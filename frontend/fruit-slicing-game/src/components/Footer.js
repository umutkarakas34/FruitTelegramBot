import React from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { HomeOutlined as HomeOutlinedIcon, AssignmentOutlined as TasksOutlinedIcon, PeopleOutlined as FriendsOutlinedIcon } from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';
import '../style/Footer.css';

const Footer = () => {
  const location = useLocation();

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Box className="footer" display="flex" justifyContent="space-around" alignItems="center">
      <IconButton color="inherit" component={Link} to="/home" className={getActiveClass('/home')}>
        <HomeOutlinedIcon className={location.pathname === '/home' ? 'active-icon' : ''} />
        <Typography variant="caption">Home</Typography>
      </IconButton>
      <IconButton color="inherit" component={Link} to="/task" className={getActiveClass('/task')}>
        <TasksOutlinedIcon className={location.pathname === '/task' ? 'active-icon' : ''} />
        <Typography variant="caption">Tasks</Typography>
      </IconButton>
      <IconButton color="inherit" component={Link} to="/referrals" className={getActiveClass('/referrals')}>
        <FriendsOutlinedIcon className={location.pathname === '/referrals' ? 'active-icon' : ''} />
        <Typography variant="caption">Friends</Typography>
      </IconButton>
    </Box>
  );
};

export default Footer;
