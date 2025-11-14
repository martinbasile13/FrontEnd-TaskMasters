import { LogOut, User, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="navbar bg-base-200 shadow-lg px-2 sm:px-4">
      <div className="navbar-start">
        <h1 className="text-lg sm:text-xl font-bold truncate max-w-[200px] sm:max-w-none flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          TaskMasters
        </h1>
      </div>
      
      <div className="navbar-end">
        <div className="flex items-center gap-2 sm:gap-4">
          {user && (
            <div className="badge badge-primary text-xs sm:text-sm max-w-[100px] sm:max-w-none truncate flex items-center gap-1">
              <User className="h-3 w-3" />
              {user.name}
            </div>
          )}
          <button 
            className="btn btn-outline btn-xs sm:btn-sm flex items-center gap-1"
            onClick={handleLogout}
          >
            <LogOut className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
