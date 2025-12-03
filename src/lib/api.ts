import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

console.log('🌐 API Base URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // Increased for file uploads
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

// Helper function to create FormData from object with files
export const createFormData = (
  data: Record<string, any>,
  files?: { fieldName: string; files: File[] }[]
): FormData => {
  const formData = new FormData();

  // Add files
  files?.forEach(({ fieldName, files: fileList }) => {
    fileList.forEach((file) => {
      formData.append(fieldName, file);
    });
  });

  // Add other data as JSON string
  const jsonData: Record<string, any> = {};
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      jsonData[key] = value;
    }
  });
  formData.append('data', JSON.stringify(jsonData));

  return formData;
};

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

export const usersApi = {
  selfVerify: (data: any) => api.post('/users/student/self-verify', data),
  getStudentProfile: () => api.get('/users/student/profile'),
  getManagerProfile: () => api.get('/users/manager/profile'),
  updateManagerProfile: (data: any) => api.patch('/users/manager/profile', data),
  getAllUsers: (role?: string) => api.get('/users', { params: { role } }),
  terminateUser: (id: string) => api.post(`/users/${id}/terminate`),
};

export const verificationsApi = {
  submit: (formData: FormData) =>
    api.post('/verifications', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMy: () => api.get('/verifications/my'),
  getAll: (status?: string) => api.get('/verifications', { params: { status } }),
  getById: (id: string) => api.get(`/verifications/${id}`),
  review: (id: string, data: any) => api.post(`/verifications/${id}/review`, data),
};

export const hostelsApi = {
  create: (formData: FormData) =>
    api.post('/hostels', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  update: (id: string, formData: FormData) =>
    api.patch(`/hostels/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  delete: (id: string) => api.delete(`/hostels/${id}`),
  getMy: () => api.get('/hostels/manager/my'),
  search: (params: any) => api.get('/hostels/search', { params }),
  getById: (id: string) => api.get(`/hostels/${id}`),
  getStudents: (id: string) => api.get(`/hostels/${id}/students`),
  getAll: () => api.get('/hostels/admin/all'),
  getRandomReviews: (limit: number = 4) => api.get('/hostels/reviews/random', { params: { limit } }), // NEW
};

export const reservationsApi = {
  create: (data: { hostelId: string; roomType: string; message?: string }) => 
    api.post('/reservations', data),
  getMy: () => api.get('/reservations/my'),
  cancel: (id: string) => api.post(`/reservations/${id}/cancel`),
  getHostelReservations: (hostelId: string) => api.get(`/reservations/hostel/${hostelId}`),
  review: (id: string, data: any) => api.post(`/reservations/${id}/review`, data),
};

export const bookingsApi = {
  create: (formData: FormData) =>
    api.post('/bookings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getMy: () => api.get('/bookings/my'),
  getHostelBookings: (hostelId: string) => api.get(`/bookings/hostel/${hostelId}`),
  approve: (id: string) => api.post(`/bookings/${id}/approve`),
  disapprove: (id: string, formData: FormData) =>
    api.post(`/bookings/${id}/disapprove`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  leave: (data: any) => api.post('/bookings/leave', data),
  kick: (id: string, data: any) => api.post(`/bookings/${id}/kick`, data),
  getAll: (status?: string) => api.get('/bookings', { params: { status } }),
  getById: (id: string) => api.get(`/bookings/${id}`),
};

export const feesApi = {
  submit: (formData: FormData) =>
    api.post('/fees', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
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