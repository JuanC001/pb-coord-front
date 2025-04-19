import { Alert, Snackbar } from '@mui/material'
import React from 'react'

interface SnackbarProps {
    snackbar: {
        open: boolean
        message: string
        severity: 'success' | 'error' | 'warning' | 'info'
    }
    handleCloseSnackbar: () => void
}

export const CustomSnackbar = ({ snackbar, handleCloseSnackbar }: SnackbarProps) => {
    return (
        <Snackbar
            open={snackbar.open}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                {snackbar.message}
            </Alert>
        </Snackbar>
    )
}
