import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, InputBase, Button, Box, useMediaQuery, IconButton, Badge } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FaSearch } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/logo.svg';
import NotificationsIcon from '@mui/icons-material/Notifications';

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

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
        <Box sx={{ display: 'flex', alignItems: 'center', width: isMobile ? '30%' : '20%', ml: { xs: 5, sm: 5 } }}>
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
              {/* Login button - also visible on mobile */}
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                sx={{ 
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  minWidth: 0,
                  ml: 'auto', // Push to the right
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(124, 77, 255, 0.4)',
                  }
                }}
              >
                Log In
              </Button>
              
              {/* Notification icon - also visible on mobile */}
              <IconButton 
                color="inherit" 
                size="small"
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Badge badgeContent={2} color="error" sx={{ transform: 'scale(0.8)' }}>
                  <NotificationsIcon fontSize="small" />
                </Badge>
              </IconButton>
              
              {/* Search icon on mobile */}
              <IconButton size="small" className="icon-button" aria-label="search">
                <FaSearch />
              </IconButton>
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
