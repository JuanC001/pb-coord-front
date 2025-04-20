import coordApi from "../utils/apiUtils";
import { ShipmentStatus } from "../constants/appConstants";
import { Shipment, ShipmentResponse } from "../types/shipment.types";

export const shipmentService = {
    getAllShipments: async (): Promise<ShipmentResponse> => {
        try {
            const { data } = await coordApi.get('/shipments');
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al obtener los envíos'
            };
        }
    },

    getShipmentById: async (id: string): Promise<ShipmentResponse> => {
        try {
            const { data } = await coordApi.get(`/shipments/${id}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al obtener el envío'
            };
        }
    },

    getShipmentsByTrackingNumber: async (trackingNumber: string): Promise<ShipmentResponse> => {
        try {
            const { data } = await coordApi.get(`/shipments/tracking/${trackingNumber}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al obtener el envío por número de seguimiento'
            };
        }
    },

    getShipmentsByOrderId: async (orderId: string): Promise<ShipmentResponse> => {
        try {
            const { data } = await coordApi.get(`/shipments/order/${orderId}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al obtener los envíos por orden'
            };
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

    updateShipment: async (id: string, shipment: Partial<Shipment>): Promise<ShipmentResponse> => {
        try {
            const { data } = await coordApi.put(`/shipments/${id}`, shipment);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al actualizar el envío'
            };
        }
    },

    updateShipmentStatus: async (id: string, status: ShipmentStatus): Promise<ShipmentResponse> => {
        try {
            const { data } = await coordApi.patch(`/shipments/status/${id}`, { status });
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al actualizar el estado del envío'
            };
        }
    },

    deleteShipment: async (id: string): Promise<ShipmentResponse> => {
        try {
            const { data } = await coordApi.delete(`/shipments/${id}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al eliminar el envío'
            };
        }
    }
};