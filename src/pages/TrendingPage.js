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
  IconButton
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import { FaDownload, FaEye, FaThumbsUp, FaCheck, FaPlay, FaPause, FaVolumeMute, FaVolumeUp } from 'react-icons/fa';
import { fetchVideos, getThumbnailUrl, getVideoUrl } from '../firebase';

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
  const query = useQuery();
  const searchParam = query.get('search');

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
      // Create sample data if video data is incomplete
      const newsTypes = [
        { title: "NEW REPORT", subtitle: "General Daily News on Climate", tags: ["#generalnews", "#news"] },
        { title: "ISRAEL NEWS", subtitle: "Attack News on Israel", tags: ["#news", "#attack", "#israel"] }, 
        { title: "NEWS ABOUT CLIMATE", subtitle: "Weather News", tags: ["#news", "#climate"] },
        { title: "WORLD NEWS", subtitle: "International Updates", tags: ["#news", "#world"] },
        { title: "TECHNOLOGY NEWS", subtitle: "Latest in Tech", tags: ["#tech", "#news"] },
        { title: "BREAKING NEWS", subtitle: "Urgent Updates", tags: ["#breaking", "#news"] }
      ];
      
      const index = videos.indexOf(video) % newsTypes.length;
      const newsItem = newsTypes[index];
      const title = video.caption || newsItem.title;
      const subtitle = video.overview || newsItem.subtitle;
      const tags = video.tag ? video.tag.split(' ') : newsItem.tags;
      
      // Check if search term is in any of the video's content
      return (
        title.toLowerCase().includes(searchTermLower) ||
        subtitle.toLowerCase().includes(searchTermLower) ||
        tags.some(tag => tag.toLowerCase().includes(searchTermLower))
      );
    });
    
    setFilteredVideos(filtered);
  }, [searchParam, videos]);

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
            // Create sample data based on the reference image
            const newsTypes = [
              { title: "NEW REPORT", subtitle: "General Daily News on Climate", tags: ["#generalnews", "#news"] },
              { title: "ISRAEL NEWS", subtitle: "Attack News on Israel", tags: ["#news", "#attack", "#israel"] }, 
              { title: "NEWS ABOUT CLIMATE", subtitle: "Weather News", tags: ["#news", "#climate"] },
              { title: "WORLD NEWS", subtitle: "International Updates", tags: ["#news", "#world"] },
              { title: "TECHNOLOGY NEWS", subtitle: "Latest in Tech", tags: ["#tech", "#news"] },
              { title: "BREAKING NEWS", subtitle: "Urgent Updates", tags: ["#breaking", "#news"] }
            ];
            
            // Use sample data if video data is incomplete
            const newsItem = newsTypes[index % newsTypes.length];
            const displayTitle = video.caption || newsItem.title;
            const displaySubtitle = video.overview || newsItem.subtitle;
            const displayTags = video.tag ? video.tag.split(' ') : newsItem.tags;
            const videoUrl = getVideoUrl(video.videoHash);
            const isPlaying = activeVideo === video.id;
            const isMuted = mutedVideos[video.id];
            
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
                        {displayTitle}
                      </Typography>
                      <Typography 
                        variant="subtitle2" 
                        color="text.secondary" 
                        component="div" 
                        sx={{ mb: 1.5, opacity: 0.8 }}
                      >
                        {displaySubtitle}
                      </Typography>
                      
                      {/* Tags */}
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.8, mb: 1.5 }}>
                        {displayTags.map((tag, idx) => (
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
                        ))}
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
                          bgcolor: index % 3 === 0 ? '#3396ff' : index % 3 === 1 ? '#4364d9' : '#8c42f4',
                          fontSize: '0.9rem',
                          fontWeight: 'bold',
                          border: '2px solid rgba(255,255,255,0.1)',
                          transition: 'transform 0.2s ease',
                          cursor: 'pointer',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 0 0 2px rgba(255,255,255,0.2)',
                          }
                        }}
                      >
                        {index % 3 === 0 ? 'S' : index % 3 === 1 ? 'P' : 'H'}
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
                          {index % 3 === 0 ? 'Shrey' : index % 3 === 1 ? 'Priyank' : 'Harshil'}
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
                    
                    {/* Download button */}
                    <Button 
                      variant="contained" 
                      startIcon={<FaDownload />} 
                      size="small"
                      onClick={() => handleDownload(videoUrl, video.id)}
                      sx={{
                        bgcolor: 'white',
                        color: '#1A1A1A',
                        fontWeight: 'bold',
                        borderRadius: '30px',
                        textTransform: 'uppercase',
                        fontSize: '0.75rem',
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
    </Box>
  );
};

export default TrendingPage; 