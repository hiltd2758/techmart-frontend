import api from './productAPI';

// ==================== API ENDPOINTS ====================

export const countryAPI = {
    /**
     * Lấy danh sách tất cả quốc gia (công khai)
     * @returns {Promise} Response chứa danh sách quốc gia
     */
    getCountries: () =>
        api.get('/public/countries'),

    /**
     * Lấy danh sách tỉnh/thành của quốc gia theo ID
     * @param {number} countryId - ID của quốc gia
     * @returns {Promise} Response chứa danh sách tỉnh/thành
     */
    getStatesByCountryId: (countryId) =>
        api.get(`/public/state-or-provinces/${countryId}`),

    /**
     * Lấy danh sách quận/huyện theo tỉnh/thành
     * @param {number} stateOrProvinceId - ID của tỉnh/thành
     * @returns {Promise} Response chứa danh sách quận/huyện
     */
    getDistrictsByStateOrProvinceId: (stateOrProvinceId) =>
        api.get(`/public/districts/${stateOrProvinceId}`),

    /**
     * Lấy danh sách quốc gia (admin)
     * @returns {Promise} Response chứa danh sách quốc gia
     */
    getAdminCountries: () =>
        api.get('/countries'),

    /**
     * Lấy danh sách quốc gia với phân trang (admin)
     * @param {number} pageNo - Số trang (bắt đầu từ 0)
     * @param {number} pageSize - Số item trên mỗi trang
     * @returns {Promise} Response chứa danh sách quốc gia và thông tin phân trang
     */
    getAdminCountriesPaging: (pageNo = 0, pageSize = 10) =>
        api.get(`/countries/paging?pageNo=${pageNo}&pageSize=${pageSize}`),

    /**
     * Lấy thông tin quốc gia theo ID (admin)
     * @param {number} id - ID của quốc gia
     * @returns {Promise} Response chứa thông tin quốc gia
     */
    getCountryById: (id) =>
        api.get(`/countries/${id}`),

    /**
     * Tạo quốc gia mới (admin)
     * @param {Object} data - Dữ liệu quốc gia
     * @returns {Promise} Response chứa quốc gia vừa tạo
     */
    createCountry: (data) =>
        api.post('/countries', data),

    /**
     * Cập nhật thông tin quốc gia (admin)
     * @param {number} id - ID của quốc gia
     * @param {Object} data - Dữ liệu cập nhật
     * @returns {Promise} Response từ server
     */
    updateCountry: (id, data) =>
        api.put(`/countries/${id}`, data),

    /**
     * Xóa quốc gia (admin)
     * @param {number} id - ID của quốc gia
     * @returns {Promise} Response xác nhận xóa
     */
    deleteCountry: (id) =>
        api.delete(`/countries/${id}`),
};

export default countryAPI;