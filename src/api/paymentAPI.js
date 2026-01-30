import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
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
                    console.log('[Payment API] Token expiring soon, refreshing...');

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const { data } = await axios.post(
                            `http://localhost:8080/api/v1/auth/refresh-token/${refreshToken}`
                        );

                        localStorage.setItem('accessToken', data.data.accessToken);
                        localStorage.setItem('refreshToken', data.data.refreshToken);

                        config.headers.Authorization = `Bearer ${data.data.accessToken}`;
                        console.log('[Payment API] Token refreshed successfully');
                    }
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('[Payment API] Error decoding/refreshing token:', error);
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

// ============ PAYMENT API ENDPOINTS ============
export const paymentAPI = {
    /**
     * Create a new payment
     * POST /api/v1/payments
     * @param {string} checkoutId - Checkout ID
     * @param {number} orderId - Order ID (optional)
     * @param {number} amount - Payment amount
     * @param {string} paymentMethod - Payment method (VNPAY, CREDIT_CARD, COD)
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
     * Initiate payment with provider (get redirect URL)
     * GET /api/v1/payments/{orderId}/initiate
     * ✅ Returns: { redirectUrl, paymentId, expiresAt, status, successful }
     * 
     * Enhanced version that extracts and validates all required fields
     */
    initiatePayment: async (orderId) => {
        const response = await api.get(`/payments/${orderId}/initiate`);
        const paymentData = response.data?.data;
        
        if (!paymentData) {
            throw new Error('Invalid payment initiation response - missing data');
        }
        
        // Ensure all required fields are present with fallbacks
        const initiatedPayment = {
            redirectUrl: paymentData.redirectUrl || null,
            paymentId: paymentData.paymentId || null,
            expiresAt: paymentData.expiresAt || null,
            status: paymentData.status || 'pending',
            successful: paymentData.successful !== undefined ? paymentData.successful : false
        };
        
        console.log('[PaymentAPI] Initiated payment:', initiatedPayment);
        return {
            data: {
                data: initiatedPayment,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Get payment by ID
     * GET /api/v1/payments/{paymentId}
     */
    getPaymentById: (paymentId) =>
        api.get(`/payments/${paymentId}`),

    /**
     * Get payment by checkout ID
     * GET /api/v1/payments/checkout/{checkoutId}
     */
    getPaymentByCheckoutId: (checkoutId) =>
        api.get(`/payments/checkout/${checkoutId}`),

    /**
     * Get payment by order ID
     * GET /api/v1/payments/order/{orderId}
     */
    getPaymentByOrderId: (orderId) =>
        api.get(`/payments/order/${orderId}`),

    /**
     * Check payment status
     * GET /api/v1/payments/{paymentId}/status
     */
    checkPaymentStatus: (paymentId) =>
        api.get(`/payments/${paymentId}/status`),

    /**
     * Get payments by status
     * GET /api/v1/payments/status/{status}
     */
    getPaymentsByStatus: (status) =>
        api.get(`/payments/status/${status}`),

    /**
     * Process refund
     * POST /api/v1/payments/{paymentId}/refund
     */
    processRefund: (paymentId, refundAmount, reason) =>
        api.post(`/payments/${paymentId}/refund`, {
            refundAmount,
            reason
        }),

    /**
     * Cancel payment
     * POST /api/v1/payments/{paymentId}/cancel
     */
    cancelPayment: (paymentId) =>
        api.post(`/payments/${paymentId}/cancel`),

    /**
     * Retry failed payment
     * POST /api/v1/payments/{paymentId}/retry
     */
    retryPayment: (paymentId) =>
        api.post(`/payments/${paymentId}/retry`),

    /**
     * Get supported payment methods
     * GET /api/v1/payments/methods
     */
    getSupportedMethods: () =>
        api.get('/payments/methods'),

    /**
     * Check if payment method is available
     * GET /api/v1/payments/methods/{method}/available
     */
    isMethodAvailable: (method) =>
        api.get(`/payments/methods/${method}/available`),

    /**
     * Confirm COD payment
     * POST /api/v1/payments/callback/cod
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