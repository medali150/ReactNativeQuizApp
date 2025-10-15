import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Change this based on your testing device:
// Android Emulator: http://10.0.2.2:5000/api
// iOS Simulator: http://localhost:5000/api
// Physical Device (iPhone/Android): Use your computer's IP address
const API_URL = 'http://192.168.100.233:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: async (username: string, email: string, password: string, role: string = 'user') => {
    const response = await api.post('/auth/register', { username, email, password, role });
    return response.data;
  },
  
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },
  
  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },
  
  getMe: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// User API
export const userAPI = {
  getAllUsers: async () => {
    const response = await api.get('/auth/users');
    return response.data;
  },
  
  updateProfile: async (userId: string, userData: any) => {
    const response = await api.put(`/auth/users/${userId}`, userData);
    return response.data;
  },
  
  deleteUser: async (userId: string) => {
    const response = await api.delete(`/auth/users/${userId}`);
    return response.data;
  },
};

// Quiz API
export const quizAPI = {
  getAllQuizzes: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },
  
  getCategories: async () => {
    const response = await api.get('/quizzes/categories');
    return response.data;
  },
  
  getQuizzesByCategory: async (category: string) => {
    const response = await api.get(`/quizzes/category/${category}`);
    return response.data;
  },
  
  getQuiz: async (id: string) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },
  
  createQuiz: async (quizData: any) => {
    const response = await api.post('/quizzes', quizData);
    return response.data;
  },
  
  updateQuiz: async (id: string, quizData: any) => {
    const response = await api.put(`/quizzes/${id}`, quizData);
    return response.data;
  },
  
  deleteQuiz: async (id: string) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  },
  
  submitQuiz: async (id: string, answers: number[]) => {
    const response = await api.post(`/quizzes/${id}/submit`, { answers });
    return response.data;
  },
  
  getUserSubmissions: async () => {
    const response = await api.get('/quizzes/submissions');
    return response.data;
  },
  
  // AI Quiz Generation
  generateQuizWithAI: async (data: { topic: string; category: string; difficulty: string; numberOfQuestions: number }) => {
    const response = await api.post('/quizzes/generate/ai', data);
    return response.data;
  },
  
  getAIStatus: async () => {
    const response = await api.get('/quizzes/ai/status');
    return response.data;
  },
};

export default api;
