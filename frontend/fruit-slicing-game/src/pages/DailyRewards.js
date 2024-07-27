import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { GiKatana } from 'react-icons/gi';
import { ReactComponent as Logo } from '../logo1.svg';
import api from '../api/api';
import { encryptData, decryptData } from '../utils/encryption'; // Import encryption functions

const DailyRewards = () => {
  const navigate = useNavigate();
  const [checkin, setCheckin] = useState(null);
  const [loading, setLoading] = useState(true); // Initially set to true to show loading
  const [points, setPoints] = useState(0);
  const [tickets, setTickets] = useState(0);

  useEffect(() => {
    const fetchCheckinData = async () => {
      const storedEncryptedTelegramData = localStorage.getItem('sessionData');
      let telegramId;

      if (storedEncryptedTelegramData) {
        try {
          const decryptedTelegramData = JSON.parse(decryptData(storedEncryptedTelegramData));
          telegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));
          console.log('DecryptedXXXXX telegramId:', telegramId); // Log decrypted telegramId
        } catch (error) {
          console.error('Error decrypting session data:', error);
        }
      }

      console.log('FetchedXXXX telegramId:', telegramId); // Log telegramId
      setLoading(true);
      try {
        const response = await api.post('/user/get-checkin', { telegramId });
        console.log('API response:', response);
        const checkinData = response.data;
        setCheckin(checkinData.checkin_series);
        setPoints(checkinData.point);
        setTickets(checkinData.ticket);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching check-in data:', error);
        setLoading(false);
      }
    };

    fetchCheckinData();
  }, []);

  const handleContinue = async () => {
    const storedEncryptedTelegramData = localStorage.getItem('sessionData');
    let telegramId;

    if (storedEncryptedTelegramData) {
      try {
        const decryptedTelegramData = JSON.parse(decryptData(storedEncryptedTelegramData));
        telegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));
        console.log('Decrypted telegramId:', telegramId); // Log decrypted telegramId
      } catch (error) {
        console.error('Error decrypting session data:', error);
      }
    }

    console.log('Continuing with telegramId:', telegramId); // Log telegramId
    setLoading(true);
    try {
      const response = await api.post('/user/checkin', { telegramId });
      navigate('/home');
    } catch (error) {
      console.error('Error claiming daily rewards:', error);
      setLoading(false);
    }
  };


  return (
    <Box
      sx={{
        position: 'relative',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'auto',
        padding: 0,
        backgroundColor: '#000',
        color: '#fff',
      }}
    >
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <CircularProgress color="inherit" />
        </Box>
      ) : (
        <>
          <FlashOnIcon
            sx={{
              fontSize: '80px',
              color: '#ff0',
              animation: 'flash 1.5s infinite',
              marginBottom: '20px',
              '@keyframes flash': {
                '0%, 50%, 100%': { opacity: 1 },
                '25%, 75%': { opacity: 0.5 },
              },
            }}
          />
          <Box sx={{ marginBottom: '40px' }}>
            <Typography variant="h4" sx={{ fontSize: '24px', fontWeight: 'bold' }}>
              Your daily rewards
            </Typography>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '20px',
              marginBottom: '20px',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
                borderRadius: '10px',
                width: '150px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <Box
                  component={Logo}
                  sx={{
                    width: '30px',
                    height: '30px',
                    position: 'relative',
                    top: '-5px',
                  }}
                />
                <Typography variant="h6">{points}</Typography>
              </Box>
              <Typography variant="body2">Fruit Points</Typography>
            </Box>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '20px',
                background: 'radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)',
                borderRadius: '10px',
                width: '150px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                }}
              >
                <GiKatana
                  style={{
                    fontSize: '30px',
                    color: '#fff',
                  }}
                />
                <Typography variant="h6">{tickets}</Typography>
              </Box>
              <Typography variant="body2">Play Passes</Typography>
            </Box>
          </Box>
          <Typography variant="body1" sx={{ marginBottom: '60px', fontSize: '14px' }}>
            Come back tomorrow for check-in day {checkin}<br />
            Tip: Skipping a day resets your check-in.
          </Typography>
          <Button
            onClick={handleContinue}
            sx={{
              backgroundColor: '#fff',
              color: '#000',
              padding: '15px 40px',
              textTransform: 'none',
              fontSize: '16px',
              border: 'none',
              borderRadius: '5px',
              width: '20%',
              '&:hover': {
                backgroundColor: '#ddd',
              },
            }}
          >
            Continue
          </Button>
          <style>
            {`
              @keyframes flash {
                0%, 50%, 100% { opacity: 1; }
                25%, 75% { opacity: 0.5; }
              }
            `}
          </style>
        </>
      )}
    </Box>
  );
};

export default DailyRewards;
