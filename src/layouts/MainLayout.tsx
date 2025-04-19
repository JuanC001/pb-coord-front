import { ReactNode } from 'react';
import { Container, Box } from '@mui/material';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

      <Navbar />

      <Container component="main" sx={{ flexGrow: 1, py: 4 }}>
        {children}
      </Container>

      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper', borderTop: 1, borderColor: 'divider' }}>
        <Footer />
      </Box>
    </Box>
  );
};

export default MainLayout;