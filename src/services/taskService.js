import api from './api';

export const taskService = {
  // Traer todas las tareas
  getTasks: async () => {
    try {
      console.log('Obteniendo tareas...');
      const response = await api.get('/api/tasks');
      return response.data;
    } catch (error) {
      console.log('Error trayendo tareas:', error);
      return {
        success: false,
        message: 'No se pudieron cargar las tareas',
        data: []
      };
    }
  },

  // Traer una tarea específica
  getTask: async (id) => {
    const response = await api.get(`/api/tasks/${id}`);
    return response.data;
  },

  // Crear tarea nueva
  createTask: async (datosTarea) => {
    try {
      console.log('Creando tarea:', datosTarea);
      const response = await api.post('/api/tasks', datosTarea);
      return response.data;
    } catch (error) {
      console.log('Error creando tarea:', error);
      return {
        success: false,
        message: 'No se pudo crear la tarea',
        data: null
      };
    }
  },

  // Actualizar tarea completa
  updateTask: async (id, datosTarea) => {
    try {
      console.log('Actualizando tarea:', id, datosTarea);
      const response = await api.put(`/api/tasks/${id}`, datosTarea);
      return response.data;
    } catch (error) {
      console.log('Error actualizando:', error);
      throw error;
    }
  },

  // Cambiar solo algunos campos
  patchTask: async (id, datosTarea) => {
    try {
      const response = await api.patch(`/api/tasks/${id}`, datosTarea);
      return response.data;
    } catch (error) {
      console.log('Error en patch:', error);
      throw error;
    }
  },

  // Marcar como hecha/no hecha
  toggleTask: async (id) => {
    const response = await api.patch(`/api/tasks/${id}/toggle`);
    return response.data;
  },

  // Borrar tarea
  deleteTask: async (id) => {
    const response = await api.delete(`/api/tasks/${id}`);
    return response.data;
  }
};

export default taskService;
