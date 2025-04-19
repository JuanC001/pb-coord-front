import { Address } from "./address.types";
import { UserData } from "./user.types";

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    uuid: string;
    email: string;
    role: string;
    firstName: string;
    lastName: string;
    token: string;
}

export interface RegisterRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    phoneNumber: string;
}

export interface RegisterReponse {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    phoneNumber: string;
    role: string;
    defaultAddress?: Address;
    isActive: boolean;
    emailVerified: boolean;
    lastLogin: string;
    createdAt: string;
    updatedAt: string;
}

export interface AuthContextType {
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