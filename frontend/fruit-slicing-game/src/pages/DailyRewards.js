import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FlashOnIcon from '@mui/icons-material/FlashOn';
import { GiKatana } from 'react-icons/gi'; // Katana ikonu
import { ReactComponent as Logo } from '../logo1.svg'; // SVG dosyasını import et

const DailyRewards = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate('/home');
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
        overflow: 'auto', // Kaydırma eklendi
        padding: 0,
        backgroundColor: '#000',
        color: '#fff',
      }}
    >
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
      <Box
        sx={{
          marginBottom: '40px',
        }}
      >
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
              gap: '8px', // İkon ve sayı arasında boşluk
            }}
          >
            <Box
              component={Logo}
              sx={{
                width: '30px', // İkonun boyutu küçültüldü
                height: '30px', // İkonun boyutu küçültüldü
                color: '#fff',
              }}
            />
            <Typography variant="h6">20</Typography>
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
              gap: '8px', // İkon ve sayı arasında boşluk
            }}
          >
            <GiKatana
              style={{
                fontSize: '30px', // Katana ikonunun boyutu
                color: '#fff', // İkonun rengi kaldırıldı
              }}
            />
            <Typography variant="h6">2</Typography>
          </Box>
          <Typography variant="body2">Play Passes</Typography>
        </Box>
      </Box>
      <Typography variant="body1" sx={{ marginBottom: '60px', fontSize: '14px' }}>
        Come back tomorrow for check-in day 3<br />
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
    </Box>
  );
};

export default DailyRewards;
