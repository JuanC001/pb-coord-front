import React, { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { Address } from '../../types/address.types';
import { CustomSnackbar } from '../shared/CustomSnackbar';
import { Box, Button, Card, CardContent, Grid, Modal, Paper, TextField, Typography } from '@mui/material';
import { useOrders } from '../../hooks/useOrders';
import { useAuth } from '../../hooks/useAuth';
import { useLoadScript, Autocomplete } from '@react-google-maps/api';
import { getEnvVariables } from '../../utils/getEnvVariables';
import './CreateOrder.css'

const { VITE_GOOGLE_MAPS_API_KEY } = getEnvVariables();
const libraries: ("places")[] = ["places"];

interface OrderDimensions {
    length: number;
    width: number;
    height: number;
    weight: number;
}

interface OrderFormData {
    origin: string;
    destination: Address;
    dimensions: OrderDimensions;
}

interface CreateOrderProps {
    handleClose: () => void;
    refresh: () => void;
}

export const CreateOrder = ({ handleClose, refresh }: CreateOrderProps) => {

    const { createOrder, isLoading } = useOrders();
    const [open, setOpen] = useState(true);
    const { user } = useAuth();
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [addressSelected, setAddressSelected] = useState(false);

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: VITE_GOOGLE_MAPS_API_KEY,
        libraries
    });

    const [snackbar, setSnackbar] = React.useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const handleCloseSnackbar = () => {
        setSnackbar(prev => ({ ...prev, open: false }));
    };

    const { control, handleSubmit, formState: { errors }, reset, setValue } = useForm<OrderFormData>({
        defaultValues: {
            origin: '',
            destination: {
                city: '',
                country: '',
                address: '',
                postalCode: ''
            },
            dimensions: {
                length: 0,
                width: 0,
                height: 0,
                weight: 0
            }
        },
    });

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();

            if (place.formatted_address || place.place_id) {
                let city = '';
                let country = '';
                let postalCode = '';
                let fullAddress = place.formatted_address || '';

                if (place.address_components) {
                    for (const component of place.address_components) {
                        const componentType = component.types[0];

                        if (componentType === 'locality' || componentType === 'administrative_area_level_2') {
                            city = component.long_name;
                        }
                        else if (componentType === 'country') {
                            country = component.long_name;
                        }
                        else if (componentType === 'postal_code') {
                            postalCode = component.long_name;
                        }
                    }
                }

                setValue('destination.address', fullAddress);
                setValue('destination.city', city);
                setValue('destination.country', country);
                setValue('destination.postalCode', postalCode);

                setAddressSelected(true);
            }
        }
    };

    const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
        setAutocomplete(autocomplete);
    };

    const onSubmit: SubmitHandler<OrderFormData> = async (data) => {
        if (!addressSelected) {
            setSnackbar({
                open: true,
                message: 'Por favor seleccione una dirección de las sugerencias del autocompletado',
                severity: 'error'
            });
            return;
        }

        try {
            const success = await createOrder({
                ...data,
                userId: user?.uuid
            });

            if (success) {
                setSnackbar({
                    open: true,
                    message: 'Orden de envío creada exitosamente',
                    severity: 'success'
                });

                setOpen(false);
                reset();
                refresh();

                setTimeout(() => {
                    setSnackbar({
                        ...snackbar,
                        open: false
                    })
                }, 1500)

                setTimeout(() => {
                    handleClose();
                }, 2000);


            } else {
                setSnackbar({
                    open: true,
                    message: 'Error al crear la orden de envío',
                    severity: 'error'
                });
            }
        } catch (error) {
            console.error('Error al crear la orden:', error);
            setSnackbar({
                open: true,
                message: 'Error al crear la orden de envío',
                severity: 'error'
            });
        }
    };

    if (loadError) {
        return (
            <div>Error al cargar Google Maps: {loadError.message}</div>
        );
    }

    return (
        <>
            <Modal open={open} onClose={handleClose} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, width: '80vw', height: '80vh', overflowY: 'auto' }}>
                    <Typography variant="h4" component="h1" gutterBottom align="center">
                        Crear Nueva Orden de Envío
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 3 }}>
                        <Card variant="outlined" sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Información de Origen
                                </Typography>

                                <Controller
                                    name="origin"
                                    control={control}
                                    rules={{
                                        required: 'El origen es obligatorio',
                                        minLength: { value: 3, message: 'La dirección debe tener al menos 3 caracteres' }
                                    }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            fullWidth
                                            margin="normal"
                                            label="Dirección de Origen"
                                            error={!!errors.origin}
                                            helperText={errors.origin?.message || ''}
                                            required
                                        />
                                    )}
                                />
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Información de Destino
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12 }}>
                                        <Controller
                                            name="destination.address"
                                            control={control}
                                            rules={{
                                                required: 'La dirección es obligatoria',
                                                minLength: { value: 5, message: 'La dirección debe tener al menos 5 caracteres' }
                                            }}
                                            render={({ field }) => (
                                                isLoaded ? (
                                                    <Autocomplete
                                                        onLoad={onLoad}
                                                        onPlaceChanged={onPlaceChanged}
                                                        options={{
                                                            types: ['address'],
                                                            componentRestrictions: { country: ['co'] } // Países permitidos (ejemplo)
                                                        }}

                                                    >
                                                        <TextField
                                                            {...field}
                                                            fullWidth
                                                            margin="normal"
                                                            label="Dirección (comienza a escribir para autocompletar)"
                                                            error={!!errors.destination?.address}
                                                            helperText={errors.destination?.address?.message || ''}
                                                            required
                                                        />
                                                    </Autocomplete>
                                                ) : (
                                                    <TextField
                                                        {...field}
                                                        fullWidth
                                                        margin="normal"
                                                        label="Cargando autocompletado..."
                                                        disabled
                                                    />
                                                )
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="destination.city"
                                            control={control}
                                            rules={{
                                                required: 'La ciudad es obligatoria',
                                                minLength: { value: 2, message: 'La ciudad debe tener al menos 2 caracteres' }
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    margin="normal"
                                                    label="Ciudad"
                                                    error={!!errors.destination?.city}
                                                    helperText={errors.destination?.city?.message || ''}
                                                    required
                                                    disabled
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="destination.country"
                                            control={control}
                                            rules={{
                                                required: 'El país es obligatorio',
                                                minLength: { value: 2, message: 'El país debe tener al menos 2 caracteres' }
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    margin="normal"
                                                    label="País"
                                                    error={!!errors.destination?.country}
                                                    helperText={errors.destination?.country?.message || ''}
                                                    required
                                                    disabled
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, md: 6 }}>
                                        <Controller
                                            name="destination.postalCode"
                                            control={control}
                                            rules={{
                                                required: 'El código postal es obligatorio',
                                                pattern: {
                                                    value: /^[0-9]{4,10}$/,
                                                    message: 'El código postal debe tener entre 4 y 10 dígitos'
                                                }
                                            }}

                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    margin="normal"
                                                    label="Código Postal"
                                                    error={!!errors.destination?.postalCode}
                                                    helperText={errors.destination?.postalCode?.message || ''}
                                                    required
                                                    disabled
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Card variant="outlined" sx={{ mb: 4 }}>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Dimensiones y Peso del Paquete
                                </Typography>

                                <Grid container spacing={2}>
                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Controller
                                            name="dimensions.length"
                                            control={control}
                                            rules={{
                                                required: 'El largo es obligatorio',
                                                min: { value: 0.1, message: 'El largo debe ser mayor a 0' }
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    margin="normal"
                                                    label="Largo (cm)"
                                                    type="number"
                                                    inputProps={{ min: 0, step: 0.1 }}
                                                    error={!!errors.dimensions?.length}
                                                    helperText={errors.dimensions?.length?.message || ''}
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Controller
                                            name="dimensions.width"
                                            control={control}
                                            rules={{
                                                required: 'El ancho es obligatorio',
                                                min: { value: 0.1, message: 'El ancho debe ser mayor a 0' }
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    margin="normal"
                                                    label="Ancho (cm)"
                                                    type="number"
                                                    inputProps={{ min: 0, step: 0.1 }}
                                                    error={!!errors.dimensions?.width}
                                                    helperText={errors.dimensions?.width?.message || ''}
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Controller
                                            name="dimensions.height"
                                            control={control}
                                            rules={{
                                                required: 'El alto es obligatorio',
                                                min: { value: 0.1, message: 'El alto debe ser mayor a 0' }
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    margin="normal"
                                                    label="Alto (cm)"
                                                    type="number"
                                                    inputProps={{ min: 0, step: 0.1 }}
                                                    error={!!errors.dimensions?.height}
                                                    helperText={errors.dimensions?.height?.message || ''}
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>

                                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                        <Controller
                                            name="dimensions.weight"
                                            control={control}
                                            rules={{
                                                required: 'El peso es obligatorio',
                                                min: { value: 0.1, message: 'El peso debe ser mayor a 0' }
                                            }}
                                            render={({ field }) => (
                                                <TextField
                                                    {...field}
                                                    fullWidth
                                                    margin="normal"
                                                    label="Peso (kg)"
                                                    type="number"
                                                    inputProps={{ min: 0, step: 0.1 }}
                                                    error={!!errors.dimensions?.weight}
                                                    helperText={errors.dimensions?.weight?.message || ''}
                                                    required
                                                />
                                            )}
                                        />
                                    </Grid>
                                </Grid>
                            </CardContent>
                        </Card>

                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                size="large"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creando...' : 'Crear Orden de Envío'}
                            </Button>
                        </Box>
                    </Box>


                </Paper>
            </Modal>
            <CustomSnackbar
                handleCloseSnackbar={handleCloseSnackbar}
                snackbar={snackbar}
            />
        </>
    )
}
