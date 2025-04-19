import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { RegisterRequest } from '../types/auth.types';
import { authService } from '../services/authService';
import { UserData } from '../types/user.types';



interface AuthContextType {
    user: UserData | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (registerData: RegisterRequest) => Promise<{
        ok: boolean;
        message?: string;
    }>;
    logout: () => void;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<UserData | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const userData = authService.getCurrentUser();

                if (userData) {
                    setUser(userData.user);
                    setToken(userData.token);

                    const renewResponse = await authService.renewToken();
                    if (!renewResponse.ok) {
                        authService.logout();
                        setUser(null);
                        setToken(null);
                    }
                }
            } catch (error) {
                console.error('Error al cargar usuario:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (email: string, password: string): Promise<boolean> => {
        try {
            setLoading(true);
            const response = await authService.login({ email, password });

            if (response.ok && response.data) {
                setUser({
                    uuid: response.data.uuid,
                    email: response.data.email,
                    firstName: response.data.firstName,
                    lastName: response.data.lastName,
                    role: response.data.role
                });
                setToken(response.data.token);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error en login:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const register = async (registerData: RegisterRequest): Promise<{
        ok: boolean;
        message?: string;
    }> => {
        try {
            setLoading(true);
            const response = await authService.register(registerData);

            if (response.ok) {
                return {
                    ok: true,
                    message: 'Usuario registrado con éxito'
                };
            }
            return {
                ok: false,
                message: response.message || 'Error al registrar el usuario'
            };
        } catch (error) {
            return {
                ok: false,
                message: 'Error al registrar el usuario'
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setToken(null);
    };

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        login,
        register,
        logout,
        loading
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('Debe ser usado dentro de un AuthProvider');
    }
    return context;
};