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
                    console.log('[Order API] Token expiring soon, refreshing...');

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        const { data } = await axios.post(
                            `http://localhost:8080/api/v1/auth/refresh-token/${refreshToken}`
                        );

                        localStorage.setItem('accessToken', data.data.accessToken);
                        localStorage.setItem('refreshToken', data.data.refreshToken);

                        config.headers.Authorization = `Bearer ${data.data.accessToken}`;
                        console.log('[Order API] Token refreshed successfully');
                    }
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('[Order API] Error decoding/refreshing token:', error);
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

// ============ ORDER API ENDPOINTS ============
export const orderAPI = {
    /**
     * Create order directly (not commonly used - use checkout flow instead)
     * POST /api/v1/public/orders
     * ✅ Returns: { orderId, status, paymentStatus, shipmentStatus, progress, checkoutId, totalAmount, email, note }
     * 
     * Enhanced version that extracts and validates all required fields
     */
    createOrder: async (data) => {
        const response = await api.post('/public/orders', data);
        const orderData = response.data?.data;
        
        if (!orderData) {
            throw new Error('Invalid order creation response - missing data');
        }
        
        // Extract numeric orderId (could be in 'id' or 'orderId' field depending on backend)
        const orderId = orderData.id || orderData.orderId;
        if (!orderId) {
            throw new Error('Invalid order response - missing orderId/id');
        }
        
        // Ensure all required fields are present with fallbacks
        const createdOrder = {
            orderId: orderId,
            id: orderId, // For backward compatibility
            status: orderData.status || 'PENDING',
            paymentStatus: orderData.paymentStatus || 'PENDING',
            shipmentStatus: orderData.shipmentStatus || 'PENDING',
            progress: orderData.progress || 'CREATED',
            checkoutId: orderData.checkoutId || null,
            totalAmount: orderData.totalAmount || 0,
            email: orderData.email || '',
            note: orderData.note || '',
            createdAt: orderData.createdAt || new Date().toISOString()
        };
        
        console.log('[OrderAPI] Created order:', createdOrder);
        return {
            data: {
                data: createdOrder,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Get order by numeric ID
     * GET /api/v1/orders/{id}
     * ✅ Returns: { orderId, status, paymentStatus, shipmentStatus, progress, checkoutId, totalAmount, email, note }
     */
    getOrderById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        const orderData = response.data?.data;
        
        if (!orderData) {
            throw new Error('Invalid order response - missing data');
        }
        
        // Ensure consistent data structure
        const normalizedOrder = {
            orderId: orderData.id || orderData.orderId || orderId,
            id: orderData.id || orderData.orderId || orderId,
            status: orderData.status || 'UNKNOWN',
            paymentStatus: orderData.paymentStatus || 'UNKNOWN',
            shipmentStatus: orderData.shipmentStatus || 'UNKNOWN',
            progress: orderData.progress || orderData.status,
            checkoutId: orderData.checkoutId || null,
            totalAmount: orderData.totalAmount || 0,
            email: orderData.email || '',
            note: orderData.note || '',
            paymentMethod: orderData.paymentMethod || 'UNKNOWN',
            createdAt: orderData.createdAt || null,
            updatedAt: orderData.updatedAt || null,
            ...orderData // Include any additional fields from backend
        };
        
        console.log('[OrderAPI] Fetched order:', normalizedOrder);
        return {
            data: {
                data: normalizedOrder,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Get order by checkout ID (polling-friendly version)
     * GET /api/v1/public/orders/checkout/{checkoutId}
     * ✅ Returns full order data when order is created from checkout
     * ✅ Throws 404 if order not yet created
     * 
     * Enhanced version for polling - extracts and validates order data
     */
    getOrderByCheckoutId: async (checkoutId) => {
        const response = await api.get(`/public/orders/checkout/${checkoutId}`);
        const orderData = response.data?.data;
        
        if (!orderData) {
            throw new Error('Invalid order response - missing data');
        }
        
        // Extract orderId
        const orderId = orderData.id || orderData.orderId;
        if (!orderId) {
            throw new Error('Invalid order response - missing orderId');
        }
        
        // Normalize order data
        const normalizedOrder = {
            orderId: orderId,
            id: orderId,
            status: orderData.status || 'PENDING',
            paymentStatus: orderData.paymentStatus || 'PENDING',
            shipmentStatus: orderData.shipmentStatus || 'PENDING',
            progress: orderData.progress || 'CREATED',
            checkoutId: orderData.checkoutId || checkoutId,
            totalAmount: orderData.totalAmount || 0,
            email: orderData.email || '',
            note: orderData.note || '',
            paymentMethodId: orderData.paymentMethodId || orderData.paymentMethod || 'UNKNOWN',
            shipmentMethodId: orderData.shipmentMethodId || orderData.shipmentMethod || 'UNKNOWN',
            customerId: orderData.customerId || null,
            numberItem: orderData.numberItem || 0,
            promotionCode: orderData.promotionCode || null,
            attributes: orderData.attributes || {},
            createdAt: orderData.createdAt || null,
            updatedAt: orderData.updatedAt || null
        };
        
        console.log('[OrderAPI] Fetched order by checkoutId:', normalizedOrder);
        return {
            data: {
                data: normalizedOrder,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Get user's orders with pagination
     * GET /api/v1/public/orders/my-orders
     */
    getMyOrders: (page = 0, size = 10) => 
        api.get('/public/orders/my-orders', {
            params: { page, size }
        }),

    /**
     * Get order details with items
     * GET /api/v1/public/orders/{id}/details
     */
    getOrderDetails: (orderId) => 
        api.get(`/public/orders/${orderId}/details`),

    /**
     * Cancel order
     * PUT /api/v1/orders/{id}/cancel
     */
    cancelOrder: (orderId, reason = 'Cancelled by user') => 
        api.put(`/orders/${orderId}/cancel`, null, {
            params: { reason }
        }),

    /**
     * Get order status
     * GET /api/v1/orders/{id}/status
     * ✅ Returns: { status, paymentStatus, shipmentStatus, progress, orderId }
     */
    getOrderStatus: async (orderId) => {
        const response = await api.get(`/orders/${orderId}/status`);
        const statusData = response.data?.data;
        
        if (!statusData) {
            throw new Error('Invalid status response - missing data');
        }
        
        // Normalize status response
        const orderStatus = {
            orderId: statusData.id || statusData.orderId || orderId,
            id: statusData.id || statusData.orderId || orderId,
            status: statusData.status || 'UNKNOWN',
            paymentStatus: statusData.paymentStatus || 'UNKNOWN',
            shipmentStatus: statusData.shipmentStatus || 'UNKNOWN',
            progress: statusData.progress || statusData.status,
            updatedAt: statusData.updatedAt || new Date().toISOString(),
            ...statusData // Include any additional fields
        };
        
        console.log('[OrderAPI] Order status:', orderStatus);
        return {
            data: {
                data: orderStatus,
                message: response.data?.message,
                timestamp: response.data?.timestamp
            }
        };
    },

    /**
     * Update order payment status
     * PUT /api/v1/public/orders/status
     */
    updateOrderPaymentStatus: (data) => 
        api.put('/public/orders/status', data),

    /**
     * Check if order exists with specific status (for completed orders)
     * GET /api/v1/public/orders/completed
     */
    checkOrderCompleted: (productId, status = 'COMPLETED') => 
        api.get('/public/orders/completed', {
            params: { productId, status }
        }),
};

export default api;