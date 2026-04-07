import axios from 'axios';

// 1. Configurações Base
const blogURL = import.meta.env.VITE_API_URL || 'http://localhost:3000/';
const socialURL = import.meta.env.VITE_SOCIAL_API_URL || 'http://localhost:3001/';

// 2. Criação das Instâncias
export const blogApi = axios.create({
  baseURL: blogURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

export const socialApi = axios.create({
  baseURL: socialURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// 3. Função para aplicar Interceptors (DRY - Don't Repeat Yourself)
const setupInterceptors = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
      }
      return Promise.reject(error);
    }
  );
};

// 4. Aplicar em ambas as instâncias
setupInterceptors(blogApi);
setupInterceptors(socialApi);

// Se você ainda quiser um export default para o blogApi por compatibilidade:
export default blogApi;