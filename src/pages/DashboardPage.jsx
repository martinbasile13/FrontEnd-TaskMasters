import Navbar from '../components/layout/Navbar';
import TasksList from '../components/tasks/TasksList';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import { useState, useEffect } from 'react';

const DashboardPage = () => {
  const [usuario, setUsuario] = useState(null);

  useEffect(() => {
    const datosUsuario = localStorage.getItem('user');
    if (datosUsuario) {
      setUsuario(JSON.parse(datosUsuario));
    }
  }, []);

  return (
    <div className="min-h-screen bg-base-100">
      <Navbar user={usuario} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Hola {usuario?.name || 'Usuario'}! 🍅
          </h1>
          <p className="text-base-content/70 mt-2">
            Organiza tus tareas y usa el pomodoro
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-1">
            <PomodoroTimer />
          </div>
          
          <div className="xl:col-span-2">
            <TasksList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
