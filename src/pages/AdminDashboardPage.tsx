import { useState, useEffect } from 'react';
import { Typography, Box, Paper, Tabs, Tab, Snackbar, Alert, CircularProgress } from '@mui/material';
import {
    LocalShipping as VehicleIcon,
    Map as RouteIcon,
    ListAlt as OrdersIcon
} from '@mui/icons-material';
import { VehicleManagement } from '../components/admin/VehicleManagement';
import { RouteAssignment } from '../components/admin/RouteAssignment';
import { OrdersList } from '../components/admin/OrdersList';
import { Route } from '../types/route.types';
import { useCarriers } from '../hooks/useCarriers';
import { useOrders } from '../hooks/useOrders';
import { useRoutes } from '../hooks/useRoutes';


export const AdminDashboardPage = () => {

    const { carriers, getAllCarriers, isLoading } = useCarriers();
    const { orders, getAllOrders } = useOrders()
    const { routes, getAllRoutes } = useRoutes()

    const [tabValue, setTabValue] = useState(0);
    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const refreshData = async () => {
        getAllCarriers()
        getAllOrders()
        getAllRoutes()
    }

    useEffect(() => {
        refreshData()
    }, [])

    if (isLoading) {
        return (<CircularProgress />)
    }

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Dashboard de Administrador
            </Typography>

            <Paper sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={handleTabChange}
                    variant="fullWidth"
                    indicatorColor="primary"
                    textColor="primary"
                >
                    <Tab icon={<VehicleIcon />} label="Gestión de Vehículos" />
                    <Tab icon={<RouteIcon />} label="Asignación de Rutas" />
                    <Tab icon={<OrdersIcon />} label="Todas las Órdenes" />
                </Tabs>
            </Paper>

            {tabValue === 0 && (
                <VehicleManagement
                    carriers={carriers}
                    setCarriers={() => { }}
                    reloadData={getAllCarriers}
                />
            )}

            {tabValue === 1 && (
                <RouteAssignment
                    carriers={carriers}
                    orders={orders}
                    refreshData={refreshData}
                />
            )}

            {tabValue === 2 && (
                <OrdersList orders={orders} />
            )}

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    severity={notification.type}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};