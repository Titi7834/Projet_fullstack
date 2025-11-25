import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Layout.css';

const Layout = () => {
  const { user, logout, isAuteur, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="layout">
      <header className="header">
        <div className="header-content">
          <Link to="/" className="logo">NAHB</Link>
          
          <nav className="nav">
            {user ? (
              <>
                <span className="user-info">Bonjour, {user.username}</span>
                {isAuteur() && (
                  <Link to="/mes-histoires" className="nav-link">Mes Histoires</Link>
                )}
                {isAdmin() && (
                  <Link to="/admin" className="nav-link">Administration</Link>
                )}
                <button onClick={handleLogout} className="btn-logout">Se déconnecter</button>
              </>
            ) : (
              <>
                <Link to="/login" className="nav-link">Se connecter</Link>
                <Link to="/register" className="btn-primary">S'inscrire</Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className="main-content">
        <Outlet />
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>© 2025 All Rights Reserved.</p>
          <div className="footer-links">
            <a href="#">Commencer votre voyage</a>
            <a href="#">Les histoires de tous sur toutes</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
