import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress, Paper, Grid } from '@mui/material';
import api from '../api/api';
import Footer from '../components/Footer';


const Statistics = () => {
    const [statistics, setStatistics] = useState({ totalUsers: 0, totalTokens: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                const response = await api.get('/user/statistics');
                setStatistics(response.data);
            } catch (error) {
                console.error('Error fetching statistics:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: '#121212', color: '#fff' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    return (
        <Container
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#121212',
                color: '#fff',
                paddingY: '20px',
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    textAlign: 'center',
                    marginBottom: '40px',
                }}
            >
                <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#ff5722', mb: 2 }}>
                    Platform Statistics
                </Typography>
                <Typography variant="body1" sx={{ color: '#fff' }}>
                    Here's an overview of the current platform statistics.
                </Typography>
            </Box>
            <Grid container spacing={3} justifyContent="center">
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: '20px',
                            borderRadius: '15px',
                            background: 'linear-gradient(145deg, #1e1e1e, #272727)',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            color: '#fff',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8bc34a' }}>Total Users</Typography>
                        {/* <Typography variant="h3" sx={{ color: '#fff', margin: '10px 0' }}>{statistics.totalUsers}</Typography> */}
                        <Typography variant="h3" sx={{ color: '#fff', margin: '10px 0' }}>SOON</Typography>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper
                        elevation={3}
                        sx={{
                            padding: '20px',
                            borderRadius: '15px',
                            background: 'linear-gradient(145deg, #1e1e1e, #272727)',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.3)',
                            color: '#fff',
                            textAlign: 'center',
                        }}
                    >
                        <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#8bc34a' }}>Fruit Points</Typography>
                        {/* <Typography variant="h3" sx={{ color: '#fff', margin: '10px 0' }}>{statistics.totalTokens.toFixed(2)}</Typography> */}
                        <Typography variant="h3" sx={{ color: '#fff', margin: '10px 0' }}>SOON</Typography>
                    </Paper>
                    
                </Grid>
            </Grid>
            <Footer sx={{ flexShrink: 0, width: '100%', marginTop: '40px' }} />
        </Container>
    );
};

export default Statistics;
