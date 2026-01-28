import api from './productAPI'; // Reusing the configured axios instance

export const addressAPI = {
    /**
     * Create new address
     * @param {Object} data - Address data
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
        api.get(`/public/addresses?ids=${ids.join(',')}`),

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
};

export default addressAPI;
