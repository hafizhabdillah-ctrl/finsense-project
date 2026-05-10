import api from './api';

export const getDebts = () => api.get('/debts');
export const createDebt = (data) => api.post('/debts', data);
export const addPayment = (debtId, amount) =>
  api.post(`/debts/${debtId}/pay`, { amount });
export const deleteDebt = (id) => api.delete(`/debts/${id}`);
