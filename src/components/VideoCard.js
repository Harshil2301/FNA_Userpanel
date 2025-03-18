import React, { useState, useRef } from 'react';
import { Card, CardContent, Typography, Box, Avatar, IconButton, CardMedia } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import GetAppIcon from '@mui/icons-material/GetApp';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import { getVideoUrl } from '../firebase';

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  
  try {
    // Handle Firestore timestamp
    if (timestamp.toDate) {
      return new Date(timestamp.toDate()).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    }
    
    // Handle string timestamp
    return new Date(timestamp).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
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
      backgroundColor: '#222222',
      background: 'linear-gradient(145deg, rgba(40,40,40,1) 0%, rgba(25,25,25,1) 100%)',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
      }
    }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="video"
          ref={videoRef}
          onEnded={() => setIsPlaying(false)}
          height="200"
          src={videoUrl}
          sx={{ 
            objectFit: 'cover',
            cursor: 'pointer',
            borderBottom: '1px solid rgba(255,255,255,0.05)'
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
                fontSize: 60, 
                color: 'white',
                opacity: 0.8,
                transition: 'all 0.3s ease',
                '&:hover': {
                  opacity: 1,
                  transform: 'scale(1.1)'
                }
              }} 
            />
          )}
        </Box>
        {tag && (
          <Box
            sx={{
              position: 'absolute',
              top: 10,
              right: 10,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(5px)',
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
                fontSize: '0.7rem',
              }}
            >
              {tag.split(' ')[0]}
            </Typography>
          </Box>
        )}
      </Box>
      
      <Box sx={{ p: 2, paddingBottom: 0, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1.1rem',
            mb: 1,
            color: 'white',
            height: '2.4em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            background: 'linear-gradient(90deg, #ffffff 0%, #e0e0e0 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          {caption || 'New Report'}
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ 
            mb: 2,
            color: 'rgba(255, 255, 255, 0.7)',
            height: '4.2em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            flexGrow: 1,
          }}
        >
          {overview || 'No description available'}
        </Typography>
      </Box>
      
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mt: 'auto',
        p: 2,
        pt: 1,
        borderTop: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={`https://ui-avatars.com/api/?name=${uploader || 'User'}&background=random`}
            sx={{ 
              width: 32, 
              height: 32, 
              mr: 1,
              border: '2px solid #7C4DFF',
            }}
          />
          <Box>
            <Typography 
              variant="subtitle2" 
              sx={{ 
                fontWeight: 'bold',
                color: 'white',
                lineHeight: 1.2,
              }}
            >
              {uploader || 'Anonymous'}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.7rem',
              }}
            >
              {formatDate(timestamp) || 'Unknown date'}
            </Typography>
          </Box>
        </Box>
        <Box>
          <IconButton 
            size="small" 
            sx={{ 
              color: 'rgba(255, 255, 255, 0.6)',
              p: 0.5,
              mr: 1,
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