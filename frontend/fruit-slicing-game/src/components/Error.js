import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useNavigate } from 'react-router-dom';
import '../style/Error.css';

const ErrorScreen = () => {
  const navigate = useNavigate();

  const handleRefresh = () => {
    navigate('/'); // Uygulamayı Loading sayfasına yönlendir
  };

  return (
    <Box className="error-screen" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Typography variant="h4" className="error-message">Bir şeyler ters gitti</Typography>
      <Typography variant="body1" className="error-submessage">Sorunu çözmek için çalışıyoruz</Typography>
      <IconButton 
        color="primary" 
        onClick={handleRefresh} 
        className="refresh-button"
      >
        <RefreshIcon style={{ fontSize: '40px', color: '#fff' }} />
      </IconButton>
    </Box>
  );
};

export default ErrorScreen;
