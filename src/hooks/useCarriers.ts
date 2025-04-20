import { useContext } from 'react';
import { CarrierContext } from '../contexts/CarrierContext';

export const useCarriers = () => {
  const context = useContext(CarrierContext);
  
  if (context === undefined) {
    throw new Error('useCarriers debe ser utilizado dentro de un CarrierProvider');
  }
  
  return context;
};