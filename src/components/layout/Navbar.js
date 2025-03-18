import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, InputBase, Button, Box, useMediaQuery, IconButton, Drawer, List, ListItem, ListItemText, Badge, Tooltip, Divider } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { FaSearch, FaBell, FaRegSun, FaMoon } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/logo.svg';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { title: 'Home', path: '/' },
    { title: 'Popular', path: '/trending' },
    { title: 'News', path: '/news' },
    { title: 'About', path: 'https://fnaai-l.vercel.app/' },
    { title: 'Contact', path: '/contact' },
  ];

  // Listen for scroll to add shadow and background opacity
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleToggleDarkMode = () => {
    setDarkMode(!darkMode);
    // In a real app, this would trigger the theme change
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      // Navigate to trending page with search query
      navigate(`/trending?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const drawer = (
    <Box sx={{ 
      width: 280, 
      height: '100%',
      background: 'linear-gradient(145deg, #1a1a1a 0%, #222222 100%)',
      color: 'white',
      p: 2,
      overflow: 'hidden'
    }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Link to="/" className="logo-link">
          <img src={logo} alt="FNA.ai Logo" className="navbar-logo" />
        </Link>
        <IconButton onClick={handleDrawerToggle} className="close-button">
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box className="mobile-search" sx={{ mb: 3 }}>
        <Box
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            borderRadius: '20px',
            backgroundColor: 'rgba(255,255,255,0.1)',
            padding: '2px 16px',
            transition: 'all 0.3s ease',
            border: '1px solid rgba(255,255,255,0.05)',
            '&:focus-within': {
              backgroundColor: 'rgba(255,255,255,0.15)',
              boxShadow: '0 0 0 2px rgba(124, 77, 255, 0.3)',
            }
          }}
        >
          <FaSearch style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }} />
          <InputBase
            placeholder="Search News"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            sx={{
              color: 'white',
              width: '100%',
              '& input': {
                padding: '10px 0',
              }
            }}
          />
        </Box>
      </Box>
      
      <List sx={{ 
        '& .MuiListItem-root': {
          borderRadius: '8px',
          mb: 1.5,
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: '4px',
            backgroundColor: '#7C4DFF',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            borderRadius: '0 4px 4px 0',
          },
          '&:hover': {
            backgroundColor: 'rgba(255,255,255,0.1)',
            transform: 'translateY(-2px)',
            '&::before': {
              opacity: 0.7,
            }
          },
          '&.active-nav-item': {
            backgroundColor: 'rgba(124, 77, 255, 0.15)',
            '&::before': {
              opacity: 1,
            }
          }
        } 
      }}>
        {navItems.map((item) => (
          <ListItem 
            key={item.title} 
            component={item.title === 'About' ? 'a' : Link} 
            href={item.title === 'About' ? 'https://fnaai-l.vercel.app/' : undefined}
            to={item.title !== 'About' ? item.path : undefined}
            target={item.title === 'About' ? '_blank' : undefined}
            rel={item.title === 'About' ? 'noopener noreferrer' : undefined}
            className={isActive(item.path) ? 'active-nav-item' : ''}
            sx={{ padding: '10px 16px' }}
            onClick={handleDrawerToggle}
          >
            <ListItemText 
              primary={item.title} 
              sx={{ 
                color: 'white',
                '& .MuiTypography-root': {
                  fontWeight: isActive(item.path) ? 600 : 400,
                  fontSize: '1rem',
                  transition: 'font-weight 0.3s ease',
                }
              }} 
            />
          </ListItem>
        ))}

        <Box sx={{ mt: 3, mb: 2 }}>
          <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)' }} />
        </Box>

        <ListItem 
          button
          onClick={handleToggleDarkMode}
          sx={{ 
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 16px'
          }}
        >
          <ListItemText 
            primary="Dark Mode" 
            sx={{ 
              color: 'white',
              '& .MuiTypography-root': {
                fontWeight: 400,
                fontSize: '1rem'
              }
            }} 
          />
          {darkMode ? <FaMoon color="#7C4DFF" /> : <FaRegSun color="#7C4DFF" />}
        </ListItem>
      </List>

      <Box sx={{ position: 'absolute', bottom: 16, left: 0, right: 0, px: 3 }}>
        <Button 
          variant="contained"
          fullWidth
          sx={{ 
            backgroundColor: '#7C4DFF',
            fontWeight: 600,
            borderRadius: '8px',
            textTransform: 'none',
            py: 1.2,
            boxShadow: '0 4px 12px rgba(124, 77, 255, 0.3)',
            '&:hover': {
              backgroundColor: '#6a3de8',
              transform: 'translateY(-2px)',
              boxShadow: '0 6px 16px rgba(124, 77, 255, 0.4)',
            }
          }}
        >
          Log In
        </Button>
      </Box>
    </Box>
  );

    return (
    <AppBar 
      position="fixed" 
      className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}
      sx={{ 
        backgroundColor: scrolled ? 'rgba(24,24,24,0.95)' : 'rgba(26,26,26,0.8)', 
        backdropFilter: 'blur(10px)',
        boxShadow: scrolled ? '0 4px 20px rgba(0,0,0,0.2)' : '0 4px 20px rgba(0,0,0,0.1)',
        borderBottom: '1px solid rgba(255,255,255,0.05)',
        width: '100%',
        left: 0,
        right: 0,
        top: 0,
        margin: 0,
        padding: 0,
        zIndex: 1300,
        transition: 'background-color 0.3s ease, box-shadow 0.3s ease',
      }}
    >
      <Toolbar sx={{ 
        py: 1, 
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '100%',
        px: { xs: 2, sm: 3, md: 4 },
      }}>
        {/* Logo on left */}
        <Box sx={{ display: 'flex', alignItems: 'center', width: isMobile ? '30%' : '20%', ml: { xs: 7, sm: 8 } }}>
          <Link to="/" className="logo-link">
            <img src={logo} alt="FNA.ai Logo" className="navbar-logo" />
          </Link>
        </Box>

        {/* Search in center - hidden on mobile */}
        {!isMobile && (
          <Box 
            sx={{ 
              flexGrow: 1, 
              display: 'flex', 
              justifyContent: 'center', 
              width: '60%'
            }}
          >
            <Box 
              className={`search-container ${searchFocused ? 'search-focused' : ''}`}
              sx={{ 
                maxWidth: '600px', 
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                borderRadius: '20px',
                backgroundColor: searchFocused ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.1)',
                padding: '2px 16px',
                border: '1px solid',
                borderColor: searchFocused ? 'rgba(124, 77, 255, 0.3)' : 'rgba(255,255,255,0.05)',
                boxShadow: searchFocused ? '0 0 0 2px rgba(124, 77, 255, 0.2)' : 'none',
                transition: 'all 0.3s ease',
              }}
            >
              <FaSearch style={{ color: 'rgba(255,255,255,0.6)', marginRight: '8px' }} />
              <InputBase
                placeholder="Search News"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                sx={{
                  color: 'white',
                  width: '100%',
                  '& input': {
                    padding: '8px 0',
                  }
                }}
              />
            </Box>
          </Box>
        )}

        {/* Right section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, justifyContent: 'flex-end', width: isMobile ? '70%' : '20%' }}>
          {isMobile ? (
            <>
              {/* Search icon on mobile */}
              <IconButton size="small" className="icon-button" aria-label="search">
                <FaSearch />
              </IconButton>
              
              {/* Menu on mobile */}
              <IconButton 
                color="inherit" 
                aria-label="open drawer" 
                edge="end" 
                onClick={handleDrawerToggle}
                className="icon-button"
              >
                <MenuIcon />
              </IconButton>
              
              <Drawer
                anchor="right"
                open={drawerOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true
                }}
                PaperProps={{
                  sx: {
                    width: 280,
                    borderRadius: '0',
                    border: 'none',
                  }
                }}
              >
                {drawer}
              </Drawer>
            </>
          ) : (
            <>
              {/* Right section icons */}
              <Box sx={{ display: 'flex', alignItems: 'center', ml: 2 }}>
                {/* Login button */}
                <Button 
                  variant="contained" 
                  color="primary"
                  sx={{ 
                    borderRadius: '20px',
                    textTransform: 'none',
                    px: 2,
                    py: 0.5,
                    fontWeight: 600,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(124, 77, 255, 0.4)',
                    }
                  }}
                >
                  Log In
                </Button>
                
                {/* About button */}
                <Button 
                  component="a"
                  href="https://fnaai-l.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{ 
                    color: 'white',
                    fontWeight: 500,
                    textTransform: 'none',
                    fontSize: '0.95rem',
                    mx: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      transform: 'translateY(-2px)',
                    }
                  }}
                >
                  About
                </Button>
                
                {/* Notification icon */}
                <IconButton 
                  color="inherit" 
                  sx={{ 
                    ml: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      transform: 'scale(1.05)',
                    }
                  }}
                >
                  <Badge badgeContent={2} color="error">
                    <NotificationsIcon />
                  </Badge>
                </IconButton>
              </Box>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
