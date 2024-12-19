import axios from 'axios'
import { isAuthError } from '../utils/apiErrorHandler'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isAuthError(error)) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export const auth = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
}

export const posts = {
  getAll: () => api.get('/posts'),
  getOne: (id) => api.get(`/posts/${id}`),
  create: (postData) => api.post('/posts', postData),
  update: (id, postData) => api.put(`/posts/${id}`, postData),
  delete: (id) => api.delete(`/posts/${id}`),
  like: (id) => api.put(`/posts/like/${id}`)
}

export const comments = {
  getForPost: (postId) => api.get(`/comments/post/${postId}`),
  create: (commentData) => api.post('/comments', commentData),
  update: (id, content) => api.put(`/comments/${id}`, { content }),
  delete: (id) => api.delete(`/comments/${id}`),
  like: (id) => api.put(`/comments/like/${id}`)
}

export const users = {
  getProfile: (id) => api.get(`/users/profile/${id}`),
  updateProfile: (userData) => api.put('/users/profile', userData),
  getUserPosts: (userId) => api.get(`/users/posts/${userId}`),
  uploadProfilePicture: (formData) => api.post('/users/profile-picture', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
}

export default api 