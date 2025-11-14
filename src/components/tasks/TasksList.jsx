import { useState, useEffect } from 'react';
import TaskForm from './TaskForm';
import TaskItem from './TaskItem';
import EditTaskModal from './EditTaskModal';
import { taskService } from '../../services/taskService';
import { categoryService } from '../../services/categoryService';
import { ListTodo, Plus } from 'lucide-react';

const TasksList = () => {
  const [tareas, setTareas] = useState([]);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [tareaEditando, setTareaEditando] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  useEffect(() => {
    cargarTareas();
    inicializarCategorias();
  }, []);

  const inicializarCategorias = async () => {
    try {
      const result = await categoryService.initializeCategories();
      console.log('Categorías inicializadas:', result.message);
    } catch (error) {
      console.log('Error con categorías:', error);
    }
  };

  const cargarTareas = async () => {
    try {
      setCargando(true);
      const response = await taskService.getTasks();
      
      if (response.success) {
        let tareasArray = [];
        if (Array.isArray(response.data)) {
          tareasArray = response.data;
        } else if (Array.isArray(response.data.tasks)) {
          tareasArray = response.data.tasks;
        }
        
        setTareas(tareasArray);
      } else {
        setTareas([]);
        setError('Error cargando tareas');
      }
    } catch (error) {
      console.log('Error:', error);
      setTareas([]);
      setError('No se pudieron cargar las tareas');
    } finally {
      setCargando(false);
    }
  };

  const manejarTareaNueva = async (nuevaTarea) => {
    await cargarTareas();
    setMostrarForm(false);
  };

  const cambiarEstadoTarea = async (tareaId) => {
    try {
      const response = await taskService.toggleTask(tareaId);
      if (response.success) {
        await cargarTareas();
      }
    } catch (error) {
      setError('Error al cambiar la tarea');
    }
  };

  const eliminarTarea = async (tareaId) => {
    if (window.confirm('¿Seguro que querés eliminar esta tarea?')) {
      try {
        const response = await taskService.deleteTask(tareaId);
        if (response.success) {
          await cargarTareas();
        }
      } catch (error) {
        setError('No se pudo eliminar');
      }
    }
  };

  const editarTarea = (tarea) => {
    setTareaEditando(tarea);
    setMostrarModal(true);
  };

  const actualizarTarea = async (tareaId, datos) => {
    try {
      const response = await taskService.updateTask(tareaId, datos);
      if (response.success) {
        await cargarTareas();
        setMostrarModal(false);
        setTareaEditando(null);
      }
    } catch (error) {
      setError('Error al actualizar');
    }
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setTareaEditando(null);
  };

  if (cargando) {
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p>Cargando tareas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title">
            <ListTodo className="h-5 w-5" />
            Mis Tareas
          </h2>
          <button 
            className="btn btn-primary"
            onClick={() => setMostrarForm(!mostrarForm)}
          >
            {mostrarForm ? 'Cancelar' : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Nueva Tarea
              </>
            )}
          </button>
        </div>

        {mostrarForm && (
          <TaskForm onTaskCreated={manejarTareaNueva} />
        )}

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
            <button 
              className="btn btn-sm"
              onClick={() => setError('')}
            >
              ✕
            </button>
          </div>
        )}

        <div className="space-y-2">
          {!Array.isArray(tareas) || tareas.length === 0 ? (
            <div className="text-center py-8">
              No hay tareas todavía. ¡Creá tu primera tarea! 🎯
            </div>
          ) : (
            tareas.map(tarea => (
              <TaskItem 
                key={tarea.id}
                task={tarea}
                onToggle={cambiarEstadoTarea}
                onDelete={eliminarTarea}
                onEdit={editarTarea}
              />
            ))
          )}
        </div>
      </div>

      {tareaEditando && (
        <EditTaskModal
          task={tareaEditando}
          isOpen={mostrarModal}
          onClose={cerrarModal}
          onTaskUpdated={actualizarTarea}
        />
      )}
    </div>
  );
};

export default TasksList;