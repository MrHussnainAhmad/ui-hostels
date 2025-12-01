import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log('🚀 Request:', config.method?.toUpperCase(), config.baseURL + config.url);
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.warn('Could not access localStorage. Proceeding without auth token.', error);
    }
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.status, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error);
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  register: (data: { email: string; password: string; role: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  createSubAdmin: (data: { email: string; password: string }) =>
    api.post('/auth/sub-admin', data),
  deleteSubAdmin: (id: string) => api.delete(`/auth/sub-admin/${id}`),
};

// Placeholder APIs for now
export const usersApi = {
  selfVerify: (data: any) => api.post('/users/student/self-verify', data),
  getStudentProfile: () => api.get('/users/student/profile'),
  getManagerProfile: () => api.get('/users/manager/profile'),
  updateManagerProfile: (data: any) => api.patch('/users/manager/profile', data),
  getAllUsers: (role?: string) => api.get('/users', { params: { role } }),
  terminateUser: (id: string) => api.post(`/users/${id}/terminate`),
};

export const verificationsApi = {
  submit: (data: any) => api.post('/verifications', data),
  getMy: () => api.get('/verifications/my'),
  getAll: (status?: string) => api.get('/verifications', { params: { status } }),
  getById: (id: string) => api.get(`/verifications/${id}`),
  review: (id: string, data: any) => api.post(`/verifications/${id}/review`, data),
};

export const hostelsApi = {
  create: (data: any) => api.post('/hostels', data),
  update: (id: string, data: any) => api.patch(`/hostels/${id}`, data),
  delete: (id: string) => api.delete(`/hostels/${id}`),
  getMy: () => api.get('/hostels/manager/my'),
  search: (params: any) => api.get('/hostels/search', { params }),
  getById: (id: string) => api.get(`/hostels/${id}`),
  getStudents: (id: string) => api.get(`/hostels/${id}/students`),
  getAll: () => api.get('/hostels/admin/all'),
};

export const reservationsApi = {
  create: (data: any) => api.post('/reservations', data),
  getMy: () => api.get('/reservations/my'),
  cancel: (id: string) => api.post(`/reservations/${id}/cancel`),
  getHostelReservations: (hostelId: string) => api.get(`/reservations/hostel/${hostelId}`),
  review: (id: string, data: any) => api.post(`/reservations/${id}/review`, data),
};

export const bookingsApi = {
  create: (data: any) => api.post('/bookings', data),
  getMy: () => api.get('/bookings/my'),
  getHostelBookings: (hostelId: string) => api.get(`/bookings/hostel/${hostelId}`),
  approve: (id: string) => api.post(`/bookings/${id}/approve`),
  disapprove: (id: string, data: any) => api.post(`/bookings/${id}/disapprove`, data),
  leave: (data: any) => api.post('/bookings/leave', data),
  kick: (id: string, data: any) => api.post(`/bookings/${id}/kick`, data),
  getAll: (status?: string) => api.get('/bookings', { params: { status } }),
  getById: (id: string) => api.get(`/bookings/${id}`),
};

export const feesApi = {
  submit: (data: any) => api.post('/fees', data),
  getMy: () => api.get('/fees/my'),
  getPendingSummary: () => api.get('/fees/pending-summary'),
  getAll: (status?: string) => api.get('/fees', { params: { status } }),
  review: (id: string, data: any) => api.post(`/fees/${id}/review`, data),
};

export const reportsApi = {
  create: (data: any) => api.post('/reports', data),
  getMy: () => api.get('/reports/my'),
  getManagerReports: () => api.get('/reports/manager/my'),
  getAll: (status?: string) => api.get('/reports', { params: { status } }),
  getById: (id: string) => api.get(`/reports/${id}`),
  resolve: (id: string, data: any) => api.post(`/reports/${id}/resolve`, data),
};

export const chatApi = {
  startConversation: (data: any) => api.post('/chat/conversation', data),
  sendMessage: (data: any) => api.post('/chat/message', data),
  getConversations: () => api.get('/chat/conversations'),
  getMessages: (conversationId: string) => api.get(`/chat/conversation/${conversationId}/messages`),
  getAllConversations: () => api.get('/chat/admin/conversations'),
};

export default api;