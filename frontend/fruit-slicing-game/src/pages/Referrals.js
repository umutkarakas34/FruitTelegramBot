import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, Avatar, Slide, IconButton, Snackbar, Alert } from '@mui/material';
import { FaPeopleGroup } from 'react-icons/fa6';
import Footer from '../components/Footer';
import api from '../api/api';
import { decryptData } from '../utils/encryption';
import CloseIcon from '@mui/icons-material/Close';
import '../style/Referrals.css';

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [level1Count, setLevel1Count] = useState(0);
  const [totalPoints, setTotalPoints] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [referralLink, setReferralLink] = useState('');

  const fetchReferrals = async () => {
    try {
      const encryptedTelegramData = localStorage.getItem('sessionData');
      if (!encryptedTelegramData) {
        throw new Error('Telegram data not found');
      }
      const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
      const decryptedTelegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));

      const response = await api.get('/user/referrals', { params: { telegramId: decryptedTelegramId } });

      setReferrals(response.data.level1Referrals);
      setLevel1Count(response.data.refCount);
      setReferralLink(`https://t.me/testbot_gamegamebot?start=${response.data.myReferralCode}`);

      const totalPoints = response.data.level1Referrals.reduce((acc, referral) => acc + referral.points, 0);
      setTotalPoints(totalPoints);

      await postTotalPoints(totalPoints);
    } catch (error) {
      console.error('Error fetching referrals:', error);
    }
  };

  const postTotalPoints = async (points) => {
    try {
      const encryptedTelegramData = localStorage.getItem('sessionData');
      if (!encryptedTelegramData) {
        throw new Error('Telegram data not found');
      }
      const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
      const decryptedTelegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));

      await api.post('/user/claim-ref', { telegramId: decryptedTelegramId, points });
    } catch (error) {
      console.error('Error posting total points:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setSnackbarOpen(true);
  };

  const handleSendLink = () => {
    const telegramMessage = `Join me on our platform and let's earn together! Use my invite link to join the fun: ${referralLink}`;
    const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(telegramMessage)}`;
    window.open(telegramUrl, '_blank');
  };

  useEffect(() => {
    fetchReferrals();
  }, []);

  const remainingInvites = 10 - level1Count;

  return (
    <Container
      sx={{
        height: '60vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: '#fff',
        overflow: 'hidden',
        paddingY: '30px',
        paddingX: '10px',
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
          width: '100%',
          paddingBottom: '80px',
          paddingY: '30px',
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
              margin: '0 auto',
            }}
          >
            <FaPeopleGroup />
          </Avatar>
          <Typography variant="h5" sx={{ color: '#fff', fontSize: '1.2rem', padding: '20px' }}>
            Invite frens. Earn points
          </Typography>
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
            Unlock a Play Pass for Each Fren!
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
          <>
            <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', mb: 2 }}>
              Total Points Earned: {totalPoints}
            </Typography>
            {referrals.map((referral) => (
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
                <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                  Points: {referral.points}
                </Typography>
              </Paper>
            ))}
          </>
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
      </Box>
      <Box
        sx={{
          position: 'fixed',
          bottom: 120,
          width: '80vw',
          maxWidth: 600,
          display: 'flex',
          justifyContent: 'center',
          zIndex: 1000,
        }}
      >
        {remainingInvites > 0 ? (
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{
              backgroundColor: '#f06f24',
              fontWeight: 'bold',
              color: '#fff',
              fontSize: '1rem',
              margin: '10px',
              padding: '20px 20px',
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
      <Footer sx={{ flexShrink: 0 }} />
      {open && (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%',
              bgcolor: '#1e1e1e',
              color: '#fff',
              borderTopLeftRadius: '10px',
              borderTopRightRadius: '10px',
              p: 2,
              zIndex: 1300,
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" sx={{ flexGrow: 1, textAlign: 'center' }}>Invite a fren</Typography>
              <IconButton onClick={handleClose} sx={{ color: '#fff' }}>
                <CloseIcon />
              </IconButton>
            </Box>
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ color: '#fff', textAlign: 'center' }}>
                Use the options below to invite your friends and earn rewards!
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 2 }}>
                <Button
                  onClick={handleSendLink}
                  sx={{
                    backgroundColor: '#2c2c2c',
                    color: '#fff',
                    margin: '10px 0',
                    padding: '17px',
                    width: '90%',
                    '&:hover': {
                      backgroundColor: '#3d3d3d',
                    },
                  }}
                >
                  Send
                </Button>
                <Button
                  onClick={handleCopyLink}
                  sx={{
                    backgroundColor: '#2c2c2c',
                    color: '#fff',
                    margin: '10px 0',
                    padding: '17px',
                    width: '90%',
                    '&:hover': {
                      backgroundColor: '#3d3d3d',
                    },
                  }}
                >
                  Copy link
                </Button>
              </Box>
            </Box>
          </Box>
        </Slide>
      )}
      <Snackbar open={snackbarOpen} autoHideDuration={3000} onClose={handleSnackbarClose} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert onClose={handleSnackbarClose} severity="success" sx={{ width: '100%', backgroundColor: '#333', color: '#fff' }}>
          Referral link copied to clipboard!
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Referrals;
