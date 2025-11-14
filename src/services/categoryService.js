import api from './api';

// Categorías que se crean por defecto
export const CATEGORIAS_DEFAULT = [
  { name: 'Trabajo', color: '#3B82F6' },
  { name: 'Personal', color: '#10B981' },  
  { name: 'Estudio', color: '#F59E0B' },
  { name: 'Casa', color: '#EF4444' },
];

export const categoryService = {
  // Traer todas las categorías
  getCategories: async () => {
    try {
      const response = await api.get('/api/categories');
      return response.data;
    } catch (error) {
      console.log('Error trayendo categorías:', error);
      return { success: false, message: 'Error al cargar categorías', data: [] };
    }
  },

  // Traer una categoría
  getCategory: async (id) => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },

  // Crear las categorías por defecto si no existen
  initializeCategories: async () => {
    try {
      console.log('Verificando si existen categorías...');
      
      const categoriesResponse = await categoryService.getCategories();
      
      if (categoriesResponse.success && categoriesResponse.data.length > 0) {
        console.log('Ya hay categorías creadas');
        return { success: true, message: 'Las categorías ya existen' };
      }

      console.log('Creando categorías por defecto...');
      
      const categoriasCreadas = [];
      for (const categoria of CATEGORIAS_DEFAULT) {
        try {
          const response = await categoryService.createCategory(categoria);
          if (response.success) {
            categoriasCreadas.push(response.data);
          }
        } catch (error) {
          console.log(`La categoría "${categoria.name}" ya existe`);
        }
      }

      return { 
        success: true, 
        message: `Se crearon ${categoriasCreadas.length} categorías`,
        data: categoriasCreadas 
      };

    } catch (error) {
      console.log('Error inicializando categorías:', error);
      return { success: false, message: 'No se pudieron crear las categorías' };
    }
  },

  // Crear nueva categoría
  createCategory: async (datosCategoria) => {
    try {
      const response = await api.post('/api/categories', datosCategoria);
      return response.data;
    } catch (error) {
      console.log('Error creando categoría:', error);
      return { 
        success: false, 
        message: 'No se pudo crear la categoría' 
      };
    }
  },

  // Actualizar categoría
  updateCategory: async (id, datosCategoria) => {
    try {
      const response = await api.put(`/api/categories/${id}`, datosCategoria);
      return response.data;
    } catch (error) {
      console.log('Error actualizando categoría:', error);
      return { 
        success: false, 
        message: 'No se pudo actualizar' 
      };
    }
  },

  // Traer tareas de una categoría
  getCategoryTasks: async (id) => {
    const response = await api.get(`/api/categories/${id}/tasks`);
    return response.data;
  },

  // Borrar categoría
  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/api/categories/${id}`);
      return response.data;
    } catch (error) {
      console.log('Error borrando categoría:', error);
      return { 
        success: false, 
        message: 'No se pudo borrar' 
      };
    }
  }
};

export default categoryService;
