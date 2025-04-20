import { ShipmentStatus } from "../constants/appConstants";

export interface Shipment {
    id?: string;
    orderId: string;
    carrierId: string;
    status?: ShipmentStatus;
    trackingNumber?: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface ShipmentResponse {
    ok: boolean;
    shipment?: Shipment;
    shipments?: Shipment[];
    message?: string;
}