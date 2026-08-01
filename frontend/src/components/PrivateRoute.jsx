import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-ink">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gold border-t-transparent" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  return children;
};

export default PrivateRoute;
