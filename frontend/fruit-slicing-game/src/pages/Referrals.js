import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, Avatar } from '@mui/material';
import Footer from '../components/Footer';
import { GiKatana } from 'react-icons/gi';
import api from '../api/api';

const Referrals = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [referrals, setReferrals] = useState([]);

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

  const fetchReferrals = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      console.log(userData);
      const response = await api.get('/user/referrals', { userId: userData.id });
      setReferrals(response);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    fetchReferrals();
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
        paddingY: '30px',
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
              // backgroundColor: 'white',
              color: 'white',
              fontSize: '2rem',
              margin: '0 auto' // Avatarı ortalamak için
            }}
            src="/images/referrals.png"
          >
          </Avatar>
          <Typography variant="h5" sx={{ color: '#fff', fontSize: '1.2rem' }}>Invite frens. Earn points</Typography>
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
            <strong>Share Your Magic Link</strong><br />
            Unlock a <GiKatana style={{ marginRight: '5px', fontSize: '1.5rem' }} /> Play Pass for Each Fren!
          </Typography>
          <Typography variant="body1" mb={2}>
            <strong>Your Friends Join the Fruit Crypto Adventure</strong><br />
            Let them start farming points and reaping rewards!
          </Typography>
          <Typography variant="body1">
            <strong>Boost Your Earnings</strong><br />
            Earn 10% from your buddies' points, plus an extra 2.5% from their referrals!
          </Typography>
        </Paper>
        {referrals.length > 0 ? (
          referrals.map((referral) => (
            <Paper
              key={referral.id}
              elevation={3}
              sx={{
                p: 2,
                width: '80vw',
                maxWidth: 600,
                backgroundColor: '#1c1c1c',
                color: '#fff',
                mb: 2,
              }}
            >
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                Referral ID: {referral.id}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                User ID: {referral.user_id}
              </Typography>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            No referrals found.
          </Typography>
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{
            mt: 1,
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
