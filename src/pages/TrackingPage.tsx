import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, Box, Paper, TextField, Button, Stepper, Step, StepLabel, Grid, Card, CardContent, Divider } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

interface TrackingResult {
    trackingNumber: string;
    status: string;
    origin: string;
    destination: string;
    currentStep: number;
    estimatedDelivery: string;
    lastUpdate: string;
    client: string;
    weight: string;
}

export const TrackingPage = () => {
    const { trackingNumber: urlTrackingNumber } = useParams<{ trackingNumber?: string }>();
    const navigate = useNavigate();
    const [trackingNumber, setTrackingNumber] = useState<string>(urlTrackingNumber || '');
    const [trackingResult, setTrackingResult] = useState<TrackingResult | null>(null);
    const [searching, setSearching] = useState<boolean>(false);

    useEffect(() => {
        if (urlTrackingNumber && urlTrackingNumber.trim()) {
            setTrackingNumber(urlTrackingNumber);
            handleTracking(urlTrackingNumber);
        }
    }, [urlTrackingNumber]);

    const handleTracking = (trackingNum = trackingNumber) => {
        if (!trackingNum.trim()) return;

        setSearching(true);

        if (trackingNum !== urlTrackingNumber) {
            navigate(`/seguimiento/${trackingNum}`);
        }

        setTimeout(() => {
            const mockResult: TrackingResult = {
                trackingNumber: trackingNum,
                status: 'En tránsito',
                origin: 'Bogotá, Colombia',
                destination: 'Medellín, Colombia',
                currentStep: 2,
                estimatedDelivery: '20 de Abril, 2025',
                lastUpdate: '18 de Abril, 2025 - 10:30 AM',
                client: 'Juan Pérez',
                weight: '2.5 kg'
            };

            setTrackingResult(mockResult);
            setSearching(false);
        }, 1500);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        handleTracking();
    };

    const steps = ['Recogido', 'En tránsito', 'En ciudad destino', 'Entregado'];

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
                                disabled={searching || !trackingNumber.trim()}
                                type="submit"
                            >
                                {searching ? 'Buscando...' : 'Rastrear Envío'}
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {trackingResult && (
                <Box sx={{ mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Resultado del Seguimiento
                    </Typography>

                    <Card sx={{ mb: 4 }} elevation={3}>
                        <CardContent>
                            <Typography variant="h6" color="primary" gutterBottom>
                                Estado: {trackingResult.status}
                            </Typography>

                            <Grid container spacing={2}>
                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Número de Guía:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {trackingResult.trackingNumber}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Última Actualización:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {trackingResult.lastUpdate}
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
                                        {trackingResult.origin}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Destino:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {trackingResult.destination}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Cliente:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {trackingResult.client}
                                    </Typography>
                                </Grid>

                                <Grid size={{ xs: 12, md: 6 }}>
                                    <Typography variant="body2" color="textSecondary">
                                        Peso:
                                    </Typography>
                                    <Typography variant="body1" gutterBottom>
                                        {trackingResult.weight}
                                    </Typography>
                                </Grid>

                                <Grid size={12}>
                                    <Typography variant="body2" color="textSecondary">
                                        Entrega Estimada:
                                    </Typography>
                                    <Typography variant="body1" color="secondary" fontWeight="bold">
                                        {trackingResult.estimatedDelivery}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    <Typography variant="h6" gutterBottom>
                        Progreso del Envío
                    </Typography>
                    <Paper sx={{ p: 3 }} elevation={2}>
                        <Stepper activeStep={trackingResult.currentStep} alternativeLabel>
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