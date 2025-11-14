import api from './api';

export const pomodoroService = {
  // Guardar pomodoro completado
  createPomodoro: async (datosPomodoro) => {
    const response = await api.post('/api/pomodoros', datosPomodoro);
    return response.data;
  },

  // Ver los pomodoros de hoy
  getTodayPomodoros: async () => {
    const response = await api.get('/api/pomodoros/today');
    return response.data;
  },

  // Estadísticas de la semana
  getWeekStats: async () => {
    const response = await api.get('/api/pomodoros/week');
    return response.data;
  },

  // Estadísticas generales
  getStats: async () => {
    const response = await api.get('/api/pomodoros/stats');
    return response.data;
  },

  // Cambiar objetivo diario
  updateGoal: async (objetivo) => {
    const response = await api.put('/api/pomodoros/goal', { goal: objetivo });
    return response.data;
  },

  // Ver pomodoros entre fechas
  getPomodorosByDateRange: async (fechaInicio, fechaFin) => {
    const response = await api.get(`/api/pomodoros/range?startDate=${fechaInicio}&endDate=${fechaFin}`);
    return response.data;
  },

  // Borrar pomodoro
  deletePomodoro: async (id) => {
    const response = await api.delete(`/api/pomodoros/${id}`);
    return response.data;
  }
};

export default pomodoroService;
