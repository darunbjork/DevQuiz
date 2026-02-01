// Third: useAuth.ts Role: Acts as a safety gate. If a developer tries to use useAuth() outside the Provider tree, it throws an error immediately instead of returning undefined.
import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContextProvider';

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};