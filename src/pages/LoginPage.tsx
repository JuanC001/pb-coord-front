import { useState } from 'react';
import { Container, Box, Typography, Grid, Paper, Link, Avatar } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

import { LoginForm } from '../components/login/LoginForm';
import { RegisterForm } from '../components/login/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

export const LoginPage = () => {

    const [isLogin, setIsLogin] = useState(true);
    const { isAuthenticated } = useAuth();

    const toggleMode = () => {
        setIsLogin(!isLogin);
    };

    if (isAuthenticated) {
        window.location.href = '/';
    }

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    {isLogin ? <LockOutlinedIcon /> : <PersonAddIcon />}
                </Avatar>
                <Typography component="h1" variant="h5">
                    {isLogin ? 'Iniciar Sesión' : 'Registrarse'}
                </Typography>

                <Paper elevation={3} sx={{ p: 4, mt: 3, width: '100%' }}>
                    <Box sx={{ mt: 1 }}>
                        <Box>
                            {isLogin ? <LoginForm /> : <RegisterForm />}
                        </Box>
                        <Grid container sx={{ justifyContent: "center" }}>
                            <Grid>
                                <Link
                                    component="button"
                                    variant="body2"
                                    onClick={toggleMode}
                                    sx={{ cursor: 'pointer' }}
                                    underline="hover"
                                >
                                    {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Paper>
            </Box>

        </Container>
    );
};
