import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Typography, Box } from '@mui/material';
import NewsList from './components/NewsList';
import Navbar from './components/layout/Navbar';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#7C4DFF',
    },
    secondary: {
      main: '#00E5FF',
    },
    background: {
      default: '#171717',
      paper: '#222222',
    },
    text: {
      primary: '#ffffff',
      secondary: 'rgba(255, 255, 255, 0.7)',
    }
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      color: '#ffffff',
      marginBottom: '1.5rem',
      paddingLeft: '8px',
      background: 'linear-gradient(90deg, #7C4DFF 0%, #00E5FF 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h6: {
      fontWeight: 600,
      fontSize: '1rem',
      lineHeight: 1.2,
    },
    body2: {
      fontSize: '0.85rem',
      lineHeight: 1.4,
    },
    subtitle2: {
      fontWeight: 600,
      fontSize: '0.8rem',
    },
    caption: {
      fontSize: '0.75rem',
    }
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#222222',
          borderRadius: '12px',
          transition: 'transform 0.3s ease',
          overflow: 'hidden',
          border: '1px solid rgba(255, 255, 255, 0.05)',
        },
      },
    },
    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '16px',
          '&:last-child': {
            paddingBottom: '16px',
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
        },
      },
    },
  },
});

function App() {
  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Navbar />
        <Box sx={{ 
          minHeight: '100vh', 
          bgcolor: '#1a1a1a', 
          py: 4,
          backgroundImage: 'url(/images/background.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            backgroundColor: 'rgba(23, 23, 23, 0.85)',
            zIndex: -1,
          },
          position: 'relative',
          zIndex: 0,
        }}>
          <Container maxWidth="lg">
            <Routes>
              <Route path="/" element={
                <>
                 
                  <NewsList />
                </>
              } />
              <Route path="/news" element={
                <>
                  <Typography variant="h1" component="h1">
                    News History
                  </Typography>
                  <NewsList />
                </>
              } />
              <Route path="/analyze" element={
                <Typography variant="h1" component="h1">
                  Analyze Media
                </Typography>
              } />
              <Route path="/about" element={
                <Typography variant="h1" component="h1">
                  About FNA.ai
                </Typography>
              } />
              <Route path="/contact" element={
                <Typography variant="h1" component="h1">
                  Contact Us
                </Typography>
              } />
            </Routes>
          </Container>
        </Box>
      </ThemeProvider>
    </Router>
  );
}

export default App;
