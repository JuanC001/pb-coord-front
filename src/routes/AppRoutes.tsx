import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import { HomePage } from '../pages/HomePage';
import { TrackingPage } from '../pages/TrackingPage';
import { AdminDashboardPage } from '../pages/AdminDashboardPage';

import { ShipmentsPage } from '../pages/ShipmentsPage';
import { ContactPage } from '@mui/icons-material';

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
                <Route path="/envios" element={<ShipmentsPage />} />
                <Route path="/seguimiento" element={<TrackingPage />} />
                <Route path="/seguimiento/:trackingNumber" element={<TrackingPage />} />
                <Route path="/contacto" element={<ContactPage />} />
                <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
                <Route path="/404" element={<NotFoundPage />} />
                <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
        </MainLayout>
    );
};