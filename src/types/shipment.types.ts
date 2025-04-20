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
    id: string;
    orderId: string;
    carrierId: string;
    status: ShipmentStatus;
    trackingNumber: string;
    createdAt: Date;
    updatedAt: Date;
    destination: {
        city: string;
        country: string;
        address: string;
        postalCode: string;
    };
    dimensions: {
        length: string;
        width: string;
        height: string;
        weight: string;
    };
    origin: string;
    routeName: string;
}