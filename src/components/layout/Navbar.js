import React, { useState, useEffect } from 'react';
import { 
  AppBar, 
  Toolbar, 
  InputBase, 
  Button, 
  Box, 
  useMediaQuery, 
  IconButton, 
  Badge, 
  Popover, 
  List, 
  ListItem, 
  ListItemText, 
  ListItemAvatar, 
  Avatar, 
  Typography, 
  Divider,
  Tooltip
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FaSearch, FaCheckCircle, FaBell, FaUpload, FaUser, FaExclamationCircle, FaVideo } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/logo.svg';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';

// Sample notifications data
const notificationsData = [
  {
    id: 1,
    type: 'upload',
    read: false,
    title: 'Video Published Successfully',
    message: 'Your upload "Climate Change Report" is now live',
    time: '5 minutes ago',
    icon: <FaCheckCircle color="#4caf50" size={16} />,
    avatar: null,
  },
  {
    id: 2,
    type: 'comment',
    read: false,
    title: 'New Comment',
    message: 'Harshil commented on your video: "Great insights!"',
    time: '2 hours ago',
    icon: null,
    avatar: 'H',
    avatarColor: '#8c42f4',
  },
  {
    id: 3,
    type: 'system',
    read: true,
    title: 'Account Verified',
    message: 'Your account has been verified. You now have creator privileges!',
    time: '1 day ago',
    icon: <FaUser color="#2196f3" size={16} />,
    avatar: null,
  },
  {
    id: 4,
    type: 'alert',
    read: true,
    title: 'Storage Space Low',
    message: 'You are using 80% of your allocated storage space',
    time: '3 days ago',
    icon: <FaExclamationCircle color="#ff9800" size={16} />,
    avatar: null,
  },
  {
    id: 5,
    type: 'recommendation',
    read: true,
    title: 'Recommended Video',
    message: 'Check out "Tech News Roundup" trending in your category',
    time: '5 days ago',
    icon: <FaVideo color="#e91e63" size={16} />,
    avatar: null,
  }
];

