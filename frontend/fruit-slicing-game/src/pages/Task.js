import React from 'react';
import { Container, Box, Typography, IconButton, Paper, Grid, Button, Avatar } from '@mui/material';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import '../style/Task.css';

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
    <Container maxWidth="xs" className="tasks-container">
      <Navbar />
      <Box className="main-content" display="flex" flexDirection="column" alignItems="center" mt={10}>
        <Typography variant="h5" mb={1}>Tasks</Typography>
        <Typography variant="body2" mb={2}>
          We’ll reward you immediately with points after each task completion.
        </Typography>
        {tasks.map((task) => (
          <Paper key={task.id} elevation={3} className="task-card" sx={{ p: 1, mb: 1, backgroundColor: '#1c1c1c' }}>
            <Grid container alignItems="center" spacing={1}>
              <Grid item>
                <Avatar className="task-avatar">{task.avatar}</Avatar>
              </Grid>
              <Grid item xs>
                <Box display="flex" flexDirection="column">
                  <Typography variant="h6" style={{ color: '#fff', fontSize: '0.8rem' }}>{task.title}</Typography>
                  <Typography variant="body2" style={{ color: '#fff', fontSize: '0.7rem' }}>{task.progress}, {task.reward}</Typography>
                </Box>
              </Grid>
              <Grid item>
                <Button className="claim-button" disabled>
                  Claim
                </Button>
              </Grid>
            </Grid>
          </Paper>
        ))}
      </Box>
      <Footer />
    </Container>
  );
};

export default Tasks;
