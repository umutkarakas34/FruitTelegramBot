import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, Avatar } from '@mui/material';
import Footer from '../components/Footer';
import '../style/Referrals.css';

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
    <Container className="referrals-container" sx={{ height: '100vh', display: 'flex', flexDirection: 'column', paddingBottom: '80px' }}>
      <Box
        className="main-content"
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        mt={10}
        sx={{
          overflow: 'auto',
          flex: '1 1 auto',
          height: 'calc(100vh - 80px)', // Adjusting height to ensure footer is always visible
          paddingBottom: '80px' // Adjusting padding to ensure space for the footer
        }}
      >
        <Avatar sx={{ mb: 2, width: 80, height: 80 }} className="referral-avatar">👨‍👩‍👧‍👦</Avatar>
        <Typography variant="h5" mb={2}>Invite frens. Earn points</Typography>
        <Typography variant="body1" mb={3}>How it works</Typography>
        <Paper elevation={3} className="referral-card" sx={{ p: 2, width: '80vw', maxWidth: 600 }}>
          <Typography variant="body1" mb={2}>
            <strong>Share your invitation link</strong><br />
            Get a 🎟️ play pass for each fren
          </Typography>
          <Typography variant="body1" mb={2}>
            <strong>Your friends join Blum</strong><br />
            And start farming points
          </Typography>
          <Typography variant="body1">
            <strong>Score 10% from buddies</strong><br />
            Plus an extra 2.5% from their referrals
          </Typography>
        </Paper>
        <Button variant="contained" color="primary" className="invite-button" sx={{ mt: 3, width: '80vw', maxWidth: 600 }}>
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
