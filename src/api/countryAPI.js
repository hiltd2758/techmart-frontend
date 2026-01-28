import api from './productAPI';

export const countryAPI = {
    getCountries: () =>
        api.get('/public/countries'),

    getStatesByCountryId: (countryId) =>
        api.get(`/public/state-or-provinces/${countryId}`),

    getDistrictsByStateOrProvinceId: (stateOrProvinceId) =>
        api.get(`/public/districts/${stateOrProvinceId}`),

    getAdminCountries: () =>
        api.get('/countries'),

    getAdminCountriesPaging: (pageNo = 0, pageSize = 10) =>
        api.get(`/countries/paging?pageNo=${pageNo}&pageSize=${pageSize}`),

    getCountryById: (id) =>
        api.get(`/countries/${id}`),

    createCountry: (data) =>
        api.post('/countries', data),

    updateCountry: (id, data) =>
        api.put(`/countries/${id}`, data),

    deleteCountry: (id) =>
        api.delete(`/countries/${id}`),
};

export default countryAPI;