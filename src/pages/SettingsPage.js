import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid,
  Paper,
  Switch,
  Slider,
  FormControlLabel,
  FormGroup,
  Divider,
  TextField,
  Button,
  Alert,
  Snackbar,
  MenuItem,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import { FaSave, FaCheck, FaUndo } from 'react-icons/fa';

// Settings schema with defaults
const defaultSettings = {
  appearance: {
    darkMode: true,
    fontSize: 16,
    accentColor: 'default',
  },
  videos: {
    autoplay: false,
    defaultVolume: 50,
    defaultMuted: true,
    showHashtags: true,
  },
  notifications: {
    emailNotifications: false,
    pushNotifications: true,
    notificationFrequency: 'daily',
  },
  account: {
    username: '',
    email: '',
    profilePicture: '',
  }
};

// Available accent colors
const accentColors = [
  { id: 'default', name: 'Default Purple', value: '#7C4DFF' },
  { id: 'blue', name: 'Ocean Blue', value: '#2196F3' },
  { id: 'green', name: 'Emerald Green', value: '#4CAF50' },
  { id: 'red', name: 'Ruby Red', value: '#F44336' },
  { id: 'orange', name: 'Amber Orange', value: '#FF9800' },
  { id: 'pink', name: 'Rose Pink', value: '#E91E63' },
];

