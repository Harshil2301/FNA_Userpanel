import React, { useState, useRef, useEffect } from 'react';
import { Card, CardMedia, Typography, Box, Avatar, IconButton, Dialog, Backdrop } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import GetAppIcon from '@mui/icons-material/GetApp';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import CloseIcon from '@mui/icons-material/Close';
import PauseIcon from '@mui/icons-material/Pause';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import VolumeOffIcon from '@mui/icons-material/VolumeOff';
import { getVideoUrl, saveVideo, unsaveVideo, isVideoSaved } from '../firebase';

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
  const [saved, setSaved] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [fullscreenMuted, setFullscreenMuted] = useState(false);
  const [fullscreenPlaying, setFullscreenPlaying] = useState(true);
  const videoRef = useRef(null);
  const fullscreenVideoRef = useRef(null);
  const videoUrl = getVideoUrl(videoHash);
  
  // Check if video is saved on component mount
  useEffect(() => {
    setSaved(isVideoSaved(id));
  }, [id]);
  
  // Handle fullscreen video playback
  useEffect(() => {
    if (fullscreen && fullscreenVideoRef.current) {
      if (fullscreenPlaying) {
        fullscreenVideoRef.current.play().catch(err => console.error("Error playing fullscreen video:", err));
      } else {
        fullscreenVideoRef.current.pause();
      }
    }
  }, [fullscreen, fullscreenPlaying]);
  
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
  
  const handleSave = () => {
    const videoData = { id, caption, overview, tag, timestamp, uploader, videoHash };
    
    if (saved) {
      // Unsave the video
      unsaveVideo(id);
      setSaved(false);
    } else {
      // Save the video
      saveVideo(videoData);
      setSaved(true);
    }
  };
  
  const handleFullscreen = (e) => {
    e.stopPropagation();
    setFullscreen(true);
    setFullscreenPlaying(true);
    if (isPlaying && videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };
  
  const handleCloseFullscreen = () => {
    setFullscreen(false);
    setFullscreenPlaying(false);
  };
  
  const toggleFullscreenPlayPause = () => {
    setFullscreenPlaying(!fullscreenPlaying);
  };
  
  const toggleFullscreenMute = () => {
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.muted = !fullscreenMuted;
      setFullscreenMuted(!fullscreenMuted);
    }
  };
  
  return (
    <>
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
          
          {/* Fullscreen button */}
          <IconButton
            onClick={handleFullscreen}
            sx={{
              position: 'absolute',
              bottom: 10,
              right: 10,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              padding: 1,
              zIndex: 10,
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.7)',
              }
            }}
          >
            <FullscreenIcon fontSize="small" />
          </IconButton>
          
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
                width: 40, 
                height: 40, 
                mr: 1.5,
                background: 'linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)',
                fontWeight: 'bold',
                fontSize: '1rem',
                boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                border: '2px solid rgba(255,255,255,0.15)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'scale(1.05)',
                  boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
                  border: '2px solid rgba(255,255,255,0.25)',
                }
              }}
            >
              {uploader ? (uploader.length > 1 ? uploader.substring(0, 2).toUpperCase() : uploader.charAt(0).toUpperCase()) : 'FN'}
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
                {uploader || (tag === '#generalnews' ? 'Shrey' : 'Harshil')}
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.5)',
                  fontSize: '0.7rem',
                }}
              >
                {formatDate(timestamp) || (tag === '#generalnews' ? 'March 7, 2025' : 'March 18, 2025')}
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
                color: saved ? '#7C4DFF' : 'rgba(255, 255, 255, 0.6)',
                p: 0.5,
                ml: 1,
                '&:hover': {
                  color: saved ? '#9C7DFF' : 'white'
                }
              }}
              onClick={handleSave}
            >
              {saved ? <BookmarkIcon fontSize="small" /> : <BookmarkBorderIcon fontSize="small" />}
            </IconButton>
          </Box>
        </Box>
      </Card>
      
      {/* Fullscreen Modal */}
      <Dialog
        open={fullscreen}
        onClose={handleCloseFullscreen}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0,0,0,0.95)',
            boxShadow: 'none',
          }
        }}
      >
        <Box 
          sx={{ 
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            outline: 'none'
          }}
        >
          {/* Video in fullscreen */}
          <Box sx={{ 
            width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
            height: { xs: '50%', sm: '60%', md: '70%' },
            position: 'relative',
            backgroundColor: '#000',
            boxShadow: '0 0 50px rgba(0,0,0,0.8)',
            borderRadius: '8px',
            overflow: 'hidden'
          }}>
            <CardMedia
              component="video"
              ref={fullscreenVideoRef}
              src={videoUrl}
              autoPlay
              muted={fullscreenMuted}
              onEnded={() => setFullscreenPlaying(false)}
              sx={{ 
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                backgroundColor: '#000'
              }}
            />
            
            {/* Video controls overlay */}
            <Box
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                p: 2,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 100%)',
                transition: 'opacity 0.3s ease',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <IconButton
                  onClick={toggleFullscreenPlayPause}
                  sx={{ 
                    color: 'white',
                    '&:hover': { color: '#7C4DFF' }
                  }}
                >
                  {fullscreenPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                </IconButton>
                <IconButton
                  onClick={toggleFullscreenMute}
                  sx={{ 
                    color: 'white',
                    ml: 1,
                    '&:hover': { color: '#7C4DFF' }
                  }}
                >
                  {fullscreenMuted ? <VolumeOffIcon /> : <VolumeUpIcon />}
                </IconButton>
              </Box>
              
              <Typography 
                variant="h6" 
                sx={{ 
                  color: 'white',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  textAlign: 'center',
                  flexGrow: 1,
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)'
                }}
              >
                {caption || 'News Report'}
              </Typography>
              
              <IconButton
                onClick={handleCloseFullscreen}
                sx={{ 
                  color: 'white',
                  '&:hover': { color: '#FF5252' }
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
          
          {/* Video info */}
          <Box sx={{ 
            width: { xs: '100%', sm: '90%', md: '80%', lg: '70%' },
            p: 2,
            color: 'white',
            mt: 2
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontWeight: 500,
                mb: 1,
                opacity: 0.9
              }}
            >
              {overview || 'No description available'}
            </Typography>
            
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center',
              justifyContent: 'space-between',
              mt: 2
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar
                  sx={{ 
                    width: 40, 
                    height: 40, 
                    mr: 1.5,
                    background: 'linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)',
                    fontWeight: 'bold',
                    fontSize: '1rem',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    border: '2px solid rgba(255,255,255,0.15)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
                      border: '2px solid rgba(255,255,255,0.25)',
                    }
                  }}
                >
                  {uploader ? (uploader.length > 1 ? uploader.substring(0, 2).toUpperCase() : uploader.charAt(0).toUpperCase()) : 'FN'}
                </Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {uploader || (tag === '#generalnews' ? 'Shrey' : 'Harshil')}
                  </Typography>
                  <Typography variant="caption" sx={{ opacity: 0.7 }}>
                    {formatDate(timestamp) || (tag === '#generalnews' ? 'March 7, 2025' : 'March 18, 2025')}
                  </Typography>
                </Box>
              </Box>
              
              <Box>
                <IconButton 
                  sx={{ 
                    color: 'white',
                    '&:hover': { color: '#00E5FF' }
                  }}
                  onClick={handleDownload}
                >
                  <GetAppIcon />
                </IconButton>
                <IconButton 
                  sx={{ 
                    color: saved ? '#7C4DFF' : 'white',
                    ml: 1,
                    '&:hover': { color: saved ? '#9C7DFF' : '#7C4DFF' }
                  }}
                  onClick={handleSave}
                >
                  {saved ? <BookmarkIcon /> : <BookmarkBorderIcon />}
                </IconButton>
              </Box>
            </Box>
          </Box>
        </Box>
      </Dialog>
    </>
  );
};

export default VideoCard; 