import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Box, Typography, Button, Grid, Paper, CircularProgress, Avatar } from '@mui/material';
import { GiKatana } from 'react-icons/gi';
import Footer from '../components/Footer';
import { ReactComponent as Logo } from '../logo1.svg';
import '../style/Home.css';
import api from '../api/api';
import { encryptData, decryptData } from '../utils/encryption'; // Import encryption functions
import { generateUUID } from '../utils/uuid'; // Import UUID generator

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
  const containerRef = useRef(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const telegramId = params.get('telegram_id');
    const username = params.get('username');
    const firstname = params.get('firstname');
    const lastname = params.get('lastname');
    const referralCode = params.get('referralCode');

    if (telegramId) {
      const encryptedTelegramId = encryptData(telegramId);
      const complexData = {
        user_metadata: {
          created_at: new Date().toISOString(),
          last_login: new Date().toISOString(),
          preferences: {
            theme: 'dark',
            notifications: true,
          },
        },
        session_info: {
          sessionId: generateUUID(),
          device_id: navigator.userAgent,
          login_time: Date.now(),
          ip_address: '', // Daha sonra fetchIpAddress ile doldurulabilir
        },
        feature_flags: {
          new_dashboard: true,
          beta_features: ['feature1', 'feature2'],
        },
        tracking_data: {
          heatmaps_enabled: false,
          session_recording_enabled: false,
          exception_capture_enabled: false,
          web_vitals_enabled: false,
        },
        analytics: {
          user_state: 'active',
          device_metrics: {
            screen_resolution: `${window.screen.width}x${window.screen.height}`,
            browser: navigator.appName,
            browser_version: navigator.appVersion,
          },
        },
        distinct_id: encryptedTelegramId, // Encrypted data should be the telegramId directly
      };

      localStorage.setItem('sessionData', encryptData(JSON.stringify(complexData)));
      fetchUserData(telegramId, username, firstname, lastname, referralCode);
      startFetchUserDataInterval(telegramId, username, firstname, lastname, referralCode);
      checkFarmingStatus(telegramId);
      checkInStatus(telegramId);
    } else {
      const storedEncryptedTelegramData = localStorage.getItem('sessionData');
      const decryptedTelegramData = JSON.parse(decryptData(storedEncryptedTelegramData));
      const decryptedTelegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));
      fetchUserId(decryptedTelegramId);
      checkFarmingStatus(decryptedTelegramId);
      checkInStatus(decryptedTelegramId);
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
        return;
      }
    } catch (error) {
      setLoading(false);
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
    }, 5000);
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
      console.log('checkFarmingStatus - telegramId:', telegramId); // Eklenen satır
      const response = await api.post('/user/farming-status', { telegramId });
      console.log(response);
      if (response.data.isFarming) {
        const startTime = new Date(response.data.startTime);
        startTimer(startTime);
        setIsFarming(true);
      } else {
        setIsFarming(false);
      }
    } catch (error) {
      console.error('Error checking farming status:', error);
    }
  };

  const handleStartFarming = async () => {
    try {
      const encryptedTelegramData = localStorage.getItem('sessionData');
      const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
      const decryptedTelegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));
      const response = await api.post('/user/start-farming', { telegramId: decryptedTelegramId });
      setIsFarming(true);
      setTimeRemaining(initialTime);
      setProgress(0);
      startTimer(new Date());
    } catch (error) {

    }
  };

  const handleClaimFarming = async () => {
    try {
      const encryptedTelegramData = localStorage.getItem('sessionData');
      const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
      const decryptedTelegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));
      const response = await api.post('/user/claim-farming', { telegramId: decryptedTelegramId });
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

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight || scrollTop === 0) {
          // Sayfanın sonuna veya başına gelindiğinde sallanma efekti ekleyin
          containerRef.current.classList.add('bounce');
          setTimeout(() => {
            containerRef.current.classList.remove('bounce');
          }, 500); // Animasyon süresiyle eşleşmeli
        }
      }
    };

    if (containerRef.current) {
      containerRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (containerRef.current) {
        containerRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <Container
      maxWidth={false}
      className="home-container"
      ref={containerRef}
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
            <Avatar sx={{ width: 80, height: 80, fontSize: '2rem', bgcolor: '#f06f24', color: '#fff', marginBottom: '20px' }}>
              {username.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" mb={2}>@{username}</Typography>
            <Box display="flex" alignItems="center" mb={2}>
              <Box
                component={Logo}
                sx={{
                  width: '50px', // İkonun boyutu büyütüldü
                  height: '60px', // İkonun boyutu büyütüldü
                  marginRight: '10px', // İkon ile yazı arasındaki boşluk artırıldı
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
                  component="a"
                  href=" https://fruitcrypto.app/ "
                  target="_blank" 
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
