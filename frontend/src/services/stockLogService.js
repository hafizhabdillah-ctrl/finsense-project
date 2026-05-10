import api from './api';

export const getStockLogs = (params) => api.get('/stock-logs', { params });
export const createStockLog = (data) => api.post('/stock-logs', data);
