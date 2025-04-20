import { useContext } from 'react';
import { RouteContext } from '../contexts/RouteContext';

export const useRoutes = () => {
  const context = useContext(RouteContext);
  
  if (context === undefined) {
    throw new Error('useRoutes debe ser utilizado dentro de un RouteProvider');
  }
  
  return context;
};