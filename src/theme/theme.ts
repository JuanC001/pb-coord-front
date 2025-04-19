import { createTheme } from '@mui/material/styles';

const primaryColor = '#1063AC';
const secondaryColor = '#1063AC';
const tertiaryColor = '#F4F5F7';
const accentColor = '#4C9AFF';

export const theme = createTheme({
    palette: {
        primary: {
            main: primaryColor,
            light: '#3A80BD',
            dark: '#084A85',
            contrastText: '#FFFFFF',
        },
        secondary: {
            main: secondaryColor,
            light: '#3A80BD',
            dark: '#084A85',
            contrastText: '#FFFFFF',
        },
        background: {
            default: '#FFFFFF',
            paper: tertiaryColor,
        },
        info: {
            main: accentColor,
        },
    },
    typography: {
        fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontWeight: 700,
            fontSize: '2.5rem',
        },
        h2: {
            fontWeight: 600,
            fontSize: '2rem',
        },
        h3: {
            fontWeight: 600,
            fontSize: '1.75rem',
        },
        h4: {
            fontWeight: 600,
            fontSize: '1.5rem',
        },
        h5: {
            fontWeight: 500,
            fontSize: '1.25rem',
        },
        h6: {
            fontWeight: 500,
            fontSize: '1.1rem',
        },
        button: {
            textTransform: 'none',
        },
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    padding: '8px 16px',
                },
            },
        },
    },
});
