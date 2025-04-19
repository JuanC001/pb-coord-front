import { Box, Button, CircularProgress, FormControl, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentTypes } from '../../constants/appConstants';
import { useState } from 'react';
import { CustomSnackbar } from '../shared/CustomSnackbar';

interface RegisterFormProps {
    firstName: string;
    lastName: string;
    documentType: string;
    documentNumber: string;
    phoneNumber: string;
    email: string;
    password: string;
    passwordConfirmation: string;
}

export const RegisterForm = () => {

    const { register: registerAuth, loading: isLoading } = useAuth();
    const { register, handleSubmit, reset, getValues, formState: {
        errors
    } } = useForm<RegisterFormProps>()

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    })

    const [passwordError, setPasswordError] = useState(false);

    const handleRegister: SubmitHandler<RegisterFormProps> = async (data: RegisterFormProps) => {
        try {
            const { ok, message } = await registerAuth(data);
            if (!ok) {
                if (message) {
                    setSnackbar({
                        open: true,
                        message: message,
                        severity: 'error'
                    });
                }
                return
            }

            setSnackbar({
                open: true,
                message: 'Usuario registrado correctamente',
                severity: 'success'
            });
            reset()

            window.location.reload();

        } catch (error) {
            console.error('Error al registrar el usuario:', error);
        }
    }

    return (
        <Box component={'form'} onSubmit={handleSubmit(handleRegister)}>
            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="firstName"
                        label="Nombre"
                        autoComplete="given-name"
                        {...register('firstName', {
                            required: 'Este campo es requerido',
                            minLength: {
                                value: 2,
                                message: 'El nombre debe tener al menos 2 caracteres'
                            }
                        })}
                        disabled={isLoading}
                        error={!!errors.firstName}
                        helperText={errors.firstName?.message}
                    />
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="lastName"
                        label="Apellido"
                        {...register('lastName', {
                            required: 'Este campo es requerido',
                            minLength: {
                                value: 2,
                                message: 'El apellido debe tener al menos 2 caracteres'
                            }
                        })}
                        autoComplete="family-name"
                        disabled={isLoading}
                        error={!!errors.lastName}
                        helperText={errors.lastName?.message}
                    />
                </Grid>
            </Grid>

            <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="document-type-label">Tipo de Documento</InputLabel>
                        <Select
                            labelId="document-type-label"
                            id="document-type"
                            label="Tipo de Documento"
                            disabled={isLoading}
                            {...register('documentType')}
                        >
                            {DocumentTypes.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="documentNumber"
                        label="Número de Documento"
                        {...register('documentNumber', {
                            required: 'Este campo es requerido',
                            minLength: {
                                value: 5,
                                message: 'El número de documento debe tener al menos 5 caracteres'
                            }
                        })}
                        disabled={isLoading}
                        error={!!errors.documentNumber}
                        helperText={errors.documentNumber?.message}
                    />
                </Grid>
            </Grid>
            <TextField
                margin="normal"
                required
                fullWidth
                label="Numero de Telefono"
                id="phoneNumber"
                type='number'
                {...register('phoneNumber', {
                    required: 'Este campo es requerido',
                    minLength: {
                        value: 10,
                        message: 'El número de teléfono debe tener al menos 10 caracteres'
                    }
                })}
                error={!!errors.phoneNumber}
                helperText={errors.phoneNumber?.message}
                disabled={isLoading}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                label="Correo Electrónico"
                type='email'
                {...register('email', {
                    required: 'Este campo es requerido',
                    pattern: {
                        value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                        message: 'El correo electrónico no es válido'
                    }
                })}
                disabled={isLoading}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                id="password"
                label="Contreseña"
                type='password'
                {...register('password', {
                    required: 'Este campo es requerido',
                    minLength: {
                        value: 6,
                        message: 'La contraseña debe tener al menos 6 caracteres'
                    }
                })}
                error={!!errors.password || passwordError}
                helperText={errors.password?.message || (passwordError ? 'Las contraseñas no coinciden' : '')}
                disabled={isLoading}
            />

            <TextField
                margin="normal"
                required
                fullWidth
                id="passworConfirmation"
                label="Confirmación de Contraseña"
                type='password'
                {...register('passwordConfirmation', {
                    required: 'Este campo es requerido',
                    validate: (value) => {
                        if (value !== getValues('password')) {
                            setPasswordError(true);
                            return 'Las contraseñas no coinciden';
                        }
                    }
                })}
                error={!!errors.passwordConfirmation || passwordError}
                helperText={errors.passwordConfirmation?.message || (passwordError ? 'Las contraseñas no coinciden' : '')}
                disabled={isLoading}
            />

            <Button type='submit' disabled={isLoading} variant='contained' fullWidth sx={{ my: 2 }}>
                {isLoading ?
                    <CircularProgress size={24} color="inherit" />
                    : 'Registrarse'

                }
            </Button>
            <CustomSnackbar
                snackbar={snackbar}
                handleCloseSnackbar={() => setSnackbar({
                    ...snackbar,
                    open: false
                })}

            />
        </Box >
    )
}
