import React, { useState, useEffect } from 'react';
import { Typography, Box, Paper, Button, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TablePagination, Chip, Tooltip, IconButton, Card, CardHeader, Divider } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { CreateOrder } from '../components/orders/CreateOrder';
import { CustomSnackbar } from '../components/shared/CustomSnackbar';
import { useOrders } from '../hooks/useOrders';
import { OrderStatus } from '../constants/appConstants';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';

export const OrdersPage = () => {

    const { orders, isLoading, error, getOrdersByUserId } = useOrders();
    const { user, loading } = useAuth();

    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error' | 'info' | 'warning'
    });

    const loadOrders = async () => {
        try {

            if (loading) return;
            if (user) {
                await getOrdersByUserId(user.uuid);
            } else {
                setSnackbar({
                    open: true,
                    message: 'Usuario no autenticado',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error al cargar las órdenes:', error);
            setSnackbar({
                open: true,
                message: 'Error al cargar las órdenes',
                severity: 'error'
            });
        }
    };

    useEffect(() => {
        if (!loading && user) {
            loadOrders();
        }
    }, [user]);

    useEffect(() => {
        if (error) {
            setSnackbar({
                open: true,
                message: error,
                severity: 'error'
            });
        }
    }, [error]);

    const refreshOrders = async () => {
        await getOrdersByUserId(user?.uuid || '');
    };

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleOpenCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const handleCloseCreateModal = () => {
        setIsCreateModalOpen(false);
    };

    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const getStatusChipColor = (status: OrderStatus | undefined) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'warning';
            case OrderStatus.ACCEPTED:
                return 'info';
            default:
                return 'default';
        }
    };

    const getStatusText = (status: OrderStatus | undefined) => {
        switch (status) {
            case OrderStatus.PENDING:
                return 'Pendiente';
            case OrderStatus.ACCEPTED:
                return 'Aceptado';
            default:
                return 'Desconocido';
        }
    };

    const formatDate = (date: Date | undefined) => {
        if (!date) return 'Fecha no disponible';

        return new Intl.DateTimeFormat('es-CO', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(new Date(date));
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            <Card elevation={3}>
                <CardHeader
                    title={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h4" component="h1">
                                Mis Órdenes de Envío
                            </Typography>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<AddIcon />}
                                onClick={handleOpenCreateModal}
                            >
                                Nueva Orden
                            </Button>
                        </Box>
                    }
                />
                <Divider />

                <TableContainer component={Paper} elevation={0}>
                    <Table sx={{ minWidth: 650 }} aria-label="tabla de órdenes">
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Origen</TableCell>
                                <TableCell>Destino</TableCell>
                                <TableCell>Dimensiones</TableCell>
                                <TableCell>Estado</TableCell>
                                <TableCell>Fecha Creación</TableCell>
                                <TableCell>Tracking</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Typography>Cargando órdenes...</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : orders.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={7} align="center">
                                        <Box sx={{ py: 3 }}>
                                            <Typography variant="h6">No tienes órdenes de envío</Typography>
                                            <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                Crea tu primera orden haciendo clic en "Nueva Orden"
                                            </Typography>
                                        </Box>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                orders
                                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                    .map((order) => (
                                        <TableRow key={order.id} hover>
                                            <TableCell>{order.id}</TableCell>
                                            <TableCell>{order.origin}</TableCell>
                                            <TableCell>
                                                {`${order.destination.city}, ${order.destination.country}`}
                                                <Typography variant="caption" display="block" color="textSecondary">
                                                    {order.destination.address}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                {`${order.dimensions.length}cm × ${order.dimensions.width}cm × ${order.dimensions.height}cm`}
                                                <Typography variant="caption" display="block" color="textSecondary">
                                                    {`${order.dimensions.weight} kg`}
                                                </Typography>
                                            </TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={getStatusText(order.orderStatus)}
                                                    color={getStatusChipColor(order.orderStatus) as any}
                                                    size="small"
                                                    icon={<LocalShippingIcon fontSize="small" />}
                                                />
                                            </TableCell>
                                            <TableCell>{formatDate(order.createdAt)}</TableCell>
                                            <TableCell>{order.trackingNumber ? <Link to={'/seguimiento/' + order.trackingNumber}>{order.trackingNumber}</Link> : 'Aun no tiene orden de rastreo'}</TableCell>
                                            
                                        </TableRow>
                                    ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>

                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={orders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página:"
                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} de ${count}`}
                />
            </Card>

            {isCreateModalOpen && (
                <CreateOrder
                    handleClose={handleCloseCreateModal}
                    refresh={refreshOrders}
                />
            )}

            <CustomSnackbar
                handleCloseSnackbar={handleCloseSnackbar}
                snackbar={snackbar}
            />
        </Container>
    );
};
