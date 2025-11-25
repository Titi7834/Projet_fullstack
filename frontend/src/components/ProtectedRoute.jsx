import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Chargement...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (requiredRole && requiredRole !== 'LECTEUR') {
    if (user.role !== requiredRole && user.role !== 'ADMIN') {
      return <Navigate to="/" />;
    }
  }

  return children;
};

export default ProtectedRoute;
