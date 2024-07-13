import React from 'react';
import { Container, Box, Typography, Paper, Button, Avatar } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/Referrals.css';

const Referrals = () => {
  return (
    <Container className="referrals-container">
      <Navbar />
      <Box className="main-content" display="flex" flexDirection="column" alignItems="center" mt={10} mb={3}>
        <Avatar sx={{ mb: 2, width: 56, height: 56 }} className="referral-avatar">👨‍👩‍👧‍👦</Avatar>
        <Typography variant="h5" mb={2}>Invite frens. Earn points</Typography>
        <Typography variant="body1" mb={3}>How it works</Typography>
        <Paper elevation={3} className="referral-card" sx={{ p: 2, width: '100%' }}>
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
        <Button variant="contained" color="primary" className="invite-button" sx={{ mt: 3 }}>
          Invite a fren (10 left)
        </Button>
      </Box>
      <Footer />
    </Container>
  );
};

export default Referrals;
