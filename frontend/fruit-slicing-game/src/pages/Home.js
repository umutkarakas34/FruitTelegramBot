import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper, CircularProgress } from '@mui/material';
import { GiKatana } from 'react-icons/gi';
import Footer from '../components/Footer';
import { ReactComponent as Logo } from '../logo1.svg';
import '../style/Home.css';
import api from '../api/api';

const Home = () => {
  const initialTime = 43200; // 12 hours in seconds
  const [timeRemaining, setTimeRemaining] = useState(initialTime);
  const [progress, setProgress] = useState(100);
  const [points, setPoints] = useState(0);
  const [tickets, setTicket] = useState(0);
  const [username, setUsername] = useState('');
  const [pointsEarned, setPointsEarned] = useState(0);
  const [alertOpen, setAlertOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const [pointsPerSecond, setPointsPerSecond] = useState(0.001);
  const [isFarming, setIsFarming] = useState(false);
  const [farmingClaimable, setFarmingClaimable] = useState(false);
  const [loading, setLoading] = useState(true);
  const timerRef = useRef(null);
  const fetchUserDataIntervalRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const telegramId = params.get('telegram_id');
    const username = params.get('username');
    const firstname = params.get('firstname');
    const lastname = params.get('lastname');
    const referralCode = params.get('referralCode');

    if (telegramId && username) {
      fetchUserData(telegramId, username, firstname, lastname, referralCode);
      startFetchUserDataInterval(telegramId, username, firstname, lastname, referralCode);
      checkFarmingStatus(telegramId);
      checkInStatus(telegramId);
    } else {
      const storedTelegramId = localStorage.getItem('telegramId');
      if (storedTelegramId) {
        fetchUserId(storedTelegramId);
        checkFarmingStatus(storedTelegramId);
        checkInStatus(storedTelegramId);
      }
    }

    return () => {
      clearInterval(timerRef.current);
      clearInterval(fetchUserDataIntervalRef.current);
    };
  }, [location.search]);

  const checkInStatus = async (telegramId) => {
    try {
      const response = await api.post('/user/checkin-status', { telegramId });
      if (response.data.message === false) {
        navigate('/daily-rewards');
      } else {
        setLoading(false);
      }
    } catch (error) {
      setLoading(false); // İçerik yüklendiğinde loading durumunu false yap
    }
  };

  const startTimer = (startTime) => {
    const initialTime = 43200; // 12 hours in seconds
    const currentTime = new Date();
    const elapsed = Math.floor((currentTime - new Date(startTime)) / 1000); // Geçen süreyi saniye cinsinden hesapla
    const timeLeft = initialTime - elapsed;

    if (timeLeft <= 0) {
      setTimeRemaining(0);
      setProgress(0);
      setIsFarming(false);
      setFarmingClaimable(true);
      return;
    }

    setTimeRemaining(timeLeft);
    setProgress((timeLeft / initialTime) * 100);
    setPointsEarned((elapsed * pointsPerSecond)); // Başlangıç puanını ayarla

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setProgress(0);
          setIsFarming(false);
          setFarmingClaimable(true);
          return 0;
        }
        const newTimeRemaining = prev - 1;
        setPointsEarned((points) => points + pointsPerSecond / 2);
        setProgress((newTimeRemaining / initialTime) * 100);
        return newTimeRemaining;
      });
    }, 1000);
  };

  const startFetchUserDataInterval = (telegramId, username, firstname, lastname, referralCode) => {
    fetchUserDataIntervalRef.current = setInterval(() => {
      fetchUserData(telegramId, username, firstname, lastname, referralCode);
    }, 1000);
  };

  const fetchUserData = async (telegramId, username, firstname, lastname, referralCode) => {
    try {
      const response = await api.get(`/user/profile`, {
        telegram_id: telegramId,
        username: username,
        firstname: firstname,
        lastname: lastname,
        referralCode: referralCode,
      });
      localStorage.setItem('telegramId', telegramId);
      setPoints(response.data.token);
      setUserData(response.data);
      setUsername(response.data.username);
      setTicket(response.data.ticket);
    } catch (error) {
    } finally {
      setLoading(false); // İçerik yüklendiğinde loading durumunu false yap
    }
  };

  const fetchUserId = async (telegramId) => {
    try {
      const response = await api.get(`/user/get-user-id`, { telegramId });
      setPoints(response.data.token);
      setUserData(response.data);
      setUsername(response.data.username);
      setTicket(response.data.ticket);
      startFetchUserDataInterval(
        response.data.telegram_id,
        response.data.username,
        response.data.firstname,
        response.data.lastname,
        response.data.referralCode
      );
    } catch (error) {
    }
  };

  const checkFarmingStatus = async (telegramId) => {
    try {
      const response = await api.post('/user/farming-status', { telegramId });

      if (response.data.isFarming) {
        const startTime = new Date(response.data.startTime);
        startTimer(startTime);
        setIsFarming(true);
      } else {
        setIsFarming(false);
      }
    } catch (error) {

    }
  };

  const handleStartFarming = async () => {
    try {
      const telegramId = localStorage.getItem('telegramId');
      const response = await api.post('/user/start-farming', { telegramId });
      setIsFarming(true);
      setTimeRemaining(initialTime);
      setProgress(0);
      startTimer(new Date());
    } catch (error) {

    }
  };

  const handleClaimFarming = async () => {
    try {
      const telegramId = localStorage.getItem('telegramId');
      const response = await api.post('/user/claim-farming', { telegramId });
      setPoints(response.data.user.token); // Kullanıcının toplam token miktarını güncelle
      setIsFarming(false);
      setFarmingClaimable(false);
      setTimeRemaining(initialTime);
      setProgress(0);
    } catch (error) {
    }
  };

  const handlePlayClick = async (event) => {
    try {
      const response = await api.post('/user/increase-ticket', { userId: userData.id });
      setTicket(response.data.ticket);
      navigate('/game');
    } catch (error) {
      console.error('Error increasing ticket:', error);
    }
  };

  const formatTime = (seconds) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`;
  };


  return (
    <Container
      maxWidth={false}
      className="home-container"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: '#121212',
        color: '#fff',
        overflowY: 'auto',
        paddingY: '0px',
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <Box
          className="main-content"
          display="flex"
          flexDirection="column"
          alignItems="center"
          mt={10}
          sx={{ overflowY: 'auto', flex: '1 1 auto', paddingBottom: '80px' }}
        >
          <Box className="profile" display="flex" flexDirection="column" alignItems="center" mb={3}>
            <Box className="profile-icon" mb={2}>
              X
            </Box>
            <Typography variant="h6">@{username}</Typography>
            <Box display="flex" alignItems="center">
              <Box
                component={Logo}
                sx={{
                  width: '50px', // İkonun boyutu büyütüldü
                  height: '60px', // İkonun boyutu büyütüldü
                  marginRight: '-6px',
                  position: 'relative',
                  top: '-8px', // İkonu yukarı kaydırmak için
                }}
              />
              <Typography variant="h4">{points.toFixed(2)}</Typography>
            </Box>
          </Box>
          <Paper
            elevation={3}
            className="game-card"
            sx={{ p: 2, mb: 3, borderRadius: '20px', width: '100%', maxWidth: '600px' }}
          >
            <Grid container direction="row" alignItems="center" justifyContent="space-between">
              <Grid item>
                <Typography variant="h5" className="game-title" sx={{ fontSize: '1.25rem', fontWeight: 'bold', textAlign: 'left' }}>
                  Slice Game
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="body2" className="game-tickets" sx={{ fontSize: '1.6rem', textAlign: 'right' }}>
                  <GiKatana style={{ marginRight: '5px', fontSize: '1.2rem' }} /> {tickets}
                </Typography>
              </Grid>
            </Grid>
            <Grid container direction="column" alignItems="center">
              {tickets > 0 && (
                <Grid item sx={{ width: '100%' }}>
                  <Button
                    variant="contained"
                    onClick={handlePlayClick}
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
              )}
              <Grid item sx={{ marginTop: '15px', width: '100%' }}>
                <Typography variant="body1" className="game-description" sx={{ fontSize: '0.9rem', color: '#ccc', textAlign: 'center' }}>
                  Join the Slice Game and earn katanas! The more you play, the more katanas you earn. Click 'Play' to start your adventure.
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
                    },
                  }}
                >
                  Learn More
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Box className="farming-info" sx={{ width: '100%', textAlign: 'center', mb: 3, maxWidth: '600px' }}>
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '50px',
                backgroundColor: '#3a3a3a',
                borderRadius: '10px',
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: `${progress}%`,
                  backgroundColor: timeRemaining === 0 ? '#fff' : '#808080',
                  borderRadius: '10px',
                  transition: 'width 1s linear',
                }}
              ></Box>
              <Typography
                className="farming-text"
                sx={{
                  position: 'absolute',
                  width: '100%',
                  textAlign: 'center',
                  lineHeight: '50px',
                  color: timeRemaining === 0 ? '#000' : 'rgba(255, 255, 255, 0.5)',
                  fontWeight: 'bold',
                  fontSize: '0.875rem',
                }}
              >
                {timeRemaining === 0 ? '' : 'Farming'}
              </Typography>
              {timeRemaining !== 0 && (
                <Typography
                  className="timer"
                  sx={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  {formatTime(timeRemaining)}
                </Typography>
              )}
              {!isFarming && !farmingClaimable && timeRemaining !== 0 && (
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
                    },
                  }}
                  onClick={handleStartFarming}
                >
                  Start Farming
                </Button>
              )}
              {farmingClaimable && (
                <Button
                  variant="contained"
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundColor: 'orange',
                    color: '#000',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    fontSize: '0.875rem',
                    '&:hover': {
                      backgroundColor: '#e67f19',
                    },
                  }}
                  onClick={handleClaimFarming}
                >
                  Claim Tokens
                </Button>
              )}
              {!farmingClaimable && (
                <Typography
                  className="points-per-second"
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '10px',
                    transform: 'translateY(-50%)',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.75rem',
                    fontWeight: 'bold',
                  }}
                >
                  +{pointsEarned.toFixed(3)}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      )}
      <Footer sx={{ flexShrink: 0 }} />
    </Container>
  );
};

export default Home;
