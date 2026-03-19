import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Loading from './Loading';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading, isLoggingOut } = useAuth();

  if (loading) {
    return <Loading />;
  }

  // Se está fazendo logout, permite a navegação sem redirecionar
  if (isLoggingOut) {
    return null;
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
