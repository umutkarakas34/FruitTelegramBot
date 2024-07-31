import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Button, Avatar, Slide, IconButton, Snackbar, Alert } from '@mui/material';
import Footer from '../components/Footer';
import api from '../api/api';
import { decryptData } from '../utils/encryption'; // Import decrypt function
import CloseIcon from '@mui/icons-material/Close';
import { ReactComponent as Logo } from '../logo1.svg';
import '../style/Referrals.css'; // Import CSS file
import { FaPeopleGroup } from "react-icons/fa6";
import { GiKatana } from 'react-icons/gi';

const Referrals = () => {
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [referrals, setReferrals] = useState([]);
  const [level1Count, setLevel1Count] = useState(0);
  const [open, setOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [referralLink, setReferralLink] = useState('');
  const [totalPoints, setTotalPoints] = useState(0);
  const [claimTime, setClaimTime] = useState(''); // Claim time from API

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

      setReferrals(response.data.level1Referrals);
      setLevel1Count(response.data.refCount);
      setReferralLink(`https://t.me/testbot_gamegamebot?start=${response.data.myReferralCode}`);

      const timeResponse = await api.get('/user/claim-time', { telegramId: decryptedTelegramId });
      setClaimTime(timeResponse.data.claimTime);
      console.log(timeResponse.data.claimTime)

      // Fetch total earned points
      const pointsResponse = await api.get('/user/get-referral-tokens', { telegramId: decryptedTelegramId });
      setTotalPoints(pointsResponse.data.totalPoints);
      console.log(pointsResponse)

      // Fetch claim time
     
      // Post points
      await postTotalPoints(pointsResponse.data.totalPoints);

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
    window.addEventListener('scroll', handleScroll);
    fetchReferrals();
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = window.innerHeight;

      if (scrollTop + clientHeight >= scrollHeight || scrollTop === 0) {
        document.body.classList.add('bounce');
        setTimeout(() => {
          document.body.classList.remove('bounce');
        }, 500);
      }
    };

    window.addEventListener('scroll', handleScroll);

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
        overflowY: 'auto',
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
          width: '100%',
          paddingBottom: '80px',
          paddingY: "30px"
        }}
      >
        <Box sx={{ width: '80vw', maxWidth: 600, textAlign: 'center', mb: 4 }}>
          <Avatar
            sx={{
              mb: 4,
              width: 80,
              height: 80,
              backgroundColor: '#fff',
              color: '#f06f24',
              fontSize: '4rem',
              margin: '0 auto' // Center the avatar
            }}
          >
            <FaPeopleGroup />
          </Avatar>
          <Typography variant="h5" sx={{ color: '#fff', fontSize: '1.2rem', padding: "20px" }}>Invite Frens</Typography>
        </Box>
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '80vw',
            maxWidth: 600,
            backgroundColor: '#1c1c1c',
            background: 'linear-gradient(145deg, #4a4a4a, #2a2a2a)',
            backgroundSize: '200% 200%',
            animation: 'gradient-animation 5s ease infinite',
            color: '#fff',
            mb: 4,
            textAlign: 'center',
          }}
        >
          {referrals.length > 0 ? (
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 4 }}>
                <Logo style={{ width: '2rem', height: '2rem', marginRight: '10px' }} />
                <Typography variant="h6" sx={{ color: '#fff', fontSize: '2rem' }}>
                  {totalPoints}
                </Typography>
                {/* {console.log(referrals)} */}
              </Box>
              <Box
                sx={{
                  mt: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: '#d3d3d3',
                    fontWeight: "bold",
                    color: '#fff',
                    fontSize: '0.875rem',
                    borderRadius: '25px',
                    padding: '6px 12px',
                    mb: 1,
                    '&:hover': {
                      backgroundColor: '#c0c0c0',
                    },
                  }}
                >
                  Claim
                </Button>
                <Typography variant="body1" sx={{ fontSize: '1.2rem', color: '#fff' }}>
                  {claimTime}
                </Typography>
              </Box>
            </Box>
          ) : (
            <>
              <Typography variant="body1" mb={2}>
                <strong>Share Your Magic Link</strong><br />
                Unlock a <GiKatana style={{ marginRight: '5px', fontSize: '1.5rem' }} /> Play Pass for Each Fren!
              </Typography>
              <Typography variant="body1">
                <strong>Boost Your Earnings</strong><br />
                Earn 10% from your buddies' points, plus an extra 2.5% from their referrals!
              </Typography>
            </>
          )}
        </Paper>
        <Typography
          variant="body2"
          sx={{
            fontSize: '0.875rem',
            background: 'linear-gradient(90deg, #000000, #ffffff)',
            backgroundSize: '200% 200%',
            backgroundClip: 'text',
            textFillColor: 'transparent',
            animation: 'color-change 5s infinite',
            mb: 4,
            textAlign: 'center'
          }}
        >
          Invite Your Friends and Earn Extra Points! <br />
          Get 10% from your friends and 2.5% from their referrals. Enjoy the benefits
        </Typography>
        {referrals.length > 0 && (
          <>
            <Typography variant="h6" sx={{ color: '#fff', fontSize: '1.2rem', mb: 2 }}>
              {level1Count} friends
            </Typography>
            <Box
              sx={{
                border: '1px solid rgba(255, 255, 255, 0.5)',
                borderRadius: '2px',
                padding: '10px',
                mb: 4,
              }}
            >
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
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar sx={{ width: 30, height: 30, mr: 1 }}>
                      {referral.username.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                      {referral.username}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Logo style={{ width: '1.5rem', height: '1.5rem', marginRight: '5px' }} />
                    <Typography variant="body1" sx={{ fontSize: '1rem' }}>
                      {referral.token}
                    </Typography>
                  </Box>
                </Paper>
              ))}
            </Box>
          </>
        )}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            width: '80vw',
            maxWidth: 600,
            mb: 4,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{
              backgroundColor: '#f06f24',
              fontWeight: "bold",
              color: '#fff',
              fontSize: '1rem',
              padding: '20px 20px',
              '&:hover': {
                backgroundColor: '#c0c0c0',
              },
            }}
          >
            Invite a fren ({remainingInvites} left)
          </Button>
        </Box>
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
      {open && (
        <Slide direction="up" in={open} mountOnEnter unmountOnExit>
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '50%', // Adjustable height
              bgcolor: '#1e1e1e', // Lighter color
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
                    backgroundColor: '#2c2c2c', // Lighter color
                    color: '#fff',
                    margin: '10px 0',
                    padding: '17px',
                    width: '90%', // Button width
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
                    backgroundColor: '#2c2c2c', // Lighter color
                    color: '#fff',
                    margin: '10px 0',
                    padding: '17px',
                    width: '90%', // Button width
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
