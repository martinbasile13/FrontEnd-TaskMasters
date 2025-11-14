import api from './api';

export const authService = {
  // Registrar usuario nuevo
  register: async (datosUsuario) => {
    console.log('Registrando usuario:', datosUsuario);
    
    try {
      const response = await api.post('/api/auth/register', datosUsuario);
      console.log('Registro exitoso:', response.data);
      return response.data;
    } catch (error) {
      console.log('Error en el registro:', error.response?.data || error);
      throw error;
    }
  },

  // Iniciar sesión
  login: async (credenciales) => {
    try {
      const response = await api.post('/api/auth/login', credenciales);
      return response.data;
    } catch (error) {
      console.log('Error en login:', error.response?.data || error);
      throw error;
    }
  },

  // Obtener datos del usuario logueado
  getProfile: async () => {
    const response = await api.get('/api/auth/profile');
    return response.data;
  },

  // Verificar email con token
  verifyEmail: async (token) => {
    const response = await api.get(`/api/auth/verify/${token}`);
    return response.data;
  },

  // Para testing - obtener todos los usuarios
  getAllUsers: async () => {
    const response = await api.get('/api/auth/users');
    return response.data;
  }
};

export default authService;
