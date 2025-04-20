import { useEffect, useState } from 'react';
import { Typography, Box, Paper, Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, InputLabel, Select, MenuItem, Grid, Card, CardContent, IconButton, Chip } from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import { Carrier } from '../../types/carrier.types';

interface VehicleManagementProps {
    carriers: Carrier[];
    setCarriers: React.Dispatch<React.SetStateAction<Carrier[]>>;
    reloadData: () => void;
}

interface CarrierDisplay extends Carrier {
    plate?: string;
    model?: string;
    year?: number;
    type?: string;
    driver?: string;
    status?: 'available' | 'in_route' | 'maintenance';
}

export const VehicleManagement = ({ carriers, setCarriers, reloadData }: VehicleManagementProps) => {
    const [vehicleDialogOpen, setVehicleDialogOpen] = useState(false);
    const [currentCarrier, setCurrentCarrier] = useState<CarrierDisplay | null>(null);
    const [isEditingVehicle, setIsEditingVehicle] = useState(false);

    const getCarrierDisplayData = (carrier: Carrier): CarrierDisplay => {
        return {
            ...carrier,
            plate: `VH-${carrier.id.substring(0, 6)}`,
            model: 'Vehículo de transporte',
            year: new Date().getFullYear(),
            type: carrier.maxWeight > 1000 ? 'Truck' : 'Van',
            driver: `Conductor ${carrier.userId}`,
            status: carrier.routeId ? 'in_route' : 'available'
        };
    };

    const handleOpenVehicleDialog = (carrier?: CarrierDisplay) => {
        if (carrier) {
            setCurrentCarrier(carrier);
            setIsEditingVehicle(true);
        } else {
            setCurrentCarrier({
                id: '',
                userId: '',
                maxWeight: 0,
                maxItems: 0,
                routeId: '',
                plate: '',
                model: '',
                year: new Date().getFullYear(),
                type: '',
                status: 'available',
                driver: ''
            });
            setIsEditingVehicle(false);
        }
        setVehicleDialogOpen(true);
    };

    const handleCloseVehicleDialog = () => {
        setVehicleDialogOpen(false);
        setCurrentCarrier(null);
    };

    const handleVehicleChange = (prop: keyof CarrierDisplay, value: any) => {
        if (currentCarrier) {
            setCurrentCarrier({
                ...currentCarrier,
                [prop]: value
            });
        }
    };

    const handleSaveVehicle = () => {
        if (!currentCarrier) return;

        const carrierToSave: Carrier = {
            id: currentCarrier.id || Date.now().toString(),
            userId: currentCarrier.userId || Date.now().toString(),
            maxWeight: currentCarrier.maxWeight || parseInt(currentCarrier.type === 'Truck' ? '5000' : '1500'),
            maxItems: currentCarrier.maxItems || 100,
            routeId: currentCarrier.routeId || ''
        };

        if (isEditingVehicle) {
            setCarriers(carriers.map(c => c.id === carrierToSave.id ? carrierToSave : c));
        } else {
            setCarriers([...carriers, carrierToSave]);
        }

        handleCloseVehicleDialog();
    };

    const handleDeleteVehicle = (id: string) => {
        setCarriers(carriers.filter(c => c.id !== id));
    };

    const carriersDisplay = carriers.map(getCarrierDisplayData);

    return (
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
                        onClick={reloadData}
                    >
                        Actualizar
                    </Button>
                </Box>
            </Box>

            <TableContainer component={Paper} sx={{ mb: 4 }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Placa</TableCell>
                            <TableCell>Tipo</TableCell>
                            <TableCell>Capacidad Máxima</TableCell>
                            <TableCell>Ítems Máximos</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Conductor ID</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {carriersDisplay.map((carrier) => (
                            <TableRow key={carrier.id}>
                                <TableCell>{carrier.id.substring(0, 8)}</TableCell>
                                <TableCell>{carrier.plate}</TableCell>
                                <TableCell>{carrier.type}</TableCell>
                                <TableCell>{carrier.maxWeight} kg</TableCell>
                                <TableCell>{carrier.maxItems}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={
                                            carrier.status === 'available' ? 'Disponible' :
                                                carrier.status === 'in_route' ? 'En ruta' : 'En mantenimiento'
                                        }
                                        color={
                                            carrier.status === 'available' ? 'success' :
                                                carrier.status === 'in_route' ? 'primary' : 'warning'
                                        }
                                    />
                                </TableCell>
                                <TableCell>{carrier.userId.substring(0, 8)}</TableCell>
                                <TableCell>
                                    <IconButton
                                        color="primary"
                                        onClick={() => handleOpenVehicleDialog(carrier)}
                                        disabled={carrier.status === 'in_route'}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        color="error"
                                        onClick={() => handleDeleteVehicle(carrier.id)}
                                        disabled={carrier.status === 'in_route'}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                        {carriersDisplay.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={8} align="center">
                                    No hay vehículos registrados
                                </TableCell>
                            </TableRow>
                        )}
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
                                {carriers.length}
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
                                {carriersDisplay.filter(c => c.status === 'available').length}
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
                                {carriersDisplay.filter(c => c.status === 'in_route').length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Dialog open={vehicleDialogOpen} onClose={handleCloseVehicleDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {isEditingVehicle ? 'Editar Vehículo' : 'Agregar Nuevo Vehículo'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="ID de Conductor (userId)"
                                fullWidth
                                value={currentCarrier?.userId || ''}
                                onChange={(e) => handleVehicleChange('userId', e.target.value)}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Tipo</InputLabel>
                                <Select
                                    value={currentCarrier?.type || ''}
                                    label="Tipo"
                                    onChange={(e) => {
                                        handleVehicleChange('type', e.target.value);
                                        if (e.target.value === 'Truck') {
                                            handleVehicleChange('maxWeight', 5000);
                                        } else {
                                            handleVehicleChange('maxWeight', 1500);
                                        }
                                    }}
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
                                label="Peso Máximo (kg)"
                                type="number"
                                fullWidth
                                value={currentCarrier?.maxWeight || 0}
                                onChange={(e) => handleVehicleChange('maxWeight', parseInt(e.target.value))}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <TextField
                                label="Ítems Máximos"
                                type="number"
                                fullWidth
                                value={currentCarrier?.maxItems || 0}
                                onChange={(e) => handleVehicleChange('maxItems', parseInt(e.target.value))}
                            />
                        </Grid>
                        <Grid size={{ xs: 12, sm: 6 }}>
                            <FormControl fullWidth>
                                <InputLabel>Estado</InputLabel>
                                <Select
                                    value={currentCarrier?.status || 'available'}
                                    label="Estado"
                                    onChange={(e) => handleVehicleChange('status', e.target.value)}
                                >
                                    <MenuItem value="available">Disponible</MenuItem>
                                    <MenuItem value="maintenance">En mantenimiento</MenuItem>
                                </Select>
                            </FormControl>
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
                            !currentCarrier?.userId ||
                            !currentCarrier?.maxWeight ||
                            !currentCarrier?.maxItems ||
                            !currentCarrier?.type
                        }
                    >
                        Guardar
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};