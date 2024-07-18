import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import confetti from 'canvas-confetti';

const RewardPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { score } = location.state || { score: 0 };
  const canvasRef = useRef(null);

  useEffect(() => {
    const myConfetti = confetti.create(canvasRef.current, { resize: true });
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      myConfetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      myConfetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }, []);

  const handlePlayAgain = () => {
    navigate('/home');
  };

  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        padding: 0,
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
      />
      <Box
        sx={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: '#4caf50', marginBottom: '20px' }}>
          Insane skills! You're a master!
        </Typography>
        <Typography variant="h3" sx={{ color: '#ff9800', fontWeight: 'bold', marginBottom: '10px' }}>
          ฿ {score}
        </Typography>
        <Typography variant="body1" sx={{ color: '#3f51b5', marginBottom: '20px' }}>
          Rewards
        </Typography>
        <Button
          onClick={handlePlayAgain}
          sx={{
            backgroundColor: '#ffffff',
            color: '#673ab7',
            padding: '15px 30px',
            textTransform: 'none',
            fontSize: '20px',
            border: '2px solid #673ab7',
            borderRadius: '5px',
            boxShadow: 'none', // Mavi gölgeyi kaldırmak için
            '&:hover': {
              backgroundColor: '#ffffff', // Hover rengini kaldırmak için aynı renk
              boxShadow: 'none', // Hover sırasında gölgeyi kaldırmak için
            },
          }}
        >
          Home
        </Button>
      </Box>
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
          zIndex: 0,
          animation: 'fadeInBackground 2s ease-in-out',
        }}
      />
      <style>
        {`
          @keyframes fadeInBackground {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default RewardPage;
