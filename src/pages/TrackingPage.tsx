import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, TextField, Button, Stepper, Step, StepLabel, Grid, Card, CardContent, Divider, Alert } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useShipments } from '../hooks/useShipments';
import { ShipmentProvider } from '../contexts/ShipmentContext';
import { ShipmentStatus } from '../constants/appConstants';

const TrackingPageContent = () => {
    const { trackingNumber: urlTrackingNumber } = useParams<{ trackingNumber?: string }>();
    const navigate = useNavigate();
    const [trackingNumber, setTrackingNumber] = useState<string>(urlTrackingNumber || '');

    const { currentShipment, isLoading, error, getShipmentsByTrackingNumber } = useShipments();

    useEffect(() => {
        if (urlTrackingNumber && urlTrackingNumber.trim()) {
            setTrackingNumber(urlTrackingNumber);
            handleTracking(urlTrackingNumber);
        }
    }, [urlTrackingNumber]);

    useEffect(() => {
        console.log('currentShipment', currentShipment);
    }, [currentShipment]);

    const handleTracking = (trackingNum = trackingNumber) => {
        if (!trackingNum.trim()) return;

        if (trackingNum !== urlTrackingNumber) {
            navigate(`/seguimiento/${trackingNum}`);
        }

        getShipmentsByTrackingNumber(trackingNum);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleTracking();
    };

    const mapShipmentStatus = (status?: ShipmentStatus): string => {
        if (!status) return 'Desconocido';

        switch (status) {
            case ShipmentStatus.PENDING:
                return 'Pendiente';
            case ShipmentStatus.IN_TRANSIT:
                return 'En tránsito';
            case ShipmentStatus.DELIVERED:
                return 'Entregado';
            default:
                return 'Desconocido';
        }
    };

    const getStepFromStatus = (status?: ShipmentStatus): number => {
        if (!status) return 0;

        switch (status) {
            case ShipmentStatus.PENDING:
                return 0;
            case ShipmentStatus.IN_TRANSIT:
                return 1;
            case ShipmentStatus.DELIVERED:
                return 3;
            default:
                return 0;
        }
    };

    const steps = ['Recogido', 'En tránsito', 'En ciudad destino', 'Entregado'];

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-CO', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <Box>
            <Typography variant="h4" component="h1" gutterBottom>
                Seguimiento de Envíos
            </Typography>
            <Typography variant="body1">
                Ingresa tu número de guía para rastrear tu envío con Coordinadora
            </Typography>

            <Paper sx={{ p: 3, mb: 4 }} elevation={2}>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={2} alignItems="center">
                        <Grid size={{ xs: 12, md: 8 }}>
                            <TextField
                                fullWidth
                                label="Número de Guía"
                                variant="outlined"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                                placeholder="Ej: CO12345678"
                            />
                        </Grid>
                        <Grid size={{ xs: 12, md: 4 }}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                size="large"
                                startIcon={<SearchIcon />}
                                onClick={() => handleTracking()}
                                disabled={isLoading || !trackingNumber.trim()}
                                type="submit"
                            >
                                {isLoading ? 'Buscando...' : 'Rastrear Envío'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {currentShipment && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Resultado del Seguimiento
                    </Typography>

                    <Card sx={{ mb: 4 }} elevation={3}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Estado: {mapShipmentStatus(currentShipment.status)}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Número de Guía:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {currentShipment.trackingNumber || 'No disponible'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Última Actualización:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {formatDate(currentShipment.updatedAt?.toString())}
                                    </Typography>
                                </Grid>

                                <Grid size={12}>
                                    <Divider sx={{ my: 2 }} />
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Origen:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {(currentShipment as any).origin || 'No disponible'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Destino:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {(currentShipment as any).destination?.city || 'No disponible'},
                                        {(currentShipment as any).destination?.country || ''}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Dirección de destino:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {(currentShipment as any).destination?.address || 'No disponible'}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Peso:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {(currentShipment as any).dimensions?.weight ? `${(currentShipment as any).dimensions.weight} kg` : 'No disponible'}
                                    </Typography>
                                </Grid>

                                <Grid size={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Ruta:
                                    </Typography>
                                    <Typography variant="body1" color="secondary" fontWeight="bold">
                                        {(currentShipment as any).routeName || 'No disponible'}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" gutterBottom>
                        Progreso del Envío
                    </Typography>
                    <Paper sx={{ p: 3 }} elevation={2}>
                        <Stepper activeStep={getStepFromStatus(currentShipment.status)} alternativeLabel>
                            {steps.map((label) => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Paper>
                </Box>
            )}

            <Paper sx={{ p: 3, mt: 4, bgcolor: 'background.paper' }} elevation={1}>
                <Typography variant="h6" gutterBottom>
                    Información de Seguimiento
                </Typography>
                <Typography variant="body2" paragraph>
                    Recuerda que puedes rastrear tus envíos usando el número de guía proporcionado en tu factura o correo electrónico.
                </Typography>
                <Typography variant="body2">
                    Si tienes problemas para rastrear tu envío o necesitas ayuda adicional, comunícate con nuestro servicio al cliente al 01 8000 123 456.
                </Typography>
            </Paper>
        </Box>
    );
};

export const TrackingPage = () => {
    return (
        <ShipmentProvider>
            <TrackingPageContent />
        </ShipmentProvider>
    );
};