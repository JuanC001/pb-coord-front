import { Container, Typography } from '@mui/material'
import React from 'react'

export const Footer = () => {
    return (
        <Container>
            <Typography variant="body2" color="text.secondary" align="center">
                © {new Date().getFullYear()} Coordinadora - Prueba técnica
            </Typography>
        </Container>
    )
}
