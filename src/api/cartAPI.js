import axios from 'axios';

// ==================== AXIOS INSTANCE SETUP ====================
const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/public/carts',
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
        // Giải mã phần payload của JWT (phần giữa 2 dấu chấm)
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expiresAtMs = tokenPayload.exp * 1000; // Chuyển từ giây sang ms
        const currentTimeMs = Date.now();
        
        return expiresAtMs - currentTimeMs;
    } catch (error) {
        console.error('[Cart API] Lỗi khi giải mã token:', error);
        return -1;
    }
}

/**
 * Kiểm tra xem token có sắp hết hạn không (< 5 phút)
 * @param {string} token - JWT token
 * @returns {boolean} true nếu token sắp hết hạn, false nếu còn hạn
 */
function isTokenExpiringsSoon(token) {
    const REFRESH_THRESHOLD_MS = 5 * 60 * 1000; // 5 phút
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
        // Gọi API để lấy token mới
        const response = await axios.post(
            'http://localhost:8080/api/v1/auth/refresh-token/' + refreshToken
        );

        const newAccessToken = response.data?.data?.accessToken;
        const newRefreshToken = response.data?.data?.refreshToken;

        if (!newAccessToken) {
            console.error('[Cart API] Không nhận được access token mới');
            return false;
        }

        // Lưu token mới vào localStorage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Cập nhật header Authorization với token mới
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log('[Cart API] Token được làm mới thành công');
        return true;
    } catch (error) {
        console.error('[Cart API] Lỗi khi làm mới token:', error.message);
        return false;
    }
}

// ==================== REQUEST INTERCEPTOR ====================
// Mục đích: Tự động làm mới token khi sắp hết hạn
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            return config;
        }

        try {
            // Kiểm tra xem token còn bao lâu
            const timeRemaining = getTokenExpiryTime(accessToken);
            const timeRemainingSeconds = Math.round(timeRemaining / 1000);
            console.log('[Cart API] Token sẽ hết hạn trong:', timeRemainingSeconds, 'giây');

            // Nếu token sắp hết hạn, hãy làm mới nó
            if (isTokenExpiringsSoon(accessToken)) {
                console.log('[Cart API] Token sắp hết hạn, đang làm mới...');
                const refreshSuccess = await refreshTokenIfNeeded(config);
                
                if (!refreshSuccess) {
                    throw new Error('Token refresh failed');
                }
            } else {
                // Token còn hạn, sử dụng token hiện tại
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('[Cart API] Lỗi khi xử lý token:', error.message);
            // Vẫn sử dụng token hiện tại nếu giải mã thất bại
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ==================== RESPONSE INTERCEPTOR ====================
// Mục đích: Xử lý lỗi 401 khi token hết hạn
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ===== Xử lý lỗi 401 Unauthorized (Token hết hạn) =====
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Đánh dấu là đã thử làm mới 1 lần để tránh loop vô hạn
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    // Gọi API để lấy token mới
                    const response = await axios.post(
                        'http://localhost:8080/api/v1/auth/refresh-token/' + refreshToken
                    );

                    const newAccessToken = response.data?.data?.accessToken;
                    const newRefreshToken = response.data?.data?.refreshToken;

                    // Cập nhật token trong localStorage
                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Thử lại request ban đầu với token mới
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    console.log('[Cart API] Token được làm mới, thử lại request...');
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('[Cart API] Làm mới token thất bại, đăng xuất người dùng');
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

export const cartAPI = {
    /**
     * Lấy tất cả sản phẩm trong giỏ hàng
     * @returns {Promise} Response chứa danh sách các sản phẩm trong giỏ
     * Response format: { statusCode, message, data: [...cartItems] }
     * Mỗi item: { productId, quantity, createdAt, updatedAt }
     */
    getCartItems: () =>
        api.get('/items'),

    /**
     * Thêm sản phẩm vào giỏ hàng
     * @param {Object} data - Dữ liệu { productId, quantity }
     * @returns {Promise} Response chứa sản phẩm vừa thêm/cập nhật
     */
    addItemToCart: (data) =>
        api.post('/items', data),

    /**
     * Cập nhật số lượng sản phẩm trong giỏ
     * @param {string} productId - ID của sản phẩm cần cập nhật
     * @param {Object} data - Dữ liệu { quantity }
     * @returns {Promise} Response chứa sản phẩm sau cập nhật
     */
    updateItemQuantity: (productId, data) =>
        api.put(`/items/${productId}`, {
            productId: productId,
            quantity: data.quantity
        }),

    /**
     * Xóa một sản phẩm khỏi giỏ hàng
     * @param {string} productId - ID của sản phẩm cần xóa
     * @returns {Promise} Response xác nhận việc xóa
     */
    removeItem: (productId) =>
        api.delete(`/items/${productId}`),

    /**
     * Xóa nhiều sản phẩm cùng lúc khỏi giỏ hàng
     * @param {Array<string>} productIds - Mảng ID các sản phẩm cần xóa
     * @returns {Promise} Response xác nhận việc xóa hàng loạt
     */
    removeMultipleItems: (productIds) => {
        // Tạo query string với nhiều tham số productIds
        const params = new URLSearchParams();
        productIds.forEach(id => params.append('productIds', id));
        return api.delete('/items', { params });
    },
};

export default api;