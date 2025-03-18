import React from 'react';
import { Typography, Box } from '@mui/material';
import NewsList from '../components/NewsList';

const HomePage = () => {
  return (
    <Box>
      <Typography variant="h1" component="h1" gutterBottom>
        News
      </Typography>
      <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 4 }}>
      Uncover and analyze the latest news and videos with real-time verification for authenticity.
      </Typography>
      
      <NewsList />
    </Box>
  );
};

export default HomePage; 