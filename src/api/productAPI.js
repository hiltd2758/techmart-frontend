import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - attach token (nếu cần cho admin endpoints)
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

// Response Interceptor - auto refresh token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                try {
                    const { data } = await axios.post(
                        `http://localhost:8080/api/v1/auth/refresh-token/${refreshToken}`
                    );
                    
                    localStorage.setItem('accessToken', data.data.accessToken);
                    localStorage.setItem('refreshToken', data.data.refreshToken);

                    originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
                    return api(originalRequest);
                } catch (err) {
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
};

export default api;