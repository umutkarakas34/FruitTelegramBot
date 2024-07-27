import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, Avatar, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { GiKatana } from 'react-icons/gi';
import Footer from '../components/Footer';
import api from '../api/api';
import { FaPeopleGroup } from "react-icons/fa6";
import { decryptData } from '../utils/encryption'; // Import decrypt function

const Referrals = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [level1Count, setLevel1Count] = useState(0);
  const [open, setOpen] = useState(false);
  const [referralLink, setReferralLink] = useState('');

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
      const encryptedTelegramData = localStorage.getItem('sessionData');
      if (!encryptedTelegramData) {
        throw new Error('Telegram data not found');
      }
      const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
      const decryptedTelegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));


      const response = await api.get('/user/referrals', { telegramId: decryptedTelegramId });

      setReferrals(response.data.level1Referrals); // response.data.level1Referrals olmalı
      setLevel1Count(response.data.refCount); // response.data.refCount olmalı
      setReferralLink(`https://t.me/testbot_gamegamebot?start=${response.data.myReferralCode}`); // response.data.myReferralCode olmalı
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  const handleSendLink = () => {
    const telegramMessage = `Join me on our platform and let's earn together! Use my invite link to join the fun: ${referralLink}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(telegramMessage)}`;
    window.open(telegramUrl, '_blank');
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    fetchReferrals();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const remainingInvites = 10 - level1Count;

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
        paddingY: '50px',
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
          paddingY: "30px"
        }}
      >
        <Box sx={{ width: '80vw', maxWidth: 600, textAlign: 'center', mb: 2 }}>
          <Avatar
            sx={{
              mb: 2,
              width: 80,
              height: 80,
              backgroundColor: '#fff',
              color: '#f06f24',
              fontSize: '4rem',
              margin: '0 auto' // Avatarı ortalamak için
            }}
          >
            <FaPeopleGroup />
          </Avatar>
          <Typography variant="h5" sx={{ color: '#fff', fontSize: '1.2rem', padding: "20px" }}>Invite frens. Earn points</Typography>
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
        <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', mb: 2 }}>
          Total Level 1 Referrals: {level1Count}
        </Typography>
        {referrals.length > 0 ? (
          referrals.map((referral) => (
            <Paper
              key={referral.id}
              elevation={3}
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 2,
                width: '80vw',
                maxWidth: 600,
                backgroundColor: '#1c1c1c',
                color: '#fff',
                mb: 2,
              }}
            >
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                @{referral.username}
              </Typography>
              <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                Sub Referrals: {referral.subRefCount}
              </Typography>
            </Paper>
          ))
        ) : (
          <Paper
            elevation={3}
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              p: 2,
              width: '80vw',
              maxWidth: 600,
              backgroundColor: '#1c1c1c',
              color: '#fff',
              mb: 2,
            }}
          >
            <Typography variant="body1" sx={{ fontSize: '1rem' }}>
              No referrals found.
            </Typography>
          </Paper>
        )}
        {remainingInvites > 0 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{
              mt: 1,
              width: '80vw',
              maxWidth: 600,
              backgroundColor: '#f06f24',
              fontWeight: "bold",
              color: '#fff',
              fontSize: '1rem',
              padding: '20px 30px',
              '&:hover': {
                backgroundColor: '#c0c0c0',
              },
            }}
          >
            Invite a fren ({remainingInvites} left)
          </Button>
        ) : (
          <Button
            variant="contained"
            color="primary"
            disabled
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
            Invite limit reached
          </Button>
        )}
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
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            backgroundColor: '#121212',
            color: '#fff',
            padding: '20px',
            borderRadius: '10px',
          },
        }}
      >
        <DialogTitle>Invite a fren</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: '#fff' }}>
            Use the options below to invite your friends and earn rewards!
          </DialogContentText>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Button
              onClick={handleSendLink}
              sx={{
                backgroundColor: '#1a73e8',
                color: '#fff',
                margin: '0 10px',
                '&:hover': {
                  backgroundColor: '#135ab6',
                },
              }}
            >
              Send
            </Button>
            <Button
              onClick={handleCopyLink}
              sx={{
                backgroundColor: '#34a853',
                color: '#fff',
                margin: '0 10px',
                '&:hover': {
                  backgroundColor: '#2a8c42',
                },
              }}
            >
              Copy link
            </Button>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} sx={{ color: '#fff' }}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Referrals;
