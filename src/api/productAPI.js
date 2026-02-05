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
        console.error('[Product API] Lỗi khi giải mã token:', error);
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
            console.error('[Product API] Không nhận được access token mới');
            return false;
        }

        localStorage.setItem('accessToken', newAccessToken);
        localStorage.setItem('refreshToken', newRefreshToken);

        config.headers.Authorization = `Bearer ${newAccessToken}`;
        console.log('[Product API] Token được làm mới thành công');
        return true;
    } catch (error) {
        console.error('[Product API] Lỗi khi làm mới token:', error.message);
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
            if (isTokenExpiringsSoon(accessToken)) {
                console.log('[Product API] Token sắp hết hạn, đang làm mới...');
                const refreshSuccess = await refreshTokenIfNeeded(config);
                
                if (!refreshSuccess) {
                    throw new Error('Token refresh failed');
                }
            } else {
                config.headers.Authorization = `Bearer ${accessToken}`;
            }
        } catch (error) {
            console.error('[Product API] Lỗi khi xử lý token:', error.message);
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

        // Xử lý token hết hạn
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const errorMessage = error.response?.data?.message || '';

            // Kiểm tra xem có phải lỗi JWT expired
            if (errorMessage.includes('JWT expired') || errorMessage.includes('expired')) {
                console.log('[Product API] Token đã hết hạn, đang thử làm mới...');

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

                        console.log('[Product API] Token được làm mới, thử lại request...');
                        return api(originalRequest); // Thử lại request với token mới

                    } catch (refreshError) {
                        console.error('[Product API] Làm mới token thất bại:', refreshError);

                        alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');

                        localStorage.clear();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                } else {
                    // Không có refresh token
                    alert('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

// ==================== API ENDPOINTS ====================

export const productAPI = {
    // ===== PUBLIC PRODUCT ENDPOINTS =====

    /**
     * Lấy danh sách sản phẩm được công bố (với bộ lọc)
     * @param {Object} params - Các tham số lọc
     * @returns {Promise} Response chứa danh sách sản phẩm
     */
    getProducts: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.categoryIds) queryParams.append('categoryIds', params.categoryIds);
        if (params.brandIds) queryParams.append('brandIds', params.brandIds);
        if (params.minPrice) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
        if (params.inStock !== undefined) queryParams.append('inStock', params.inStock);
        if (params.sortBy) queryParams.append('sortBy', params.sortBy);
        if (params.sortDirection) queryParams.append('sortDirection', params.sortDirection);
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);

        return api.get(`/public/products?${queryParams.toString()}`);
    },

    /**
     * Lấy danh sách sản phẩm nổi bật
     * @param {number} limit - Số lượng sản phẩm (mặc định 10)
     * @returns {Promise} Response chứa danh sách sản phẩm nổi bật
     */
    getFeaturedProducts: (limit = 10) =>
        api.get(`/public/products/featured?limit=${limit}`),

    /**
     * Lấy sản phẩm nổi bật theo ID cụ thể
     * @param {Array<number>} ids - Mảng ID sản phẩm
     * @returns {Promise} Response chứa danh sách sản phẩm
     */
    getFeaturedProductsByIds: (ids = []) =>
        api.get(`/public/products/featured-by-ids?ids=${ids.join(',')}`),

    /**
     * Lấy thông tin sản phẩm tóm tắt theo ID
     * @param {number} id - ID của sản phẩm
     * @returns {Promise} Response chứa thông tin cơ bản sản phẩm
     */
    getProductById: (id) =>
        api.get(`/public/products/${id}`),

    /**
     * Lấy thông tin sản phẩm đầy đủ theo ID
     * @param {number} id - ID của sản phẩm
     * @returns {Promise} Response chứa thông tin chi tiết sản phẩm
     */
    getProductDetail: (id) =>
        api.get(`/public/products/${id}/detail`),

    /**
     * Lấy các biến thể sản phẩm (SKU combinations)
     * @param {number} id - ID của sản phẩm
     * @returns {Promise} Response chứa danh sách biến thể
     */
    getProductVariations: (id) =>
        api.get(`/public/products/${id}/variations`),

    /**
     * Lấy sản phẩm liên quan
     * @param {number} id - ID của sản phẩm
     * @param {number} limit - Số lượng sản phẩm liên quan (mặc định 10)
     * @returns {Promise} Response chứa danh sách sản phẩm liên quan
     */
    getRelatedProducts: (id, limit = 10) =>
        api.get(`/public/products/${id}/related?limit=${limit}`),

    /**
     * Lấy sản phẩm theo slug (thân thiện với SEO)
     * @param {string} slug - Slug của sản phẩm
     * @returns {Promise} Response chứa thông tin sản phẩm
     */
    getProductBySlug: (slug) =>
        api.get(`/public/products/slug/${slug}`),

    /**
     * Lấy slug sản phẩm theo ID
     * @param {number} id - ID của sản phẩm
     * @returns {Promise} Response chứa slug
     */
    getProductSlug: (id) =>
        api.get(`/public/products/${id}/slug`),

    /**
     * Lấy danh sách thuộc tính sản phẩm (cho bộ lọc)
     * @param {Object} params - { page, size }
     * @returns {Promise} Response chứa danh sách thuộc tính
     */
    getAttributes: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);

        return api.get(`/public/products/attributes?${queryParams.toString()}`);
    },

    /**
     * Lấy nhóm thuộc tính sản phẩm
     * @param {Object} params - { page, size }
     * @returns {Promise} Response chứa danh sách nhóm thuộc tính
     */
    getAttributeGroups: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);

        return api.get(`/public/products/attribute-groups?${queryParams.toString()}`);
    },

    /**
     * Lấy giá trị tùy chọn cho sản phẩm cụ thể
     * @param {number} productId - ID của sản phẩm
     * @returns {Promise} Response chứa danh sách giá trị tùy chọn
     */
    getProductOptionValues: (productId) =>
        api.get(`/public/products/${productId}/option-values`),

    /**
     * Lấy kết hợp tùy chọn (biến thể SKU)
     * @param {number} productId - ID của sản phẩm
     * @returns {Promise} Response chứa danh sách kết hợp tùy chọn
     */
    getProductOptionCombinations: (productId) =>
        api.get(`/public/products/${productId}/option-combinations`),

    // ===== ADMIN PRODUCT ENDPOINTS =====

    /**
     * Lấy danh sách sản phẩm (admin - có bộ lọc và phân trang)
     * @param {Object} params - Các tham số lọc
     * @returns {Promise} Response chứa danh sách sản phẩm
     */
    adminGetProducts: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.ids) queryParams.append('ids', params.ids);
        if (params.categoryIds) queryParams.append('categoryIds', params.categoryIds);
        if (params.brandIds) queryParams.append('brandIds', params.brandIds);
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice);
        if (params.isPublished !== undefined) queryParams.append('isPublished', params.isPublished);
        if (params.isFeatured !== undefined) queryParams.append('isFeatured', params.isFeatured);
        if (params.inStock !== undefined) queryParams.append('inStock', params.inStock);
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);

        return api.get(`/products?${queryParams.toString()}`);
    },

    /**
     * Lấy thông tin sản phẩm theo ID (admin)
     * @param {number} id - ID của sản phẩm
     * @returns {Promise} Response chứa thông tin sản phẩm
     */
    adminGetProductById: (id) =>
        api.get(`/products/${id}`),

    /**
     * Tạo sản phẩm mới (admin)
     * @param {Object} productData - Dữ liệu sản phẩm
     * @returns {Promise} Response chứa sản phẩm vừa tạo
     */
    adminCreateProduct: (productData) =>
        api.post('/products', productData),

    /**
     * Cập nhật sản phẩm (admin)
     * @param {number} id - ID của sản phẩm
     * @param {Object} productData - Dữ liệu cập nhật
     * @returns {Promise} Response từ server
     */
    adminUpdateProduct: (id, productData) =>
        api.put(`/products/${id}`, productData),

    /**
     * Xóa sản phẩm (admin)
     * @param {number} id - ID của sản phẩm
     * @returns {Promise} Response xác nhận xóa
     */
    adminDeleteProduct: (id) =>
        api.delete(`/products/${id}`),

    /**
     * Lấy sản phẩm kho (với thông tin tồn kho)
     * @param {Object} params - { page, size, keyword, skuCode }
     * @returns {Promise} Response chứa danh sách sản phẩm kho
     */
    getWarehouseProducts: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.skuCode) queryParams.append('skuCode', params.skuCode);
        return api.get(`/products/warehouse?${queryParams.toString()}`);
    },

    /**
     * Tìm kiếm sản phẩm nâng cao (admin)
     * @param {Object} params - Các tham số tìm kiếm
     * @returns {Promise} Response chứa danh sách sản phẩm tìm được
     */
    adminSearchProducts: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.keyword) queryParams.append('keyword', params.keyword);
        if (params.categoryIds) queryParams.append('categoryIds', params.categoryIds);
        if (params.brandIds) queryParams.append('brandIds', params.brandIds);
        if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice);
        if (params.inStock !== undefined) queryParams.append('inStock', params.inStock);
        if (params.isPublished !== undefined) queryParams.append('isPublished', params.isPublished);
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);
        if (params.sort) queryParams.append('sort', params.sort);

        return api.get(`/products/search?${queryParams.toString()}`);
    },

    /**
     * Tìm kiếm sản phẩm công khai (khách hàng)
     * @param {Object} params - Các tham số tìm kiếm
     * @returns {Promise} Response chứa danh sách sản phẩm tìm được
     */
    publicSearchProducts: (params = {}) => {
        const queryParams = new URLSearchParams();

        if (params.q) queryParams.append('q', params.q);
        if (params.categoryIds) queryParams.append('categoryIds', params.categoryIds);
        if (params.brandIds) queryParams.append('brandIds', params.brandIds);
        if (params.minPrice !== undefined) queryParams.append('minPrice', params.minPrice);
        if (params.maxPrice !== undefined) queryParams.append('maxPrice', params.maxPrice);
        if (params.inStock !== undefined) queryParams.append('inStock', params.inStock);
        if (params.isFeatured !== undefined) queryParams.append('isFeatured', params.isFeatured);
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);

        return api.get(`/public/search/products?${queryParams.toString()}`);
    },
};

export default api;