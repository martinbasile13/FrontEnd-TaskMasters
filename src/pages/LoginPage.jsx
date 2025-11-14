import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';
import { Target, Mail, Lock, LogIn } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [contraseña, setContraseña] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // Limpiar datos anteriores
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }, []);

  const manejarLogin = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    
    try {
      console.log('Intentando login con:', email);
      const response = await authService.login({ email, password: contraseña });
      
      if (response.success) {
        login(response.data.user, response.data.token);
        navigate('/dashboard');
      } else {
        setError(response.message || 'No se pudo iniciar sesión');
      }
    } catch (error) {
      console.log('Error en login:', error);
      
      if (error.response) {
        setError(error.response.data?.message || 'Error del servidor');
      } else if (error.request) {
        setError('No se puede conectar al servidor. ¿Está funcionando el backend?');
      } else {
        setError('Algo salió mal al iniciar sesión');
      }
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body p-6">
          <h2 className="card-title justify-center text-2xl mb-6">
            <Target className="h-6 w-6 text-primary mr-2" />
            Iniciar Sesión
          </h2>
          
          <form onSubmit={manejarLogin}>
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email
                </span>
              </label>
              <input 
                type="email"
                placeholder="tu@email.com"
                className="input input-bordered"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="form-control mb-6">
              <label className="label">
                <span className="label-text">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Contraseña
                </span>
              </label>
              <input 
                type="password"
                placeholder="••••••"
                className="input input-bordered"
                value={contraseña}
                onChange={(e) => setContraseña(e.target.value)}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary w-full ${cargando ? 'loading' : ''}`}
              disabled={cargando}
            >
              {cargando ? 'Entrando...' : (
                <>
                  <LogIn className="h-4 w-4 mr-2" />
                  Entrar
                </>
              )}
            </button>
          </form>
          
          <div className="divider">O</div>
          <button 
            className="btn btn-outline w-full"
            onClick={() => navigate('/register')}
          >
            Crear cuenta nueva
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
