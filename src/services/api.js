import axios from 'axios';  
  
const api = axios.create({  
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080', // ← Bỏ /api
  headers: {  
    'Content-Type': 'application/json',  
  },  
});  
  
export const productsAPI = {  
  getNewArrivals: () => api.get('/api/v1/products/new-arrivals'),
  getDeals: () => api.get('/api/v1/products/deals'),
};  
  
export default api;