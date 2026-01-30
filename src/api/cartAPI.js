import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/public/carts',
    headers: {
        'Content-Type': 'application/json',
    },
});

// ============ REQUEST INTERCEPTOR - AUTO REFRESH WHEN EXPIRING SOON ============
api.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem('accessToken');

        if (token) {
            try {
                // Decode JWT to check expiration
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiresAt = payload.exp * 1000; // Convert to milliseconds
                const now = Date.now();

                // If token expires in < 5 minutes → refresh now
                if (expiresAt - now < 5 * 60 * 1000) {
                    console.log('Token expiring soon, refreshing...');

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const { data } = await axios.post(
                            `http://localhost:8080/api/v1/auth/refresh-token/${refreshToken}`
                        );

                        localStorage.setItem('accessToken', data.data.accessToken);
                        localStorage.setItem('refreshToken', data.data.refreshToken);

                        config.headers.Authorization = `Bearer ${data.data.accessToken}`;
                        console.log('Token refreshed successfully');
                    }
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error decoding/refreshing token:', error);
                config.headers.Authorization = `Bearer ${token}`;
            }
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ============ RESPONSE INTERCEPTOR - HANDLE EXPIRED TOKEN ============
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized
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
                    return Promise.reject(err);
                }
            }
        }

        return Promise.reject(error);
    }
);

export const cartAPI = {
    /**
     * Get all cart items for the authenticated user
     * @returns {Promise} Response with cart items array
     * Response format: { statusCode, message, data: [...cartItems] }
     * Each item: { productId, quantity, createdAt, updatedAt }
     */
    getCartItems: () =>
        api.get('/items'),

    /**
     * Add item to cart
     * @param {Object} data - { productId, quantity }
     * @returns {Promise} Response with created/updated cart item
     */
    addItemToCart: (data) =>
        api.post('/items', data),

    /**
     * Update cart item quantity
     * @param {string} productId - Product ID to update
     * @param {Object} data - { quantity }
     * @returns {Promise} Response with updated cart item
     */
    updateItemQuantity: (productId, data) =>
        api.put(`/items/${productId}`, {
            productId: productId,
            quantity: data.quantity
        }),

    /**
     * Remove single item from cart
     * @param {string} productId - Product ID to remove
     * @returns {Promise} Response confirming removal
     */
    removeItem: (productId) =>
        api.delete(`/items/${productId}`),

    /**
     * Remove multiple items from cart
     * @param {Array<string>} productIds - Array of product IDs to remove
     * @returns {Promise} Response confirming bulk removal
     */
    removeMultipleItems: (productIds) => {
        const params = new URLSearchParams();
        productIds.forEach(id => params.append('productIds', id));
        return api.delete('/items', { params });
    },
};

export default api;