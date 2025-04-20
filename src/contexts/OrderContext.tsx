import { createContext, ReactNode, useState } from 'react';
import { orderService } from '../services/orderService';
import { OrderStatus } from '../constants/appConstants';
import { Order } from '../types/order.types';

interface OrderContextProps {
    orders: Order[];
    currentOrder: Order | null;
    isLoading: boolean;
    error: string | null;
    getAllOrders: () => Promise<void>;
    getOrderById: (id: string) => Promise<void>;
    getOrdersByUserId: (userId: string) => Promise<void>;
    createOrder: (order: Order) => Promise<boolean>;
    updateOrder: (id: string, order: Partial<Order>) => Promise<boolean>;
    updateOrderStatus: (id: string, status: OrderStatus) => Promise<boolean>;
    deleteOrder: (id: string) => Promise<boolean>;
    clearCurrentOrder: () => void;
}

export const OrderContext = createContext<OrderContextProps>({} as OrderContextProps);

interface OrderProviderProps {
    children: ReactNode;
}

export const OrderProvider = ({ children }: OrderProviderProps) => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [currentOrder, setCurrentOrder] = useState<Order | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAllOrders = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.getAllOrders();
            if (response){
                setOrders(response);
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const getOrderById = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.getOrderById(id);
            if (response.ok && response.order) {
                setCurrentOrder(response.order);
            } else {
                setError(response.message || 'Error al obtener la orden');
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const getOrdersByUserId = async (userId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.getOrdersByUserId(userId);
            if (response) {
                setOrders(response);
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const createOrder = async (order: Order): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.createOrder(order);
            if (response) {
                setOrders(prevOrders => [...prevOrders, response]);
                setCurrentOrder(response);
                return true;
            } else {
                setError(response || 'Error al crear la orden');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrder = async (id: string, orderData: Partial<Order>): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.updateOrder(id, orderData);
            if (response.ok && response.order) {
                setOrders(prevOrders =>
                    prevOrders.map(order => order.id === id ? response.order! : order)
                );
                if (currentOrder?.id === id) {
                    setCurrentOrder(response.order);
                }
                return true;
            } else {
                setError(response.message || 'Error al actualizar la orden');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateOrderStatus = async (id: string, status: OrderStatus): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.updateOrderStatus(id, status);
            if (response.ok && response.order) {
                setOrders(prevOrders =>
                    prevOrders.map(order =>
                        order.id === id ? { ...order, orderStatus: status } : order
                    )
                );
                if (currentOrder?.id === id) {
                    setCurrentOrder({ ...currentOrder, orderStatus: status });
                }
                return true;
            } else {
                setError(response.message || 'Error al actualizar el estado de la orden');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteOrder = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await orderService.deleteOrder(id);
            if (response.ok) {
                setOrders(prevOrders =>
                    prevOrders.filter(order => order.id !== id)
                );
                if (currentOrder?.id === id) {
                    setCurrentOrder(null);
                }
                return true;
            } else {
                setError(response.message || 'Error al eliminar la orden');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const clearCurrentOrder = () => {
        setCurrentOrder(null);
    };

    const value = {
        orders,
        currentOrder,
        isLoading,
        error,
        getAllOrders,
        getOrderById,
        getOrdersByUserId,
        createOrder,
        updateOrder,
        updateOrderStatus,
        deleteOrder,
        clearCurrentOrder
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};