import React from 'react';
import { Card, CardMedia, Typography, Box, Avatar, IconButton } from '@mui/material';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';

const NewsCard = ({ image, title, description, author, date, authorImage }) => {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
      backgroundColor: '#222222',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 6px 20px rgba(0,0,0,0.4)',
      }
    }}>
      <CardMedia
        component="img"
        height="190"
        image={image}
        alt={title}
        sx={{ 
          objectFit: 'cover',
        }}
      />
      <Box sx={{ p: 2, paddingBottom: 0 }}>
        <Typography 
          gutterBottom 
          variant="h6" 
          component="h2" 
          sx={{ 
            fontWeight: 'bold',
            fontSize: '1rem',
            mb: 1,
            color: 'white',
            height: '2.4em',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {title}
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
          }}
        >
          {description}
        </Typography>
      </Box>
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mt: 'auto',
        p: 2,
        pt: 1,
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            src={authorImage}
            sx={{ 
              width: 30, 
              height: 30, 
              mr: 1,
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
              {author}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.7rem',
              }}
            >
              {date}
            </Typography>
          </Box>
        </Box>
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
    </Card>
  );
};

export default NewsCard; 