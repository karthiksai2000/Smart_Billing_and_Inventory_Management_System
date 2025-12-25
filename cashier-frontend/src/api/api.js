import axios from 'axios';

const API_BASE_URL = 'http://localhost:9090/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add request interceptor to include auth token if available
api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (user && user.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
};

// Products API (Items in demo)
export const productsAPI = {
  getAll: () => api.get('/items'),
  getById: (id) => api.get(`/items/${id}`),
  getByCustomId: (customId) => api.get(`/items/by-custom/${encodeURIComponent(customId)}`),
  create: (product) => api.post('/items', product),
  update: (id, product) => api.put(`/items/${id}`, product),
  delete: (id) => api.delete(`/items/${id}`),
  search: (query) => api.get(`/items/search?name=${query}`),
  updateStock: (id, quantity) => api.patch(`/items/${id}/stock?quantity=${quantity}`),
  getLowStock: () => api.get('/items/low-stock'),
  getByCategory: (categoryId) => api.get(`/items/category/${categoryId}`),
};

// Categories API
export const categoriesAPI = {
  getAll: () => api.get('/categories'),
  create: (category) => api.post('/categories', category),
  update: (id, category) => api.put(`/categories/${id}`, category),
  delete: (id) => api.delete(`/categories/${id}`),
};

// Sales/Bills API
export const salesAPI = {
  getAll: (params) => api.get('/bills', { params }),
  create: (sale) => api.post('/bills', sale),
  createFromCart: (cartData) => api.post('/bills/from-cart', cartData),
  getById: (id) => api.get(`/bills/${id}`),
  getByCashier: (cashierId) => api.get(`/bills/cashier/${cashierId}`),
  getByDateRange: (startDate, endDate) => api.get(`/bills/date-range?startDate=${startDate}&endDate=${endDate}`),
  refund: (id) => api.post(`/bills/${id}/refund`),
  refundItems: (billId, itemIds) => api.post(`/bills/${billId}/refund-items`, { itemIds }),
};

// Customers API
export const customersAPI = {
  getAll: () => api.get('/customers'),
  getById: (id) => api.get(`/customers/${id}`),
  create: (customer) => api.post('/customers', customer),
  update: (id, customer) => api.put(`/customers/${id}`, customer),
  delete: (id) => api.delete(`/customers/${id}`),
  search: (name) => api.get(`/customers/search?name=${name}`),
  getByPhone: (phone) => api.get(`/customers/phone/${phone}`),
};

// Dashboard/Reports API
export const reportsAPI = {
  getDashboardStats: async () => {
    // Calculate stats from bills and items
    const [billsResponse, itemsResponse] = await Promise.all([
      api.get('/bills'),
      api.get('/items')
    ]);
    
    const bills = billsResponse.data;
    const items = itemsResponse.data;
    
    const totalSales = bills.reduce((sum, bill) => sum + (bill.totalAmount || 0), 0);
    const totalTransactions = bills.length;
    const lowStockItems = items.filter(item => item.stockQuantity < 10).length;
    
    return {
      data: {
        totalSales,
        totalTransactions,
        lowStockItems,
        totalProducts: items.length
      }
    };
  },
  getSalesReport: (params) => api.get('/bills', { params }),
  getTransactions: (params) => api.get('/bills', { params }),
};

export default api;