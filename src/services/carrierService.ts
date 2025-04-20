import coordApi from "../utils/apiUtils";
import { Carrier, CarrierResponse } from "../types/carrier.types";

export const carrierService = {
    getAllCarriers: async (): Promise<Carrier[] | null> => {
        try {
            const { data } = await coordApi.get('/carriers');
            return data;
        } catch (error: any) {
            return null
        }
    },

    getCarrierById: async (id: string): Promise<CarrierResponse> => {
        try {
            const { data } = await coordApi.get(`/carriers/${id}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al obtener el transportista'
            };
        }
    },

    createCarrier: async (carrier: Carrier): Promise<CarrierResponse> => {
        try {
            const { data } = await coordApi.post('/carriers', carrier);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al crear el transportista'
            };
        }
    },

    updateCarrier: async (id: string, carrier: Partial<Carrier>): Promise<CarrierResponse> => {
        try {
            const { data } = await coordApi.put(`/carriers/${id}`, carrier);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al actualizar el transportista'
            };
        }
    },

    deleteCarrier: async (id: string): Promise<CarrierResponse> => {
        try {
            const { data } = await coordApi.delete(`/carriers/${id}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al eliminar el transportista'
            };
        }
    }
};