// components/Footer.js
import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { Home as HomeIcon, Assignment as TasksIcon, People as FriendsIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import '../style/Footer.css';

const Footer = () => {
  return (
    <Box className="footer" display="flex" justifyContent="space-around" alignItems="center">
      <IconButton color="inherit" component={Link} to="/">
        <HomeIcon />
        <Typography variant="caption">Home</Typography>
      </IconButton>
      <IconButton color="inherit" component={Link} to="/task">
        <TasksIcon />
        <Typography variant="caption">Tasks</Typography>
      </IconButton>
      <IconButton color="inherit" component={Link} to="/referrals">
        <FriendsIcon />
        <Typography variant="caption">Friends</Typography>
      </IconButton>
    </Box>
  );
};

export default Footer;
