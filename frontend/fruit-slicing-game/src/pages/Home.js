import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/Home.css';

const Home = () => {
  const [timeRemaining, setTimeRemaining] = useState(4320); // 12 hours in seconds
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        const newTimeRemaining = prev - 1;
        setProgress((newTimeRemaining / 43200) * 100);
        return newTimeRemaining;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <Container maxWidth="xs" className="home-container">
      <Navbar />
      <Box className="main-content" display="flex" flexDirection="column" alignItems="center" mt={10}>
        <Box className="profile" display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Box className="profile-icon" mb={2}>X</Box>
          <Typography variant="h6">nftbholder</Typography>
          <Typography variant="h4">฿ 117,721</Typography>
        </Box>

        <Paper elevation={3} className="game-card" sx={{ p: 2, mb: 3, borderRadius: '20px' }}>
          <Grid container direction="row" alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" className="game-title" sx={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'left' }}>Drop Game</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" className="game-tickets" sx={{ fontSize: '1rem', textAlign: 'right' }}>Tickets: 7</Typography>
            </Grid>
          </Grid>
          <Grid container direction="column" alignItems="center">
            <Grid item sx={{ width: '100%' }}>
              <Button
                variant="contained"
                component={Link}
                to="/game"
                sx={{
                  borderRadius: '10px',
                  padding: '10px 0',
                  marginTop: '20px',
                  width: '100%',
                  background: 'linear-gradient(90deg, #ff5722, #ff9800, #ffeb3b, #8bc34a, #00bcd4, #3f51b5, #9c27b0)',
                  color: '#fff',
                  backgroundSize: '200% 200%',
                  animation: 'gradient-animation 5s ease infinite',
                }}
              >
                Play
              </Button>
            </Grid>
            <Grid item sx={{ marginTop: '15px', width: '100%' }}>
              <Typography variant="body1" className="game-description" sx={{ fontSize: '0.9rem', color: '#ccc', textAlign: 'center' }}>
                Join the Drop Game and earn rewards! The more you play, the more tickets you earn. Click 'Play' to start your adventure.
              </Typography>
            </Grid>
            <Grid item sx={{ marginTop: '15px', width: '100%' }}>
              <Typography
                variant="body2"
                component={Link}
                to="/learn-more"
                sx={{
                  color: '#fff',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'none',
                  }
                }}
              >
                Learn More
              </Typography>
            </Grid>
          </Grid>
        </Paper>

        <Box className="farming-info" sx={{ width: '100%', textAlign: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', width: '100%', height: '50px', backgroundColor: '#3a3a3a', borderRadius: '10px', overflow: 'hidden' }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progress}%`,
              backgroundColor: '#808080', // Kalan süre gri renkte
              borderRadius: '10px',
              transition: 'width 1s linear'
            }}></Box>
            <Typography className="farming-text" sx={{
              position: 'absolute',
              width: '100%',
              textAlign: 'center',
              lineHeight: '50px',
              color: 'rgba(255, 255, 255, 0.5)', // Daha silik renkte
              fontWeight: 'bold',
              fontSize: '0.875rem' // Daha küçük font
            }}>Farming</Typography>
            <Typography className="timer" sx={{
              position: 'absolute',
              right: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.5)', // Daha silik renkte
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>{formatTime(timeRemaining)}</Typography>
          </Box>
        </Box>
      </Box>
      <Footer />
    </Container>
  );
};

export default Home;
