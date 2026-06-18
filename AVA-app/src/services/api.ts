import axios from 'axios';

const BASE_URL = (process.env as any).EXPO_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({ baseURL: BASE_URL });

export const authAPI = {
  register: (data: { prenom: string; nom: string; email: string; tel?: string; password: string }) =>
    api.post('/auth/register', data),
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
};

export const chatAPI = {
  sendMessage: (message: string, userId: string) =>
    api.post('/chat/message', { message, userId }),
};

export const paymentAPI = {
  createSubscription: (paymentMethodId: string) =>
    api.post('/payment/subscribe', { paymentMethodId }),
  cancelSubscription: () =>
    api.post('/payment/cancel'),
  validateCode: (code: string) =>
    api.post('/payment/validate-code', { code }),
};
