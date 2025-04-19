import { AppBar, Box, Button, IconButton, Menu, MenuItem, Toolbar, Typography } from '@mui/material'
import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';


export const Navbar = () => {


    const [isAdmin, setIsAdmin] = useState(true);
    const [adminMenuAnchor, setAdminMenuAnchor] = useState<null | HTMLElement>(null);
    const adminMenuOpen = Boolean(adminMenuAnchor);

    const handleAdminMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAdminMenuAnchor(event.currentTarget);
    };

    const handleAdminMenuClose = () => {
        setAdminMenuAnchor(null);
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <LocalShippingIcon sx={{ mr: 2 }} />
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    Coordinadora
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    <Button color="inherit" component={RouterLink} to="/">Inicio</Button>
                    <Button color="inherit" component={RouterLink} to="/envios">Envíos</Button>
                    <Button color="inherit" component={RouterLink} to="/seguimiento">Seguimiento</Button>
                    <Button color="inherit" component={RouterLink} to="/contacto">Contacto</Button>

                    {isAdmin && (
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
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    )
}
