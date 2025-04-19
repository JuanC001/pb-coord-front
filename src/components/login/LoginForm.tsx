import { Box, Button, CircularProgress, TextField } from '@mui/material'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useAuth } from '../../contexts/AuthContext';
import Swal from 'sweetalert2';
import { CustomSnackbar } from '../shared/CustomSnackbar';
import { useState } from 'react';

interface LoginFormProps {
    email: string;
    password: string;
}

export const LoginForm = () => {

    
    const { login: loginAuth, loading: isLoading } = useAuth();
    const { register, handleSubmit } = useForm<LoginFormProps>()

    const [snackbar, setSnackbar] = useState({
        open: false,
        message: '',
        severity: 'success' as 'success' | 'error'
    });

    const handleLogin: SubmitHandler<LoginFormProps> = async (data) => {

        try {
            const success = await loginAuth(data.email, data.password);
            if (!success) {
                console.error('Error al iniciar sesión');
                setSnackbar({
                    open: true,
                    message: 'Error al iniciar sesión',
                    severity: 'error'
                });
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Error al iniciar sesión',
                severity: 'error'
            });
        }

    }

    return (
        <Box sx={{ mt: 1 }}>
            <form onSubmit={handleSubmit(handleLogin)}>
                <TextField
                    margin="normal"
                    required
                    fullWidth
                    id="email"
                    label="Correo Electrónico"
                    type='email'
                    {...register('email')}
                    autoFocus={true}
                    disabled={isLoading}
                />

                <TextField
                    margin="normal"
                    required
                    fullWidth
                    label="Contraseña"
                    type="password"
                    id="password"
                    autoComplete='current-password'
                    {...register('password')}
                    disabled={isLoading}
                />
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : 'Iniciar Sesión'}
                </Button>
            </form>
            <CustomSnackbar
                snackbar={snackbar}
                handleCloseSnackbar={() => setSnackbar({
                    ...snackbar,
                    open: false
                })}
            />
        </Box>
    )
}
