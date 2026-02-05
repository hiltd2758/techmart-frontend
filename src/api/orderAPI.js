import axios from 'axios';

// ==================== AXIOS INSTANCE SETUP ====================
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ==================== HELPER FUNCTIONS ====================

/**
 * Kiểm tra xem token còn hiệu lực bao lâu
 * @param {string} token - JWT token từ localStorage
 * @returns {number} Thời gian còn lại (ms), hoặc -1 nếu token không hợp lệ
 */
function getTokenExpiryTime(token) {
    if (!token) return -1;
    
    try {
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expiresAtMs = tokenPayload.exp * 1000;
        const currentTimeMs = Date.now();
        
        return expiresAtMs - currentTimeMs;
    } catch (error) {
        console.error('[Order API] Lỗi khi giải mã token:', error);
        return -1;
    }
}

/**
 * Kiểm tra xem token có sắp hết hạn không (< 5 phút)
 * @param {string} token - JWT token
 * @returns {boolean} true nếu token sắp hết hạn
 */
function isTokenExpiringsSoon(token) {
    const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
    const timeRemaining = getTokenExpiryTime(token);
    return timeRemaining < REFRESH_THRESHOLD_MS;
}

/**
 * Làm mới token hết hạn bằng refresh token
 * @param {Object} config - Cấu hình request từ axios
 * @returns {boolean} true nếu làm mới thành công
 */
async function refreshTokenIfNeeded(config) {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return false;

    try {
        const response = await axios.post(
            'http://localhost:8080/api/v1/auth/refresh-token/' + refreshToken
        );

        const newAccessToken = response.data?.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken;

        if (!newAccessToken) {
            console.error('[Order API] Không nhận được access token mới');
            return false;
        }

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log('[Order API] Token được làm mới thành công');
        return true;
    } catch (error) {
        console.error('[Order API] Lỗi khi làm mới token:', error.message);
        return false;
    }
}

