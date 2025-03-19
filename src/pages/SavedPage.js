import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Box, 
  Grid,
  Alert
} from '@mui/material';
import VideoCard from '../components/VideoCard';
import { getSavedVideos } from '../firebase';

const SavedPage = () => {
  const [savedVideos, setSavedVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load saved videos on mount
    const loadSavedVideos = () => {
      setLoading(true);
      const videos = getSavedVideos();
      setSavedVideos(videos);
      setLoading(false);
    };

    loadSavedVideos();

    // Listen for storage changes to update the UI
    const handleStorageChange = () => {
      loadSavedVideos();
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for updates from within the app
    window.addEventListener('savedVideosUpdated', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('savedVideosUpdated', handleStorageChange);
    };
  }, []);

  return (
    <Box className="saved-content" sx={{ pt: '80px', px: { xs: 2, sm: 3, md: 4 }, maxWidth: '1400px', margin: '0 auto' }}>
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
        Saved Videos
      </Typography>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography>Loading saved videos...</Typography>
        </Box>
      ) : savedVideos.length > 0 ? (
        <Grid container spacing={3}>
          {savedVideos.map((video) => (
            <Grid item xs={12} sm={6} md={4} key={video.id}>
              <VideoCard {...video} />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Alert 
          severity="info" 
          sx={{ 
            my: 4,
            backgroundColor: 'rgba(30, 73, 118, 0.1)',
            color: 'white',
            borderRadius: '8px'
          }}
        >
          You haven't saved any videos yet. Click the bookmark icon on videos to save them for later.
        </Alert>
      )}
    </Box>
  );
};

export default SavedPage; 