import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import '../style/DailyRewards.css';

const DailyRewards = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/home');
  };

  return (
    <Box className="rewards-container">
      <Box className="rewards-header">
        <Typography variant="h4" className="rewards-title">Your daily rewards</Typography>
      </Box>
      <Box className="rewards-content">
        <Box className="reward-item">
          <Typography variant="h6">20</Typography>
          <Typography variant="body2">Blum Points</Typography>
        </Box>
        <Box className="reward-item">
          <Typography variant="h6">2</Typography>
          <Typography variant="body2">Play Passes</Typography>
        </Box>
      </Box>
      <Typography variant="body1" className="rewards-note">
        Come back tomorrow for check-in day 3<br />
        Tip: Skipping a day resets your check-in.
      </Typography>
      <Button onClick={handleContinue} className="continue-button" variant="contained">
        Continue
      </Button>
    </Box>
  );
};

export default DailyRewards;
