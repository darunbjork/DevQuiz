import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
  adminOnly?: boolean; // Add adminOnly prop
}

function ProtectedRoute({ children, adminOnly }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuth(); // Destructure user from useAuth
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If adminOnly is true, check if the user has the admin role
  if (adminOnly && (!user || user.role !== 'admin')) {
    return <Navigate to="/" />; // Redirect to home or an unauthorized page
  }
  
  return <>{children}</>;
}

export default ProtectedRoute;