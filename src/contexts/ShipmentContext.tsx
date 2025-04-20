import { createContext, ReactNode, useState } from 'react';
import { shipmentService } from '../services/shipmentService';
import { Shipment } from '../types/shipment.types';
import { ShipmentStatus } from '../constants/appConstants';

interface ShipmentContextProps {
    shipments: Shipment[];
    currentShipment: Shipment | null;
    isLoading: boolean;
    error: string | null;
    getAllShipments: () => Promise<void>;
    getShipmentById: (id: string) => Promise<void>;
    getShipmentsByTrackingNumber: (trackingNumber: string) => Promise<void>;
    getShipmentsByOrderId: (orderId: string) => Promise<void>;
    createShipment: (shipment: {
        orderId: string;
        carrierId: string;
    }) => Promise<boolean>;
    updateShipment: (id: string, shipment: Partial<Shipment>) => Promise<boolean>;
    updateShipmentStatus: (id: string, status: ShipmentStatus) => Promise<boolean>;
    deleteShipment: (id: string) => Promise<boolean>;
    clearCurrentShipment: () => void;
}

export const ShipmentContext = createContext<ShipmentContextProps>({} as ShipmentContextProps);

interface ShipmentProviderProps {
    children: ReactNode;
}

export const ShipmentProvider = ({ children }: ShipmentProviderProps) => {
    const [shipments, setShipments] = useState<Shipment[]>([]);
    const [currentShipment, setCurrentShipment] = useState<Shipment | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAllShipments = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await shipmentService.getAllShipments();
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const getShipmentById = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await shipmentService.getShipmentById(id);

        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const getShipmentsByTrackingNumber = async (trackingNumber: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await shipmentService.getShipmentsByTrackingNumber(trackingNumber);
            console.log('response', response);
            if (response) {
                setCurrentShipment(response);
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const getShipmentsByOrderId = async (orderId: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await shipmentService.getShipmentsByOrderId(orderId);
            if (response) {
                setShipments([response]);
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const createShipment = async (shipment: { orderId: string; carrierId: string; }): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await shipmentService.createShipment(shipment);
            if (response) {
                setShipments(prevShipments => [...prevShipments, response]);
                setCurrentShipment(response);
                return true;
            }

            return false;
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateShipment = async (id: string, shipmentData: Partial<Shipment>): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await shipmentService.updateShipment(id, shipmentData);
            return false
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateShipmentStatus = async (id: string, status: ShipmentStatus): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await shipmentService.updateShipmentStatus(id, status);
            return false
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteShipment = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await shipmentService.deleteShipment(id);
            return false

        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const clearCurrentShipment = () => {
        setCurrentShipment(null);
    };

    const value = {
        shipments,
        currentShipment,
        isLoading,
        error,
        getAllShipments,
        getShipmentById,
        getShipmentsByTrackingNumber,
        getShipmentsByOrderId,
        createShipment,
        updateShipment,
        updateShipmentStatus,
        deleteShipment,
        clearCurrentShipment
    };

    return (
        <ShipmentContext.Provider value={value}>
            {children}
        </ShipmentContext.Provider>
    );
};