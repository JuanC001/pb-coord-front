import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../constants/appConstants';


export const Navbar = () => {


    const { loading: authLoading, isAuthenticated } = useAuth();
    const navigate = useNavigate();


    return (
        <AppBar position="static" sx={{ bgcolor: 'primary.light', px: 4 }}>
            <Toolbar>
                <Box sx={{ flexGrow: 1 }}>
                    <Box component={'img'} onClick={() => navigate('/')}
                        sx={{ cursor: 'pointer' }}
                        src='https://coordinadora.com/wp-content/uploads/2023/03/logo-coordinadora.svg'>
                    </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={RouterLink} to="/">Inicio</Button>
                    <Button color="inherit" component={RouterLink} to="/seguimiento">Seguimiento</Button>
                    <Button color="inherit" component={RouterLink} to="/contacto">Contacto</Button>

                    {authLoading === false && isAuthenticated && <ProtectedMenu />}
                    {authLoading === false && !isAuthenticated && <>
                        <Button color="inherit" component={RouterLink} to="/sign-in">Iniciar Sesión</Button>
                    </>}

                </Box>
            </Toolbar>
        </AppBar>
    )
}

export const ProtectedMenu = () => {

    const { logout, user } = useAuth();

    const handleLogout = () => {
        logout();
    };

    const [adminMenuAnchor, setAdminMenuAnchor] = useState<null | HTMLElement>(null);
    const adminMenuOpen = Boolean(adminMenuAnchor);

    const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAdminMenuAnchor(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAdminMenuAnchor(null);
    };

    return (
        <Box sx={{ display: 'flex', gap: 2 }}>
            {
                (user?.role === UserRole.CUSTOMER || user?.role === UserRole.ADMIN) &&
                <>
                    <Button color="inherit" component={RouterLink} to="/envios">Envíos</Button>
                    <Button color="inherit" component={RouterLink} to="/my-orders">Ordenes</Button>
                </>

            }

            {
                user?.role === UserRole.COURRIER &&
                <Button color="inherit" component={RouterLink} to="/courrier/dashboard">Dashboard</Button>
            }



            <Button color="inherit" onClick={handleLogout}>Cerrar Sesión</Button>
            {user?.role === UserRole.ADMIN &&
                <Box>
                    <IconButton
                        color="inherit"
                        onClick={handleAdminMenuOpen}
                        aria-controls={adminMenuOpen ? 'admin-menu' : undefined}
                        aria-haspopup="true"
                        aria-expanded={adminMenuOpen ? 'true' : undefined}
                        title="Administración"
                    >
                        <AdminPanelSettingsIcon />
                    </IconButton>
                    <Menu
                        id="admin-menu"
                        anchorEl={adminMenuAnchor}
                        open={adminMenuOpen}
                        onClose={handleAdminMenuClose}
                    >
                        <MenuItem
                            onClick={handleAdminMenuClose}
                            component={RouterLink}
                            to="/admin/dashboard"
                        >
                            Dashboard de Administrador
                        </MenuItem>
                    </Menu>
                </Box>
            }
        </Box>
    )

}