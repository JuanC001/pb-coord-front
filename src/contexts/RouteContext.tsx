import { createContext, ReactNode, useState } from 'react';
import { routeService } from '../services/routeService';
import { Route } from '../types/route.types';

interface RouteContextProps {
    routes: Route[];
    currentRoute: Route | null;
    isLoading: boolean;
    error: string | null;
    getAllRoutes: () => Promise<void>;
    getRouteById: (id: string) => Promise<void>;
    createRoute: (route: Route) => Promise<boolean>;
    updateRoute: (id: string, route: Partial<Route>) => Promise<boolean>;
    deleteRoute: (id: string) => Promise<boolean>;
    clearCurrentRoute: () => void;
}

export const RouteContext = createContext<RouteContextProps>({} as RouteContextProps);

interface RouteProviderProps {
    children: ReactNode;
}

export const RouteProvider = ({ children }: RouteProviderProps) => {
    const [routes, setRoutes] = useState<Route[]>([]);
    const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAllRoutes = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await routeService.getAllRoutes();
            if (response) {
                setRoutes(response);
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const getRouteById = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await routeService.getRouteById(id);
            if (response.ok && response.route) {
                setCurrentRoute(response.route);
            } else {
                setError(response.message || 'Error al obtener la ruta');
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const createRoute = async (route: Route): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await routeService.createRoute(route);
            if (response.ok && response.route) {
                setRoutes(prevRoutes => [...prevRoutes, response.route!]);
                setCurrentRoute(response.route);
                return true;
            } else {
                setError(response.message || 'Error al crear la ruta');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateRoute = async (id: string, routeData: Partial<Route>): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await routeService.updateRoute(id, routeData);
            if (response.ok && response.route) {
                setRoutes(prevRoutes =>
                    prevRoutes.map(route => route.id === id ? response.route! : route)
                );
                if (currentRoute?.id === id) {
                    setCurrentRoute(response.route);
                }
                return true;
            } else {
                setError(response.message || 'Error al actualizar la ruta');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteRoute = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await routeService.deleteRoute(id);
            if (response.ok) {
                setRoutes(prevRoutes =>
                    prevRoutes.filter(route => route.id !== id)
                );
                if (currentRoute?.id === id) {
                    setCurrentRoute(null);
                }
                return true;
            } else {
                setError(response.message || 'Error al eliminar la ruta');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const clearCurrentRoute = () => {
        setCurrentRoute(null);
    };

    const value = {
        routes,
        currentRoute,
        isLoading,
        error,
        getAllRoutes,
        getRouteById,
        createRoute,
        updateRoute,
        deleteRoute,
        clearCurrentRoute
    };

    return (
        <RouteContext.Provider value={value}>
            {children}
        </RouteContext.Provider>
    );
};