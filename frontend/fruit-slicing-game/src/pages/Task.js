import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Grid, Button, Avatar, CircularProgress } from '@mui/material';
import Footer from '../components/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../api/api'; // api dosyanızın yolu
import { decryptData } from '../utils/encryption'; // Şifre çözme fonksiyonu

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTaskId, setLoadingTaskId] = useState(null);
  const [buttonText, setButtonText] = useState('Start');
  const [startedTaskId, setStartedTaskId] = useState(null);

  const fetchTasks = async () => {
    try {
      const encryptedTelegramData = localStorage.getItem('sessionData');
      if (encryptedTelegramData) {
        const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
        const telegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));

        const response = await api.get('/user/user-tasks', { telegramId });
        setTasks(response.data);
        console.log('asdad' + response.data.task_link)
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const startTask = (taskId, taskLink) => {
    setStartedTaskId(taskId);
    setButtonText('Claim');
    console.log('Test Task Link:', taskLink);

    // Kullanıcıyı hemen belirtilen linke yönlendir
    window.open(taskLink, '_blank');
  };

  const completeTask = async (taskId) => {
    try {
      setLoadingTaskId(taskId);
      const encryptedTelegramData = localStorage.getItem('sessionData');
      if (encryptedTelegramData) {
        const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
        const telegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));

        await api.post('/user/complete-task', { telegramId, task_id: taskId });

        setTimeout(() => {
          fetchTasks();
          setLoadingTaskId(null);
          setButtonText('Start'); // Claim yapıldıktan sonra tekrar "Start" olarak ayarla
        }, 1500);
      }
    } catch (error) {
      console.error('Error completing task:', error);
      setLoadingTaskId(null);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress color="inherit" />
      </Box>
    );
  }

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
        paddingY: '3px',
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
          paddingBottom: '60px',
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
            padding: '5px 0',
            marginBottom: '0px',
          }}
        >
          <Typography
            variant="h5"
            mb={1}
            sx={{
              color: '#fff',
              fontSize: '1.6rem',
            }}
          >
            Tasks
          </Typography>
          <Typography variant="body2" m={2} sx={{ color: "#fff", fontSize: '1rem' }}>
            We’ll reward you immediately with points after each task completion.
          </Typography>
        </Box>
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <Paper
              key={task.id}
              elevation={3}
              sx={{
                p: 1,
                mb: 2,
                width: '90vw',
                maxWidth: 800,
                backgroundColor: '#1c1c1c',
                background: 'linear-gradient(145deg, #4a4a4a, #2a2a2a)',
                backgroundSize: '200% 200%',
                animation: 'gradient-animation 5s ease infinite',
                color: '#fff',
                padding: '20px',
                marginTop: '2px',
              }}
            >
              <Grid container alignItems="center" spacing={2}>
                <Grid item>
                  <Avatar sx={{ backgroundColor: '#808080', color: 'white', width: 40, height: 40, fontSize: '1.2rem' }}>
                    {task.task_image}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="h6" sx={{ color: '#fff', fontSize: '0.9rem' }}>
                      {task.task_title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.8rem' }}>
                      {task.task_description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Button
                    sx={{
                      backgroundColor: buttonText === 'Claim' || task.completed ? 'inherit' : '#f06f24',
                      color: task.completed ? '#4CAF50' : '#fff',
                      fontSize: '0.8rem',
                      padding: '6px 12px',
                      display: 'flex',
                      alignItems: 'center',
                    }}
                    onClick={() =>
                      buttonText === 'Start'
                        ? startTask(task.id, task.task_link)
                        : completeTask(task.id)
                    }
                    disabled={task.completed || loadingTaskId === task.id || (buttonText === 'Starting...' && startedTaskId === task.id)}
                  >
                    {loadingTaskId === task.id ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : task.completed ? <CheckCircleIcon sx={{ color: 'orange' }} /> : buttonText}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#fff', fontSize: '1rem', textAlign: 'center', mt: 2, fontStyle: 'italic', letterSpacing: '0.05rem' }}>
  ~ Stay tuned, exciting new tasks are coming your way soon! ~
</Typography>


        )}
      </Box>
      <Footer sx={{ flexShrink: 0 }} />
    </Container>
  );
};

export default Tasks;
