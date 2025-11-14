import { useState, useEffect } from 'react';
import { pomodoroService } from '../../services/pomodoroService';
import { Play, Pause, RefreshCw, ListTodo, Target } from 'lucide-react';

const PomodoroTimer = () => {
  const [tiempoRestante, setTiempoRestante] = useState(25 * 60);
  const [corriendo, setCorriendo] = useState(false);
  const [pomodorosHoy, setPomodorosHoy] = useState(0);
  const [objetivo, setObjetivo] = useState(6);

  useEffect(() => {
    cargarEstadisticasHoy();
  }, []);

  useEffect(() => {
    let intervalo = null;
    if (corriendo && tiempoRestante > 0) {
      intervalo = setInterval(() => {
        setTiempoRestante(tiempoRestante - 1);
      }, 1000);
    } else if (tiempoRestante === 0) {
      pomodoroCompletado();
    }
    return () => clearInterval(intervalo);
  }, [corriendo, tiempoRestante]);

  const cargarEstadisticasHoy = async () => {
    try {
      const response = await pomodoroService.getTodayPomodoros();
      if (response.success) {
        const stats = response.data.stats;
        setPomodorosHoy(stats.completed);
        setObjetivo(stats.goal);
      }
    } catch (error) {
      console.log('Error cargando stats:', error);
    }
  };

  const pomodoroCompletado = async () => {
    try {
      setCorriendo(false);
      
      const response = await pomodoroService.createPomodoro({});
      
      if (response.success) {
        setPomodorosHoy(pomodorosHoy + 1);
        
        // notificacion
        if ('Notification' in window) {
          new Notification('🍅 ¡Pomodoro listo!', {
            body: 'Tomate un descanso de 5 minutos'
          });
        }
      }
      
      setTiempoRestante(25 * 60); 
    } catch (error) {
      console.log('Error guardando pomodoro:', error);
      // igual suma uno aunque falle
      setPomodorosHoy(pomodorosHoy + 1);
      setTiempoRestante(25 * 60);
    }
  };

  const empezarTimer = () => {
    setCorriendo(true);
    // pedir permisos para notificaciones
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  const pausarTimer = () => {
    setCorriendo(false);
  };

  const resetearTimer = () => {
    setCorriendo(false);
    setTiempoRestante(25 * 60);
  };

  const formatearTiempo = (segundos) => {
    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;
    return `${minutos.toString().padStart(2, '0')}:${segsRestantes.toString().padStart(2, '0')}`;
  };

  const progreso = ((25 * 60 - tiempoRestante) / (25 * 60)) * 100;
  const progresoDelDia = (pomodorosHoy / objetivo) * 100;

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body text-center p-6">
        <h2 className="card-title justify-center mb-4 text-xl">
          🍅 Pomodoro Timer
        </h2>
        
        <div className="mb-6">
          <div className="text-5xl font-mono font-bold text-primary mb-4">
            {formatearTiempo(tiempoRestante)}
          </div>
          
          {/* barra de progreso */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div 
              className="bg-primary h-3 rounded-full"
              style={{ width: `${progreso}%` }}
            ></div>
          </div>
        </div>

        {/* botones */}
        <div className="flex justify-center gap-3 mb-6">
          {!corriendo ? (
            <button 
              className="btn btn-primary"
              onClick={empezarTimer}
            >
              <Play className="h-4 w-4 mr-2" />
              Empezar
            </button>
          ) : (
            <button 
              className="btn btn-warning"
              onClick={pausarTimer}
            >
              <Pause className="h-4 w-4 mr-2" />
              Pausar
            </button>
          )}
          <button 
            className="btn btn-outline"
            onClick={resetearTimer}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Reset
          </button>
        </div>

        <div className="divider">
          <Target className="h-4 w-4 inline mr-2" />
          Progreso de hoy
        </div>
        
        <div className="stats shadow w-full">
          <div className="stat">
            <div className="stat-title">Pomodoros</div>
            <div className="stat-value text-primary">
              {pomodorosHoy}/{objetivo}
            </div>
            <div className="stat-desc">
              Faltan {objetivo - pomodorosHoy}
            </div>
          </div>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3 mt-4">
          <div 
            className="bg-green-500 h-3 rounded-full"
            style={{ width: `${Math.min(progresoDelDia, 100)}%` }}
          ></div>
        </div>
        <div className="text-sm text-gray-600 mt-2">
          {Math.round(progresoDelDia)}% del objetivo
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
