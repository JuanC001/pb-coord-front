import { useContext } from 'react';
import { OrderContext } from '../contexts/OrderContext';

export const useOrders = () => {
  const context = useContext(OrderContext);
  
  if (context === undefined) {
    throw new Error('useOrders debe ser utilizado dentro de un OrderProvider');
  }
  
  return context;
};