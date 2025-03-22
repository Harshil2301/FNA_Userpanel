import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Collapse, useMediaQuery, useTheme, Tooltip, IconButton, Dialog, DialogTitle, DialogContent } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import { FaHome, FaNewspaper, FaFireAlt, FaFootballBall, FaTv, FaGraduationCap, 
  FaInfoCircle, FaEnvelope, FaAngleDown, FaAngleUp, FaEllipsisH, FaUtensils, 
  FaFlask, FaMusic, FaTree, FaPlane, FaStar, FaBars, FaTimesCircle, FaBookmark, FaCog,
  FaChevronLeft, FaChevronRight, FaTimes
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import './Sidebar.css';
import { KeyboardArrowLeft as KeyboardArrowLeftIcon } from '@mui/icons-material';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isMediumScreen = useMediaQuery('(min-width: 600px) and (max-width: 1023px)');
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hovering, setHovering] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [aboutQrDialogOpen, setAboutQrDialogOpen] = useState(false);
  
  // Handle sidebar toggle based on window resize and initial state
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        // Mobile and tablet behavior 
        if (!isMobile && !isMediumScreen) {
          setCollapsed(true);
          setShowSidebar(false);
        }
      } else {
        // Desktop behavior - show sidebar by default
        setShowSidebar(true);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobile, isMediumScreen]);
  
  // Initialize sidebar state in App.js
  useEffect(() => {
    // Dispatch event to set initial sidebar state
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { isOpen: showSidebar, collapsed: collapsed }
    }));
  }, [showSidebar, collapsed]);

  // Listen for sidebar toggle events from Navbar
  useEffect(() => {
    const handleExternalToggle = (e) => {
      if (e.detail && typeof e.detail.isOpen !== 'undefined') {
        setShowSidebar(e.detail.isOpen);
      } else {
        setShowSidebar(!showSidebar);
      }
    };
    
    window.addEventListener('sidebarToggle', handleExternalToggle);
    
    return () => {
      window.removeEventListener('sidebarToggle', handleExternalToggle);
    };
  }, [showSidebar]);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleToggleSidebar = () => {
    if (isMobile) {
      setShowSidebar(!showSidebar);
    }
  };
  
  const handleCollapseSidebar = () => {
    if (isLargeScreen) {
      setCollapsed(!collapsed);
      // Dispatch custom event to notify App.js about sidebar collapse
      window.dispatchEvent(new CustomEvent('sidebarToggle', { 
        detail: { isOpen: showSidebar, collapsed: !collapsed }
      }));
    }
  };

  // Handle About QR dialog
  const handleAboutQrDialogOpen = () => {
    setAboutQrDialogOpen(true);
  };

  const handleAboutQrDialogClose = () => {
    setAboutQrDialogOpen(false);
  };

  const mainItems = [
    { name: 'Home', icon: <FaHome size={20} />, path: '/' },
    { name: 'Popular', icon: <FaFireAlt size={20} />, path: '/trending' },
  ];

  const categories = [
    { name: 'News', icon: <FaNewspaper size={20} />, path: '/news' },
    { name: 'Sports', icon: <FaFootballBall size={20} />, path: '/sports', badge: 'new' },
    { name: 'Entertainment', icon: <FaTv size={20} />, path: '/entertainment' },
    { name: 'Education', icon: <FaGraduationCap size={20} />, path: '/education' },
    { name: 'Foods & Drinks', icon: <FaUtensils size={20} />, path: '/foods-drinks' },
    { name: 'Science', icon: <FaFlask size={20} />, path: '/science' },
    { name: 'Music', icon: <FaMusic size={20} />, path: '/music' },
    { name: 'Nature', icon: <FaTree size={20} />, path: '/nature' },
    { name: 'Places & Travels', icon: <FaPlane size={20} />, path: '/travel' },
  ];

  const resources = [
    { 
      name: 'About', 
      icon: <FaInfoCircle size={20} />, 
      action: handleAboutQrDialogOpen,
      isQrCode: true
    },
    { name: 'Contact', icon: <FaEnvelope size={20} />, path: 'https://fnaai.vercel.app/contactsupport' },
    { name: 'Settings', icon: <FaCog size={20} />, path: '/settings' },
    { name: 'Saved', icon: <FaBookmark size={20} />, path: '/saved', badge: 5 },
  ];
  
  return (
    <>
      {/* Backdrop for mobile */}
      {showSidebar && !isLargeScreen && (
        <Box
          onClick={handleToggleSidebar}
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(3px)',
            zIndex: 1199,
            transition: 'opacity 0.3s ease',
            opacity: showSidebar ? 1 : 0,
            pointerEvents: showSidebar ? 'auto' : 'none',
          }}
        />
      )}
      
      {/* Sidebar */}
      <Box 
        className={`sidebar ${collapsed && isLargeScreen ? 'collapsed' : ''} ${!showSidebar ? 'hidden' : ''}`}
        sx={{ 
          bgcolor: '#1A1A1A', 
          height: '100vh',
          position: 'fixed',
          top: '64px',
          left: 0,
          zIndex: 1200,
          borderRadius: 0,
          width: collapsed && isLargeScreen ? '64px' : '240px',
          transition: 'all 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), box-shadow 0.3s ease, transform 0.5s cubic-bezier(0.25, 0.1, 0.25, 1), width 0.5s cubic-bezier(0.25, 0.1, 0.25, 1)',
          transform: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
          overflow: 'visible',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: hovering ? '0 8px 30px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
          overflowY: 'auto',
          p: { xs: 1.5, sm: 2 },
          bottom: 0,  // Extend to the bottom of the viewport
          '@media (max-width: 600px)': {
            width: '240px',
            maxWidth: '85%',
            left: 0,
            transform: showSidebar ? 'translateX(0)' : 'translateX(-100%)',
            boxShadow: '4px 0 24px rgba(0,0,0,0.5)'
          }
        }}
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
        {/* Only show hamburger menu for collapsed sidebar on large screens */}
        {/* 
        {collapsed && isLargeScreen && !isMediumScreen && (
          <Box
            className="sidebar-hamburger-btn"
            sx={{
              position: 'absolute',
              left: '50%',
              transform: 'translateX(-50%)',
              top: '16px',
              zIndex: 1500,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={handleCollapseSidebar}
              aria-label="Expand sidebar"
              sx={{
                color: 'white',
                backgroundColor: '#1A1A1A',
                border: '2px solid white',
                borderRadius: '50%',
                p: 0.5,
                width: 28,
                height: 28,
                '&:hover': {
                  backgroundColor: '#7C4DFF',
                  color: 'white',
                  border: '2px solid white',
                  boxShadow: 'none',
                  transform: 'scale(1.05)',
                },
                transition: 'all 0.3s ease',
                boxShadow: '0 2px 6px rgba(0,0,0,0.6)',
              }}
            >
              <FaBars size={14} />
            </IconButton>
          </Box>
        )}
        */}

        {/* Toggle Button - only show on large screens */}
        {isLargeScreen && (
          <Box
            className="sidebar-toggle-container"
            sx={{
              position: 'absolute',
              right: 0,
              top: '20px',
              transform: 'translateX(50%)',
              zIndex: 2000,
              overflow: 'visible',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <IconButton
              onClick={handleCollapseSidebar}
              className="sidebar-toggle-button"
              sx={{
                bgcolor: 'background.paper',
                color: 'text.primary',
                width: '36px',
                height: '36px',
                transition: 'all 0.3s ease',
                borderRadius: '50%',
                boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                '&:hover': {
                  bgcolor: 'action.hover',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                },
                transform: collapsed && isLargeScreen ? 'rotate(180deg)' : 'rotate(0deg)',
              }}
            >
              <KeyboardArrowLeftIcon sx={{ fontSize: '20px' }} />
            </IconButton>
          </Box>
        )}

        {/* Main Navigation */}
        <List 
          component="nav" 
          sx={{ 
            p: { xs: 1, sm: 1.5 },
            mt: isLargeScreen ? (collapsed ? 4 : 0) : 1,
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {mainItems.map((item) => (
            <Tooltip 
              key={item.name}
              title={collapsed && isLargeScreen ? item.name : ""}
              placement="right"
              arrow
            >
              <ListItem
                button
                component={Link}
                to={item.path}
                className={isActive(item.path) ? 'active-item' : ''}
                onMouseEnter={() => setHoveredItem(item.name)}
                onMouseLeave={() => setHoveredItem(null)}
                sx={{
                  mb: 0.5,
                  borderRadius: '8px',
                  justifyContent: collapsed && isLargeScreen ? 'center' : 'flex-start',
                  height: '48px',
                  position: 'relative',
                  overflow: 'hidden',
                  backgroundColor: isActive(item.path) ? 'rgba(124, 77, 255, 0.15)' : 'transparent',
                  transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
                  '&:hover': {
                    backgroundColor: isActive(item.path) ? 'rgba(124, 77, 255, 0.2)' : 'rgba(255,255,255,0.1)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                  '&::before': hoveredItem === item.name && !isActive(item.path) ? {
                    content: '""',
                    position: 'absolute',
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: '4px',
                    backgroundColor: 'var(--primary-color)',
                    borderRadius: '0 4px 4px 0',
                    opacity: 0.7,
                    transition: 'all 0.2s ease-in-out',
                  } : {}
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: collapsed && isLargeScreen ? 0 : 40, 
                    color: isActive(item.path) ? '#7C4DFF' : 'rgba(255,255,255,0.7)',
                    mr: (collapsed && isLargeScreen) ? 0 : { xs: 3, sm: 2.5, md: 1.5 },
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                
                {(!collapsed || !isLargeScreen) && (
                  <ListItemText 
                    primary={item.name} 
                    primaryTypographyProps={{
                      fontSize: { xs: '1rem', sm: '0.95rem' },
                      fontWeight: isActive(item.path) ? 'bold' : 'normal',
                      color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.7)',
                      transition: 'color 0.3s ease',
                    }} 
                  />
                )}
                {isActive(item.path) && !collapsed && (
                  <Box sx={{ 
                    position: 'absolute',
                    right: 10,
                    color: '#7C4DFF',
                  }}>
                    <FaStar size={12} />
                  </Box>
                )}
              </ListItem>
            </Tooltip>
          ))}
        </List>
        
        {/* Always show categories and resources for small/medium screens, only hide in collapsed large screens */}
        {(!collapsed || !isLargeScreen) && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 1, mb: 1 }} />
            
            <Typography 
              variant="subtitle2" 
              component="div" 
              sx={{ 
                px: 2, 
                py: 1, 
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: 1,
                opacity: showSidebar ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: showSidebar ? '0.15s' : '0s',
              }}
            >
              Categories
            </Typography>
            
            <List component="nav" sx={{ 
              p: 1, 
              flexGrow: 0,
              overflowY: 'auto',
              opacity: showSidebar ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: showSidebar ? '0.2s' : '0s',
            }}>
              {categories.map((item) => (
                <Tooltip 
                  key={item.name}
                  title=""
                  placement="right"
                  arrow
                  disableHoverListener={true}
                >
                  <ListItem
                    button
                    component={Link}
                    to={item.path}
                    className={isActive(item.path) ? 'active-item' : ''}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    sx={{
                      mb: 0.5,
                      borderRadius: '8px',
                      justifyContent: 'flex-start',
                      height: '48px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: isActive(item.path) ? 'rgba(124, 77, 255, 0.15)' : 'transparent',
                      transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      '&:hover': {
                        backgroundColor: isActive(item.path) ? 'rgba(124, 77, 255, 0.2)' : 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                      '&::before': hoveredItem === item.name && !isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: 'var(--primary-color)',
                        borderRadius: '0 4px 4px 0',
                        opacity: 0.7,
                        transition: 'all 0.2s ease-in-out',
                      } : {}
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40, 
                        color: isActive(item.path) ? '#7C4DFF' : 'rgba(255,255,255,0.7)',
                        mr: { xs: 3, sm: 2.5, md: 1.5 }
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.name} 
                      primaryTypographyProps={{ 
                        fontSize: { xs: '1rem', sm: '0.95rem' },
                        fontWeight: isActive(item.path) ? 'bold' : 'normal',
                        color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.7)'
                      }} 
                    />
                    {isActive(item.path) && (
                      <Box sx={{ 
                        position: 'absolute',
                        right: 10,
                        color: '#7C4DFF',
                      }}>
                        <FaStar size={12} />
                      </Box>
                    )}
                  </ListItem>
                </Tooltip>
              ))}
            </List>
            
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 1, mb: 1 }} />
            
            <Typography 
              variant="subtitle2" 
              component="div" 
              sx={{ 
                px: 2, 
                py: 1, 
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem',
                textTransform: 'uppercase',
                letterSpacing: 1,
                opacity: showSidebar ? 1 : 0,
                transition: 'opacity 0.3s ease',
                transitionDelay: showSidebar ? '0.25s' : '0s',
              }}
            >
              Resources
            </Typography>
            
            <List component="nav" sx={{ 
              p: 1, 
              opacity: showSidebar ? 1 : 0,
              transition: 'opacity 0.3s ease',
              transitionDelay: showSidebar ? '0.3s' : '0s',
            }}>
              {resources.map((item) => (
                <Tooltip 
                  key={item.name}
                  title=""
                  placement="right"
                  arrow
                  disableHoverListener={true}
                >
                  <ListItem
                    button
                    component={item.isQrCode ? 'div' : (item.path?.startsWith('http') ? 'a' : Link)}
                    href={!item.isQrCode && item.path?.startsWith('http') ? item.path : undefined}
                    to={!item.isQrCode && !item.path?.startsWith('http') ? item.path : undefined}
                    target={!item.isQrCode && item.path?.startsWith('http') ? "_blank" : undefined}
                    rel={!item.isQrCode && item.path?.startsWith('http') ? "noopener noreferrer" : undefined}
                    onClick={item.isQrCode ? item.action : undefined}
                    className={isActive(item.path) ? 'active-item' : ''}
                    onMouseEnter={() => setHoveredItem(item.name)}
                    onMouseLeave={() => setHoveredItem(null)}
                    sx={{
                      mb: 0.5,
                      borderRadius: '8px',
                      justifyContent: 'flex-start',
                      height: '48px',
                      position: 'relative',
                      overflow: 'hidden',
                      backgroundColor: isActive(item.path) ? 'rgba(124, 77, 255, 0.15)' : 'transparent',
                      transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
                      '&:hover': {
                        backgroundColor: isActive(item.path) ? 'rgba(124, 77, 255, 0.2)' : 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                      '&::before': hoveredItem === item.name && !isActive(item.path) ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        bottom: 0,
                        width: '4px',
                        backgroundColor: 'var(--secondary-color)',
                        borderRadius: '0 4px 4px 0',
                        opacity: 0.7,
                        transition: 'all 0.2s ease-in-out',
                      } : {}
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 40, 
                        color: 'rgba(255,255,255,0.7)',
                        mr: { xs: 3, sm: 2.5, md: 1.5 }
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText 
                      primary={item.name} 
                      primaryTypographyProps={{ 
                        fontSize: { xs: '1rem', sm: '0.95rem' },
                        color: 'rgba(255,255,255,0.7)'
                      }} 
                    />
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          </>
        )}

        {/* Categories section in collapsed mode - ONLY for large screens */}
        {collapsed && isLargeScreen && (
          <>
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 1, mb: 1 }} />
            
            <List component="nav" sx={{ 
              p: 0.5, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              mt: 2
            }}>
              {categories.slice(0, 5).map((item) => (
                <Tooltip 
                  key={item.name}
                  title={item.name}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    component={Link}
                    to={item.path}
                    className={isActive(item.path) ? 'active-item' : ''}
                    sx={{
                      borderRadius: '8px',
                      justifyContent: 'center',
                      height: '42px',
                      width: '42px',
                      minWidth: '42px',
                      mb: 1,
                      p: 0,
                      backgroundColor: isActive(item.path) ? 'rgba(124, 77, 255, 0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 0, 
                        color: isActive(item.path) ? '#7C4DFF' : 'rgba(255,255,255,0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </ListItem>
                </Tooltip>
              ))}
            </List>
            
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mt: 1, mb: 1 }} />
            
            <List component="nav" sx={{ 
              p: 0.5, 
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}>
              {resources.slice(0, 3).map((item) => (
                <Tooltip 
                  key={item.name}
                  title={item.name}
                  placement="right"
                  arrow
                >
                  <ListItem
                    button
                    component={item.isQrCode ? 'div' : (item.path?.startsWith('http') ? 'a' : Link)}
                    href={!item.isQrCode && item.path?.startsWith('http') ? item.path : undefined}
                    to={!item.isQrCode && !item.path?.startsWith('http') ? item.path : undefined}
                    target={!item.isQrCode && item.path?.startsWith('http') ? "_blank" : undefined}
                    rel={!item.isQrCode && item.path?.startsWith('http') ? "noopener noreferrer" : undefined}
                    onClick={item.isQrCode ? item.action : undefined}
                    className={isActive(item.path) ? 'active-item' : ''}
                    sx={{
                      borderRadius: '8px',
                      justifyContent: 'center',
                      height: '42px',
                      width: '42px',
                      minWidth: '42px',
                      mb: 1,
                      p: 0,
                      backgroundColor: isActive(item.path) ? 'rgba(124, 77, 255, 0.15)' : 'transparent',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                      },
                    }}
                  >
                    <ListItemIcon 
                      sx={{ 
                        minWidth: 0, 
                        color: isActive(item.path) ? '#7C4DFF' : 'rgba(255,255,255,0.7)',
                        display: 'flex',
                        justifyContent: 'center',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          </>
        )}

        {/* Close button for mobile - add a way to close the sidebar on mobile */}
        {isMobile && (
          <Box sx={{ 
            p: 2, 
            display: 'flex', 
            justifyContent: 'center', 
            mt: 2,
            mb: 2 
          }}>
            <IconButton
              onClick={handleToggleSidebar}
              sx={{
                color: 'white',
                backgroundColor: 'rgba(124, 77, 255, 0.2)',
                '&:hover': {
                  backgroundColor: 'rgba(124, 77, 255, 0.3)',
                }
              }}
            >
              <FaTimes size={18} />
            </IconButton>
          </Box>
        )}
      </Box>

      {/* QR Code Dialog for About */}
      <Dialog
        open={aboutQrDialogOpen}
        onClose={handleAboutQrDialogClose}
        aria-labelledby="about-qr-code-dialog-title"
        PaperProps={{
          sx: {
            backgroundColor: '#1A1A1A',
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
            maxWidth: '400px',
            width: '100%',
            overflow: 'hidden'
          }
        }}
      >
        <Box sx={{ position: 'relative', padding: '16px' }}>
          <IconButton
            onClick={handleAboutQrDialogClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: 'rgba(255,255,255,0.7)',
              '&:hover': {
                color: 'white',
                backgroundColor: 'rgba(255,255,255,0.1)'
              }
            }}
          >
            <FaTimes />
          </IconButton>
          
          <DialogTitle 
            id="about-qr-code-dialog-title"
            sx={{ 
              textAlign: 'center', 
              fontWeight: 'bold',
              color: 'white',
              pt: 3,
              pb: 1
            }}
          >
            About FNA.ai
          </DialogTitle>
          
          <DialogContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
              Scan this QR code to visit the About page on your device
            </Typography>
            
            <Box 
              sx={{ 
                backgroundColor: 'black', 
                p: 3, 
                borderRadius: '8px',
                display: 'inline-block',
                mb: 2,
                position: 'relative',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}
            >
              <QRCodeSVG 
                value="https://fnaai-l.vercel.app/" 
                size={200} 
                bgColor={"#000000"} 
                fgColor={"#ffffff"} 
                level={"H"} 
                includeMargin={false}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '44px',
                  height: '44px',
                  backgroundColor: 'white',
                  borderRadius: '8px',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 0 8px rgba(255,255,255,0.5)',
                  border: '2px solid white'
                }}
              >
                <img 
                  src={`${process.env.PUBLIC_URL}/qr.png`} 
                  alt="FNA.ai Logo" 
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain'
                  }} 
                />
              </Box>
            </Box>
            
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block', 
                color: 'rgba(255,255,255,0.5)',
                fontSize: '0.8rem',
                mt: 2
              }}
            >
              Or visit <Box 
                component="a" 
                href="https://fnaai-l.vercel.app/" 
                target="_blank"
                rel="noopener noreferrer"
                sx={{ 
                  color: '#7C4DFF', 
                  fontWeight: 'bold',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline'
                  }
                }}
              >
                https://fnaai-l.vercel.app/
              </Box> on your device
            </Typography>
          </DialogContent>
        </Box>
      </Dialog>
    </>
  );
};

export default Sidebar; 