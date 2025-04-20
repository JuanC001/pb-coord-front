import { createContext, ReactNode, useState } from 'react';
import { carrierService } from '../services/carrierService';
import { Carrier } from '../types/carrier.types';

interface CarrierContextProps {
    carriers: Carrier[];
    currentCarrier: Carrier | null;
    isLoading: boolean;
    error: string | null;
    getAllCarriers: () => Promise<void>;
    getCarrierById: (id: string) => Promise<void>;
    createCarrier: (carrier: Carrier) => Promise<boolean>;
    updateCarrier: (id: string, carrier: Partial<Carrier>) => Promise<boolean>;
    deleteCarrier: (id: string) => Promise<boolean>;
    clearCurrentCarrier: () => void;
}

export const CarrierContext = createContext<CarrierContextProps>({} as CarrierContextProps);

interface CarrierProviderProps {
    children: ReactNode;
}

export const CarrierProvider = ({ children }: CarrierProviderProps) => {
    const [carriers, setCarriers] = useState<Carrier[]>([]);
    const [currentCarrier, setCurrentCarrier] = useState<Carrier | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const getAllCarriers = async () => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await carrierService.getAllCarriers();
            if (response) {
                setCarriers(response);
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const getCarrierById = async (id: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await carrierService.getCarrierById(id);
            if (response.ok && response.carrier) {
                setCurrentCarrier(response.carrier);
            } else {
                setError(response.message || 'Error al obtener el transportista');
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
        } finally {
            setIsLoading(false);
        }
    };

    const createCarrier = async (carrier: Carrier): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await carrierService.createCarrier(carrier);
            if (response.ok && response.carrier) {
                setCarriers(prevCarriers => [...prevCarriers, response.carrier!]);
                setCurrentCarrier(response.carrier);
                return true;
            } else {
                setError(response.message || 'Error al crear el transportista');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const updateCarrier = async (id: string, carrierData: Partial<Carrier>): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await carrierService.updateCarrier(id, carrierData);
            if (response.ok && response.carrier) {
                setCarriers(prevCarriers =>
                    prevCarriers.map(carrier => carrier.id === id ? response.carrier! : carrier)
                );
                if (currentCarrier?.id === id) {
                    setCurrentCarrier(response.carrier);
                }
                return true;
            } else {
                setError(response.message || 'Error al actualizar el transportista');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const deleteCarrier = async (id: string): Promise<boolean> => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await carrierService.deleteCarrier(id);
            if (response.ok) {
                setCarriers(prevCarriers =>
                    prevCarriers.filter(carrier => carrier.id !== id)
                );
                if (currentCarrier?.id === id) {
                    setCurrentCarrier(null);
                }
                return true;
            } else {
                setError(response.message || 'Error al eliminar el transportista');
                return false;
            }
        } catch (error) {
            setError('Error al conectar con el servidor');
            return false;
        } finally {
            setIsLoading(false);
        }
    };

    const clearCurrentCarrier = () => {
        setCurrentCarrier(null);
    };

    const value = {
        carriers,
        currentCarrier,
        isLoading,
        error,
        getAllCarriers,
        getCarrierById,
        createCarrier,
        updateCarrier,
        deleteCarrier,
        clearCurrentCarrier
    };

    return (
        <CarrierContext.Provider value={value}>
            {children}
        </CarrierContext.Provider>
    );
};