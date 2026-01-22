import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

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

export default api;