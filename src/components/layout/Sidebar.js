import React, { useState, useEffect } from 'react';
// eslint-disable-next-line no-unused-vars
import { Box, Typography, List, ListItem, ListItemText, ListItemIcon, Divider, Collapse, useMediaQuery, useTheme, Tooltip } from '@mui/material';
// eslint-disable-next-line no-unused-vars
import { FaHome, FaNewspaper, FaFireAlt, FaFootballBall, FaTv, FaGraduationCap, 
  FaInfoCircle, FaEnvelope, FaAngleDown, FaAngleUp, FaEllipsisH, FaUtensils, 
  FaFlask, FaMusic, FaTree, FaPlane, FaStar, FaBars, FaTimesCircle, FaBookmark, FaCog
} from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [collapsed, setCollapsed] = useState(false);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [hovering, setHovering] = useState(false);
  const [showSidebar, setShowSidebar] = useState(!isMobile);
  
  // Check for mobile view and set collapsed state
  useEffect(() => {
    setCollapsed(isMobile);
    setShowSidebar(!isMobile);
  }, [isMobile]);
  
  // Initialize sidebar state in App.js
  useEffect(() => {
    // Dispatch event to set initial sidebar state
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { isOpen: showSidebar }
    }));
  }, [showSidebar]);
  
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar);
    // Dispatch custom event to notify App.js about sidebar toggle
    window.dispatchEvent(new CustomEvent('sidebarToggle', { 
      detail: { isOpen: !showSidebar }
    }));
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
    { name: 'About', icon: <FaInfoCircle size={20} />, path: 'https://fnaai-l.vercel.app/' },
    { name: 'Contact', icon: <FaEnvelope size={20} />, path: 'https://fnaai.vercel.app/contactsupport' },
    { name: 'Settings', icon: <FaCog size={20} />, path: '/settings' },
    { name: 'Saved', icon: <FaBookmark size={20} />, path: '/saved', badge: 5 },
  ];
  
  return (
    <>
      {/* Hamburger menu toggle (visible in mobile and when sidebar is hidden) */}
      <Box
        sx={{
          position: 'fixed',
          top: '36px',
          left: '16px',
          zIndex: 1301,
          display: showSidebar ? 'none' : 'flex', 
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          width: 32,
          height: 32,
          borderRadius: '4px',
          backgroundColor: 'rgba(40, 40, 40, 0.7)',
          transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            backgroundColor: 'rgba(60, 60, 60, 0.9)',
            transform: 'scale(1.05)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }
        }}
        onClick={handleToggleSidebar}
      >
        <FaBars size={18} color="rgba(255,255,255,0.9)" />
      </Box>

      {/* Close button (only visible when sidebar is open) */}
      <Box
        sx={{
          position: 'fixed',
          top: '36px',
          left: '16px', // Same position as hamburger
          zIndex: 1301,
          display: showSidebar ? 'flex' : 'none', // Toggle visibility instead of position
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'pointer',
          width: 32,
          height: 32,
          borderRadius: '4px',
          backgroundColor: 'rgba(40, 40, 40, 0.7)',
          transition: 'all 0.25s cubic-bezier(0.25, 0.8, 0.25, 1)',
          backdropFilter: 'blur(5px)',
          '&:hover': {
            backgroundColor: 'rgba(60, 60, 60, 0.9)',
            transform: 'scale(1.05)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
          }
        }}
        onClick={handleToggleSidebar}
      >
        <FaTimesCircle size={18} color="rgba(255,255,255,0.9)" />
      </Box>

      {/* Sidebar */}
      <Box 
        className="sidebar" 
        sx={{ 
          bgcolor: '#1A1A1A', 
          height: '100vh',
          position: 'fixed',
          top: '64px',
          left: showSidebar ? 0 : '-240px',
          zIndex: 1200,
          borderRadius: 0,
          width: '240px',
          transition: 'all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1), box-shadow 0.3s ease',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: hovering ? '0 8px 30px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.3)',
          overflowY: 'auto',
          '@media (max-width: 600px)': {
            width: '100%',
            left: showSidebar ? 0 : '-100%',
          }
        }}
        onMouseEnter={() => {
          setHovering(true);
        }}
        onMouseLeave={() => {
          setHovering(false);
        }}
      >
        {/* Main Navigation */}
        <List component="nav" sx={{ p: 1, mt: 2 }}>
          {mainItems.map((item) => (
            <Tooltip 
              key={item.name}
              title={collapsed ? item.name : ""}
              placement="right"
              arrow
              disableHoverListener={!collapsed}
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
                    mr: 1,
                    transition: 'color 0.3s ease',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
                    fontWeight: isActive(item.path) ? 'bold' : 'normal',
                    color: isActive(item.path) ? 'white' : 'rgba(255,255,255,0.7)',
                    transition: 'color 0.3s ease',
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
            letterSpacing: 1
          }}
        >
          Categories
        </Typography>
        
        <List component="nav" sx={{ p: 1, flexGrow: 1, overflowY: 'auto' }}>
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
                    mr: 1 
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
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
            letterSpacing: 1
          }}
        >
          Resources
        </Typography>
        
        <List component="nav" sx={{ p: 1, mb: 2 }}>
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
                component={item.path.startsWith('http') ? 'a' : Link}
                href={item.path.startsWith('http') ? item.path : undefined}
                to={!item.path.startsWith('http') ? item.path : undefined}
                target={item.path.startsWith('http') ? "_blank" : undefined}
                rel={item.path.startsWith('http') ? "noopener noreferrer" : undefined}
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
                    mr: 1
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText 
                  primary={item.name} 
                  primaryTypographyProps={{ 
                    fontSize: '0.95rem',
                    color: 'rgba(255,255,255,0.7)'
                  }} 
                />
              </ListItem>
            </Tooltip>
          ))}
        </List>
      </Box>
    </>
  );
};

export default Sidebar; 