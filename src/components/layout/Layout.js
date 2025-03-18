import React from 'react';
import { Box, Grid, Container, useMediaQuery, useTheme } from '@mui/material';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import './Layout.css';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#121212' }}>
      {/* Navbar */}
      <Navbar />
      
      {/* Main Content */}
      <Container maxWidth="xl" sx={{ flexGrow: 1, py: 3 }}>
        <Grid container spacing={2}>
          {/* Sidebar */}
          <Grid 
            item 
            xs={12} 
            sm={3} 
            md={2} 
            lg={2} 
            sx={{ 
              display: 'flex',
              position: 'relative', 
              mb: isMobile ? '60px' : 0 // Add bottom margin on mobile for the fixed sidebar
            }}
          >
            <Sidebar />
          </Grid>
          
          {/* Main Content */}
          <Grid item xs={12} sm={9} md={10} lg={10}>
            <Box 
              sx={{ 
                bgcolor: '#1A1A1A', 
                borderRadius: '8px', 
                p: 3, 
                mb: 3,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)'
              }}
            >
              {children}
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Layout; 