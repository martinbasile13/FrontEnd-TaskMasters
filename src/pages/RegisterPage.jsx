// Página de Registro
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { Target, User, Mail, Lock, UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [datosForm, setDatosForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  const manejarRegistro = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    setExito('');
    
    try {
      const respuesta = await authService.register(datosForm);
      
      if (respuesta.success) {
        setExito('Usuario creado! Ya podes loguearte');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        setError(respuesta.message || 'Error al crear usuario');
      }
    } catch (error) {
      console.log('Error:', error);
      if (error.response) {
        setError(error.response.data?.message || 'Error en el servidor');
      } else {
        setError('No se pudo conectar al servidor');
      }
    } finally {
      setCargando(false);
    }
  };

  const cambiarDatos = (e) => {
    setDatosForm({
      ...datosForm,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-base-100 flex items-center justify-center p-4">
      <div className="card w-full max-w-md bg-base-100 shadow-xl">
        <div className="card-body p-6">
          <h2 className="card-title justify-center text-2xl mb-6">
            <Target className="h-6 w-6 text-primary mr-2" />
            Crear Cuenta
          </h2>
          
          <form onSubmit={manejarRegistro}>
            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}
            {exito && (
              <div className="alert alert-success mb-4">
                <span>{exito}</span>
              </div>
            )}
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">
                  <User className="inline h-4 w-4 mr-2" />
                  Nombre
                </span>
              </label>
              <input 
                type="text"
                name="name"
                placeholder="Tu nombre"
                className="input input-bordered"
                value={datosForm.name}
                onChange={cambiarDatos}
                required
              />
            </div>
            
            <div className="form-control mb-4">
              <label className="label">
                <span className="label-text">
                  <Mail className="inline h-4 w-4 mr-2" />
                  Email
                </span>
              </label>
              <input 
                type="email"
                name="email"
                placeholder="tu@email.com"
                className="input input-bordered"
                value={datosForm.email}
                onChange={cambiarDatos}
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
                name="password"
                placeholder="••••••"
                className="input input-bordered"
                value={datosForm.password}
                onChange={cambiarDatos}
                required
              />
            </div>
            
            <button 
              type="submit" 
              className={`btn btn-primary w-full ${cargando ? 'loading' : ''}`}
              disabled={cargando}
            >
              {cargando ? 'Creando cuenta...' : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Cuenta
                </>
              )}
            </button>
          </form>
          
          <div className="divider">O</div>
          <button 
            className="btn btn-outline w-full"
            onClick={() => navigate('/login')}
          >
            Ya tengo cuenta
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
