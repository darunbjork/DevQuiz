import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean; 
}

function ProtectedRoute({ children, adminOnly }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth(); 
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/" />; 
  }
  
  return <>{children}</>;
}

export default ProtectedRoute;