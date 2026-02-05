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
        console.error('[Payment API] Lỗi khi giải mã token:', error);
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
            console.error('[Payment API] Không nhận được access token mới');
            return false;
        }

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log('[Payment API] Token được làm mới thành công');
        return true;
    } catch (error) {
        console.error('[Payment API] Lỗi khi làm mới token:', error.message);
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
                console.log('[Payment API] Token sắp hết hạn, đang làm mới...');
                const refreshSuccess = await refreshTokenIfNeeded(config);
                
                if (!refreshSuccess) {
                    throw new Error('Token refresh failed');
                }
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('[Payment API] Lỗi khi xử lý token:', error.message);
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
                    console.log('[Payment API] Token được làm mới, thử lại request...');
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('[Payment API] Làm mới token thất bại');
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
export const paymentAPI = {
    /**
     * Tạo thanh toán mới
     * POST /api/v1/payments
     * @param {string} checkoutId - ID của checkout
     * @param {number} orderId - ID của đơn hàng (tùy chọn)
     * @param {number} amount - Số tiền thanh toán
     * @param {string} paymentMethod - Phương thức thanh toán (VNPAY, CREDIT_CARD, COD)
     * @returns {Promise} Response từ server
     */
    createPayment: (checkoutId, orderId, amount, paymentMethod) =>
        api.post('/payments', null, {
            params: {
                checkoutId,
                orderId,
                amount,
                paymentMethod
            }
        }),

    /**
     * Khởi tạo thanh toán với nhà cung cấp (lấy URL chuyển hướng)
     * GET /api/v1/payments/{orderId}/initiate
     * @param {number} orderIdParam - ID của đơn hàng (hoặc lấy từ localStorage)
     * @returns {Promise} Response chứa redirectUrl và thông tin thanh toán
     */
    initiatePayment: async (orderIdParam) => {
        // Ưu tiên tham số orderId; nếu không có thì lấy từ localStorage
        let orderId = orderIdParam ?? localStorage.getItem('orderId');
        if (!orderId) {
            throw new Error('Missing orderId for payment initiation');
        }

        // Chuyển đổi orderId thành số
        const numericOrderId = Number(orderId);
        if (!Number.isFinite(numericOrderId)) {
            throw new Error('Invalid orderId for payment initiation - expected numeric orderId');
        }

        const response = await api.get(`/payments/${numericOrderId}/initiate`);
        const paymentData = response.data?.data;
        
        if (!paymentData) {
            throw new Error('Invalid payment initiation response - missing data');
        }
        
        // Chuẩn bị đầy đủ các trường cần thiết với giá trị mặc định
        const initiatedPayment = {
            redirectUrl: paymentData.redirectUrl || null,
            paymentId: paymentData.paymentId || null,
            expiresAt: paymentData.expiresAt || null,
            status: paymentData.status || 'pending',
            successful: paymentData.successful !== undefined ? paymentData.successful : false
        };
        
        console.log('[PaymentAPI] Thanh toán được khởi tạo:', initiatedPayment);
        return {
            data: {
                data: initiatedPayment,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Lấy thông tin thanh toán theo ID
     * GET /api/v1/payments/{paymentId}
     * @param {number} paymentId - ID của thanh toán
     * @returns {Promise} Response chứa thông tin thanh toán
     */
    getPaymentById: (paymentId) =>
        api.get(`/payments/${paymentId}`),

    /**
     * Lấy thông tin thanh toán theo checkout ID
     * GET /api/v1/payments/checkout/{checkoutId}
     * @param {string} checkoutId - ID của checkout
     * @returns {Promise} Response chứa thông tin thanh toán
     */
    getPaymentByCheckoutId: (checkoutId) =>
        api.get(`/payments/checkout/${checkoutId}`),

    /**
     * Lấy thông tin thanh toán theo order ID
     * GET /api/v1/payments/order/{orderId}
     * @param {number} orderId - ID của đơn hàng
     * @returns {Promise} Response chứa thông tin thanh toán
     */
    getPaymentByOrderId: (orderId) =>
        api.get(`/payments/order/${orderId}`),

    /**
     * Kiểm tra trạng thái thanh toán
     * GET /api/v1/payments/{paymentId}/status
     * @param {number} paymentId - ID của thanh toán
     * @returns {Promise} Response chứa trạng thái hiện tại
     */
    checkPaymentStatus: (paymentId) =>
        api.get(`/payments/${paymentId}/status`),

    /**
     * Lấy danh sách thanh toán theo trạng thái
     * GET /api/v1/payments/status/{status}
     * @param {string} status - Trạng thái cần tìm
     * @returns {Promise} Response chứa danh sách thanh toán
     */
    getPaymentsByStatus: (status) =>
        api.get(`/payments/status/${status}`),

    /**
     * Xử lý hoàn tiền
     * POST /api/v1/payments/{paymentId}/refund
     * @param {number} paymentId - ID của thanh toán
     * @param {number} refundAmount - Số tiền hoàn
     * @param {string} reason - Lý do hoàn tiền
     * @returns {Promise} Response xác nhận hoàn tiền
     */
    processRefund: (paymentId, refundAmount, reason) =>
        api.post(`/payments/${paymentId}/refund`, {
            refundAmount,
            reason
        }),

    /**
     * Hủy thanh toán
     * POST /api/v1/payments/{paymentId}/cancel
     * @param {number} paymentId - ID của thanh toán
     * @returns {Promise} Response xác nhận hủy
     */
    cancelPayment: (paymentId) =>
        api.post(`/payments/${paymentId}/cancel`),

    /**
     * Thử lại thanh toán thất bại
     * POST /api/v1/payments/{paymentId}/retry
     * @param {number} paymentId - ID của thanh toán
     * @returns {Promise} Response từ server
     */
    retryPayment: (paymentId) =>
        api.post(`/payments/${paymentId}/retry`),

    /**
     * Lấy danh sách phương thức thanh toán được hỗ trợ
     * GET /api/v1/payments/methods
     * @returns {Promise} Response chứa danh sách phương thức
     */
    getSupportedMethods: () =>
        api.get('/payments/methods'),

    /**
     * Kiểm tra xem phương thức thanh toán có sẵn không
     * GET /api/v1/payments/methods/{method}/available
     * @param {string} method - Tên phương thức thanh toán
     * @returns {Promise} Response xác nhận sẵn có
     */
    isMethodAvailable: (method) =>
        api.get(`/payments/methods/${method}/available`),

    /**
     * Xác nhận thanh toán COD (Collect on Delivery)
     * POST /api/v1/payments/callback/cod
     * @param {number} paymentId - ID của thanh toán
     * @param {string} confirmationCode - Mã xác nhận
     * @param {number} collectedAmount - Số tiền đã thu
     * @returns {Promise} Response xác nhận
     */
    confirmCODPayment: (paymentId, confirmationCode, collectedAmount) =>
        api.post('/payments/callback/cod', null, {
            params: {
                paymentId,
                confirmationCode,
                collectedAmount
            }
        }),
};

export default api;