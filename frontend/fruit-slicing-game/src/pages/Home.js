import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, IconButton, Grid, Paper } from '@mui/material';
import { Home as HomeIcon, Assignment as TasksIcon, People as FriendsIcon, Settings as SettingsIcon, Cancel as CancelIcon } from '@mui/icons-material';
import { FaAppleAlt, FaLemon } from 'react-icons/fa';
import { useSpring, animated } from 'react-spring';
import '../style/Home.css';

const Home = () => {
  const fruitAnimation = useSpring({
    loop: true,
    to: [
      { transform: 'translateY(0px)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0px)' }
    ],
    from: { transform: 'translateY(0px)' },
    config: { duration: 1000 }
  });

  return (
    <Container maxWidth="sm" className="home-container">
      <Box className="header" display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <IconButton color="inherit">
          <CancelIcon />
        </IconButton>
        <Typography variant="h6" component="div" className="header-title">
          Crypto Game
        </Typography>
        <IconButton color="inherit">
          <SettingsIcon />
        </IconButton>
      </Box>

      <Box className="main-content" display="flex" flexDirection="column" alignItems="center" mb={3}>
        <Box className="profile" display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Box className="profile-icon" mb={2}>X</Box>
          <Typography variant="h6">nftbholder</Typography>
          <Typography variant="h4">฿ 117,721</Typography>
        </Box>

        <Paper elevation={3} className="game-card" sx={{ p: 2, mb: 3 }}>
          <Grid container alignItems="center">
            <Grid item xs>
              <Typography variant="h6" className="game-title">Drop Game</Typography>
              <Typography variant="body1" className="game-tickets">Tickets: 7</Typography>
            </Grid>
            <Grid item>
              <Button variant="contained" color="primary" component={Link} to="/game">
                Play Now
              </Button>
            </Grid>
          </Grid>
          <Grid container justifyContent="center" spacing={2} mt={2}>
            <Grid item>
              <animated.div style={fruitAnimation}>
                <FaAppleAlt className="fruit-icon" />
              </animated.div>
            </Grid>
            <Grid item>
              <animated.div style={fruitAnimation}>
                <FaLemon className="fruit-icon" />
              </animated.div>
            </Grid>
          
          </Grid>
        </Paper>

        <Paper elevation={3} className="farming-info" sx={{ p: 2 }}>
          <Typography variant="h6">Farming ฿ 5.747</Typography>
          <Typography variant="body2">Remaining: 07h 12m</Typography>
        </Paper>
      </Box>

      <Box className="bottom-nav" display="flex" justifyContent="space-around" alignItems="center" mt={3}>
        <IconButton color="inherit" component={Link} to="/home">
          <HomeIcon />
          <Typography variant="caption">Home</Typography>
        </IconButton>
        <IconButton color="inherit">
          <TasksIcon />
          <Typography variant="caption">Tasks</Typography>
        </IconButton>
        <IconButton color="inherit">
          <FriendsIcon />
          <Typography variant="caption">Friends</Typography>
        </IconButton>
      </Box>
    </Container>
  );
};

export default Home;
