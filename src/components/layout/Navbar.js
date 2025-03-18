import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, Container } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { FaGlobe, FaSearch, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/logo.svg';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Analyze', path: '/analyze' },
    { title: 'News', path: '/news' },
    { title: 'About', path: '/about' },
    { title: 'Contact', path: '/contact' },
  ];

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const drawer = (
    <Box sx={{ 
      width: 250, 
      height: '100%',
      background: 'linear-gradient(135deg, #1a1a1a 0%, #222222 100%)',
      color: 'white',
      p: 2
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Link to="/">
          <img src={logo} alt="FNA.ai Logo" className="navbar-logo" />
        </Link>
        <IconButton onClick={handleDrawerToggle} sx={{ color: 'white' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        {navItems.map((item) => (
          <ListItem 
            key={item.title} 
            component={Link} 
            to={item.path}
            sx={{ 
              mb: 1, 
              borderRadius: '8px',
              '&:hover': {
                background: 'rgba(124, 77, 255, 0.1)',
              }
            }}
          >
            <ListItemText 
              primary={item.title} 
              sx={{ 
                color: 'white',
                '& .MuiTypography-root': {
                  fontWeight: 500
                }
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ 
      backgroundColor: 'rgba(26,26,26,0.8)', 
      backdropFilter: 'blur(10px)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    }}>
      <Container>
        <Toolbar sx={{ py: 1, px: { xs: 1, sm: 2 } }}>
          <Box sx={{ flexGrow: 1 }}>
            <Link to="/">
              <img src={logo} alt="FNA.ai Logo" className="navbar-logo" />
            </Link>
          </Box>

          {isMobile ? (
            <>
              <IconButton 
                color="inherit" 
                aria-label="open drawer" 
                edge="start" 
                onClick={handleDrawerToggle}
                sx={{ ml: 2 }}
              >
                <MenuIcon />
              </IconButton>
              
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true // Better mobile performance
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <>
              <Box sx={{ display: 'flex', gap: 2 }}>
                {navItems.map((item) => (
                  <Button 
                    key={item.title} 
                    component={Link} 
                    to={item.path}
                    sx={{ 
                      color: 'white',
                      fontWeight: 500,
                      textTransform: 'none',
                      fontSize: '0.95rem',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.05)'
                      }
                    }}
                  >
                    {item.title}
                  </Button>
                ))}
              </Box>
              
              <Box sx={{ display: 'flex', gap: 2, ml: 3 }}>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <FaSearch />
                </IconButton>
                <IconButton size="small" sx={{ color: 'white' }}>
                  <FaUser />
                </IconButton>
              </Box>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
