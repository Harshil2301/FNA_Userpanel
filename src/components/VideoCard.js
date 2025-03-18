import React, { useState, useRef } from 'react';
import { Card, CardMedia, Typography, Box, Avatar, IconButton } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GetAppIcon from '@mui/icons-material/GetApp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { getVideoUrl } from '../firebase';

// Helper function to format dates
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    const date = timestamp instanceof Date 
      ? timestamp 
      : timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    // Format: "March 7, 2025"
    return new Intl.DateTimeFormat('en-US', { 
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    }).format(date);
  } catch (err) {
    console.error('Error formatting date:', err);
    return '';
  }
};

const VideoCard = ({ id, caption, overview, tag, timestamp, uploader, videoHash }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);
  const videoUrl = getVideoUrl(videoHash);
  
  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  
  const handleDownload = () => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `fna-video-${id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      console.error('No video hash available for download');
    }
  };
  
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      backgroundColor: '#1A1A1A',
      borderRadius: '12px',
      transition: 'transform 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
      }
    }}>
      <Box sx={{ position: 'relative' }}>
        {/* FNA.ai logo in top left */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 10,
            backgroundColor: 'rgba(0,0,0,0.5)',
            borderRadius: '4px',
            padding: '3px 6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            sx={{
              fontSize: '0.65rem',
              fontWeight: 'bold',
              color: 'white',
              background: 'linear-gradient(90deg, #7C4DFF 0%, #00E5FF 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              letterSpacing: '0.5px',
            }}
          >
            FNA.ai
          </Typography>
        </Box>
        
        <CardMedia
          component="video"
          ref={videoRef}
          onEnded={() => setIsPlaying(false)}
          height="240"
          src={videoUrl}
          sx={{ 
            objectFit: 'cover',
            cursor: 'pointer',
            borderRadius: '12px 12px 0 0'
          }}
          onClick={handlePlayPause}
        />
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isPlaying ? 'transparent' : 'rgba(0,0,0,0.4)',
            transition: 'background-color 0.3s ease',
            cursor: 'pointer',
          }}
          onClick={handlePlayPause}
        >
          {!isPlaying && (
            <PlayArrowIcon 
              sx={{ 
                fontSize: 70, 
                color: 'white',
                opacity: 0.9,
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.1)'
                }
              }} 
            />
          )}
        </Box>
        
        {/* Hashtag in top right */}
        {tag && (
          <Box
            sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              backgroundColor: 'rgba(0,0,0,0.5)',
              borderRadius: '4px',
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              zIndex: 10
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: '#00E5FF',
                fontWeight: 500,
                fontSize: '0.8rem',
              }}
            >
              {tag.startsWith('#') ? tag : `#${tag}`}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            color: 'white',
            lineHeight: 1.2,
            mb: 1
          }}
        >
          {caption || 'News Report'}
        </Typography>
        
        <Typography 
          variant="body2" 
          sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.85rem',
            mb: 2
          }}
        >
          {overview || 'No description available'}
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        px: 2,
        pb: 2
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            sx={{ 
              width: 30, 
              height: 30, 
              mr: 1,
              bgcolor: tag === '#generalnews' ? '#00E5FF' : 'primary.main',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.7rem'
            }}
          >
            {tag === '#generalnews' ? 'SH' : 'HA'}
          </Avatar>
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
                fontSize: '0.85rem'
              }}
            >
              {uploader || tag === '#generalnews' ? 'Shrey' : 'Harshil'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.7rem',
              }}
            >
              {tag === '#generalnews' ? 'March 7, 2025' : 'March 18, 2025'}
            </Typography>
          </Box>
        </Box>
        
        <Box>
          <IconButton 
            size="small" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              p: 0.5,
              '&:hover': {
                color: 'white'
              }
            }}
            onClick={handleDownload}
          >
            <GetAppIcon fontSize="small" />
          </IconButton>
          <IconButton 
            size="small" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              p: 0.5,
              ml: 1,
              '&:hover': {
                color: 'white'
              }
            }}
          >
            <BookmarkBorderIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Card>
  );
};

export default VideoCard; 