// src/pages/Statistics.js
import React, { useEffect, useState } from 'react';
import { Container, Box, Typography, CircularProgress, Paper } from '@mui/material';
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
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress color="inherit" />
            </Box>
        );
    }

    return (
        <Container sx={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <Paper
                elevation={3}
                sx={{
                    padding: '20px',
                    borderRadius: '15px',
                    background: 'linear-gradient(145deg, #1e1e1e, #272727)',
                    color: '#fff',
                    textAlign: 'center',
                    width: '80%',
                    maxWidth: '600px',
                    marginBottom: '20px'
                }}
            >
                <Typography variant="h4" sx={{ mb: 2, fontWeight: 'bold' }}>Statistics</Typography>
                <Box sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff5722' }}>Total Users</Typography>
                    <Typography variant="h5">{statistics.totalUsers}</Typography>
                </Box>
                <Box>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: '#ff5722' }}>Total Tokens</Typography>
                    <Typography variant="h5">{statistics.totalTokens.toFixed(2)}</Typography>
                </Box>
            </Paper>
            <Footer sx={{ flexShrink: 0, width: '100%' }} />
        </Container>
    );
};

export default Statistics;
