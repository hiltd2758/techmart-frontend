import axios from 'axios';

// ==================== AXIOS INSTANCE SETUP ====================
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/public',
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
        console.error('[Checkout API] Lỗi khi giải mã token:', error);
        return -1;
    }
}

/**
 * Kiểm tra xem token có sắp hết hạn không (< 5 phút)
 * @param {string} token - JWT token
 * @returns {boolean} true nếu token sắp hết hạn, false nếu còn hạn
 */
function isTokenExpiringsSoon(token) {
    const REFRESH_THRESHOLD_MS = 5 * 60 * 1000;
    const timeRemaining = getTokenExpiryTime(token);
    return timeRemaining < REFRESH_THRESHOLD_MS;
}

/**
 * Làm mới token hết hạn bằng refresh token
 * @param {Object} config - Cấu hình request từ axios
 * @returns {boolean} true nếu làm mới thành công, false nếu thất bại
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
            console.error('[Checkout API] Không nhận được access token mới');
            return false;
        }

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log('[Checkout API] Token được làm mới thành công');
        return true;
    } catch (error) {
        console.error('[Checkout API] Lỗi khi làm mới token:', error.message);
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
                console.log('[Checkout API] Token sắp hết hạn, đang làm mới...');
                const refreshSuccess = await refreshTokenIfNeeded(config);
                
                if (!refreshSuccess) {
                    throw new Error('Token refresh failed');
                }
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('[Checkout API] Lỗi khi xử lý token:', error.message);
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
                    console.log('[Checkout API] Token được làm mới, thử lại request...');
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('[Checkout API] Làm mới token thất bại');
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(refreshError);
                }
            }
        }

        return Promise.reject(error);
    }
);

// ==================== PAYMENT METHOD CONSTANTS ====================
export const PAYMENT_METHODS = {
    VNPAY: 'VNPAY',
    CREDIT_CARD: 'CREDIT_CARD',
    COD: 'COD'
};

// ==================== SHIPPING METHOD CONSTANTS ====================
export const SHIPPING_METHODS = {
    STANDARD: 'STANDARD',
    EXPRESS: 'EXPRESS',
    SAME_DAY: 'SAME_DAY'
};

// ==================== API ENDPOINTS ====================
export const checkoutAPI = {
    /**
     * Tạo checkout mới
     * POST /api/v1/public/checkouts
     * @param {Object} data - Dữ liệu checkout
     * @returns {Promise} Response chứa checkout ID và các thông tin cơ bản
     */
    createCheckout: async (data) => {
        const response = await api.post('/checkouts', data);
        const checkoutData = response.data?.data;
        
        if (!checkoutData) {
            throw new Error('Invalid checkout response - missing data');
        }
        
        // Lấy checkout ID từ response
        const checkoutId = checkoutData.id;
        if (!checkoutId) {
            throw new Error('Invalid checkout response - missing checkout id');
        }
        
        // Chuẩn bị đầy đủ các trường cần thiết với giá trị mặc định
        const createdCheckout = {
            id: checkoutId,
            checkoutId: checkoutId, // Để tương thích ngược
            status: checkoutData.status || 'PENDING',
            progress: checkoutData.progress || 'CREATED',
            totalAmount: checkoutData.totalAmount || 0,
            paymentMethodId: checkoutData.paymentMethodId || null,
            shipmentMethodId: checkoutData.shipmentMethodId || null,
            items: checkoutData.items || [],
            createdAt: checkoutData.createdAt || new Date().toISOString(),
            updatedAt: checkoutData.updatedAt || new Date().toISOString()
        };
        
        console.log('[CheckoutAPI] Checkout được tạo:', createdCheckout);
        return {
            data: {
                data: createdCheckout,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Lấy thông tin checkout
     * GET /api/v1/public/checkouts/{checkoutId}
     * @param {string} checkoutId - ID của checkout
     * @returns {Promise} Response chứa thông tin chi tiết checkout
     */
    getCheckout: async (checkoutId) => {
        const response = await api.get(`/checkouts/${checkoutId}`);
        const checkoutData = response.data?.data;
        
        if (!checkoutData) {
            throw new Error('Invalid checkout response - missing data');
        }
        
        // Chuẩn hóa dữ liệu checkout
        const checkout = {
            id: checkoutData.id || checkoutId,
            checkoutId: checkoutData.id || checkoutId,
            status: checkoutData.status || 'UNKNOWN',
            progress: checkoutData.progress || checkoutData.status,
            totalAmount: checkoutData.totalAmount || 0,
            paymentMethodId: checkoutData.paymentMethodId || null,
            shipmentMethodId: checkoutData.shipmentMethodId || null,
            items: checkoutData.items || [],
            createdAt: checkoutData.createdAt || null,
            updatedAt: checkoutData.updatedAt || null,
            ...checkoutData // Bao gồm các trường bổ sung từ server
        };
        
        console.log('[CheckoutAPI] Lấy checkout:', checkout);
        return {
            data: {
                data: checkout,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Cập nhật thông tin checkout
     * PUT /api/v1/public/checkouts
     * @param {string} checkoutId - ID của checkout
     * @param {Object} data - Dữ liệu cập nhật
     * @returns {Promise} Response từ server
     */
    updateCheckout: (checkoutId, data) =>
        api.put('/checkouts', {
            checkoutId,
            ...data
        }),

    /**
     * Cập nhật phương thức thanh toán
     * PUT /api/v1/public/checkouts/{checkoutId}/payment-method
     * @param {string} checkoutId - ID của checkout
     * @param {string} paymentMethodId - ID phương thức thanh toán
     * @returns {Promise} Response từ server
     */
    updatePaymentMethod: (checkoutId, paymentMethodId) =>
        api.put(`/checkouts/${checkoutId}/payment-method`, {
            paymentMethodId
        }),

    /**
     * Xác nhận checkout và tạo đơn hàng
     * PUT /api/v1/public/checkouts/status
     * @param {string} checkoutId - ID của checkout
     * @returns {Promise} Response chứa orderId và trạng thái
     */
    confirmCheckout: async (checkoutId) => {
        const response = await api.put('/checkouts/status', { 
            checkoutId,
            status: 'CONFIRMED'
        });
        
        const confirmData = response.data?.data;
        if (!confirmData) {
            throw new Error('Invalid checkout confirmation response - missing data');
        }
        
        // Lấy order ID từ response xác nhận
        const orderId = confirmData.orderId || confirmData.id;
        if (!orderId) {
            console.warn('[CheckoutAPI] Không tìm thấy orderId trong response:', confirmData);
        }
        
        const confirmed = {
            orderId: orderId || null,
            checkoutId: checkoutId,
            status: confirmData.status || 'CONFIRMED',
            totalAmount: confirmData.totalAmount || 0,
            ...confirmData
        };
        
        console.log('[CheckoutAPI] Checkout được xác nhận:', confirmed);
        return {
            data: {
                data: confirmed,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Hủy checkout
     * DELETE /api/v1/public/checkouts/{checkoutId}
     * @param {string} checkoutId - ID của checkout
     * @returns {Promise} Response xác nhận hủy
     */
    cancelCheckout: (checkoutId) =>
        api.delete(`/checkouts/${checkoutId}`),
};

export default api;