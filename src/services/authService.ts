import coordApi from '../utils/apiUtils';
import { LoginRequest, LoginResponse, RegisterRequest, RegisterReponse } from '../types/auth.types';
import { AxiosError } from 'axios';

export const authService = {

  login: async (credentials: LoginRequest): Promise<{ ok: boolean; data?: LoginResponse; message?: string }> => {
    try {
      const { data } = await coordApi.post<LoginResponse>('/auth/login', credentials);

      if (data && data.token) {
        sessionStorage.setItem('user', JSON.stringify({
          user: {
            uuid: data.uuid,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          },
          token: data.token
        }));

        return {
          ok: true,
          data
        };
      }

      return {
        ok: false,
        message: 'Respuesta inválida del servidor'
      };
    } catch (error: any) {

      console.error('Error en login:', error);
      return {
        ok: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    }
  },


  register: async (userData: RegisterRequest): Promise<{ ok: boolean; data?: RegisterReponse; message?: string }> => {
    try {
      const { data } = await coordApi.post<RegisterReponse>('/auth/register', userData);

      if (data && data.id) {
        return {
          ok: true,
          data
        };
      }

      return {
        ok: false,
        message: 'Respuesta inválida del servidor'
      };
    } catch (error: any) {
      console.error('Error en registro:', error);
      if(error instanceof AxiosError){
        console.error('Error de Axios:', error.response?.data);
      }
      return {
        ok: false,
        message: error.response?.data?.message || 'Error al registrar usuario'
      };
    }
  },

  renewToken: async (): Promise<{ ok: boolean; data?: LoginResponse; message?: string }> => {
    try {
      const userData = sessionStorage.getItem('user');
      console.log('userData', userData);
      if (!userData) {
        return {
          ok: false,
          message: 'No hay sesión activa'
        };
      }

      const { data } = await coordApi.post<LoginResponse>('/auth/renew');
      console.log('data', data);

      if (data && data.token) {
        sessionStorage.setItem('user', JSON.stringify({
          user: {
            uuid: data.uuid,
            email: data.email,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
          },
          token: data.token
        }));

        return {
          ok: true,
          data
        };
      }

      return {
        ok: false,
        message: 'Error al renovar el token'
      };
    } catch (error: any) {
      console.error('Error en renovación de token:', error);
      return {
        ok: false,
        message: error.response?.data?.message || 'Error al renovar token'
      };
    }
  },


  logout: (): void => {
    sessionStorage.removeItem('user');
    sessionStorage.clear();
    localStorage.clear();
    window.location.reload();
  },

  isAuthenticated: (): boolean => {
    const userData = sessionStorage.getItem('user');
    if (!userData) return false;

    const { token } = JSON.parse(userData);
    return !!token;
  },

  getCurrentUser: (): {
    user: {
      uuid: string;
      email: string;
      firstName: string;
      lastName: string;
      role: string;
    };
    token: string
  } | null => {
    const userData = sessionStorage.getItem('user');
    if (!userData) return null;

    return JSON.parse(userData);
  }
};