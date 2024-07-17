import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Box, Typography, Button } from '@mui/material';
import { Container } from '@mui/system';
import '../style/RewardPage.css';
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
      myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } }));
      myConfetti(Object.assign({}, defaults, { particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } }));
    }, 250);
  }, []);

  const handlePlayAgain = () => {
    navigate('/game');
  };

  return (
    <Container className="r-container">
      <canvas ref={canvasRef} className="confetti-canvas" />
      <Box className="reward-content">
        <img src="/confetti.gif" alt="Confetti" className="reward-gif" />
        <Typography variant="h4" className="reward-message">Insane skills! You're a master!</Typography>
        <Typography variant="h3" className="reward-score">฿ {score}</Typography>
        <Typography variant="body1" className="reward-label">Rewards</Typography>
        <Button onClick={handlePlayAgain} className="res">
          Play Again
        </Button>
      </Box>
      <div className="background-animation"></div>
    </Container>
  );
};

export default RewardPage;
