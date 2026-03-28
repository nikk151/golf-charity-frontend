// src/components/layout/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requireSubscription = false }) => {
  const { token, isHydrating, subscriptionStatus } = useAuth();
  const location = useLocation();

  // Still validating the stored token — show a minimal loader
  if (isHydrating) {
    return (
      <div className="min-h-screen bg-brand-dark flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
      </div>
    );
  }

  // Not logged in at all
  if (!token) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  // Route requires an active subscription but user doesn't have one
  if (requireSubscription && subscriptionStatus !== 'active') {
    return <Navigate to="/subscribe" replace />;
  }

  return children;
};

export default ProtectedRoute;
