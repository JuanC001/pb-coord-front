import { Typography, Box, Paper, Grid, Button } from '@mui/material';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import MapIcon from '@mui/icons-material/Map';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { Link as RouterLink } from 'react-router-dom';

export const HomePage = () => {
    return (
        <Box>
            <Paper
                sx={{
                    py: 8,
                    px: 4,
                    mb: 6,
                    bgcolor: 'primary.main',
                    color: 'primary.contrastText',
                    borderRadius: 2,
                    backgroundImage: 'linear-gradient(45deg, #1063AC 30%, #3A80BD 90%)',
                }}
                elevation={3}
            >
                <Grid container spacing={4} alignItems="center">
                    <Grid size={{ xs: 12, md: 6 }}>
                        <Typography variant="h2" component="h1" gutterBottom>
                            Envíos Seguros y Rápidos con Coordinadora
                        </Typography>
                        <Typography variant="h5" paragraph>
                            Soluciones logísticas para empresas y personas
                        </Typography>
                        <Button
                            variant="contained"
                            color="secondary"
                            size="large"
                            component={RouterLink}
                            to="/my-orders"
                            sx={{ mt: 2 }}
                        >
                            Realizar un envío
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 12, md: 6 }} sx={{ textAlign: 'center' }}>
                        <Box
                            component="img"
                            src="/src/assets/images/shipping-illustration.png"
                            alt="Servicio de envíos"
                            sx={{
                                maxWidth: '100%',
                                height: 'auto',
                                display: { xs: 'none', md: 'block' }
                            }}
                        />
                    </Grid>
                </Grid>
            </Paper>

            <Typography variant="h4" component="h2" gutterBottom sx={{ mb: 4 }}>
                Nuestros Servicios
            </Typography>

            <Grid container spacing={4}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <LocalShippingIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" component="h3" gutterBottom>
                                Envíos Nacionales
                            </Typography>
                            <Typography>
                                Contamos con cobertura en todo el territorio nacional con los tiempos de entrega más competitivos del mercado.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <MapIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" component="h3" gutterBottom>
                                Seguimiento en Tiempo Real
                            </Typography>
                            <Typography>
                                Realiza seguimiento de tus envíos en tiempo real y recibe notificaciones sobre el estado de tu paquete.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Paper sx={{ p: 3, height: '100%' }} elevation={2}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                            <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
                            <Typography variant="h5" component="h3" gutterBottom>
                                Atención Personalizada
                            </Typography>
                            <Typography>
                                Nuestro equipo de atención al cliente está disponible para ayudarte con cualquier consulta o necesidad.
                            </Typography>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>

            <Paper sx={{ p: 4, mt: 6, bgcolor: 'secondary.main', color: 'secondary.contrastText', borderRadius: 2 }} elevation={3}>
                <Grid container spacing={2} alignItems="center">
                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h4" component="h2" gutterBottom>
                            ¿Listo para enviar tu paquete?
                        </Typography>
                        <Typography variant="body1">
                            Empieza a usar nuestros servicios de envío hoy mismo y experimenta la diferencia.
                        </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, md: 4 }} sx={{ textAlign: { xs: 'left', md: 'right' } }}>
                        <Button
                            variant="contained"
                            color="primary"
                            size="large"
                            component={RouterLink}
                            to="/envios"
                            sx={{ mt: { xs: 2, md: 0 } }}
                        >
                            Comenzar
                        </Button>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};