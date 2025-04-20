import { useState } from 'react';
import { Typography, Box, Paper, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Chip, TablePagination, TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { Order } from '../../types/order.types';
import { OrderStatus } from '../../constants/appConstants';

interface OrdersListProps {
    orders: Order[];
}

export const OrdersList = ({ orders }: OrdersListProps) => {
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [searchTerm, setSearchTerm] = useState('');

    const handleChangePage = (_: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusChip = (status?: OrderStatus) => {
        switch (status) {
            case OrderStatus.PENDING:
                return <Chip label="Pendiente" color="warning" />;
            case OrderStatus.ACCEPTED:
                return <Chip label="Aceptada" color="primary" />;
            default:
                return <Chip label="Desconocido" />;
        }
    };

    const formatDestinationAddress = (destination: any) => {
        if (!destination) return 'No disponible';
        return `${destination.address}, ${destination.city}, ${destination.country}`;
    };

    const filteredOrders = orders.filter(order =>
        (order.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (order.origin?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (order.destination?.address?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (order.destination?.city?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        (order.destination?.country?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    );

    return (
        <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h5">Todas las Órdenes</Typography>
                <TextField
                    placeholder="Buscar órdenes..."
                    variant="outlined"
                    size="small"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Número de Guía</TableCell>
                            <TableCell>ID Usuario</TableCell>
                            <TableCell>Origen</TableCell>
                            <TableCell>Destino</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Peso</TableCell>
                            <TableCell>Dimensiones</TableCell>
                            <TableCell>Fecha Creación</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredOrders
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((order) => (
                                <TableRow key={order.id}>
                                    <TableCell>{order.id?.substring(0, 8)}</TableCell>
                                    <TableCell>{order.trackingNumber || 'N/A'}</TableCell>
                                    <TableCell>{order.userId?.substring(0, 8) || 'N/A'}</TableCell>
                                    <TableCell>{order.origin}</TableCell>
                                    <TableCell>{formatDestinationAddress(order.destination)}</TableCell>
                                    <TableCell>{getStatusChip(order.orderStatus)}</TableCell>
                                    <TableCell>{order.dimensions.weight} kg</TableCell>
                                    <TableCell>
                                        {order.dimensions.length} x {order.dimensions.width} x {order.dimensions.height} cm
                                    </TableCell>
                                    <TableCell>
                                        {order.createdAt ? new Date(order.createdAt).toLocaleDateString() : 'N/A'}
                                    </TableCell>
                                </TableRow>
                            ))}
                        {filteredOrders.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={9} align="center">
                                    No se encontraron órdenes
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25, 50]}
                    component="div"
                    count={filteredOrders.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                    labelRowsPerPage="Filas por página:"
                />
            </TableContainer>
        </Box>
    );
};