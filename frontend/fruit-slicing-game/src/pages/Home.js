import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { GiKatana } from 'react-icons/gi';
import confetti from 'canvas-confetti';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ReactComponent as Logo } from '../logo1.svg';
import '../style/Home.css';

const Home = () => {
  const initialTime = 43200; // 12 hours in seconds
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [progress, setProgress] = useState(100);
  const [points, setPoints] = useState(117721);
  const [pointsEarned, setPointsEarned] = useState(0);
  const [pointsPerSecond, setPointsPerSecond] = useState(0.001);
  const [showConfetti, setShowConfetti] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    startTimer();

    return () => clearInterval(timerRef.current);
  }, []);

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setProgress(0);
          return 0;
        }
        const newTimeRemaining = prev - 1;
        setPointsEarned((prevPointsEarned) => prevPointsEarned + pointsPerSecond);
        setProgress((newTimeRemaining / initialTime) * 100);
        return newTimeRemaining;
      });
    }, 1000);
  };

  const handleStartClick = (event) => {
    const buttonRect = event.target.getBoundingClientRect();

    confetti({
      particleCount: 100,
      startVelocity: 30,
      spread: 360,
      origin: {
        x: (buttonRect.left + buttonRect.width / 2) / window.innerWidth,
        y: (buttonRect.top + buttonRect.height / 2) / window.innerHeight,
      }
    });

    setPoints((prevPoints) => prevPoints + pointsEarned);
    setPointsEarned(0);

    setAlertOpen(true);
    setTimeout(() => setAlertOpen(false), 3000);

    clearInterval(timerRef.current);
    setTimeRemaining(initialTime);
    setProgress(100);
    startTimer();
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };

  return (
    <Container maxWidth={false} className="home-container" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
      <Box className="main-content" display="flex" flexDirection="column" alignItems="center" mt={10} sx={{ overflow: 'auto', flex: '1 1 auto', paddingBottom: '80px' }}>
        <Box className="profile" display="flex" flexDirection="column" alignItems="center" mb={3}>
          <Box className="profile-icon" mb={2}>X</Box>
          <Typography variant="h6">nftbholder</Typography>
          <Box display="flex" alignItems="center">
            <Box
              component={Logo}
              sx={{
                width: '50px', // İkonun boyutu büyütüldü
                height: '60px', // İkonun boyutu büyütüldü
                marginRight: '8px',
                position: 'relative',
                top: '-8px', // İkonu yukarı kaydırmak için
              }}
            />
            <Typography variant="h4">{points.toFixed(3)}</Typography>
          </Box>
        </Box>

        <Paper elevation={3} className="game-card" sx={{ p: 2, mb: 3, borderRadius: '20px', width: '100%', maxWidth: '600px' }}>
          <Grid container direction="row" alignItems="center" justifyContent="space-between">
            <Grid item>
              <Typography variant="h5" className="game-title" sx={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'left' }}>Drop Game</Typography>
            </Grid>
            <Grid item>
              <Typography variant="body2" className="game-tickets" sx={{ fontSize: '1rem', textAlign: 'right' }}>
                <GiKatana style={{ marginRight: '5px', fontSize: '1.5rem' }} /> 7
              </Typography>
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

        <Box className="farming-info" sx={{ width: '100%', textAlign: 'center', mb: 3, maxWidth: '600px' }}>
          <Box sx={{ position: 'relative', width: '100%', height: '50px', backgroundColor: '#3a3a3a', borderRadius: '10px', overflow: 'hidden' }}>
            <Box sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${progress}%`,
              backgroundColor: timeRemaining === 0 ? '#fff' : '#808080',
              borderRadius: '10px',
              transition: 'width 1s linear'
            }}></Box>
            <Typography className="farming-text" sx={{
              position: 'absolute',
              width: '100%',
              textAlign: 'center',
              lineHeight: '50px',
              color: timeRemaining === 0 ? '#000' : 'rgba(255, 255, 255, 0.5)',
              fontWeight: 'bold',
              fontSize: '0.875rem'
            }}>{timeRemaining === 0 ? '' : 'Farming'}</Typography>
            {timeRemaining !== 0 && (
              <Typography className="timer" sx={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                color: 'rgba(255, 255, 255, 0.5)',
                fontSize: '0.75rem',
                fontWeight: 'bold'
              }}>{formatTime(timeRemaining)}</Typography>
            )}
            {timeRemaining === 0 && (
              <Button
                variant="contained"
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  backgroundColor: '#fff',
                  color: '#000',
                  borderRadius: '10px',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                  '&:hover': {
                    backgroundColor: '#fff',
                  }
                }}
                onClick={handleStartClick}
              >
                Start
              </Button>
            )}
            <Typography className="points-per-second" sx={{
              position: 'absolute',
              top: '50%',
              left: '10px',
              transform: 'translateY(-50%)',
              color: 'rgba(255, 255, 255, 0.5)',
              fontSize: '0.75rem',
              fontWeight: 'bold'
            }}>+{pointsEarned.toFixed(3)}</Typography>
          </Box>
        </Box>
      </Box>
      <Footer sx={{ flexShrink: 0 }} />
      <Snackbar
        open={alertOpen}
        onClose={() => setAlertOpen(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={() => setAlertOpen(false)} severity="info" sx={{ backgroundColor: '#000', color: '#fff', fontSize: '0.875rem' }}>
          Meyvelere karşı dikkatli olun!
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default Home;
