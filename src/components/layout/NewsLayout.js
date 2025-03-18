import React from 'react';
import { Grid, Box, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Sidebar from './Sidebar';

const NewsLayout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Container 
      maxWidth="lg" 
      sx={{ 
        mt: 3,
        pl: { xs: 3, md: 0 }, // Remove left padding on desktop
        pr: { xs: 3, md: 3 },
        maxWidth: '100% !important'
      }}
    >
      <Grid container spacing={3}>
        {/* Sidebar on the left */}
        <Grid 
          item 
          xs={12} 
          md={3} 
          lg={3} 
          order={{ xs: 2, md: 1 }}
          sx={{ 
            pl: { md: 0 }, // Remove padding from the grid item
            pr: { md: 2 }
          }}
        >
          <Sidebar />
        </Grid>
        
        {/* Main content on the right */}
        <Grid 
          item 
          xs={12} 
          md={9} 
          lg={9} 
          order={{ xs: 1, md: 2 }}
        >
          {children}
        </Grid>
      </Grid>
    </Container>
  );
};

export default NewsLayout; 