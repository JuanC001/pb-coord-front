import coordApi from "../utils/apiUtils";
import { Route, RouteResponse } from "../types/route.types";

export const routeService = {
    getAllRoutes: async (): Promise<Route[] | null> => {
        try {
            const { data } = await coordApi.get('/routes');
            return data;
        } catch (error: any) {
            return null
        }
    },

    getRouteById: async (id: string): Promise<RouteResponse> => {
        try {
            const { data } = await coordApi.get(`/routes/${id}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al obtener la ruta'
            };
        }
    },

    createRoute: async (route: Route): Promise<RouteResponse> => {
        try {
            const { data } = await coordApi.post('/routes', route);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al crear la ruta'
            };
        }
    },

    updateRoute: async (id: string, route: Partial<Route>): Promise<RouteResponse> => {
        try {
            const { data } = await coordApi.put(`/routes/${id}`, route);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al actualizar la ruta'
            };
        }
    },

    deleteRoute: async (id: string): Promise<RouteResponse> => {
        try {
            const { data } = await coordApi.delete(`/routes/${id}`);
            return data;
        } catch (error: any) {
            return {
                ok: false,
                message: error.response?.data?.message || 'Error al eliminar la ruta'
            };
        }
    }
};