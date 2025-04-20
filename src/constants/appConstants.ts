export const SHIPMENT_STATUS = {
  PENDING: 'Pendiente',
  IN_TRANSIT: 'En tránsito',
  DELIVERED: 'Entregado',
  RETURNED: 'Devuelto',
  CANCELLED: 'Cancelado',
};
export const DocumentTypes = [
  { value: 'CC', label: 'Cédula de Ciudadanía' },
  { value: 'CE', label: 'Cédula de Extranjería' },
  { value: 'PA', label: 'Pasaporte' },
  { value: 'NIT', label: 'NIT' }
];

export enum OrderStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
}

export enum ShipmentStatus {
  PENDING = 'pending',
  IN_TRANSIT = 'in_transit',
  DELIVERED = 'delivered',
}

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  COURRIER = 'courrier',
}