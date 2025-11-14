import axios from 'axios';

// URL del backend desde variable de entorno
const URL_BACKEND = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: URL_BACKEND,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Agregar token a las peticiones automáticamente 
api.interceptors.request.use(
  (config) => {
    // No mandar token en registro y login
    const rutasAuth = ['/api/auth/register', '/api/auth/login'];
    const esRutaAuth = rutasAuth.some(ruta => config.url.includes(ruta));
    
    if (!esRutaAuth) {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Manejar errores de autenticacion
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si el token no sirve más, limpiar y mandar al login
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log('Token vencido, limpiando sesión...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
