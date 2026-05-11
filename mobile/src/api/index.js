import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {}
  return config;
});

// Auth
export const login = (credentials) =>
  api.post('/auth/login', credentials).then((r) => r.data);

export const getMe = () =>
  api.get('/auth/me').then((r) => r.data);

// Posts
export const getPosts = () =>
  api.get('/posts').then((r) => r.data);

export const getPostById = (id) =>
  api.get(`/posts/${id}`).then((r) => r.data);

export const searchPosts = (q) =>
  api.get(`/posts/search?q=${encodeURIComponent(q)}`).then((r) => r.data);

export const createPost = (data) =>
  api.post('/posts', data).then((r) => r.data);

export const updatePost = (id, data) =>
  api.put(`/posts/${id}`, data).then((r) => r.data);

export const deletePost = (id) =>
  api.delete(`/posts/${id}`).then((r) => r.data);

// Users
export const getUsers = (params) =>
  api.get('/users', { params }).then((r) => r.data);

export const getUserById = (id) =>
  api.get(`/users/${id}`).then((r) => r.data);

export const createUser = (data) =>
  api.post('/users', data).then((r) => r.data);

export const updateUser = (id, data) =>
  api.put(`/users/${id}`, data).then((r) => r.data);

export const deleteUser = (id) =>
  api.delete(`/users/${id}`).then((r) => r.data);

export default api;
