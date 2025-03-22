import React, { useState, useEffect, useRef } from 'react';
import { 
  Typography, 
  Box, 
  CircularProgress, 
  Alert,
  Card,
  CardMedia,
  CardContent,
  Avatar,
  Button,
  Chip,
  IconButton,
  Modal,
  Backdrop,
  Dialog
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { FaDownload, FaEye, FaThumbsUp, FaCheck, FaPlay, FaPause, FaVolumeMute, FaVolumeUp, FaBookmark, FaRegBookmark, FaExpand, FaTimes } from 'react-icons/fa';
import { fetchVideos, getThumbnailUrl, getVideoUrl, saveVideo, unsaveVideo, isVideoSaved } from '../firebase';

// Helper function to parse query parameters
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const TrendingPage = () => {
  const [videos, setVideos] = useState([]);
  const [filteredVideos, setFilteredVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [mutedVideos, setMutedVideos] = useState({});
  const videoRefs = useRef({});
  const [savedVideos, setSavedVideos] = useState({});
  const query = useQuery();
  const searchParam = query.get('search');
  const [fullscreenVideo, setFullscreenVideo] = useState(null);
  const [fullscreenPlaying, setFullscreenPlaying] = useState(true);
  const [fullscreenMuted, setFullscreenMuted] = useState(false);
  const fullscreenVideoRef = useRef(null);

  useEffect(() => {
    const fetchAndRandomizeVideos = async () => {
      try {
        setLoading(true);
        
        // Use the same fetchVideos function as the home page
        const videoData = await fetchVideos(6);
        
        // Fisher-Yates shuffle algorithm to randomize the videos
        const shuffledVideos = [...videoData];
        for (let i = shuffledVideos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffledVideos[i], shuffledVideos[j]] = [shuffledVideos[j], shuffledVideos[i]];
        }
        
        // Initialize all videos as muted
        const initialMutedState = {};
        shuffledVideos.forEach(video => {
          initialMutedState[video.id] = true;
        });
        setMutedVideos(initialMutedState);
        
        setVideos(shuffledVideos);
        setFilteredVideos(shuffledVideos);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching videos for trending page: ', err);
        setError('Failed to load trending videos. Please try again later.');
        setLoading(false);
      }
    };

    fetchAndRandomizeVideos();
  }, []);

  // Filter videos when search parameter changes
  useEffect(() => {
    if (!searchParam || videos.length === 0) {
      setFilteredVideos(videos);
      return;
    }

    const searchTermLower = searchParam.toLowerCase();
    const filtered = videos.filter(video => {
      // Don't use sample data, use only the actual data from Firebase
      const title = video.caption || '';
      const subtitle = video.overview || '';
      const tags = video.tag ? video.tag.split(' ') : [];
      
      // Check if search term is in any of the video's content
      return (
        title.toLowerCase().includes(searchTermLower) ||
        subtitle.toLowerCase().includes(searchTermLower) ||
        tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    });
    
    setFilteredVideos(filtered);
  }, [searchParam, videos]);

  // Add function to check if videos are saved
  useEffect(() => {
    // Set initial saved state for each video
    const initialSavedState = {};
    videos.forEach(video => {
      initialSavedState[video.id] = isVideoSaved(video.id);
    });
    setSavedVideos(initialSavedState);
  }, [videos]);

  // Function to handle video playback
  const handlePlayPause = (videoId) => {
    const videoElement = videoRefs.current[videoId];
    
    if (!videoElement) return;

    if (activeVideo === videoId) {
      // Current video is already playing, pause it
      videoElement.pause();
      setActiveVideo(null);
    } else {
      // Pause any currently playing video
      if (activeVideo && videoRefs.current[activeVideo]) {
        videoRefs.current[activeVideo].pause();
      }
      
      // Play the new video
      videoElement.muted = mutedVideos[videoId];
      videoElement.play().catch(e => console.error("Error playing video:", e));
      setActiveVideo(videoId);
    }
  };

  // Function to toggle mute for a specific video
  const toggleMute = (videoId) => {
    const newMutedState = !mutedVideos[videoId];
    setMutedVideos(prev => ({ ...prev, [videoId]: newMutedState }));
    
    // Apply to video if it's the currently playing one
    if (videoId === activeVideo && videoRefs.current[videoId]) {
      videoRefs.current[videoId].muted = newMutedState;
    }
  };

  // Function to get random view count (0-999)
  const getRandomViews = () => Math.floor(Math.random() * 100);

  // Function to handle download
  const handleDownload = (videoUrl, id) => {
    if (videoUrl) {
      const a = document.createElement('a');
      a.href = videoUrl;
      a.download = `fna-video-${id}.mp4`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  };

  // Function to handle video save/unsave
  const handleSaveToggle = (e, video) => {
    e.stopPropagation(); // Prevent triggering video play
    
    const videoData = { ...video };
    const currentSaved = savedVideos[video.id];
    
    if (currentSaved) {
      // Unsave the video
      unsaveVideo(video.id);
      setSavedVideos(prev => ({
        ...prev,
        [video.id]: false
      }));
    } else {
      // Save the video
      saveVideo(videoData);
      setSavedVideos(prev => ({
        ...prev,
        [video.id]: true
      }));
    }
  };

  // Handle fullscreen video
  useEffect(() => {
    if (fullscreenVideo && fullscreenVideoRef.current) {
      if (fullscreenPlaying) {
        fullscreenVideoRef.current.play().catch(err => console.error("Error playing fullscreen video:", err));
      } else {
        fullscreenVideoRef.current.pause();
      }
    }
  }, [fullscreenVideo, fullscreenPlaying]);

  // Function to open fullscreen video
  const handleOpenFullscreen = (e, video) => {
    e.stopPropagation(); // Prevent triggering video play
    setFullscreenVideo(video);
    setFullscreenPlaying(true);
    setFullscreenMuted(mutedVideos[video.id] || false);
    
    // Pause any playing video
    if (activeVideo && videoRefs.current[activeVideo]) {
      videoRefs.current[activeVideo].pause();
      setActiveVideo(null);
    }
  };

  // Function to close fullscreen video
  const handleCloseFullscreen = () => {
    setFullscreenVideo(null);
    setFullscreenPlaying(false);
  };

  // Function to toggle fullscreen play/pause
  const toggleFullscreenPlayPause = () => {
    setFullscreenPlaying(!fullscreenPlaying);
  };

  // Function to toggle fullscreen mute
  const toggleFullscreenMute = () => {
    if (fullscreenVideoRef.current) {
      fullscreenVideoRef.current.muted = !fullscreenMuted;
      setFullscreenMuted(!fullscreenMuted);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px" className="loading-container">
        <CircularProgress sx={{ color: 'var(--primary-color)' }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mb: 4 }}>
        {error}
      </Alert>
    );
  }

  return (
    <Box sx={{ animation: 'fadeIn 0.5s ease-in-out' }}>
      <Typography variant="h1" component="h1" gutterBottom>
        {searchParam ? `Search: ${searchParam}` : 'Trending Insights'}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
        {searchParam 
          ? `Showing results for "${searchParam}"`
          : 'Discover what\'s trending right now. Refresh to see different content.'}
      </Typography>
      
      {/* Video Cards - horizontal layout */}
      <Box sx={{ mb: 4 }}>
        {filteredVideos.length > 0 ? (
          filteredVideos.map((video, index) => {
            const videoUrl = getVideoUrl(video.videoHash);
            const isPlaying = activeVideo === video.id;
            const isMuted = mutedVideos[video.id];
            const isSaved = savedVideos[video.id];
            
            return (
              <Card 
                key={video.id}
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  overflow: 'hidden',
                  borderRadius: '8px',
                  backgroundColor: '#1A1A1A',
                  mb: 3,
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 6px 25px rgba(0,0,0,0.3)',
                    backgroundColor: '#222',
                    '& .video-play-button': {
                      opacity: 1,
                    }
                  }
                }}
              >
                {/* Left side - Video Thumbnail with actual video */}
                <Box 
                  sx={{
                    width: { xs: '100%', sm: 300 },
                    height: { xs: 180, sm: 200 },
                    position: 'relative',
                    flexShrink: 0,
                    cursor: 'pointer',
                    overflow: 'hidden',
                    borderRight: { sm: '1px solid rgba(255,255,255,0.05)' },
                    borderBottom: { xs: '1px solid rgba(255,255,255,0.05)', sm: 'none' }
                  }}
                  onClick={() => handlePlayPause(video.id)}
                >
                  <CardMedia
                    component="video"
                    ref={el => videoRefs.current[video.id] = el}
                    src={videoUrl}
                    poster={getThumbnailUrl(video.videoHash, video)}
                    onEnded={() => setActiveVideo(null)}
                    muted={isMuted}
                    loop
                    sx={{ 
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      backgroundColor: '#333',
                      display: 'block'
                    }}
                  />
                  
                  {/* Play/Pause Overlay */}
                  <Box 
                    className="video-play-button"
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
                      opacity: isPlaying ? 0 : 0.8,
                      transition: 'opacity 0.3s ease',
                      zIndex: 2
                    }}
                  >
                    {isPlaying ? (
                      <FaPause size={42} color="white" />
                    ) : (
                      <FaPlay size={42} color="white" style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
                    )}
                  </Box>
                  
                  {/* Mute/Unmute button - Only visible when video is playing */}
                  {isPlaying && (
                    <IconButton 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMute(video.id);
                      }}
                      sx={{ 
                        position: 'absolute',
                        bottom: 10,
                        right: 10,
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        '&:hover': { 
                          backgroundColor: 'rgba(0,0,0,0.7)' 
                        },
                        width: 32,
                        height: 32,
                        zIndex: 3
                      }}
                    >
                      {isMuted ? <FaVolumeMute size={14} /> : <FaVolumeUp size={14} />}
                    </IconButton>
                  )}
                  
                  {/* Category Label */}
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 10,
                      left: 10,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.75rem',
                      fontWeight: 'bold',
                      zIndex: 1
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        background: 'linear-gradient(90deg, #7C4DFF 0%, #00E5FF 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '0.5px',
                      }}
                    >
                      FNA.ai
                    </Typography>
                  </Box>
                  
                  {/* Fullscreen button (always visible) */}
                  <IconButton 
                    onClick={(e) => handleOpenFullscreen(e, video)}
                    sx={{ 
                      position: 'absolute',
                      bottom: 10,
                      left: 10,
                      color: 'white',
                      backgroundColor: 'rgba(0,0,0,0.5)',
                      '&:hover': { 
                        backgroundColor: 'rgba(0,0,0,0.7)' 
                      },
                      width: 32,
                      height: 32,
                      zIndex: 3
                    }}
                  >
                    <FaExpand size={14} />
                  </IconButton>
                </Box>
                
                {/* Right side - Content */}
                <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                  <CardContent sx={{ 
                    flex: '1 0 auto', 
                    p: 2.5,
                    transition: 'background-color 0.3s ease',
                    '&:hover': {
                      backgroundColor: 'rgba(255,255,255,0.03)',
                    }
                  }}>
                    {/* Title and subtitle */}
                    <Box sx={{ mb: 1.5 }}>
                      <Typography 
                        component="div" 
                        variant="h6" 
                        fontWeight="bold"
                        sx={{ 
                          textTransform: 'uppercase', 
                          letterSpacing: '0.5px', 
                          fontSize: '1.2rem',
                          mb: 0.8,
                          background: 'linear-gradient(90deg, #ffffff 0%, #cccccc 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent',
                        }}
                      >
                        {video.caption || 'News Report'}
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        component="div" 
                        sx={{ mb: 1.5, opacity: 0.8 }}
                      >
                        {video.overview || 'No description available'}
                      </Typography>
                      
                      {/* Tags */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
                        {video.tag ? video.tag.split(' ').map((tag, idx) => (
                          <Chip
                            key={idx}
                            label={tag}
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(37, 37, 37, 0.8)',
                              color: '#aaa',
                              fontSize: '0.75rem',
                              height: 24,
                              transition: 'all 0.2s ease',
                              cursor: 'pointer',
                              '&:hover': {
                                backgroundColor: 'rgba(60, 60, 60, 0.8)',
                                color: 'white',
                              }
                            }}
                          />
                        )) : null}
                      </Box>
                      
                      {/* Stats */}
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5, color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FaThumbsUp size={14} />
                          <span>{getRandomViews()}</span>
                        </Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <FaEye size={14} />
                          <span>{getRandomViews()}</span>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                  
                  {/* User and actions */}
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    p: 2.5, 
                    pt: 0.5,
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    {/* User info */}
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Avatar 
                        sx={{ 
                          width: 36, 
                          height: 36, 
                          background: 'linear-gradient(135deg, #7C4DFF 0%, #00E5FF 100%)',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          border: '2px solid rgba(255,255,255,0.15)',
                          transition: 'transform 0.2s ease, box-shadow 0.2s ease, border 0.2s ease',
                          cursor: 'pointer',
                          boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
                            border: '2px solid rgba(255,255,255,0.25)',
                          }
                        }}
                      >
                        {video.uploader ? 
                          (video.uploader.length > 1 ? 
                            video.uploader.substring(0, 2).toUpperCase() : 
                            video.uploader.charAt(0).toUpperCase()) : 
                          'FN'}
                      </Avatar>
                      <Box>
                        <Typography 
                          variant="subtitle2" 
                          component="span"
                          sx={{ 
                            fontWeight: 'bold', 
                            display: 'flex', 
                            alignItems: 'center',
                            fontSize: '0.9rem'
                          }}
                        >
                          {video.uploader || (index % 3 === 0 ? 'Shrey' : index % 3 === 1 ? 'Priyank' : 'Harshil')}
                          <Box 
                            component="span" 
                            sx={{ 
                              ml: 0.5, 
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'transparent'
                            }}
                          >
                            <FaCheck size={12} color="#4caf50" />
                          </Box>
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'rgba(255,255,255,0.5)',
                            display: 'block',
                            marginTop: '-2px',
                            fontSize: '0.75rem'
                          }}
                        >
                          Verified Creator
                        </Typography>
                      </Box>
                    </Box>
                    
                    {/* Action buttons */}
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      {/* Download button */}
                      <Button 
                        variant="contained" 
                        startIcon={<FaDownload />} 
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDownload(videoUrl, video.id);
                        }}
                        sx={{
                          bgcolor: 'white',
                          color: '#1A1A1A',
                          fontWeight: 'bold',
                          borderRadius: '30px',
                          textTransform: 'uppercase',
                          fontSize: '0.75rem',
                          mr: 1,
                          transition: 'all 0.2s ease',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                          '&:hover': {
                            bgcolor: '#f0f0f0',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                          }
                        }}
                      >
                        Download
                      </Button>
                      
                      {/* Save Button */}
                      <Button 
                        variant="text" 
                        size="small"
                        startIcon={isSaved ? <FaBookmark /> : <FaRegBookmark />}
                        onClick={(e) => handleSaveToggle(e, video)}
                        sx={{ 
                          color: isSaved ? 'var(--primary-color)' : 'rgba(255,255,255,0.7)', 
                          fontSize: '0.8rem', 
                          fontWeight: 'bold',
                          textTransform: 'none',
                          '&:hover': {
                            backgroundColor: 'rgba(124, 77, 255, 0.1)'
                          }
                        }}
                      >
                        {isSaved ? 'Saved' : 'Save'}
                      </Button>
                    </Box>
                  </Box>
                </Box>
              </Card>
            );
          })
        ) : (
          <Typography sx={{ 
            textAlign: 'center', 
            my: 6,
            fontSize: '1.1rem',
            color: 'rgba(255,255,255,0.7)'
          }}>
            {searchParam 
              ? `No results found for "${searchParam}". Try a different search term.` 
              : 'No trending videos available at the moment. Please check back later.'}
          </Typography>
        )}
      </Box>
      
      {/* Fullscreen Video Modal */}
      <Dialog
        open={fullscreenVideo !== null}
        onClose={handleCloseFullscreen}
        fullScreen
        PaperProps={{
          style: {
            backgroundColor: 'rgba(0,0,0,0.95)',
            boxShadow: 'none',
          }
        }}
      >
        {fullscreenVideo && (
          <Box 
            sx={{ 
              width: '100%',
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative'
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
                src={getVideoUrl(fullscreenVideo.videoHash)}
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
                    {fullscreenPlaying ? <FaPause size={18} /> : <FaPlay size={18} />}
                  </IconButton>
                  <IconButton
                    onClick={toggleFullscreenMute}
                    sx={{ 
                      color: 'white',
                      ml: 1,
                      '&:hover': { color: '#7C4DFF' }
                    }}
                  >
                    {fullscreenMuted ? <FaVolumeMute size={18} /> : <FaVolumeUp size={18} />}
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
                  {fullscreenVideo.caption || 'News Report'}
                </Typography>
                
                <IconButton
                  onClick={handleCloseFullscreen}
                  sx={{ 
                    color: 'white',
                    '&:hover': { color: '#FF5252' }
                  }}
                >
                  <FaTimes size={18} />
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
                {fullscreenVideo.overview || 'No description available'}
              </Typography>
              
              {/* Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5, mt: 1.5 }}>
                {(fullscreenVideo.tag ? fullscreenVideo.tag.split(' ') : ['#news']).map((tag, idx) => (
                  <Chip
                    key={idx}
                    label={tag}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(37, 37, 37, 0.8)',
                      color: '#aaa',
                      fontSize: '0.75rem',
                      height: 24,
                    }}
                  />
                ))}
              </Box>
              
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
                      border: '2px solid rgba(255,255,255,0.15)',
                      boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 6px 12px rgba(0,0,0,0.4)',
                        border: '2px solid rgba(255,255,255,0.25)',
                      }
                    }}
                  >
                    {fullscreenVideo.uploader ? 
                      (fullscreenVideo.uploader.length > 1 ? 
                        fullscreenVideo.uploader.substring(0, 2).toUpperCase() : 
                        fullscreenVideo.uploader.charAt(0).toUpperCase()) : 
                      'FN'}
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 'bold', display: 'flex', alignItems: 'center' }}>
                      {fullscreenVideo.uploader || 'Unknown'}
                      <Box component="span" sx={{ ml: 0.5, display: 'inline-flex' }}>
                        <FaCheck size={12} color="#4caf50" />
                      </Box>
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                      Verified Creator
                    </Typography>
                  </Box>
                </Box>
                
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Button 
                    variant="contained" 
                    startIcon={<FaDownload />} 
                    size="small"
                    onClick={() => handleDownload(getVideoUrl(fullscreenVideo.videoHash), fullscreenVideo.id)}
                    sx={{
                      bgcolor: 'white',
                      color: '#1A1A1A',
                      fontWeight: 'bold',
                      borderRadius: '30px',
                      textTransform: 'uppercase',
                      fontSize: '0.75rem',
                      mr: 1,
                      '&:hover': {
                        bgcolor: '#f0f0f0',
                        transform: 'translateY(-2px)',
                      }
                    }}
                  >
                    Download
                  </Button>
                  
                  <Button 
                    variant="outlined" 
                    size="small"
                    startIcon={savedVideos[fullscreenVideo.id] ? <FaBookmark /> : <FaRegBookmark />}
                    onClick={() => handleSaveToggle(new Event('click'), fullscreenVideo)}
                    sx={{ 
                      color: savedVideos[fullscreenVideo.id] ? 'var(--primary-color)' : 'white',
                      borderColor: 'rgba(255,255,255,0.3)',
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      borderRadius: '30px',
                      '&:hover': {
                        borderColor: 'rgba(255,255,255,0.5)',
                      }
                    }}
                  >
                    {savedVideos[fullscreenVideo.id] ? 'Saved' : 'Save'}
                  </Button>
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Dialog>
    </Box>
  );
};

export default TrendingPage; 