// ==================== REQUEST INTERCEPTOR ====================
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            return config;
        }

        try {
            if (isTokenExpiringsSoon(accessToken)) {
                console.log('[Order API] Token sắp hết hạn, đang làm mới...');
                const refreshSuccess = await refreshTokenIfNeeded(config);
                
                if (!refreshSuccess) {
                    throw new Error('Token refresh failed');
                }
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('[Order API] Lỗi khi xử lý token:', error.message);
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        'http://localhost:8080/api/v1/auth/refresh-token/' + refreshToken
                    );

                    const newAccessToken = response.data?.data?.accessToken;
                    const newRefreshToken = response.data?.data?.refreshToken;

                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    console.log('[Order API] Token được làm mới, thử lại request...');
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('[Order API] Làm mới token thất bại');
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

// ==================== API ENDPOINTS ====================
export const orderAPI = {
    /**
     * Tạo đơn hàng trực tiếp (thường dùng checkout flow thay vì đây)
     * POST /api/v1/public/orders
     * @param {Object} data - Dữ liệu đơn hàng
     * @returns {Promise} Response chứa thông tin đơn hàng vừa tạo
     */
    createOrder: async (data) => {
        const response = await api.post('/public/orders', data);
        const orderData = response.data?.data;
        
        if (!orderData) {
            throw new Error('Invalid order creation response - missing data');
        }
        
        // Lấy order ID (có thể ở field 'id' hoặc 'orderId')
        const orderId = orderData.id || orderData.orderId;
        if (!orderId) {
            throw new Error('Invalid order response - missing orderId/id');
        }
        
        // Chuẩn bị đầy đủ các trường cần thiết với giá trị mặc định
        const createdOrder = {
            orderId: orderId,
            id: orderId, // Để tương thích ngược
            status: orderData.status || 'PENDING',
            paymentStatus: orderData.paymentStatus || 'PENDING',
            shipmentStatus: orderData.shipmentStatus || 'PENDING',
            progress: orderData.progress || 'CREATED',
            checkoutId: orderData.checkoutId || null,
            totalAmount: orderData.totalAmount || 0,
            email: orderData.email || '',
            note: orderData.note || '',
            createdAt: orderData.createdAt || new Date().toISOString()
        };
        
        console.log('[OrderAPI] Đơn hàng được tạo:', createdOrder);
        localStorage.setItem('orderId', orderId.toString());
        return {
            data: {
                data: createdOrder,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Lấy thông tin đơn hàng theo ID
     * GET /api/v1/orders/{id}
     * @param {number} orderId - ID của đơn hàng
     * @returns {Promise} Response chứa thông tin chi tiết đơn hàng
     */
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        const orderData = response.data?.data;
        
        if (!orderData) {
            throw new Error('Invalid order response - missing data');
        }
        
        // Chuẩn hóa cấu trúc dữ liệu đơn hàng
        const normalizedOrder = {
            orderId: orderData.id || orderData.orderId || orderId,
            id: orderData.id || orderData.orderId || orderId,
            status: orderData.status || 'UNKNOWN',
            paymentStatus: orderData.paymentStatus || 'UNKNOWN',
            shipmentStatus: orderData.shipmentStatus || 'UNKNOWN',
            progress: orderData.progress || orderData.status,
            checkoutId: orderData.checkoutId || null,
            totalAmount: orderData.totalAmount || 0,
            email: orderData.email || '',
            note: orderData.note || '',
            paymentMethod: orderData.paymentMethod || 'UNKNOWN',
            createdAt: orderData.createdAt || null,
            updatedAt: orderData.updatedAt || null,
            ...orderData // Bao gồm các trường bổ sung từ backend
        };
        
        console.log('[OrderAPI] Lấy đơn hàng:', normalizedOrder);
        return {
            data: {
                data: normalizedOrder,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Lấy danh sách đơn hàng của khách hàng (phân trang)
     * GET /api/v1/public/orders/my-orders
     * @param {number} page - Số trang (mặc định 0)
     * @param {number} size - Số item mỗi trang (mặc định 10)
     * @returns {Promise} Response chứa danh sách đơn hàng
     */
    getMyOrders: (page = 0, size = 10) => 
        api.get('/public/orders/my-orders', {
            params: { page, size }
        }),

    /**
     * Lấy chi tiết đơn hàng (bao gồm các sản phẩm)
     * GET /api/v1/public/orders/{id}/details
     * @param {number} orderId - ID của đơn hàng
     * @returns {Promise} Response chứa chi tiết đơn hàng
     */
    getOrderDetails: (orderId) => 
        api.get(`/public/orders/${orderId}/details`),

    /**
     * Hủy đơn hàng
     * PUT /api/v1/orders/{id}/cancel
     * @param {number} orderId - ID của đơn hàng
     * @param {string} reason - Lý do hủy (mặc định: người dùng hủy)
     * @returns {Promise} Response xác nhận hủy
     */
    cancelOrder: (orderId, reason = 'Cancelled by user') => 
        api.put(`/orders/${orderId}/cancel`, null, {
            params: { reason }
        }),

    /**
     * Lấy trạng thái đơn hàng
     * GET /api/v1/orders/{id}/status
     * @param {number} orderId - ID của đơn hàng
     * @returns {Promise} Response chứa trạng thái hiện tại
     */
    getOrderStatus: async (orderId) => {
        const response = await api.get(`/orders/${orderId}/status`);
        const statusData = response.data?.data;
        
        if (!statusData) {
            throw new Error('Invalid status response - missing data');
        }
        
        // Chuẩn hóa response trạng thái
        const orderStatus = {
            orderId: statusData.id || statusData.orderId || orderId,
            id: statusData.id || statusData.orderId || orderId,
            status: statusData.status || 'UNKNOWN',
            paymentStatus: statusData.paymentStatus || 'UNKNOWN',
            shipmentStatus: statusData.shipmentStatus || 'UNKNOWN',
            progress: statusData.progress || statusData.status,
            updatedAt: statusData.updatedAt || new Date().toISOString(),
            ...statusData // Bao gồm các trường bổ sung
        };
        
        console.log('[OrderAPI] Trạng thái đơn hàng:', orderStatus);
        return {
            data: {
                data: orderStatus,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Cập nhật trạng thái thanh toán của đơn hàng
     * PUT /api/v1/public/orders/status
     * @param {Object} data - Dữ liệu cập nhật trạng thái
     * @returns {Promise} Response từ server
     */
    updateOrderPaymentStatus: (data) => 
        api.put('/public/orders/status', data),

    /**
     * Kiểm tra xem đơn hàng có tồn tại với trạng thái cụ thể không (cho đơn hoàn thành)
     * GET /api/v1/public/orders/completed
     * @param {number} productId - ID sản phẩm
     * @param {string} status - Trạng thái cần kiểm tra (mặc định: COMPLETED)
     * @returns {Promise} Response chứa kết quả kiểm tra
     */
    checkOrderCompleted: (productId, status = 'COMPLETED') => 
        api.get('/public/orders/completed', {
            params: { productId, status }
        }),
};

export default api;