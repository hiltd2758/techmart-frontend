import axios from 'axios';
import customerAPI from './customerAPI';

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

                const timeUntilExpiry = expiresAt - now;
                console.log('[Address API] Token expires in:', Math.round(timeUntilExpiry / 1000), 'seconds');

                if (timeUntilExpiry < 5 * 60 * 1000) {
                    console.log('[Address API] Token expired/expiring soon, refreshing...');

                    const refreshToken = localStorage.getItem('refreshToken');
                    if (refreshToken) {
                        try {
                            const { data } = await axios.post(
                                `http://localhost:8080/api/v1/auth/refresh-token/${refreshToken}`
                            );

                            localStorage.setItem('accessToken', data.data.accessToken);
                            localStorage.setItem('refreshToken', data.data.refreshToken);

                            config.headers.Authorization = `Bearer ${data.data.accessToken}`;
                            console.log('[Address API] Token refreshed successfully');
                        } catch (refreshError) {
                            console.error('[Address API] Token refresh failed:', refreshError.message);
                            localStorage.clear();
                            window.location.href = '/login';
                            return Promise.reject(refreshError);
                        }
                    }
                } else {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('[Address API] Error decoding/refreshing token:', error);
                // Still set the token even if decoding failed
                config.headers.Authorization = `Bearer ${token}`;
            }
        } else {
            console.warn('[Address API] No accessToken found in localStorage');
        }

        console.log('[Address API] Request:', config.method?.toUpperCase(), config.url, 'Auth Header:', config.headers.Authorization ? 'Present' : 'Missing');
        return config;
    },
    (error) => Promise.reject(error)
);

// ============ RESPONSE INTERCEPTOR - HANDLE EXPIRED TOKEN ============
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status === 403) {
            const token = localStorage.getItem('accessToken');
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    console.error('[Address API] 403 Forbidden - Token Payload:', payload);
                    console.error('[Address API] Token expires at:', new Date(payload.exp * 1000));
                    console.error('[Address API] Token scopes/roles:', payload.scope || payload.roles || 'N/A');
                } catch (e) {
                    console.error('[Address API] Failed to decode token for debugging');
                }
            }
            console.error('[Address API] 403 Forbidden - Full Response:', error.response);
            console.error('[Address API] 403 Forbidden - Response Data:', error.response?.data);
            console.error('[Address API] 403 Forbidden - Response Status:', error.response?.status);
            console.error('[Address API] 403 Forbidden - Response Headers:', error.response?.headers);
            console.error('[Address API] Request URL:', originalRequest?.url);
            console.error('[Address API] Request Method:', originalRequest?.method);
            console.error('[Address API] Request Data:', originalRequest?.data);
            console.error('[Address API] Auth Header Present:', !!originalRequest?.headers?.Authorization);
        }

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
                    console.error('[Address API] Token refresh failed, redirecting to login');
                    localStorage.clear();
                    window.location.href = '/login';
                    return Promise.reject(err);
                }
            }
        }

        return Promise.reject(error);
    }
);

export const addressAPI = {
    // ===== LOCATION SERVICE (addresses table) =====
    
    /**
     * Create new physical address in location service
     * @param {Object} data - { street, ward, district, city, province, postalCode }
     */
    createAddress: (data) =>
        api.post('/public/addresses', data),

    /**
     * Get address by ID
     * @param {number} id 
     */
    getAddressById: (id) =>
        api.get(`/public/addresses/${id}`),

    /**
     * Get multiple addresses by IDs
     * @param {Array} ids 
     */
    getAddressesByIds: (ids) =>
        api.get('/public/addresses', { params: { ids: ids.join(',') } }),

    /**
     * Update address
     * @param {number} id 
     * @param {Object} data 
     */
    updateAddress: (id, data) =>
        api.put(`/public/addresses/${id}`, data),

    /**
     * Delete address
     * @param {number} id 
     */
    deleteAddress: (id) =>
        api.delete(`/public/addresses/${id}`),

    // ===== CUSTOMER SERVICE (user_addresses - mapping) =====
    
    /**
     * Get all user addresses (customer's saved addresses)
     * @param {string} userId - Optional, auto-detected from auth if not provided
     */
    getUserAddresses: (userId = null) =>
        api.get('/public/customer/addresses', userId ? { params: { userId } } : {}),

    /**
     * Get default user address
     * @param {string} userId - Optional
     */
    getDefaultAddress: (userId = null) =>
        api.get('/public/customer/addresses/default', userId ? { params: { userId } } : {}),

    /**
     * Create user address (link address to customer)
     * @param {Object} data - { addressId, isDefault }
     */
    createUserAddress: (data) =>
        api.post('/public/customer/addresses', data),

    /**
     * Set address as default
     * @param {number} id - User address ID
     */
    setDefaultAddress: (id) =>
        api.put(`/public/customer/addresses/${id}/set-default`),

    /**
     * Delete user address
     * @param {number} id - User address ID
     */
    deleteUserAddress: (id) =>
        api.delete(`/public/customer/addresses/${id}`),

    // ===== COMBINED OPERATIONS =====
    
    /**
     * Create complete address (backend handles creation + customer linking)
     * @param {Object} addressData - { street, ward, district, city, province, postalCode, countryId, stateId, districtId }
     * @param {boolean} isDefault 
     */
    createCompleteAddress: async (addressData, isDefault = false) => {
        try {
            console.log('[Address API] Creating address with customer linking...');
            
            // Backend endpoint handles both address creation and customer linking in one call
            const response = await api.post('/public/customer/addresses', {
                ...addressData,
                isDefault,
            });
            
            console.log('[Address API] Address created and linked successfully');
            return response;
        } catch (error) {
            console.error('[Address API] Error creating address:', error);
            throw error;
        }
    },

    /**
     * Update complete address
     * @param {number} userAddressId - User address ID
     * @param {number} addressId - Physical address ID
     * @param {Object} addressData - Updated address data
     */
    updateCompleteAddress: async (userAddressId, addressId, addressData) => {
        // Update physical address
        await api.put(`/public/addresses/${addressId}`, addressData);
        
        return { success: true };
    },
};

export default addressAPI;