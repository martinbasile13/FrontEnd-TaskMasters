import { Trash2, Edit3 } from 'lucide-react';

const TaskItem = ({ task, onToggle, onDelete, onEdit }) => {
  const completada = task.is_completed === 1 || task.completed === true;
  
  return (
    <div className={`card border-2 ${completada ? 'border-green-200 bg-green-50' : 'border-gray-200'}`}>
      <div className="card-body p-4">
        <div className="flex items-start gap-3">
          <input 
            type="checkbox"
            className="checkbox checkbox-primary mt-1"
            checked={completada}
            onChange={() => onToggle(task.id)}
          />
          
          <div className="flex-1">
            <h3 className={`font-medium ${
              completada ? 'line-through text-gray-500' : ''
            }`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-sm text-gray-600 mt-1">
                {task.description}
              </p>
            )}
            
            {task.category && (
              <div className="mt-2">
                <span 
                  className="badge text-white text-xs"
                  style={{ backgroundColor: task.category.color }}
                >
                  🏷️ {task.category.name}
                </span>
              </div>
            )}
          </div>
          
          <div className="flex gap-2">
            <button 
              className="btn btn-sm btn-primary"
              onClick={() => onEdit(task)}
            >
              <Edit3 className="h-4 w-4" />
            </button>
            <button 
              className="btn btn-sm btn-error"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskItem;
