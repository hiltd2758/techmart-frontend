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

                    // TokenResponseDTO: { accessToken, refreshToken }
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

export const customerAPI = {
    // Admin endpoints
    getCustomers: (pageNo = 0, pageSize = 10) =>
        api.get(`/customers?pageNo=${pageNo}&pageSize=${pageSize}`),

    getCustomerById: (id) =>
        api.get(`/customers/profile/${id}`),

    updateCustomer: (id, data) =>
        api.put(`/customers/profile/${id}`, data),

    deleteCustomer: (id) =>
        api.delete(`/customers/profile/${id}`),

    createCustomer: (data) =>
        api.post(`/customers`, data),

    // Public endpoints
    getMyProfile: (username) =>
        api.get(`/public/customer/profile?username=${username}`),

    createGuestUser: (data) =>
        api.post(`/public/customer/guest-user`, {
            username: data.username,
            password: data.password,
            name: data.name,
            email: data.email
        }),

    // Address endpoints
    getAddresses: () =>
        api.get(`/public/customer/addresses`),

    getDefaultAddress: () =>
        api.get(`/public/customer/addresses/default`),

    createAddress: (data) =>
        api.post(`/public/customer/addresses`, data),

    setDefaultAddress: (id) =>
        api.put(`/public/customer/addresses/${id}/set-default`),

    deleteAddress: (id) =>
        api.delete(`/public/customer/addresses/${id}`),
};

// Auth API
export const authAPI = {
    // Login - LoginResponseDTO: { username, email, name, oauthId, roles, token, refreshToken }
    login: (username, password) =>
        api.post('/auth/login', { username, password }),

    // Signup
    signup: (data) =>
        api.post('/auth/sign-up', {
            username: data.username,
            password: data.password,
            name: data.name,
            email: data.email
        }),

    // Verify user registration
    verifyUser: (token) =>
        api.post(`/auth/verification/${token}`),

    // Resend verification email
    resendVerification: (username) =>
        api.post(`/auth/refresh-user-verification?username=${username}`),

    // Logout - requires both accessToken (header) and refreshToken (body)
    logout: () => {
        const refreshToken = localStorage.getItem('refreshToken');
        // accessToken tự động được thêm bởi request interceptor
        return api.post('/auth/logout', { refreshToken });
    },

    // Get user profile
    getUserProfile: (username) =>
        api.get(`/users/${username}`)
};

export default api;