const SettingsPage = () => {
  const [settings, setSettings] = useState(defaultSettings);
  const [savedSettings, setSavedSettings] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings');
    if (storedSettings) {
      try {
        setSettings(JSON.parse(storedSettings));
      } catch (error) {
        console.error('Error parsing stored settings:', error);
      }
    }
  }, []);

  // Check for unsaved changes
  useEffect(() => {
    const storedSettings = localStorage.getItem('userSettings');
    if (storedSettings) {
      const parsedStoredSettings = JSON.parse(storedSettings);
      setHasChanges(JSON.stringify(parsedStoredSettings) !== JSON.stringify(settings));
    } else {
      setHasChanges(JSON.stringify(defaultSettings) !== JSON.stringify(settings));
    }
  }, [settings]);

  // Handle settings changes
  const handleSettingChange = (section, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [setting]: value
      }
    }));
  };

  // Save settings
  const saveSettings = () => {
    localStorage.setItem('userSettings', JSON.stringify(settings));
    setSavedSettings(true);
    setSnackbarOpen(true);
    setHasChanges(false);
    
    // Apply settings to the app
    applySettings();
  };

  // Reset settings to defaults
  const resetSettings = () => {
    setSettings(defaultSettings);
    setHasChanges(true);
  };

  // Apply settings to the app
  const applySettings = () => {
    // Here you would implement actually applying the settings
    // This is a placeholder where you'd add code to update the app's appearance and behavior
    console.log('Applying settings:', settings);
    
    // Example: apply accent color
    document.documentElement.style.setProperty('--primary-color', 
      accentColors.find(color => color.id === settings.appearance.accentColor)?.value || '#7C4DFF'
    );
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <Box className="settings-content" sx={{ pt: '80px', px: { xs: 2, sm: 3, md: 4 }, pb: 6, maxWidth: '1200px', margin: '0 auto' }}>
      <Typography 
        variant="h4" 
        component="h1" 
        sx={{ 
          mb: 4, 
          fontWeight: 700,
          background: 'linear-gradient(90deg, #7C4DFF 0%, #00E5FF 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          display: 'inline-block'
        }}
      >
        Settings
      </Typography>

      {/* Settings Grid */}
      <Grid container spacing={3}>
        {/* Appearance Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(30, 30, 30, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
              Appearance
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.appearance.darkMode} 
                    onChange={(e) => handleSettingChange('appearance', 'darkMode', e.target.checked)}
                    color="primary"
                  />
                } 
                label="Dark Mode" 
                sx={{ color: 'white' }}
              />
            </FormGroup>
            
            <Box sx={{ mb: 3 }}>
              <Typography id="font-size-slider" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Font Size: {settings.appearance.fontSize}px
              </Typography>
              <Slider
                value={settings.appearance.fontSize}
                onChange={(e, newValue) => handleSettingChange('appearance', 'fontSize', newValue)}
                aria-labelledby="font-size-slider"
                valueLabelDisplay="auto"
                step={1}
                marks
                min={12}
                max={20}
                color="primary"
              />
            </Box>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="accent-color-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Accent Color</InputLabel>
              <Select
                labelId="accent-color-label"
                id="accent-color-select"
                value={settings.appearance.accentColor}
                label="Accent Color"
                onChange={(e) => handleSettingChange('appearance', 'accentColor', e.target.value)}
                sx={{ 
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--primary-color)',
                  }
                }}
              >
                {accentColors.map((color) => (
                  <MenuItem key={color.id} value={color.id}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Box sx={{ width: 16, height: 16, borderRadius: '50%', backgroundColor: color.value }} />
                      <Typography>{color.name}</Typography>
                    </Box>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        
        {/* Video Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(30, 30, 30, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
              Video Preferences
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.videos.autoplay} 
                    onChange={(e) => handleSettingChange('videos', 'autoplay', e.target.checked)}
                    color="primary"
                  />
                } 
                label="Autoplay Videos" 
                sx={{ color: 'white' }}
              />
              
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.videos.defaultMuted} 
                    onChange={(e) => handleSettingChange('videos', 'defaultMuted', e.target.checked)}
                    color="primary"
                  />
                } 
                label="Mute Videos by Default" 
                sx={{ color: 'white' }}
              />
              
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.videos.showHashtags} 
                    onChange={(e) => handleSettingChange('videos', 'showHashtags', e.target.checked)}
                    color="primary"
                  />
                } 
                label="Show Hashtags" 
                sx={{ color: 'white' }}
              />
            </FormGroup>
            
            <Box sx={{ mb: 3 }}>
              <Typography id="volume-slider" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Default Volume: {settings.videos.defaultVolume}%
              </Typography>
              <Slider
                value={settings.videos.defaultVolume}
                onChange={(e, newValue) => handleSettingChange('videos', 'defaultVolume', newValue)}
                aria-labelledby="volume-slider"
                valueLabelDisplay="auto"
                step={5}
                marks
                min={0}
                max={100}
                color="primary"
              />
            </Box>
          </Paper>
        </Grid>
        
        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(30, 30, 30, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
              Notification Settings
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <FormGroup sx={{ mb: 3 }}>
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.notifications.emailNotifications} 
                    onChange={(e) => handleSettingChange('notifications', 'emailNotifications', e.target.checked)}
                    color="primary"
                  />
                } 
                label="Email Notifications" 
                sx={{ color: 'white' }}
              />
              
              <FormControlLabel 
                control={
                  <Switch 
                    checked={settings.notifications.pushNotifications} 
                    onChange={(e) => handleSettingChange('notifications', 'pushNotifications', e.target.checked)}
                    color="primary"
                  />
                } 
                label="Push Notifications" 
                sx={{ color: 'white' }}
              />
            </FormGroup>
            
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="frequency-label" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Notification Frequency</InputLabel>
              <Select
                labelId="frequency-label"
                id="frequency-select"
                value={settings.notifications.notificationFrequency}
                label="Notification Frequency"
                onChange={(e) => handleSettingChange('notifications', 'notificationFrequency', e.target.value)}
                sx={{ 
                  color: 'white',
                  '.MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: 'var(--primary-color)',
                  }
                }}
              >
                <MenuItem value="realtime">Real-time</MenuItem>
                <MenuItem value="daily">Daily Digest</MenuItem>
                <MenuItem value="weekly">Weekly Summary</MenuItem>
                <MenuItem value="never">Never</MenuItem>
              </Select>
            </FormControl>
          </Paper>
        </Grid>
        
        {/* Account Settings */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%', backgroundColor: 'rgba(30, 30, 30, 0.6)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <Typography variant="h6" sx={{ mb: 2, color: 'white', fontWeight: 600 }}>
              Account Information
            </Typography>
            <Divider sx={{ mb: 3, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
            
            <TextField
              label="Username"
              variant="outlined"
              fullWidth
              margin="normal"
              value={settings.account.username}
              onChange={(e) => handleSettingChange('account', 'username', e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary-color)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'var(--primary-color)',
                  },
                },
              }}
            />
            
            <TextField
              label="Email Address"
              variant="outlined"
              fullWidth
              margin="normal"
              type="email"
              value={settings.account.email}
              onChange={(e) => handleSettingChange('account', 'email', e.target.value)}
              sx={{ 
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  color: 'white',
                  '& fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                  },
                  '&:hover fieldset': {
                    borderColor: 'rgba(255, 255, 255, 0.5)',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'var(--primary-color)',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&.Mui-focused': {
                    color: 'var(--primary-color)',
                  },
                },
              }}
            />
            
            <Alert 
              severity="info" 
              sx={{ 
                mt: 2,
                backgroundColor: 'rgba(30, 73, 118, 0.1)',
                color: 'white',
                borderRadius: '8px'
              }}
            >
              Account settings are for demonstration only and are not connected to an actual user database.
            </Alert>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Save/Reset Buttons */}
      <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button 
          variant="outlined" 
          color="primary" 
          startIcon={<FaUndo />}
          onClick={resetSettings}
          sx={{ 
            borderColor: 'rgba(255, 255, 255, 0.3)',
            color: 'white',
            '&:hover': {
              borderColor: 'rgba(255, 255, 255, 0.5)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            }
          }}
        >
          Reset to Defaults
        </Button>
        
        <Button 
          variant="contained" 
          color="primary" 
          startIcon={hasChanges ? <FaSave /> : <FaCheck />}
          onClick={saveSettings}
          disabled={!hasChanges}
          sx={{ 
            fontWeight: 600,
            boxShadow: '0 4px 12px rgba(124, 77, 255, 0.3)',
            '&:hover': {
              boxShadow: '0 6px 14px rgba(124, 77, 255, 0.4)',
              transform: 'translateY(-2px)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(124, 77, 255, 0.4)',
              color: 'rgba(255, 255, 255, 0.6)',
            }
          }}
        >
          {hasChanges ? 'Save Changes' : 'Saved'}
        </Button>
      </Box>
      
      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity="success" 
          sx={{ 
            width: '100%',
            backgroundColor: 'rgba(46, 125, 50, 0.9)',
            color: 'white',
            fontWeight: 500,
            borderRadius: '8px',
          }}
        >
          Settings saved successfully!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default SettingsPage; 