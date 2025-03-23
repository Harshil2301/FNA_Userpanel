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
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { FaSearch, FaCheckCircle, FaBell, FaUpload, FaUser, FaExclamationCircle, FaVideo, FaTimes, FaBars } from 'react-icons/fa';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../../styles/Navbar.css';
import logo from '../../assets/logo.svg';
import NotificationsIcon from '@mui/icons-material/Notifications';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneIcon from '@mui/icons-material/NotificationsNone';
import QrCode2Icon from '@mui/icons-material/QrCode2';
import { QRCodeSVG } from 'qrcode.react';

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

const Navbar = ({ onSidebarToggle }) => {
  const [searchFocused, setSearchFocused] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchAnchorEl, setSearchAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState(notificationsData);
  const [qrDialogOpen, setQrDialogOpen] = useState(false);
  const [aboutQrDialogOpen, setAboutQrDialogOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const isDownMd = useMediaQuery(theme.breakpoints.down('md'));
  const isWithinMediumRange = useMediaQuery('(min-width: 600px) and (max-width: 1023px)');
  const isSmallOrMedium = isDownMd || isWithinMediumRange;
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

  // Handle QR dialog open
  const handleQrDialogOpen = () => {
    setQrDialogOpen(true);
  };

  // Handle QR dialog close
  const handleQrDialogClose = () => {
    setQrDialogOpen(false);
  };

  // Handle About QR dialog open
  const handleAboutQrDialogOpen = () => {
    setAboutQrDialogOpen(true);
  };

  // Handle About QR dialog close
  const handleAboutQrDialogClose = () => {
    setAboutQrDialogOpen(false);
  };

  // Handle sidebar toggle
  const handleToggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    
    // Call the prop function if it exists
    if (onSidebarToggle) {
      onSidebarToggle();
    } else {
      // Fallback to dispatching the event directly
      window.dispatchEvent(new CustomEvent('sidebarToggle', { 
        detail: { isOpen: newState }
      }));
    }
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1400, 
        backgroundColor: '#0a0a0a',
        boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.5)',
        height: '70px',
      }}
    >
      <Toolbar sx={{ 
        py: 1, 
        justifyContent: 'space-between',
        width: '100%',
        maxWidth: '100%',
        px: { xs: 2, sm: 3, md: 4 },
      }}>
        {/* Logo on left with hamburger menu */}
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          width: isMobile ? '30%' : '20%',
          gap: { xs: 0.5, sm: 1 } // Reduced gap for small screens
        }}>
          {isSmallOrMedium && (
            <Tooltip title={sidebarOpen ? "Close Navigation" : "Open Navigation"}>
              <IconButton 
                edge="start"
                color="inherit" 
                aria-label={sidebarOpen ? "close menu" : "open menu"}
                onClick={handleToggleSidebar}
                sx={{ 
                  mr: { xs: 0.5, sm: 2, md: 3 },
                  ml: { xs: 2, sm: 1 },
                  display: {xs: 'flex', lg: 'none'},
                  color: 'white',
                  transition: 'transform 0.3s ease',
                  transform: sidebarOpen ? 'rotate(90deg)' : 'rotate(0deg)',
                  height: '32px',
                  width: '32px',
                  padding: '6px',
                  my: 'auto',
                  alignSelf: 'center',
                  '&:hover': { 
                    bgcolor: 'rgba(255,255,255,0.08)'
                  }
                }}
              >
                {sidebarOpen ? <FaTimes size={18} /> : <FaBars size={18} />}
              </IconButton>
            </Tooltip>
          )}
          
          <Link to="/" className="logo-link" style={{ display: 'flex', alignItems: 'center' }}>
            <img 
              src={logo}
              alt="FNA.ai Logo" 
              className="navbar-logo" 
              style={{ 
                height: isSmallOrMedium ? '24px' : '32px', 
                width: 'auto',
                marginTop: '0px'
              }} 
            />
          </Link>
        </Box>

        {/* Search bar - center aligned */}
        <Box sx={{ 
          width: { xs: '40%', sm: '45%', md: '50%' }, 
          display: { xs: isMobile && !mobileSearchOpen ? 'none' : 'flex' },
          position: 'relative'
        }}>
          <Box 
            className={`search-container ${searchFocused ? 'search-focused' : ''}`}
            sx={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
              backgroundColor: 'rgba(255,255,255,0.08)',
              color: 'rgba(255,255,255,0.8)',
              borderRadius: '8px',
              py: { xs: 0.5, sm: 0.75, md: 1 }, // Reduced padding for small screens
              px: { xs: 1, sm: 1.5, md: 2 }, // Reduced padding for small screens
              height: { xs: '38px', sm: '40px', md: '42px' }, // Reduced height for small screens
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.12)'
              }
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

        {/* Right Actions */}
        <Box 
          sx={{ 
            display: 'flex', 
            justifyContent: 'flex-end', 
            alignItems: 'center',
            gap: { xs: 0.5, sm: 1, md: 1.5 }, 
            width: { xs: '45%', sm: '45%', md: '25%', lg: '20%' }, // Increased width on small screens
            ml: { xs: 'auto', md: 0 }, // Auto margin on small screens
            '@media (min-width: 900px) and (max-width: 1110px)': {
              width: '30%',
              gap: 1,
            }
          }}
        >
          {isMobile ? (
            <>
              {/* Get Web button - also visible on mobile */}
              <Button 
                variant="contained" 
                color="primary"
                size="small"
                onClick={handleQrDialogOpen}
                sx={{ 
                  borderRadius: '20px',
                  textTransform: 'none',
                  px: 1.5,
                  py: 0.5,
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  minWidth: 0,
                  ml: 'auto', // Push to the right
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  border: '2px solid #8e60ff',
                  whiteSpace: 'nowrap',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: '0 4px 12px rgba(124, 77, 255, 0.4)',
                    border: '2px solid #a280ff',
                  }
                }}
              >
                <QrCode2Icon sx={{ fontSize: 14 }} />
                Web
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
                sx={{
                  color: 'white',
                  p: 1,
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.08)',
                    transform: 'scale(1.05)',
                  }
                }}
              >
                <FaSearch size={16} />
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
                {/* Get Web button */}
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<QrCode2Icon />}
                  onClick={handleQrDialogOpen}
                  className="get-web-btn"
                  size={isMobile ? "small" : "medium"}
                  sx={{
                    backgroundColor: '#7C4DFF',
                    fontSize: { xs: '0.70rem', sm: '0.75rem', md: '0.85rem' },
                    px: { xs: 1, sm: 1.5, md: 2 },
                    py: { xs: 0.5, sm: 0.75 },
                    borderRadius: '30px',
                    fontWeight: 'bold',
                    whiteSpace: 'nowrap',
                    '&:hover': {
                      backgroundColor: '#651fff',
                      boxShadow: '0 4px 20px rgba(124, 77, 255, 0.4)',
                      transform: 'translateY(-2px)'
                    },
                    '&:active': {
                      transform: 'translateY(0)'
                    },
                    textTransform: 'none',
                    display: { xs: 'none', sm: 'flex' },
                    '@media (min-width: 900px) and (max-width: 1110px)': {
                      px: 1.5, // Reduce padding
                      fontSize: '0.75rem', // Reduce font size
                      minWidth: '90px', // Ensure minimum width
                    }
                  }}
                >
                  Get Web
                </Button>
                
                {/* About button */}
                <Button 
                  onClick={handleAboutQrDialogOpen}
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

      {/* QR Code Dialog */}
      <Dialog
        open={qrDialogOpen}
        onClose={handleQrDialogClose}
        aria-labelledby="qr-code-dialog-title"
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
            onClick={handleQrDialogClose}
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
            id="qr-code-dialog-title"
            sx={{ 
              textAlign: 'center', 
              fontWeight: 'bold',
              color: 'white',
              pt: 3,
              pb: 1
            }}
          >
            Get the FNA.ai Web App
          </DialogTitle>
          
          <DialogContent sx={{ textAlign: 'center', p: 3 }}>
            <Typography variant="body2" sx={{ mb: 3, color: 'rgba(255,255,255,0.7)' }}>
              Scan this QR code to access the FNA.ai web app on your device
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
                value="https://fna-newzify.vercel.app/" 
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
                href="https://fna-newzify.vercel.app/" 
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
                https://fna-newzify.vercel.app/
              </Box> on your device
            </Typography>
          </DialogContent>
        </Box>
      </Dialog>

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
    </AppBar>
  );
};

export default Navbar;
