import coordApi from "../utils/apiUtils";
import { ShipmentStatus } from "../constants/appConstants";
import { Shipment, ShipmentResponse } from "../types/shipment.types";

export const shipmentService = {
    getAllShipments: async (): Promise<ShipmentResponse | null> => {
        try {
            const { data } = await coordApi.get('/shipments');
            return data;
        } catch (error: any) {
            return null
        }
    },

    getShipmentById: async (id: string): Promise<ShipmentResponse | null> => {
        try {
            const { data } = await coordApi.get(`/shipments/${id}`);
            return data;
        } catch (error: any) {
            return null
        }
    },

    getShipmentsByTrackingNumber: async (trackingNumber: string): Promise<ShipmentResponse | null> => {
        try {
            const { data } = await coordApi.get(`/shipments/tracking/${trackingNumber}`);
            return data;
        } catch (error: any) {
            return null
        }
    },

    getShipmentsByOrderId: async (orderId: string): Promise<ShipmentResponse | null> => {
        try {
            const { data } = await coordApi.get(`/shipments/order/${orderId}`);
            return data;
        } catch (error: any) {
            return null
        }
    },

    createShipment: async (shipment: Shipment): Promise<Shipment | null> => {
        try {
            const { data } = await coordApi.post('/shipments', shipment);
            return data;
        } catch (error: any) {
            return null
        }
    },

    updateShipment: async (id: string, shipment: Partial<Shipment>): Promise<ShipmentResponse | null> => {
        try {
            const { data } = await coordApi.put(`/shipments/${id}`, shipment);
            return data;
        } catch (error: any) {
            return null
        }
    },

    updateShipmentStatus: async (id: string, status: ShipmentStatus): Promise<ShipmentResponse | null> => {
        try {
            const { data } = await coordApi.patch(`/shipments/status/${id}`, { status });
            return data;
        } catch (error: any) {
            return null
        }
    },

    deleteShipment: async (id: string): Promise<ShipmentResponse | null> => {
        try {
            const { data } = await coordApi.delete(`/shipments/${id}`);
            return data;
        } catch (error: any) {
            return null
        }
    }
};