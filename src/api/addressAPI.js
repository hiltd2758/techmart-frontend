import axios from 'axios';
import customerAPI from './customerAPI';

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
        // Giải mã phần payload của JWT (phần giữa 2 dấu chấm)
        const tokenPayload = JSON.parse(atob(token.split('.')[1]));
        const expiresAtMs = tokenPayload.exp * 1000; // Chuyển từ giây sang ms
        const currentTimeMs = Date.now();
        
        return expiresAtMs - currentTimeMs;
    } catch (error) {
        console.error('[Address API] Lỗi khi giải mã token:', error);
        return -1;
    }
}

/**
 * Kiểm tra xem token có sắp hết hạn không (< 5 phút)
 * @param {string} token - JWT token
 * @returns {boolean} true nếu token sắp hết hạn, false nếu còn hạn
 */
function isTokenExpiringso(token) {
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
            console.error('[Address API] Không nhận được access token mới');
            return false;
        }

        // Lưu token mới vào localStorage
        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        // Cập nhật header Authorization với token mới
        config.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log('[Address API] Token được làm mới thành công');
        return true;
    } catch (error) {
        console.error('[Address API] Lỗi khi làm mới token:', error.message);
        return false;
    }
}

// ==================== REQUEST INTERCEPTOR ====================
// Mục đích: Tự động làm mới token khi sắp hết hạn
api.interceptors.request.use(
    async (config) => {
        const accessToken = localStorage.getItem('accessToken');

        if (!accessToken) {
            console.warn('[Address API] Không tìm thấy access token');
            return config;
        }

        try {
            // Kiểm tra xem token còn bao lâu
            const timeRemaining = getTokenExpiryTime(accessToken);
            const timeRemainingSeconds = Math.round(timeRemaining / 1000);
            console.log('[Address API] Token sẽ hết hạn trong:', timeRemainingSeconds, 'giây');

            // Nếu token sắp hết hạn, hãy làm mới nó
            if (isTokenExpiringso(accessToken)) {
                console.log('[Address API] Token sắp hết hạn, đang làm mới...');
                const refreshSuccess = await refreshTokenIfNeeded(config);
                
                if (!refreshSuccess) {
                    throw new Error('Token refresh failed');
                }
            } else {
                // Token còn hạn, sử dụng token hiện tại
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('[Address API] Lỗi khi xử lý token:', error.message);
            // Vẫn sử dụng token hiện tại nếu giải mã thất bại
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        // Ghi log thông tin request
        const method = config.method?.toUpperCase();
        const hasAuthHeader = !!config.headers.Authorization;
        console.log(`[Address API] ${method} ${config.url} - Auth: ${hasAuthHeader ? 'Có' : 'Không'}`);
        
        return config;
    },
    (error) => Promise.reject(error)
);


// ==================== RESPONSE INTERCEPTOR ====================
// Mục đích: Xử lý lỗi 401/403 khi token hết hạn hoặc không có quyền
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // ===== Xử lý lỗi 403 Forbidden (Không có quyền) =====
        if (error.response?.status === 403) {
            const accessToken = localStorage.getItem('accessToken');
            
            // Ghi log chi tiết để hỗ trợ debug
            console.error('[Address API] 403 Forbidden - Không có quyền truy cập');
            
            if (accessToken) {
                try {
                    const tokenPayload = JSON.parse(atob(accessToken.split('.')[1]));
                    const expiresAt = new Date(tokenPayload.exp * 1000);
                    const roles = tokenPayload.scope || tokenPayload.roles || 'Không xác định';
                    
                    console.error('[Address API] Token hết hạn lúc:', expiresAt);
                    console.error('[Address API] Quyền/Roles:', roles);
                } catch (decodeError) {
                    console.error('[Address API] Không thể giải mã token');
                }
            }
            
            // Ghi log chi tiết của request để debug
            console.error('[Address API] URL được yêu cầu:', originalRequest?.url);
            console.error('[Address API] Phương thức:', originalRequest?.method);
            console.error('[Address API] Có Authorization header:', !!originalRequest?.headers?.Authorization);
        }

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
                    console.log('[Address API] Token được làm mới, thử lại request...');
                    return api(originalRequest);
                } catch (refreshError) {
                    console.error('[Address API] Làm mới token thất bại, đăng xuất người dùng');
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

export const addressAPI = {
    // ===== LOCATION SERVICE - Quản lý địa chỉ vật lý =====
    
    /**
     * Tạo địa chỉ vật lý mới
     * @param {Object} data - Dữ liệu địa chỉ { street, ward, district, city, province, postalCode }
     * @returns {Promise} Response từ server
     */
    createAddress: (data) =>
        api.post('/public/addresses', data),

    /**
     * Lấy thông tin địa chỉ theo ID
     * @param {number} id - ID của địa chỉ
     * @returns {Promise} Response chứa thông tin địa chỉ
     */
    getAddressById: (id) =>
        api.get(`/public/addresses/${id}`),

    /**
     * Lấy thông tin multiple địa chỉ theo danh sách ID
     * @param {Array<number>} ids - Mảng ID của các địa chỉ
     * @returns {Promise} Response chứa danh sách địa chỉ
     */
    getAddressesByIds: (ids) =>
        api.get('/public/addresses', { params: { ids: ids.join(',') } }),

    /**
     * Cập nhật thông tin địa chỉ
     * @param {number} id - ID của địa chỉ cần cập nhật
     * @param {Object} data - Dữ liệu cập nhật
     * @returns {Promise} Response từ server
     */
    updateAddress: (id, data) =>
        api.put(`/public/addresses/${id}`, data),

    /**
     * Xoá địa chỉ
     * @param {number} id - ID của địa chỉ cần xoá
     * @returns {Promise} Response từ server
     */
    deleteAddress: (id) =>
        api.delete(`/public/addresses/${id}`),

    // ===== CUSTOMER SERVICE - Quản lý địa chỉ của khách hàng (mapping) =====
    
    /**
     * Lấy tất cả địa chỉ đã lưu của khách hàng
     * @param {string} userId - ID khách hàng (tùy chọn, tự động lấy từ auth)
     * @returns {Promise} Response chứa danh sách địa chỉ của khách hàng
     */
    getUserAddresses: (userId = null) =>
        api.get('/public/customer/addresses', userId ? { params: { userId } } : {}),

    /**
     * Lấy địa chỉ mặc định của khách hàng
     * @param {string} userId - ID khách hàng (tùy chọn)
     * @returns {Promise} Response chứa địa chỉ mặc định
     */
    getDefaultAddress: (userId = null) =>
        api.get('/public/customer/addresses/default', userId ? { params: { userId } } : {}),

    /**
     * Tạo liên kết địa chỉ cho khách hàng
     * @param {Object} data - Dữ liệu { addressId, isDefault }
     * @returns {Promise} Response từ server
     */
    createUserAddress: (data) =>
        api.post('/public/customer/addresses', data),

    /**
     * Đặt địa chỉ làm mặc định
     * @param {number} id - ID của địa chỉ khách hàng
     * @returns {Promise} Response từ server
     */
    setDefaultAddress: (id) =>
        api.put(`/public/customer/addresses/${id}/set-default`),

    /**
     * Xoá địa chỉ của khách hàng
     * @param {number} id - ID của địa chỉ khách hàng cần xoá
     * @returns {Promise} Response từ server
     */
    deleteUserAddress: (id) =>
        api.delete(`/public/customer/addresses/${id}`),

    // ===== COMBINED OPERATIONS - Thao tác kết hợp =====
    
    /**
     * Tạo địa chỉ hoàn chỉnh (backend xử lý tạo + liên kết khách hàng)
     * Hàm này gọi 1 API endpoint thay vì nhiều API liên tiếp
     * @param {Object} addressData - Dữ liệu địa chỉ { street, ward, district, city, province, postalCode, countryId, stateId, districtId }
     * @param {boolean} isDefault - Có đặt làm mặc định không (mặc định = false)
     * @returns {Promise} Response từ server chứa địa chỉ mới
     */
    createCompleteAddress: async (addressData, isDefault = false) => {
        try {
            console.log('[Address API] Đang tạo địa chỉ và liên kết với khách hàng...');
            
            // Backend endpoint xử lý cả tạo địa chỉ lẫn liên kết khách hàng trong 1 lần gọi
            const response = await api.post('/public/customer/addresses', {
                ...addressData,
                isDefault,
            });
            
            console.log('[Address API] Địa chỉ được tạo và liên kết thành công');
            return response;
        } catch (error) {
            console.error('[Address API] Lỗi khi tạo địa chỉ:', error);
            throw error;
        }
    },

    /**
     * Cập nhật địa chỉ hoàn chỉnh
     * Cập nhật cả thông tin địa chỉ vật lý
     * @param {number} userAddressId - ID của địa chỉ khách hàng
     * @param {number} addressId - ID của địa chỉ vật lý
     * @param {Object} addressData - Dữ liệu cập nhật
     * @returns {Promise} Response { success: true }
     */
    updateCompleteAddress: async (userAddressId, addressId, addressData) => {
        // Cập nhật thông tin địa chỉ vật lý
        await api.put(`/public/addresses/${addressId}`, addressData);
        
        return { success: true };
    },
};

export default addressAPI;