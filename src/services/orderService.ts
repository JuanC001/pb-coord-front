import coordApi from "../utils/apiUtils";
import { OrderStatus } from "../constants/appConstants";
import { Order, OrderResponse } from "../types/order.types";

export const orderService = {

    getAllOrders: async (): Promise<OrderResponse> => {
        try {
            const { data } = await coordApi.get('/orders');
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al obtener las órdenes'
            };
        }
    },

    getOrderById: async (id: string): Promise<OrderResponse> => {
        try {
            const { data } = await coordApi.get(`/orders/${id}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al obtener la orden'
            };
        }
    },

    getOrdersByUserId: async (userId: string): Promise<Order[]> => {
        try {
            const { data } = await coordApi.get(`/orders/user/${userId}`);
            return data;
        } catch (error: any) {
            return []
        }
    },

    createOrder: async (order: Order): Promise<Order | null> => {
        try {
            const { data } = await coordApi.post('/orders', order);
            return data;
        } catch (error: any) {
            return null;
        }
    },

    updateOrder: async (id: string, order: Partial<Order>): Promise<OrderResponse> => {
        try {
            const { data } = await coordApi.put(`/orders/${id}`, order);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al actualizar la orden'
            };
        }
    },

    updateOrderStatus: async (id: string, orderStatus: OrderStatus): Promise<OrderResponse> => {
        try {
            const { data } = await coordApi.patch(`/orders/status/${id}`, { orderStatus });
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al actualizar el estado de la orden'
            };
        }
    },

    deleteOrder: async (id: string): Promise<OrderResponse> => {
        try {
            const { data } = await coordApi.delete(`/orders/${id}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al eliminar la orden'
            };
        }
    }
};