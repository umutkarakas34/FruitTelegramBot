import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, Paper, Grid, Button, Avatar, CircularProgress } from '@mui/material';
import Footer from '../components/Footer';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import api from '../api/api'; // api dosyanızın yolu
import { decryptData } from '../utils/encryption'; // Şifre çözme fonksiyonu

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingTaskId, setLoadingTaskId] = useState(null); // Loading durumunu takip eden state

  const fetchTasks = async () => {
    try {
      const encryptedTelegramData = localStorage.getItem('sessionData');
      if (encryptedTelegramData) {
        const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
        const telegramId = decryptedTelegramData.distinct_id;

        // Kullanıcının görev durumlarını ve tüm görevleri getir
        const response = await api.get('/user/user-tasks', { telegramId });
        setTasks(response.data);
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const completeTask = async (taskId) => {
    try {
      setLoadingTaskId(taskId); // Loading state'ini ayarla
      const encryptedTelegramData = localStorage.getItem('sessionData');
      if (encryptedTelegramData) {
        const decryptedTelegramData = JSON.parse(decryptData(encryptedTelegramData));
        const telegramId = decryptedTelegramData.distinct_id;

        await api.post('/user/complete-task', { telegramId, task_id: taskId });

        // Görev tamamlandıktan sonra görevleri yeniden yükleyin
        setTimeout(() => {
          fetchTasks();
          setLoadingTaskId(null); // Loading state'ini temizle
        }, 1500); // 1.5 saniye bekle
      }
    } catch (error) {
      console.error('Error completing task:', error);
      setLoadingTaskId(null); // Hata durumunda loading state'ini temizle
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
        paddingY: '30px',
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
          marginBottom: '20px', // Başlık ve üst kısım arasında boşluk bırakmak için
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
        {tasks.length > 0 ? (
          tasks.map((task) => (
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
                    {task.task_image}
                  </Avatar>
                </Grid>
                <Grid item xs>
                  <Box display="flex" flexDirection="column">
                    <Typography variant="h6" sx={{ color: '#fff', fontSize: '0.8rem' }}>
                      {task.task_title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#fff', fontSize: '0.7rem' }}>
                      {task.task_description}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item>
                  <Button
                    sx={{
                      backgroundColor: task.completed ? 'inherit' : '#f06f24',
                      color: task.completed ? '#4CAF50' : '#fff',
                      fontSize: '0.7rem',
                      padding: '5px 10px',
                      display: 'flex',
                      alignItems: 'center',
                    }} // Daha güzel bir yeşil ton ekleyin
                    onClick={() => completeTask(task.id)}
                    disabled={task.completed || loadingTaskId === task.id}
                  >
                    {loadingTaskId === task.id ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : task.completed ? <CheckCircleIcon sx={{ color: 'orange' }} /> : 'Claim'}
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          ))
        ) : (
          <Typography variant="body1" sx={{ color: '#fff', fontSize: '1rem', textAlign: 'center', mt: 2 }}>
            No tasks found.
          </Typography>
        )}
      </Box>
      <Footer sx={{ flexShrink: 0 }} />
    </Container>
  );
};

export default Tasks;