const Navbar = () => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(notificationsData);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();
  const navigate = useNavigate();

  // Count unread notifications
  const unreadCount = notifications.filter(notification => !notification.read).length;
  
  // Determine if notifications popover is open
  const notificationsOpen = Boolean(notificationsAnchorEl);
  const notificationsId = notificationsOpen ? 'notifications-popover' : undefined;

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
      // Close mobile search if open
      if (mobileSearchOpen) {
        setMobileSearchOpen(false);
        setSearchAnchorEl(null);
      }
    }
  };

  const handleMobileSearchClick = (event) => {
    setSearchAnchorEl(event.currentTarget);
    setMobileSearchOpen(true);
  };

  const handleMobileSearchClose = () => {
    setMobileSearchOpen(false);
    setSearchAnchorEl(null);
  };
  
  // Handle notifications icon click
  const handleNotificationsClick = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  // Handle notifications popover close
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };
  
  // Mark all notifications as read
  const markAllAsRead = () => {
    setNotifications(notifications.map(notification => ({
      ...notification,
      read: true
    })));
  };
  
  // Mark a single notification as read
  const markAsRead = (id) => {
    setNotifications(notifications.map(notification => 
      notification.id === id 
        ? { ...notification, read: true } 
        : notification
    ));
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
                aria-describedby={notificationsId}
                onClick={handleNotificationsClick}
                sx={{ 
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <Badge badgeContent={unreadCount} color="error" sx={{ transform: 'scale(0.8)' }}>
                  {unreadCount > 0 ? (
                    <NotificationsActiveIcon fontSize="small" sx={{ color: unreadCount > 0 ? '#ff9800' : 'inherit' }} />
                  ) : (
                    <NotificationsIcon fontSize="small" />
                  )}
                </Badge>
              </IconButton>
              
              {/* Search icon on mobile */}
              <IconButton 
                size="small" 
                className="icon-button" 
                aria-label="search"
                onClick={handleMobileSearchClick}
              >
                <FaSearch />
              </IconButton>

              {/* Mobile search popover */}
              <Popover
                open={mobileSearchOpen}
                anchorEl={searchAnchorEl}
                onClose={handleMobileSearchClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{
                  mt: 1,
                  '& .MuiPopover-paper': {
                    borderRadius: '20px',
                    backgroundColor: 'rgba(35,35,35,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                    width: 280,
                  }
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    p: 1,
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    borderRadius: '20px',
                    margin: 1,
                    border: '1px solid rgba(124, 77, 255, 0.2)',
                  }}
                >
                  <FaSearch style={{ color: 'rgba(255,255,255,0.6)', margin: '0 8px' }} />
                  <InputBase
                    autoFocus
                    placeholder="Search News"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleSearch}
                    sx={{
                      color: 'white',
                      width: '100%',
                      '& input': {
                        padding: '8px 4px',
                      }
                    }}
                  />
                </Box>
              </Popover>
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
                <Tooltip title="Notifications">
                  <IconButton 
                    color="inherit" 
                    aria-describedby={notificationsId}
                    onClick={handleNotificationsClick}
                    sx={{ 
                      ml: 1,
                      position: 'relative',
                      '&:hover': {
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        transform: 'scale(1.05)',
                      },
                      '&::after': unreadCount > 0 ? {
                        content: '""',
                        position: 'absolute',
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        backgroundColor: '#ff9800',
                        top: '10px',
                        right: '10px',
                        animation: 'pulse 2s infinite'
                      } : {}
                    }}
                  >
                    <Badge badgeContent={unreadCount} color="error">
                      {unreadCount > 0 ? (
                        <NotificationsActiveIcon sx={{ color: unreadCount > 0 ? '#ff9800' : 'inherit' }} />
                      ) : (
                        <NotificationsIcon />
                      )}
                    </Badge>
                  </IconButton>
                </Tooltip>
              </Box>
            </>
          )}
        </Box>
      </Toolbar>
      
      {/* Notifications Popover */}
      <Popover
        id={notificationsId}
        open={notificationsOpen}
        anchorEl={notificationsAnchorEl}
        onClose={handleNotificationsClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          mt: 1,
          '& .MuiPopover-paper': {
            width: { xs: 300, sm: 350 },
            maxHeight: 400,
            borderRadius: '8px',
            backgroundColor: 'rgba(35,35,35,0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
            overflow: 'hidden',
          }
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Notifications Header */}
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center', 
          p: 2, 
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          backgroundColor: 'rgba(40,40,40,0.5)'
        }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold', color: 'white' }}>
            Notifications
            {unreadCount > 0 && (
              <Box component="span" sx={{ 
                ml: 1, 
                px: 1, 
                py: 0.2, 
                borderRadius: '10px', 
                fontSize: '0.75rem', 
                backgroundColor: 'rgba(255, 152, 0, 0.2)', 
                color: '#ff9800' 
              }}>
                {unreadCount} new
              </Box>
            )}
          </Typography>
          
          {unreadCount > 0 && (
            <Button 
              size="small" 
              onClick={markAllAsRead}
              sx={{ 
                color: 'rgba(255,255,255,0.7)', 
                textTransform: 'none',
                fontSize: '0.8rem',
                fontWeight: 'normal',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.05)',
                  color: 'white'
                }
              }}
            >
              Mark all as read
            </Button>
          )}
        </Box>
        
        {/* Notifications List */}
        {notifications.length > 0 ? (
          <List sx={{ p: 0 }}>
            {notifications.map((notification, index) => (
              <React.Fragment key={notification.id}>
                <ListItem 
                  alignItems="flex-start"
                  sx={{ 
                    px: 2, 
                    py: 1.5,
                    cursor: 'pointer',
                    backgroundColor: notification.read ? 'transparent' : 'rgba(124, 77, 255, 0.1)',
                    transition: 'background-color 0.2s ease',
                    '&:hover': {
                      backgroundColor: notification.read ? 'rgba(255,255,255,0.03)' : 'rgba(124, 77, 255, 0.15)'
                    }
                  }}
                  onClick={() => markAsRead(notification.id)}
                >
                  <ListItemAvatar>
                    {notification.avatar ? (
                      <Avatar sx={{ bgcolor: notification.avatarColor || 'primary.main', width: 40, height: 40 }}>
                        {notification.avatar}
                      </Avatar>
                    ) : (
                      <Avatar sx={{ 
                        bgcolor: 'rgba(40, 40, 40, 0.8)', 
                        width: 40, 
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        {notification.icon}
                      </Avatar>
                    )}
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="subtitle2" sx={{ 
                        fontWeight: notification.read ? 'normal' : 'bold',
                        color: 'white',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        {notification.title}
                        {!notification.read && (
                          <Box component="span" sx={{ 
                            width: 8, 
                            height: 8, 
                            borderRadius: '50%', 
                            backgroundColor: '#7C4DFF',
                            ml: 1,
                            display: 'inline-block'
                          }} />
                        )}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          sx={{ 
                            color: 'rgba(255,255,255,0.7)',
                            display: 'block',
                            fontSize: '0.8rem',
                            mb: 0.5
                          }}
                        >
                          {notification.message}
                        </Typography>
                        <Typography
                          component="span"
                          variant="caption"
                          sx={{ 
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '0.75rem'
                          }}
                        >
                          {notification.time}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>
                {index < notifications.length - 1 && <Divider component="li" sx={{ borderColor: 'rgba(255,255,255,0.08)' }} />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <NotificationsNoneIcon sx={{ fontSize: 48, color: 'rgba(255,255,255,0.3)', mb: 1 }} />
            <Typography sx={{ color: 'rgba(255,255,255,0.5)' }}>No notifications yet</Typography>
          </Box>
        )}
        
        {/* Notifications Footer */}
        <Box sx={{ 
          p: 1.5, 
          borderTop: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center',
          backgroundColor: 'rgba(30,30,30,0.6)'
        }}>
          <Button 
            fullWidth
            sx={{ 
              color: '#7C4DFF', 
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(124, 77, 255, 0.08)'
              }
            }}
          >
            View All Notifications
          </Button>
        </Box>
      </Popover>
    </AppBar>
  );
};

export default Navbar;
