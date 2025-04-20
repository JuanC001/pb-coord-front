import { useState } from 'react';
import { Typography, Box, Paper, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Chip, Divider } from '@mui/material';
import { LocalShipping as CarrierIcon } from '@mui/icons-material';
import { Carrier } from '../../types/carrier.types'
import { Order } from '../../types/order.types'
import { Address } from '../../types/address.types';
import { OrderStatus } from '../../constants/appConstants';
import { useShipments } from '../../hooks/useShipments';
import { useOrders } from '../../hooks/useOrders';
import { CustomSnackbar } from '../shared/CustomSnackbar';
interface RouteAssignmentProps {
    carriers: Carrier[],
    orders: Order[],
    refreshData: () => void
}

export const RouteAssignment = ({ orders, carriers, refreshData }: RouteAssignmentProps) => {
    const { createShipment } = useShipments()
    const { updateOrderStatus } = useOrders()

    const [assignCarrierDialogOpen, setAssignCarrierDialogOpen] = useState(false);
    const [currentOrderId, setCurrentOrderId] = useState('');
    const [selectedCarrier, setSelectedCarrier] = useState('');
    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const formatDestinationAddress = (destination: Address) => {
        if (!destination) return 'No disponible';
        return `${destination.address}, ${destination.city}, ${destination.country}`;
    };

    const getStatusChip = (status: OrderStatus) => {
        switch (status) {
            case 'pending':
                return <Chip label="Pendiente" color="warning" />;
            case 'accepted':
                return <Chip label="Aceptada" color="primary" />;
            default:
                return <Chip label="Desconocido" />;
        }
    };

    const getAvailableCarriers = () => {
        return carriers;
    };

    const handleOpenAssignCarrierDialog = (orderId: string) => {
        setCurrentOrderId(orderId);
        setSelectedCarrier('');
        setAssignCarrierDialogOpen(true);
    };

    const handleCloseAssignCarrierDialog = () => {
        setAssignCarrierDialogOpen(false);
        setCurrentOrderId('');
        setSelectedCarrier('');
    };

    const handleAssignCarrierToOrder = async () => {
        try {
            if (!currentOrderId || !selectedCarrier) return;

            const order = orders.find((order) => order.id === currentOrderId);
            if (!order) return;

            const response = await createShipment({
                orderId: currentOrderId,
                carrierId: selectedCarrier
            });


            if (response) {

                await updateOrderStatus(currentOrderId, OrderStatus.ACCEPTED);
                handleCloseAssignCarrierDialog();
                refreshData();
                setSnackbar({
                    open: true,
                    message: 'Transportador asignado exitosamente',
                    severity: 'success'
                });

            } else {
                console.error('Error al crear el envío');
            }


        } catch (error) {
            console.error('Error al asignar transportador:', error);
        }
    };

    return (
        <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
                Listado de Órdenes
            </Typography>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Número de Guía</TableCell>
                            <TableCell>Origen</TableCell>
                            <TableCell>Destino</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Peso</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell>{order.id?.substring(0, 8)}</TableCell>
                                <TableCell>{order.trackingNumber || 'N/A'}</TableCell>
                                <TableCell>{order.origin}</TableCell>
                                <TableCell>{formatDestinationAddress(order.destination)}</TableCell>
                                <TableCell>
                                    {getStatusChip(order.orderStatus as OrderStatus)}
                                </TableCell>
                                <TableCell>{order.dimensions?.weight} kg</TableCell>
                                <TableCell>
                                    <Button
                                        startIcon={<CarrierIcon />}
                                        variant="outlined"
                                        color="primary"
                                        size="small"
                                        onClick={() => handleOpenAssignCarrierDialog(order.id as string)}
                                        disabled={order.orderStatus !== 'pending'}
                                    >
                                        Asignar Transportador
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {orders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">
                                    No hay órdenes registradas
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            <Dialog open={assignCarrierDialogOpen} onClose={handleCloseAssignCarrierDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Asignar Transportador a Orden
                </DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2 }}>
                        <Typography variant="subtitle2" gutterBottom>
                            ID de Orden: {currentOrderId?.substring(0, 8) || 'N/A'}
                        </Typography>

                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel>Seleccionar Transportador</InputLabel>
                            <Select
                                value={selectedCarrier}
                                label="Seleccionar Transportador"
                                onChange={(e) => setSelectedCarrier(e.target.value)}
                            >
                                {getAvailableCarriers().map((carrier) => (
                                    <MenuItem key={carrier.id} value={carrier.id}>
                                        ID: {carrier.id.substring(0, 8)} - Capacidad: {carrier.maxWeight}kg - Ruta : {carrier.routeName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAssignCarrierDialog}>Cancelar</Button>
                    <Button
                        onClick={handleAssignCarrierToOrder}
                        variant="contained"
                        color="primary"
                        disabled={!selectedCarrier}
                    >
                        Asignar Transportador
                    </Button>
                </DialogActions>
            </Dialog>

            <Box mt={4}>
                <Divider sx={{ mb: 2 }} />
                <Typography variant="h5" sx={{ mb: 2 }}>
                    Órdenes Aprobadas
                </Typography>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Número de Guía</TableCell>
                                <TableCell>Origen</TableCell>
                                <TableCell>Destino</TableCell>
                                <TableCell>Peso</TableCell>
                                <TableCell>Transportador</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {orders
                                .filter((order) => order.orderStatus === 'accepted')
                                .map((order) => (
                                    <TableRow key={order.id}>
                                        <TableCell>{order.id?.substring(0, 8)}</TableCell>
                                        <TableCell>{order.trackingNumber || 'N/A'}</TableCell>
                                        <TableCell>{order.origin}</TableCell>
                                        <TableCell>{formatDestinationAddress(order.destination)}</TableCell>
                                        <TableCell>{order.dimensions?.weight} kg</TableCell>
                                    </TableRow>
                                ))}

                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
            <CustomSnackbar
                snackbar={snackbar}
                handleCloseSnackbar={() => setSnackbar({
                    ...snackbar,
                    open: false
                })}
            />

        </Box>
    );
};
