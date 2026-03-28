// src/components/auth/AdminRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Loader2 } from 'lucide-react';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, isHydrating } = useAuth();
  
  console.log('🛡️ AdminRoute Status:', { 
    isHydrating, 
    isAuthenticated, 
    is_admin: user?.is_admin,
    userEmail: user?.email 
  });

  if (isHydrating) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  // Check if authenticated AND is admin
  if (!isAuthenticated || !user?.is_admin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
