import { useState, useEffect } from 'react';
import { categoryService } from '../../services/categoryService';
import { Edit2, FileText, MessageSquare, FolderOpen, Save } from 'lucide-react';

const EditTaskModal = ({ task, isOpen, onClose, onTaskUpdated }) => {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [categorias, setCategorias] = useState([]);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task && isOpen) {
      setTitulo(task.title || '');
      setDescripcion(task.description || '');
      setCategoriaId(task.category_id || '');
      cargarCategorias();
    }
  }, [task, isOpen]);

  const cargarCategorias = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success && Array.isArray(response.data)) {
        setCategorias(response.data);
      }
    } catch (error) {
      console.log('Error categorías:', error);
    }
  };

  const guardarCambios = async (e) => {
    e.preventDefault();
    if (!titulo.trim()) {
      setError('Ponele un título che');
      return;
    }

    setGuardando(true);
    setError('');

    try {
      const datosActualizados = {
        title: titulo,
        description: descripcion,
        category_id: parseInt(categoriaId)
      };

      await onTaskUpdated(task.id, datosActualizados);
      onClose();
    } catch (error) {
      console.log('Error actualizando:', error);
      setError('No se pudo actualizar');
    } finally {
      setGuardando(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-11/12 max-w-md p-6">
        <h3 className="font-bold text-lg mb-4">
          <Edit2 className="inline h-5 w-5 mr-2" />
          Editar Tarea
        </h3>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={guardarCambios} className="space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text">
                <FileText className="inline h-4 w-4 mr-2" />
                Título
              </span>
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="¿Qué hay que hacer?"
              className="input input-bordered"
              required
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                <MessageSquare className="inline h-4 w-4 mr-2" />
                Descripción
              </span>
            </label>
            <textarea
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              placeholder="Más detalles..."
              className="textarea textarea-bordered h-20"
            />
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text">
                <FolderOpen className="inline h-4 w-4 mr-2" />
                Categoría
              </span>
            </label>
            <select
              value={categoriaId}
              onChange={(e) => setCategoriaId(e.target.value)}
              className="select select-bordered"
            >
              <option value="">Elegir categoría</option>
              {categorias.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              className="btn btn-ghost"
              onClick={onClose}
              disabled={guardando}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`btn btn-primary ${guardando ? 'loading' : ''}`}
              disabled={guardando || !titulo.trim()}
            >
              {guardando ? 'Guardando...' : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Guardar
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
