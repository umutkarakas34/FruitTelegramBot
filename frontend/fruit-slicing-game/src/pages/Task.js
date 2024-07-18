import React from 'react';
import { Container, Box, Typography, Paper, Grid, Button, Avatar } from '@mui/material';
import Footer from '../components/Footer';

const Tasks = () => {
  const tasks = [
    { id: 1, title: 'Farm 5,000 BP', progress: '2,707/5,000 BP', reward: '+200 BP', avatar: '🔨' },
    { id: 2, title: 'Farm 10,000 BP', progress: '2,707/10,000 BP', reward: '+300 BP', avatar: '🌾' },
    { id: 3, title: 'Invite 1 fren', progress: '0/1 fren', reward: '+60 BP', avatar: '👤' },
    { id: 4, title: 'Invite 5 frens', progress: '0/5 frens', reward: '+120 BP', avatar: '👥' },
    { id: 5, title: 'Invite 10 frens', progress: '0/10 frens', reward: '+200 BP', avatar: '👨‍👩‍👧‍👦' },
    { id: 6, title: 'Pokras Lampas Quest', progress: '3/3 tasks', reward: '+300 BP', avatar: '🖌️' },
    { id: 7, title: 'Join Trending Apps', progress: '', reward: '+200 BP', avatar: '📲' },
  ];

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
        paddingBottom: '80px',
      }}
    >
      <Box
        sx={{
          position: 'sticky',
          top: 0,
          backgroundColor: '#121212',
          width: '100%',
          zIndex: 1,
          textAlign: 'center',
          padding: '10px 0',
        }}
      >
        <Typography
          variant="h5"
          mb={1}
          sx={{
            color: '#fff', // Task başlık rengi beyaz
            fontSize: '1.2rem',
          }}
        >
          Tasks
        </Typography>
        <Typography variant="body2" mb={2}>
          We’ll reward you immediately with points after each task completion.
        </Typography>
      </Box>
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
        {tasks.map((task) => (
          <Paper
            key={task.id}
            elevation={3}
            sx={{
              p: 1,
              mb: 1,
              width: '80vw',
              maxWidth: 600,
              backgroundColor: '#1c1c1c',
              background: 'linear-gradient(145deg, #4a4a4a, #2a2a2a)',
              backgroundSize: '200% 200%',
              animation: 'gradient-animation 5s ease infinite',
              color: '#fff',
              padding: '10px',
            }}
          >
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Avatar sx={{ backgroundColor: '#808080', color: 'white', width: 40, height: 40, fontSize: '1.2rem' }}>
                  {task.avatar}
                </Avatar>
              </Grid>
              <Grid item xs>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" sx={{ color: '#fff', fontSize: '0.8rem' }}>
                    {task.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.7rem' }}>
                    {task.progress}, {task.reward}
                  </Typography>
                </Box>
              </Grid>
              <Grid item>
                <Button sx={{ backgroundColor: '#d3d3d3', color: '#fff', fontSize: '0.7rem', padding: '5px 10px' }} disabled>
                  Claim
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
      <Footer sx={{ flexShrink: 0 }} />
    </Container>
  );
};

export default Tasks;
