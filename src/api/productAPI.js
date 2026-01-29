import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============ REQUEST INTERCEPTOR - AUTO REFRESH KHI GẦN HẾT HẠN ============
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                // Decode JWT để check expiration
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiresAt = payload.exp * 1000; // Convert to milliseconds
                const now = Date.now();

                // Nếu token còn < 5 phút → refresh ngay
                if (expiresAt - now < 5 * 60 * 1000) {
                    console.log('Token sắp hết hạn, đang refresh...');

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const { data } = await axios.post(
                            `http://localhost:8080/api/v1/auth/refresh-token/${refreshToken}`
                        );

                        localStorage.setItem('accessToken', data.data.accessToken);
                        localStorage.setItem('refreshToken', data.data.refreshToken);

                        config.headers.Authorization = `Bearer ${data.data.accessToken}`;
                        console.log(' Token đã được refresh thành công');
                    }
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Lỗi khi decode/refresh token:', error);
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ============ RESPONSE INTERCEPTOR - XỬ LÝ KHI TOKEN ĐÃ HẾT HẠN ============
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Xử lý lỗi 401 Unauthorized
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const errorMessage = error.response?.data?.message || '';

            // Kiểm tra nếu là lỗi JWT expired
            if (errorMessage.includes('JWT expired') || errorMessage.includes('expired')) {
                console.log(' Token đã hết hạn, đang thử refresh...');

                const refreshToken = localStorage.getItem('refreshToken');

                if (refreshToken) {
                    try {
                        const { data } = await axios.post(
                            `http://localhost:8080/api/v1/auth/refresh-token/${refreshToken}`
                        );

                        localStorage.setItem('accessToken', data.data.accessToken);
                        localStorage.setItem('refreshToken', data.data.refreshToken);

                        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;

                        console.log(' Đã refresh token, retry request...');
                        return api(originalRequest); // Retry request với token mới

                    } catch (refreshError) {
                        console.error(' Refresh token thất bại:', refreshError);

                        // Hiển thị thông báo thân thiện
                        alert(' Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');

                        localStorage.clear();
                        window.location.href = '/login';
                        return Promise.reject(refreshError);
                    }
                } else {
                    // Không có refresh token
                    alert(' Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại!');
                    localStorage.clear();
                    window.location.href = '/login';
                }
            }
        }

        return Promise.reject(error);
    }
);

export const productAPI = {
    // Public Product Endpoints

    /**
     * Get all published products with filters
     * @param {Object} params - { categoryIds, brandIds, minPrice, maxPrice, inStock, sortBy, sortDirection, page, size }
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
     * Get featured products
     * @param {number} limit - Number of products to fetch
     */
    getFeaturedProducts: (limit = 10) =>
        api.get(`/public/products/featured?limit=${limit}`),

    /**
     * Get featured products by specific IDs
     * @param {Array} ids - Array of product IDs
     */
    getFeaturedProductsByIds: (ids = []) =>
        api.get(`/public/products/featured-by-ids?ids=${ids.join(',')}`),

    /**
     * Get product summary by ID
     * @param {number} id - Product ID
     */
    getProductById: (id) =>
        api.get(`/public/products/${id}`),

    /**
     * Get full product detail by ID
     * @param {number} id - Product ID
     */
    getProductDetail: (id) =>
        api.get(`/public/products/${id}/detail`),

    /**
     * Get product variations/SKU combinations
     * @param {number} id - Product ID
     */
    getProductVariations: (id) =>
        api.get(`/public/products/${id}/variations`),

    /**
     * Get related products
     * @param {number} id - Product ID
     * @param {number} limit - Number of related products
     */
    getRelatedProducts: (id, limit = 10) =>
        api.get(`/public/products/${id}/related?limit=${limit}`),

    /**
     * Get product by slug (SEO-friendly)
     * @param {string} slug - Product slug
     */
    getProductBySlug: (slug) =>
        api.get(`/public/products/slug/${slug}`),

    /**
     * Get product slug by ID
     * @param {number} id - Product ID
     */
    getProductSlug: (id) =>
        api.get(`/public/products/${id}/slug`),

    /**
     * Get product attributes for filtering
     * @param {Object} params - { page, size }
     */
    getAttributes: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);

        return api.get(`/public/products/attributes?${queryParams.toString()}`);
    },

    /**
     * Get product attribute groups
     * @param {Object} params - { page, size }
     */
    getAttributeGroups: (params = {}) => {
        const queryParams = new URLSearchParams();
        if (params.page !== undefined) queryParams.append('page', params.page);
        if (params.size !== undefined) queryParams.append('size', params.size);

        return api.get(`/public/products/attribute-groups?${queryParams.toString()}`);
    },

    /**
     * Get option values for a specific product
     * @param {number} productId - Product ID
     */
    getProductOptionValues: (productId) =>
        api.get(`/public/products/${productId}/option-values`),

    /**
     * Get option combinations (SKU variants)
     * @param {number} productId - Product ID
     */
    getProductOptionCombinations: (productId) =>
        api.get(`/public/products/${productId}/option-combinations`),

    // ==================== ADMIN PRODUCT ENDPOINTS ====================

    /**
     * Get all products for admin (with filters and pagination)
     * @param {Object} params - { ids, categoryIds, brandIds, keyword, minPrice, maxPrice, isPublished, isFeatured, inStock, page, size }
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
     * Get product by ID for admin
     * @param {number} id - Product ID
     */
    adminGetProductById: (id) =>
        api.get(`/products/${id}`),

    /**
     * Create new product
     * @param {Object} productData - ProductCreationDTO
     */
    adminCreateProduct: (productData) =>
        api.post('/products', productData),

    /**
     * Update existing product
     * @param {number} id - Product ID
     * @param {Object} productData - ProductUpdateDTO
     */
    adminUpdateProduct: (id, productData) =>
        api.put(`/products/${id}`, productData),

    /**
     * Delete product
     * @param {number} id - Product ID
     */
    adminDeleteProduct: (id) =>
        api.delete(`/products/${id}`),

    /**
     * Get warehouse products with inventory info
     * @param {Object} params - { page, size, keyword, skuCode }
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
     * Advanced search for products (Admin)
     * @param {Object} params - { keyword, categoryIds, brandIds, minPrice, maxPrice, inStock, isPublished, page, size, sort }
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
     * Public search for products (Customer)
     * @param {Object} params - { q, categoryIds, brandIds, minPrice, maxPrice, inStock, isFeatured, page, size }
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