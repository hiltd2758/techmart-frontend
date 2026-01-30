import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1/public',
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
                const payload = JSON.parse(atob(token.split('.')[1]));
                const expiresAt = payload.exp * 1000;
                const now = Date.now();

                if (expiresAt - now < 5 * 60 * 1000) {
                    console.log('[Checkout API] Token expiring soon, refreshing...');

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const { data } = await axios.post(
                            `http://localhost:8080/api/v1/auth/refresh-token/${refreshToken}`
                        );

                        localStorage.setItem('accessToken', data.data.accessToken);
                        localStorage.setItem('refreshToken', data.data.refreshToken);

                        config.headers.Authorization = `Bearer ${data.data.accessToken}`;
                        console.log('[Checkout API] Token refreshed successfully');
                    }
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('[Checkout API] Error decoding/refreshing token:', error);
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

// ============ PAYMENT METHOD CONSTANTS ============
export const PAYMENT_METHODS = {
    VNPAY: 'VNPAY',
    CREDIT_CARD: 'CREDIT_CARD',
    COD: 'COD'
};

// ============ SHIPPING METHOD CONSTANTS ============
export const SHIPPING_METHODS = {
    STANDARD: 'STANDARD',
    EXPRESS: 'EXPRESS',
    SAME_DAY: 'SAME_DAY'
};

// ============ CHECKOUT API ENDPOINTS ============
export const checkoutAPI = {
    /**
     * Create a new checkout
     * POST /api/v1/public/checkouts
     * ✅ Returns: { id, status, progress, totalAmount, paymentMethodId, shipmentMethodId, items[] }
     * 
     * Enhanced version that extracts and validates all required fields
     */
    createCheckout: async (data) => {
        const response = await api.post('/checkouts', data);
        const checkoutData = response.data?.data;
        
        if (!checkoutData) {
            throw new Error('Invalid checkout response - missing data');
        }
        
        // Extract checkout ID (usually in 'id' field for UUID)
        const checkoutId = checkoutData.id;
        if (!checkoutId) {
            throw new Error('Invalid checkout response - missing checkout id');
        }
        
        // Ensure all required fields are present with fallbacks
        const createdCheckout = {
            id: checkoutId,
            checkoutId: checkoutId, // For backward compatibility
            status: checkoutData.status || 'PENDING',
            progress: checkoutData.progress || 'CREATED',
            totalAmount: checkoutData.totalAmount || 0,
            paymentMethodId: checkoutData.paymentMethodId || null,
            shipmentMethodId: checkoutData.shipmentMethodId || null,
            items: checkoutData.items || [],
            createdAt: checkoutData.createdAt || new Date().toISOString(),
            updatedAt: checkoutData.updatedAt || new Date().toISOString()
        };
        
        console.log('[CheckoutAPI] Created checkout:', createdCheckout);
        return {
            data: {
                data: createdCheckout,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Get checkout details
     * GET /api/v1/public/checkouts/{checkoutId}
     * ✅ Returns: { id, status, progress, totalAmount, paymentMethodId, shipmentMethodId, items[] }
     * 
     * Enhanced version that extracts and validates all required fields
     */
    getCheckout: async (checkoutId) => {
        const response = await api.get(`/checkouts/${checkoutId}`);
        const checkoutData = response.data?.data;
        
        if (!checkoutData) {
            throw new Error('Invalid checkout response - missing data');
        }
        
        // Normalize checkout data
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
            ...checkoutData // Include any additional fields
        };
        
        console.log('[CheckoutAPI] Fetched checkout:', checkout);
        return {
            data: {
                data: checkout,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Update checkout information
     * PUT /api/v1/public/checkouts
     * Body: {
     *   checkoutId: string,
     *   shippingAddressId: number,
     *   shipmentMethodId: string,
     *   paymentMethodId: string,
     *   promotionCode: string (optional),
     *   note: string (optional)
     * }
     */
    updateCheckout: (checkoutId, data) =>
        api.put('/checkouts', {
            checkoutId,
            ...data
        }),

    /**
     * Update payment method for a checkout
     * PUT /api/v1/public/checkouts/{checkoutId}/payment-method
     * Body: { paymentMethodId: string }
     */
    updatePaymentMethod: (checkoutId, paymentMethodId) =>
        api.put(`/checkouts/${checkoutId}/payment-method`, {
            paymentMethodId
        }),

    /**
     * Confirm checkout and create order
     * PUT /api/v1/public/checkouts/status
     * ✅ Returns: { orderId, checkoutId, status, totalAmount }
     * 
     * Enhanced version that extracts order ID from response
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
        
        // Extract order ID from confirmation
        const orderId = confirmData.orderId || confirmData.id;
        if (!orderId) {
            console.warn('[CheckoutAPI] No orderId in confirmation response:', confirmData);
        }
        
        const confirmed = {
            orderId: orderId || null,
            checkoutId: checkoutId,
            status: confirmData.status || 'CONFIRMED',
            totalAmount: confirmData.totalAmount || 0,
            ...confirmData
        };
        
        console.log('[CheckoutAPI] Checkout confirmed:', confirmed);
        return {
            data: {
                data: confirmed,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Cancel checkout
     * DELETE /api/v1/public/checkouts/{checkoutId}
     */
    cancelCheckout: (checkoutId) =>
        api.delete(`/checkouts/${checkoutId}`),
};

export default api;