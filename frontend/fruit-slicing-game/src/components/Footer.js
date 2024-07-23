import React, { useEffect, useState } from 'react';
import { Box, Typography, IconButton, CircularProgress } from '@mui/material';
import { HomeOutlined as HomeOutlinedIcon, AssignmentOutlined as TasksOutlinedIcon, PeopleOutlined as FriendsOutlinedIcon, BarChartOutlined as StatisticsOutlinedIcon } from '@mui/icons-material';
import AnalyticsIcon from '@mui/icons-material/Analytics';
import { Link, useLocation } from 'react-router-dom';
import api from '../api/api';
import '../style/Footer.css';

const Footer = () => {
  const location = useLocation();
  const [statistics, setStatistics] = useState({ totalUsers: 0, totalTokens: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await api.get('/user/statistics');
        setStatistics(response.data);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  const getActiveClass = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <Box className="footer" display="flex" justifyContent="space-around" alignItems="center">
      <IconButton color="inherit" component={Link} to="/home" className={getActiveClass('/home')}>
        <HomeOutlinedIcon className={location.pathname === '/home' || '/' ? 'active-icon' : ''} />
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
      <IconButton color="inherit" component={Link} to="/statistics" className={getActiveClass('/statistics')}>
        <AnalyticsIcon className={location.pathname === '/statistics' ? 'active-icon' : ''} />
        <Typography variant="caption">Statistics</Typography>
      </IconButton>
    </Box>
  );
};

export default Footer;
