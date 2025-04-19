import { useState, useEffect } from 'react';
import { Typography, Box, Paper, Tabs, Tab, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, IconButton, Chip, Snackbar, Alert } from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
    LocalShipping as VehicleIcon,
    Map as RouteIcon,
} from '@mui/icons-material';

interface Vehicle {
    id: string;
    plate: string;
    model: string;
    year: number;
    type: string;
    capacity: string;
    status: 'available' | 'in_route' | 'maintenance';
    driver: string;
}

interface Order {
    id: string;
    trackingNumber: string;
    client: string;
    origin: string;
    destination: string;
    status: string;
    weight: string;
    createdAt: string;
}

interface Route {
    id: string;
    name: string;
    vehicle: string;
    orders: string[];
    status: 'pending' | 'in_progress' | 'completed';
    startDate?: string;
    estimatedEndDate?: string;
}

export const AdminDashboardPage = () => {

    const [tabValue, setTabValue] = useState(0);

    const [vehicles, setVehicles] = useState<Vehicle[]>([]);
    const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
    const [currentVehicle, setCurrentVehicle] = useState<Vehicle | null>(null);
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);

    const [orders, setOrders] = useState<Order[]>([]);
    const [routes, setRoutes] = useState<Route[]>([]);
    const [routeDialogOpen, setRouteDialogOpen] = useState(false);
    const [currentRoute, setCurrentRoute] = useState<Route | null>(null);
    const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

    const [notification, setNotification] = useState({
        open: false,
        message: '',
        type: 'success' as 'success' | 'error'
    });

    useEffect(() => {
        loadMockData();
    }, []);

    const loadMockData = () => {

        const mockVehicles: Vehicle[] = [
            {
                id: '1',
                plate: 'ABC123',
                model: 'Ford Transit',
                year: 2023,
                type: 'Van',
                capacity: '1500 kg',
                status: 'available',
                driver: 'Carlos Rodríguez'
            },
            {
                id: '2',
                plate: 'XYZ789',
                model: 'Mercedes Sprinter',
                year: 2022,
                type: 'Van',
                capacity: '2000 kg',
                status: 'in_route',
                driver: 'Ana Martínez'
            },
            {
                id: '3',
                plate: 'DEF456',
                model: 'Chevrolet NPR',
                year: 2021,
                type: 'Truck',
                capacity: '5000 kg',
                status: 'maintenance',
                driver: 'Pedro Gómez'
            }
        ];

        const mockOrders: Order[] = [
            {
                id: '1',
                trackingNumber: 'CO12345678',
                client: 'Empresa A',
                origin: 'Bogotá, Colombia',
                destination: 'Medellín, Colombia',
                status: 'pending',
                weight: '500 kg',
                createdAt: '15 de Abril, 2025'
            },
            {
                id: '2',
                trackingNumber: 'CO23456789',
                client: 'Empresa B',
                origin: 'Cali, Colombia',
                destination: 'Barranquilla, Colombia',
                status: 'pending',
                weight: '300 kg',
                createdAt: '16 de Abril, 2025'
            },
            {
                id: '3',
                trackingNumber: 'CO34567890',
                client: 'Persona Natural',
                origin: 'Medellín, Colombia',
                destination: 'Bogotá, Colombia',
                status: 'pending',
                weight: '15 kg',
                createdAt: '17 de Abril, 2025'
            }
        ];

        const mockRoutes: Route[] = [
            {
                id: '1',
                name: 'Ruta Bogotá-Medellín',
                vehicle: '2',
                orders: ['1'],
                status: 'in_progress',
                startDate: '17 de Abril, 2025',
                estimatedEndDate: '19 de Abril, 2025'
            }
        ];

        setVehicles(mockVehicles);
        setOrders(mockOrders);
        setRoutes(mockRoutes);
    };

    const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleOpenVehicleDialog = (vehicle?: Vehicle) => {
        if (vehicle) {
            setCurrentVehicle(vehicle);
            setIsEditingVehicle(true);
        } else {
            setCurrentVehicle({
                id: '',
                plate: '',
                model: '',
                year: new Date().getFullYear(),
                type: '',
                capacity: '',
                status: 'available',
                driver: ''
            });
            setIsEditingVehicle(false);
        }
        setVehicleDialogOpen(true);
    };

    const handleCloseVehicleDialog = () => {
        setVehicleDialogOpen(false);
        setCurrentVehicle(null);
    };

    const handleVehicleChange = (prop: keyof Vehicle, value: any) => {
        if (currentVehicle) {
            setCurrentVehicle({
                ...currentVehicle,
                [prop]: value
            });
        }
    };

    const handleSaveVehicle = () => {
        if (!currentVehicle) return;

        if (isEditingVehicle) {
            setVehicles(vehicles.map(v => v.id === currentVehicle.id ? currentVehicle : v));
            setNotification({
                open: true,
                message: 'Vehículo actualizado correctamente',
                type: 'success'
            });
        } else {
            const newVehicle = {
                ...currentVehicle,
                id: Date.now().toString()
            };
            setVehicles([...vehicles, newVehicle]);
            setNotification({
                open: true,
                message: 'Vehículo agregado correctamente',
                type: 'success'
            });
        }

        handleCloseVehicleDialog();
    };

    const handleDeleteVehicle = (id: string) => {
        setVehicles(vehicles.filter(v => v.id !== id));
        setNotification({
            open: true,
            message: 'Vehículo eliminado correctamente',
            type: 'success'
        });
    };

    const handleOpenRouteDialog = (route?: Route) => {
        if (route) {
            setCurrentRoute(route);
        } else {
            setCurrentRoute({
                id: '',
                name: '',
                vehicle: '',
                orders: [],
                status: 'pending'
            });
            setSelectedOrders([]);
        }
        setRouteDialogOpen(true);
    };

    const handleCloseRouteDialog = () => {
        setRouteDialogOpen(false);
        setCurrentRoute(null);
        setSelectedOrders([]);
    };

    const handleRouteChange = (prop: keyof Route, value: any) => {
        if (currentRoute) {
            setCurrentRoute({
                ...currentRoute,
                [prop]: value
            });
        }
    };

    const toggleOrderSelection = (orderId: string) => {
        if (selectedOrders.includes(orderId)) {
            setSelectedOrders(selectedOrders.filter(id => id !== orderId));
        } else {
            setSelectedOrders([...selectedOrders, orderId]);
        }
    };

    const handleSaveRoute = () => {
        if (!currentRoute) return;

        const newRoute: Route = {
            ...currentRoute,
            id: currentRoute.id || Date.now().toString(),
            orders: selectedOrders,
            startDate: new Date().toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }),
            estimatedEndDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            })
        };

        if (currentRoute.id) {
            setRoutes(routes.map(r => r.id === currentRoute.id ? newRoute : r));
        } else {
            setRoutes([...routes, newRoute]);
        }

        setVehicles(vehicles.map(v =>
            v.id === newRoute.vehicle ? { ...v, status: 'in_route' as 'in_route' } : v
        ));

        setOrders(orders.map(o =>
            selectedOrders.includes(o.id) ? { ...o, status: 'in_route' } : o
        ));

        setNotification({
            open: true,
            message: 'Ruta creada y asignada correctamente',
            type: 'success'
        });

        handleCloseRouteDialog();
    };

    const getVehicleById = (id: string) => {
        return vehicles.find(v => v.id === id);
    };

    const getOrderById = (id: string) => {
        return orders.find(o => o.id === id);
    };

    const getPendingOrders = () => {
        return orders.filter(o => o.status === 'pending');
    };

    const getAvailableVehicles = () => {
        return vehicles.filter(v => v.status === 'available');
    };

    const handleCloseNotification = () => {
        setNotification({
            ...notification,
            open: false
        });
    };

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
                </Tabs>
            </Paper>

            {tabValue === 0 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5">Flota de Vehículos</Typography>
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={() => handleOpenVehicleDialog()}
                                sx={{ mr: 1 }}
                            >
                                Nuevo Vehículo
                            </Button>
                            <Button
                                variant="outlined"
                                startIcon={<RefreshIcon />}
                                onClick={loadMockData}
                            >
                                Actualizar
                            </Button>
                        </Box>
                    </Box>

                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Placa</TableCell>
                                    <TableCell>Modelo</TableCell>
                                    <TableCell>Año</TableCell>
                                    <TableCell>Tipo</TableCell>
                                    <TableCell>Capacidad</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Conductor</TableCell>
                                    <TableCell>Acciones</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {vehicles.map((vehicle) => (
                                    <TableRow key={vehicle.id}>
                                        <TableCell>{vehicle.plate}</TableCell>
                                        <TableCell>{vehicle.model}</TableCell>
                                        <TableCell>{vehicle.year}</TableCell>
                                        <TableCell>{vehicle.type}</TableCell>
                                        <TableCell>{vehicle.capacity}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={
                                                    vehicle.status === 'available' ? 'Disponible' :
                                                        vehicle.status === 'in_route' ? 'En ruta' : 'En mantenimiento'
                                                }
                                                color={
                                                    vehicle.status === 'available' ? 'success' :
                                                        vehicle.status === 'in_route' ? 'primary' : 'warning'
                                                }
                                            />
                                        </TableCell>
                                        <TableCell>{vehicle.driver}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                color="primary"
                                                onClick={() => handleOpenVehicleDialog(vehicle)}
                                                disabled={vehicle.status === 'in_route'}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                            <IconButton
                                                color="error"
                                                onClick={() => handleDeleteVehicle(vehicle.id)}
                                                disabled={vehicle.status === 'in_route'}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Grid container spacing={3}>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Total de Vehículos
                                    </Typography>
                                    <Typography variant="h3" color="primary">
                                        {vehicles.length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Vehículos Disponibles
                                    </Typography>
                                    <Typography variant="h3" color="success.main">
                                        {vehicles.filter(v => v.status === 'available').length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Card>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom>
                                        Vehículos en Ruta
                                    </Typography>
                                    <Typography variant="h3" color="primary">
                                        {vehicles.filter(v => v.status === 'in_route').length}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Box>
            )}

            {tabValue === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h5">Órdenes Pendientes y Rutas</Typography>
                        <Button
                            variant="contained"
                            color="primary"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenRouteDialog()}
                            disabled={getPendingOrders().length === 0 || getAvailableVehicles().length === 0}
                        >
                            Asignar Nueva Ruta
                        </Button>
                    </Box>

                    {/* Sección de órdenes pendientes */}
                    <Typography variant="h6" sx={{ mt: 3, mb: 2 }}>
                        Órdenes Pendientes
                    </Typography>

                    <TableContainer component={Paper} sx={{ mb: 4 }}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Número de Guía</TableCell>
                                    <TableCell>Cliente</TableCell>
                                    <TableCell>Origen</TableCell>
                                    <TableCell>Destino</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Peso</TableCell>
                                    <TableCell>Fecha Creación</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {orders.filter(o => o.status === 'pending').map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.trackingNumber}</TableCell>
                                        <TableCell>{order.client}</TableCell>
                                        <TableCell>{order.origin}</TableCell>
                                        <TableCell>{order.destination}</TableCell>
                                        <TableCell>
                                            <Chip label="Pendiente" color="warning" />
                                        </TableCell>
                                        <TableCell>{order.weight}</TableCell>
                                        <TableCell>{order.createdAt}</TableCell>
                                    </TableRow>
                                ))}
                                {orders.filter(o => o.status === 'pending').length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No hay órdenes pendientes
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* Sección de rutas asignadas */}
                    <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                        Rutas Asignadas
                    </Typography>

                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Nombre de Ruta</TableCell>
                                    <TableCell>Vehículo</TableCell>
                                    <TableCell>Conductor</TableCell>
                                    <TableCell>Órdenes</TableCell>
                                    <TableCell>Estado</TableCell>
                                    <TableCell>Fecha Inicio</TableCell>
                                    <TableCell>Fecha Estimada Fin</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {routes.map((route) => {
                                    const vehicle = getVehicleById(route.vehicle);

                                    return (
                                        <TableRow key={route.id}>
                                            <TableCell>{route.name}</TableCell>
                                            <TableCell>{vehicle ? `${vehicle.model} (${vehicle.plate})` : 'No asignado'}</TableCell>
                                            <TableCell>{vehicle ? vehicle.driver : 'No asignado'}</TableCell>
                                            <TableCell>{route.orders.length}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={
                                                        route.status === 'pending' ? 'Pendiente' :
                                                            route.status === 'in_progress' ? 'En progreso' : 'Completada'
                                                    }
                                                    color={
                                                        route.status === 'pending' ? 'warning' :
                                                            route.status === 'in_progress' ? 'primary' : 'success'
                                                    }
                                                />
                                            </TableCell>
                                            <TableCell>{route.startDate || 'No iniciada'}</TableCell>
                                            <TableCell>{route.estimatedEndDate || 'Sin estimación'}</TableCell>
                                        </TableRow>
                                    );
                                })}
                                {routes.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center">
                                            No hay rutas asignadas
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>
                </Box>
            )}

            <Dialog open={vehicleDialogOpen} onClose={handleCloseVehicleDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEditingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Placa"
                                fullWidth
                                value={currentVehicle?.plate || ''}
                                onChange={(e) => handleVehicleChange('plate', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Modelo"
                                fullWidth
                                value={currentVehicle?.model || ''}
                                onChange={(e) => handleVehicleChange('model', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Año"
                                type="number"
                                fullWidth
                                value={currentVehicle?.year || new Date().getFullYear()}
                                onChange={(e) => handleVehicleChange('year', parseInt(e.target.value) || new Date().getFullYear())}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={currentVehicle?.type || ''}
                                    label="Tipo"
                                    onChange={(e) => handleVehicleChange('type', e.target.value)}
                                >
                                    <MenuItem value="Car">Automóvil</MenuItem>
                                    <MenuItem value="Van">Van</MenuItem>
                                    <MenuItem value="Truck">Camión</MenuItem>
                                    <MenuItem value="Mini-Truck">Mini-Camión</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Capacidad"
                                fullWidth
                                value={currentVehicle?.capacity || ''}
                                onChange={(e) => handleVehicleChange('capacity', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={currentVehicle?.status || 'available'}
                                    label="Estado"
                                    onChange={(e) => handleVehicleChange('status', e.target.value)}
                                >
                                    <MenuItem value="available">Disponible</MenuItem>
                                    <MenuItem value="maintenance">En mantenimiento</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <TextField
                                label="Conductor"
                                fullWidth
                                value={currentVehicle?.driver || ''}
                                onChange={(e) => handleVehicleChange('driver', e.target.value)}
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseVehicleDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSaveVehicle}
                        variant="contained"
                        color="primary"
                        disabled={
                            !currentVehicle?.plate ||
                            !currentVehicle?.model ||
                            !currentVehicle?.type ||
                            !currentVehicle?.capacity ||
                            !currentVehicle?.driver
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>

            <Dialog open={routeDialogOpen} onClose={handleCloseRouteDialog} maxWidth="md" fullWidth>
                <DialogTitle>Asignar Nueva Ruta</DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Nombre de la Ruta"
                                fullWidth
                                value={currentRoute?.name || ''}
                                onChange={(e) => handleRouteChange('name', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Vehículo</InputLabel>
                                <Select
                                    value={currentRoute?.vehicle || ''}
                                    label="Vehículo"
                                    onChange={(e) => handleRouteChange('vehicle', e.target.value)}
                                >
                                    {getAvailableVehicles().map((vehicle) => (
                                        <MenuItem key={vehicle.id} value={vehicle.id}>
                                            {vehicle.model} ({vehicle.plate}) - {vehicle.capacity}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid size={12}>
                            <Typography variant="subtitle1" gutterBottom>
                                Seleccionar Órdenes para esta Ruta:
                            </Typography>

                            <TableContainer component={Paper} variant="outlined">
                                <Table size="small">
                                    <TableHead>
                                        <TableRow>
                                            <TableCell padding="checkbox">Seleccionar</TableCell>
                                            <TableCell>Número de Guía</TableCell>
                                            <TableCell>Cliente</TableCell>
                                            <TableCell>Origen</TableCell>
                                            <TableCell>Destino</TableCell>
                                            <TableCell>Peso</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getPendingOrders().map((order) => (
                                            <TableRow
                                                key={order.id}
                                                selected={selectedOrders.includes(order.id)}
                                                onClick={() => toggleOrderSelection(order.id)}
                                                hover
                                            >
                                                <TableCell padding="checkbox">
                                                    <input
                                                        type="checkbox"
                                                        checked={selectedOrders.includes(order.id)}
                                                        onChange={() => { }}
                                                    />
                                                </TableCell>
                                                <TableCell>{order.trackingNumber}</TableCell>
                                                <TableCell>{order.client}</TableCell>
                                                <TableCell>{order.origin}</TableCell>
                                                <TableCell>{order.destination}</TableCell>
                                                <TableCell>{order.weight}</TableCell>
                                            </TableRow>
                                        ))}
                                        {getPendingOrders().length === 0 && (
                                            <TableRow>
                                                <TableCell colSpan={6} align="center">
                                                    No hay órdenes pendientes para asignar
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseRouteDialog}>Cancelar</Button>
                    <Button
                        onClick={handleSaveRoute}
                        variant="contained"
                        color="primary"
                        disabled={
                            !currentRoute?.name ||
                            !currentRoute?.vehicle ||
                            selectedOrders.length === 0
                        }
                    >
                        Asignar Ruta
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={notification.open}
                autoHideDuration={4000}
                onClose={handleCloseNotification}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            >
                <Alert
                    onClose={handleCloseNotification}
                    severity={notification.type}
                    variant="filled"
                >
                    {notification.message}
                </Alert>
            </Snackbar>
        </Box>
    );
};