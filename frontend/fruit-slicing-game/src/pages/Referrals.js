import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, Avatar } from '@mui/material';
import Footer from '../components/Footer';

const Referrals = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);

  const handleScroll = () => {
    if (window.pageYOffset > 300) {
      setShowScrollButton(true);
    } else {
      setShowScrollButton(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Container
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: '#fff',
        overflow: 'hidden',
        paddingBottom: '80px',
      }}
    >
      <Box
        sx={{
          mt: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          overflowY: 'auto',
          flex: '1 1 auto',
          width: '100%', // Tam genişlikte olması için
          paddingBottom: '80px',
        }}
      >
        <Box sx={{ width: '80vw', maxWidth: 600, textAlign: 'center', mb: 2 }}>
          <Avatar 
            sx={{ 
              mb: 2, 
              width: 80, 
              height: 80, 
              backgroundColor: '#808080', 
              color: 'white', 
              fontSize: '2rem', 
              margin: '0 auto' // Avatarı ortalamak için
            }}
          >
            👨‍👩‍👧‍👦
          </Avatar>
          <Typography variant="h5" sx={{ color: '#fff', fontSize: '1.2rem' }}>Invite frens. Earn points</Typography>
          <Typography variant="body1" mb={3}>How it works</Typography>
        </Box>
        <Paper
          elevation={3}
          sx={{
            p: 2,
            width: '80vw',
            maxWidth: 600,
            backgroundColor: '#1c1c1c',
            background: 'linear-gradient(145deg, #4a4a4a, #2a2a2a)',
            backgroundSize: '200% 200%',
            animation: 'gradient-animation 5s ease infinite',
            color: '#fff',
            mb: 2,
          }}
        >
          <Typography variant="body1" mb={2}>
            <strong>Share your invitation link</strong><br />
            Get a 🎟️ play pass for each fren
          </Typography>
          <Typography variant="body1" mb={2}>
            <strong>Your friends join Fruit Cyrpto</strong><br />
            And start farming points
          </Typography>
          <Typography variant="body1">
            <strong>Score 10% from buddies</strong><br />
            Plus an extra 2.5% from their referrals
          </Typography>
        </Paper>
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 3,
            width: '80vw',
            maxWidth: 600,
            backgroundColor: '#d3d3d3',
            color: '#fff',
            fontSize: '1rem',
            padding: '30px 30px',
            '&:hover': {
              backgroundColor: '#c0c0c0',
            },
          }}
        >
          Invite a fren (10 left)
        </Button>
      </Box>
      {showScrollButton && (
        <Button
          onClick={scrollToTop}
          sx={{
            position: 'fixed',
            bottom: 16,
            right: 16,
            backgroundColor: 'primary.main',
            color: '#fff',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Scroll to Top
        </Button>
      )}
      <Footer sx={{ flexShrink: 0 }} />
    </Container>
  );
};

export default Referrals;
