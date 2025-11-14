import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { taskService } from '../../services/taskService';
import { Plus, FileText, FolderOpen, MessageSquare } from 'lucide-react';

const TaskForm = ({ onTaskCreated }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    traerCategorias();
  }, []);

  const traerCategorias = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success) {
        setCategorias(response.data || []);
      } else {
        setError('No se pudieron cargar las categorías');
      }
    } catch (error) {
      console.log('Error:', error);
      setError('Error al cargar categorías');
    }
  };

  const enviarFormulario = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    const nuevaTarea = {
      title: titulo,
      description: descripcion,
      category_id: categoriaId
    };
    
    try {
      const response = await taskService.createTask(nuevaTarea);
      
      if (response.success) {
        onTaskCreated(response.data);
        // limpiar form
        setTitulo('');
        setDescripcion('');
        setCategoriaId('');
      } else {
        setError(response.message || 'Error al crear tarea');
      }
    } catch (error) {
      console.log('Error creando tarea:', error);
      setError('Algo salió mal');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="card bg-base-200 mb-4">
      <div className="card-body p-4">
        <h3 className="font-bold mb-4">
          <Plus className="inline h-5 w-5 mr-2" />
          Agregar Tarea
        </h3>
        
        <form onSubmit={enviarFormulario}>
          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">
                <FileText className="inline h-4 w-4 mr-2" />
                Título
              </span>
            </label>
            <input 
              type="text"
              placeholder="¿Qué hay que hacer?"
              className="input input-bordered"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              required
            />
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">
                <FolderOpen className="inline h-4 w-4 mr-2" />
                Categoría
              </span>
            </label>
            <select 
              className="select select-bordered"
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              required
            >
              <option value="">Elegir categoría</option>
              {categorias.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          
          <div className="form-control mb-4">
            <label className="label">
              <span className="label-text">
                <MessageSquare className="inline h-4 w-4 mr-2" />
                Descripción (opcional)
              </span>
            </label>
            <textarea 
              placeholder="Más detalles..."
              className="textarea textarea-bordered"
              rows="3"
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
            />
          </div>
          
          <button 
            type="submit" 
            className={`btn btn-primary ${cargando ? 'loading' : ''}`}
            disabled={cargando}
          >
            {cargando ? 'Creando...' : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Crear Tarea
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskForm;
