import React, { useState, useEffect } from 'react';
import { Grid, Card, Typography, Box, CircularProgress } from '@mui/material';
import VideoCard from './VideoCard';
import { fetchVideos } from '../firebase';

const NewsList = ({ category }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true);
        const videoData = await fetchVideos(6, category);
        
        // Remove the override for the first two videos that's causing incorrect data
        // The server should provide the correct data for all videos
        
        setVideos(videoData);
        setLoading(false);
      } catch (err) {
        console.error('Error loading videos:', err);
        setError('Failed to load videos. Please try again later.');
        setLoading(false);
      }
    };

    loadVideos();
  }, [category]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
        <CircularProgress sx={{ color: '#7C4DFF' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: 'center', my: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  // Sample featured video - use first video or fallback to sample
  const featuredVideo = videos.length > 0 ? videos[0] : {
    id: 'featured',
    caption: 'Discover the advanced AI technology behind FNA.ai',
    overview: 'Learn how our groundbreaking deepfake detection model works to identify manipulated media and combat misinformation',
    tag: '#technology',
    timestamp: new Date(),
    uploader: 'FNA Team',
    videoHash: null
  };

  return (
    <>
      {/* Video Grid - only 2 cards per row */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {videos.length > 0 ? (
          videos.map((video) => (
            <Grid item xs={12} sm={6} key={video.id}>
              <VideoCard {...video} />
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography sx={{ textAlign: 'center', my: 4 }}>
              {category 
                ? `No videos available for ${category} category at the moment. Please check back later.` 
                : 'No videos available at the moment. Please check back later.'}
            </Typography>
          </Grid>
        )}
      </Grid>

      {/* Technology Spotlight below videos */}
      {!category && (
        <Card 
          sx={{ 
            position: 'relative', 
            overflow: 'hidden',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            mb: 4,
            background: 'linear-gradient(135deg, rgba(124,77,255,0.2) 0%, rgba(0,229,255,0.2) 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            height: 300,
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/images/featured-bg.jpg)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              zIndex: -1,
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to right, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%)',
                zIndex: 0
              }
            }}
          />

          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '100%',
              p: 4,
              color: '#fff',
              zIndex: 1
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                opacity: 0.8,
                fontSize: '0.8rem',
                fontWeight: 500,
                mb: 1,
                display: 'block',
                color: '#00E5FF'
              }}
            >
              Technology Spotlight
            </Typography>
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 700, 
                mb: 1,
                fontSize: { xs: '1.8rem', sm: '2.2rem', md: '2.5rem' },
                lineHeight: 1.2,
                width: { xs: '100%', sm: '80%', md: '60%' },
                background: 'linear-gradient(90deg, #ffffff 0%, #00E5FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              AI-Powered News Analysis
            </Typography>
            <Typography
              variant="body1"
              sx={{
                mt: 2,
                opacity: 0.8,
                width: { xs: '100%', sm: '70%', md: '50%' },
                fontSize: '1rem'
              }}
            >
              Our AI detects fake news with 79.8% accuracy, keeping you informed and protected.
            </Typography>
          </Box>
        </Card>
      )}
    </>
  );
};

export default NewsList; 