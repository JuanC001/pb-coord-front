import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { TrackingPage } from '../pages/TrackingPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

import { ContactPage } from '@mui/icons-material';
import { LoginPage } from '../pages/LoginPage';
import { useAuth } from '../hooks/useAuth';
import { ReactNode } from 'react';
import Swal from 'sweetalert2';
import { UserRole } from '../constants/appConstants';
import { CourrierDashboardPage } from '../pages/CourrierDashboardPage';
import { OrdersPage } from '../pages/OrdersPage';
import { OrderProvider } from '../contexts/OrderContext';

const PrivateRoute = ({ children, title, message, role }: { children: ReactNode, title: string, message: string, role: UserRole[] }) => {
    const { isAuthenticated, user } = useAuth();

    if (!isAuthenticated) {
        Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
        });
        return <Navigate to="/sign-in" replace />;
    }


    if (role && user && !role.includes(user?.role as UserRole)) {
        Swal.fire({
            title: title,
            text: 'No tienes los suficientes permisos para estar aquí',
            icon: 'warning',
        });
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
};

const PublicRoute = ({ children }: { children: ReactNode }) => {
    const { isAuthenticated, user } = useAuth();

    if (isAuthenticated) {
        if (user?.role === UserRole.ADMIN) {
            return <Navigate to="/admin/dashboard" replace />;

        } else if (user?.role === UserRole.COURRIER) {
            return <Navigate to="/courrier/dashboard" replace />;
        } else {
            return <Navigate to="/envios" replace />;
        }
    }

    return <>{children}</>;
};

const NotFoundPage = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Página No Encontrada</h2>
        <p>Lo sentimos, la página que buscas no existe.</p>
    </div>
);

export const AppRoutes = () => {
    return (
        <MainLayout>
            <Routes>

                <Route path="/" element={<HomePage />} />
                <Route path="/seguimiento" element={<TrackingPage />} />
                <Route path="/seguimiento/:trackingNumber" element={<TrackingPage />} />
                <Route path="/contacto" element={<ContactPage />} />

                <Route
                    path="/sign-in"
                    element={
                        <PublicRoute>
                            <LoginPage />
                        </PublicRoute>
                    }
                />

                <Route
                    path="/admin/dashboard"
                    element={
                        <PrivateRoute title='Whoops...' message='No tienes acceso a esta sección' role={[UserRole.ADMIN]}>
                            <AdminDashboardPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/courrier/dashboard"
                    element={
                        <PrivateRoute title='Whoops...' message='No tienes acceso a esta sección' role={[UserRole.COURRIER]}>
                            <CourrierDashboardPage />
                        </PrivateRoute>
                    }
                />

                <Route

                    path='/my-orders'
                    element={
                        <PrivateRoute title='Whoops...' message='Debes iniciar sesión para acceder a esta sección' role={[UserRole.CUSTOMER, UserRole.ADMIN]}>
                            <OrderProvider>
                                <OrdersPage />
                            </OrderProvider>
                        </PrivateRoute>
                    }
                />


                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </MainLayout>
    );
};