import React from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  useMediaQuery,
  Paper,
  Chip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import {
  Dashboard as DashboardIcon,
  Newspaper as NewspaperIcon,
  Bookmark as BookmarkIcon,
  TrendingUp as TrendingUpIcon,
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  AccountCircle as AccountCircleIcon,
} from '@mui/icons-material';

// Mock data for popular categories
const categories = [
  { id: 1, name: 'Politics', count: 24 },
  { id: 2, name: 'Technology', count: 18 },
  { id: 3, name: 'Business', count: 15 },
  { id: 4, name: 'Sports', count: 12 },
  { id: 5, name: 'Entertainment', count: 10 },
];

// Navigation links
const mainNavItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/' },
  { text: 'News Feed', icon: <NewspaperIcon />, path: '/news' },
  { text: 'Trending', icon: <TrendingUpIcon />, path: '/trending' },
  { text: 'Bookmarks', icon: <BookmarkIcon />, path: '/bookmarks' },
  { text: 'Notifications', icon: <NotificationsIcon />, path: '/notifications' },
];

const userNavItems = [
  { text: 'Profile', icon: <AccountCircleIcon />, path: '/profile' },
  { text: 'Settings', icon: <SettingsIcon />, path: '/settings' },
];

const Sidebar = () => {
  const theme = useTheme();
  const location = useLocation();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Don't show sidebar on mobile as we handle it via the Header's drawer
  if (isMobile) {
    return null;
  }
  
  const drawerWidth = 240;
  
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          border: 'none',
          background: theme.palette.background.default,
        },
      }}
      variant="permanent"
      anchor="left"
    >
      <Box sx={{ p: 2, pt: 3 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          Main Menu
        </Typography>
      </Box>
      
      <List component="nav">
        {mainNavItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              my: 0.5,
              px: 2,
              py: 1,
              borderRadius: '8px',
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.light}20`,
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                }
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Divider sx={{ my: 2 }} />
      
      <Box sx={{ p: 2 }}>
        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold', mb: 1 }}>
          Popular Categories
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {categories.map((category) => (
            <Chip
              key={category.id}
              label={`${category.name} (${category.count})`}
              component={RouterLink}
              to={`/category/${category.name.toLowerCase()}`}
              clickable
              size="small"
              color="primary"
              variant="outlined"
              sx={{ margin: '4px' }}
            />
          ))}
        </Box>
      </Box>
      
      <Divider sx={{ my: 2 }} />
      
      <List component="nav">
        {userNavItems.map((item) => (
          <ListItem 
            button 
            key={item.text}
            component={RouterLink}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              my: 0.5,
              px: 2,
              py: 1,
              borderRadius: '8px',
              mx: 1,
              '&.Mui-selected': {
                backgroundColor: `${theme.palette.primary.light}20`,
                color: theme.palette.primary.main,
                '& .MuiListItemIcon-root': {
                  color: theme.palette.primary.main,
                }
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
      
      <Box sx={{ flexGrow: 1 }} />
      
      <Paper 
        elevation={0} 
        sx={{ 
          m: 2, 
          p: 2, 
          borderRadius: 2,
          bgcolor: 'rgba(25, 118, 210, 0.05)',
          border: '1px solid rgba(25, 118, 210, 0.1)'
        }}
      >
        <Typography variant="subtitle2" gutterBottom>
          Need help?
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Visit our help center or contact support.
        </Typography>
        <RouterLink to="/help" style={{ textDecoration: 'none' }}>
          <Typography variant="body2" color="primary">
            Help Center →
          </Typography>
        </RouterLink>
      </Paper>
    </Drawer>
  );
};

export default Sidebar; 