import axios from 'axios';  
  
const api = axios.create({  
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',  
  headers: {  
    'Content-Type': 'application/json',  
  },  
});  
  
export const productsAPI = {  
  getNewArrivals: () => api.get('/products/new-arrivals'),  
  getDeals: () => api.get('/products/deals'),  
};  
  
export default api;