import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Box } from '@mui/material';
import HomePage from './pages/HomePage';
import TrendingPage from './pages/TrendingPage';
import SavedPage from './pages/SavedPage';
import SettingsPage from './pages/SettingsPage';
import './App.css';
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Custom event listener for sidebar toggle
  useEffect(() => {
    const handleSidebarToggle = (e) => {
      if (e.detail) {
        setSidebarOpen(e.detail.isOpen);
        if (typeof e.detail.collapsed !== 'undefined') {
          setSidebarCollapsed(e.detail.collapsed);
        }
      }
    };

    window.addEventListener('sidebarToggle', handleSidebarToggle);
    return () => {
      window.removeEventListener('sidebarToggle', handleSidebarToggle);
    };
  }, []);

  // Calculate sidebar width based on state
  const getSidebarWidth = () => {
    if (!sidebarOpen) return 0;
    return sidebarCollapsed ? 64 : 240;
  };

  return (
    <Router>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App">
          <Navbar />
          <Box sx={{ 
            display: 'flex', 
            backgroundColor: '#121212', 
            minHeight: '100vh', 
            color: 'white',
            paddingTop: '64px',
            transition: 'all 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
            position: 'relative',
            overflow: 'visible'
          }}>
            <Sidebar />
            <Box component="main" sx={{ 
              flexGrow: 1, 
              p: { xs: 1, sm: 2, md: 3 },
              pl: { xs: 2, sm: 3, md: 4 },
              ml: sidebarCollapsed ? 8 : 30,
              width: '100%',
              transition: 'margin-left 0.4s cubic-bezier(0.25, 0.1, 0.25, 1)',
              paddingTop: 1,
              overflow: 'visible',
              position: 'relative'
            }}>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/trending" element={<TrendingPage />} />
                <Route path="/news" element={<HomePage />} />
                <Route path="/sports" element={<HomePage category="sports" />} />
                <Route path="/entertainment" element={<HomePage category="entertainment" />} />
                <Route path="/education" element={<HomePage category="education" />} />
                <Route path="/foods-drinks" element={<HomePage category="food" />} />
                <Route path="/science" element={<HomePage category="science" />} />
                <Route path="/music" element={<HomePage category="music" />} />
                <Route path="/nature" element={<HomePage category="nature" />} />
                <Route path="/travel" element={<HomePage category="travel" />} />
                <Route path="/saved" element={<SavedPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="*" element={<HomePage />} />
              </Routes>
            </Box>
          </Box>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
