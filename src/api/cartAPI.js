import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor - attach token
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

export const cartAPI = {
    /**
     * Add item to cart or update quantity if already exists
     * @param {Object} data - { productId, quantity, price }
     */
    addItemToCart: (data) =>
        api.post('/public/carts/items', {
            productId: data.productId,
            quantity: data.quantity,
            price: data.price,
        }),

    /**
     * Update cart item quantity
     * @param {number} productId - Product ID
     * @param {Object} data - { quantity, price }
     */
    updateCartItemQuantity: (productId, data) =>
        api.put(`/public/carts/items/${productId}`, {
            productId,
            quantity: data.quantity,
            price: data.price,
        }),

    /**
     * Get all cart items for authenticated customer
     */
    getCartItems: () =>
        api.get('/public/carts/items'),

    /**
     * Remove single cart item
     * @param {number} productId - Product ID
     */
    removeCartItem: (productId) =>
        api.delete(`/public/carts/items/${productId}`),

    /**
     * Remove multiple cart items
     * @param {Array} productIds - Array of product IDs
     */
    removeMultipleCartItems: (productIds) =>
        api.delete('/public/carts/items', {
            params: { productIds: productIds.join(',') }
        }),
};

export default api;