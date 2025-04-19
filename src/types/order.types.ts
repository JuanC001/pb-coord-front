import { OrderStatus } from "../constants/appConstants";

export interface Order {
    id?: string;
    userId?: string;
    origin: string;
    destination: OrderDestination;
    orderStatus?: OrderStatus;
    trackingNumber?: string;
    dimensions: OrderDimensions;
    createdAt?: Date;
    updatedAt?: Date;
}
export interface OrderDestination {
    city: string;
    country: string;
    address: string;
    postalCode: string;
}
export interface OrderDimensions {
    length: number;
    width: number;
    height: number;
    weight: number;

}

export interface OrderResponse {
    ok: boolean;
    order?: Order;
    orders?: Order[];
    message?: string;
}