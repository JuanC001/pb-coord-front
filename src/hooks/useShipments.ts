import { useContext } from 'react';
import { ShipmentContext } from '../contexts/ShipmentContext';

export const useShipments = () => {
  const context = useContext(ShipmentContext);
  
  if (context === undefined) {
    throw new Error('useShipments debe ser utilizado dentro de un ShipmentProvider');
  }
  
  return context;
};