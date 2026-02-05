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

        if (!newAccessToken) return false;

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        return true;
    } catch (error) {
        console.error('[Customer API] Lỗi khi làm mới token:', error.message);
        return false;
    }
}

// ==================== REQUEST INTERCEPTOR ====================
// Mục đích: Gắn token vào request header
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
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

        // Xử lý token hết hạn
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const response = await axios.post(
                        'http://localhost:8080/api/v1/auth/refresh-token/' + refreshToken
                    );

                    // Response format: { accessToken, refreshToken }
                    const newAccessToken = response.data?.data?.accessToken;
                    const newRefreshToken = response.data?.data?.refreshToken;

                    localStorage.setItem('accessToken', newAccessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return api(originalRequest);
                } catch (err) {
                    console.error('[Customer API] Làm mới token thất bại');
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

// ==================== API ENDPOINTS ====================

export const customerAPI = {
    // ===== ADMIN ENDPOINTS =====
    
    /**
     * Lấy danh sách khách hàng (admin)
     * @param {number} pageNo - Số trang (mặc định 0)
     * @param {number} pageSize - Số item mỗi trang (mặc định 10)
     * @returns {Promise} Response chứa danh sách khách hàng
     */
    getCustomers: (pageNo = 0, pageSize = 10) =>
        api.get(`/customers?pageNo=${pageNo}&pageSize=${pageSize}`),

    /**
     * Lấy thông tin khách hàng theo ID (admin)
     * @param {number} id - ID của khách hàng
     * @returns {Promise} Response chứa thông tin khách hàng
     */
    getCustomerById: (id) =>
        api.get(`/customers/profile/${id}`),

    /**
     * Cập nhật thông tin khách hàng (admin)
     * @param {number} id - ID của khách hàng
     * @param {Object} data - Dữ liệu cập nhật
     * @returns {Promise} Response từ server
     */
    updateCustomer: (id, data) =>
        api.put(`/customers/profile/${id}`, data),

    /**
     * Xóa khách hàng (admin)
     * @param {number} id - ID của khách hàng
     * @returns {Promise} Response xác nhận xóa
     */
    deleteCustomer: (id) =>
        api.delete(`/customers/profile/${id}`),

    /**
     * Tạo khách hàng mới (admin)
     * @param {Object} data - Dữ liệu khách hàng
     * @returns {Promise} Response chứa khách hàng vừa tạo
     */
    createCustomer: (data) =>
        api.post(`/customers`, data),

    // ===== PUBLIC ENDPOINTS =====
    
    /**
     * Lấy thông tin hồ sơ khách hàng (công khai)
     * @param {string} username - Tên đăng nhập
     * @returns {Promise} Response chứa thông tin hồ sơ
     */
    getMyProfile: (username) =>
        api.get(`/public/customer/profile?username=${username}`),

    /**
     * Tạo người dùng khách (công khai)
     * @param {Object} data - Dữ liệu { username, password, name, email }
     * @returns {Promise} Response chứa người dùng vừa tạo
     */
    createGuestUser: (data) =>
        api.post(`/public/customer/guest-user`, {
            username: data.username,
            password: data.password,
            name: data.name,
            email: data.email
        }),

    // ===== ADDRESS ENDPOINTS =====
    
    /**
     * Lấy tất cả địa chỉ đã lưu (công khai)
     * @returns {Promise} Response chứa danh sách địa chỉ
     */
    getAddresses: () =>
        api.get(`/public/customer/addresses`),

    /**
     * Lấy địa chỉ mặc định (công khai)
     * @returns {Promise} Response chứa địa chỉ mặc định
     */
    getDefaultAddress: () =>
        api.get(`/public/customer/addresses/default`),

    /**
     * Tạo địa chỉ mới (công khai)
     * @param {Object} data - Dữ liệu địa chỉ
     * @returns {Promise} Response chứa địa chỉ vừa tạo
     */
    createAddress: (data) =>
        api.post(`/public/customer/addresses`, data),

    /**
     * Đặt địa chỉ làm mặc định (công khai)
     * @param {number} id - ID của địa chỉ
     * @returns {Promise} Response từ server
     */
    setDefaultAddress: (id) =>
        api.put(`/public/customer/addresses/${id}/set-default`),

    /**
     * Xóa địa chỉ (công khai)
     * @param {number} id - ID của địa chỉ
     * @returns {Promise} Response xác nhận xóa
     */
    deleteAddress: (id) =>
        api.delete(`/public/customer/addresses/${id}`),
};

// ==================== AUTH API ====================

export const authAPI = {
    /**
     * Đăng nhập
     * Response format: { username, email, name, oauthId, roles, token, refreshToken }
     * @param {string} username - Tên đăng nhập
     * @param {string} password - Mật khẩu
     * @returns {Promise} Response chứa thông tin đăng nhập
     */
    login: (username, password) =>
        api.post('/auth/login', { username, password }),

    /**
     * Đăng ký tài khoản mới
     * @param {Object} data - Dữ liệu { username, password, name, email }
     * @returns {Promise} Response từ server
     */
    signup: (data) =>
        api.post('/auth/sign-up', {
            username: data.username,
            password: data.password,
            name: data.name,
            email: data.email
        }),

    /**
     * Xác minh tài khoản sau khi đăng ký
     * @param {string} token - Token xác minh từ email
     * @returns {Promise} Response từ server
     */
    verifyUser: (token) =>
        api.post(`/auth/verification/${token}`),

    /**
     * Gửi lại email xác minh
     * @param {string} username - Tên đăng nhập
     * @returns {Promise} Response từ server
     */
    resendVerification: (username) =>
        api.post(`/auth/refresh-user-verification?username=${username}`),

    /**
     * Đăng xuất - cần accessToken (header) + refreshToken (body)
     * @returns {Promise} Response xác nhận đăng xuất
     */
    logout: () => {
        const refreshToken = localStorage.getItem('refreshToken');
        // accessToken được tự động thêm bởi request interceptor
        return api.post('/auth/logout', { refreshToken });
    },

    /**
     * Lấy thông tin hồ sơ người dùng
     * @param {string} username - Tên đăng nhập
     * @returns {Promise} Response chứa thông tin hồ sơ
     */
    getUserProfile: (username) =>
        api.get(`/users/${username}`)
};

export default api;