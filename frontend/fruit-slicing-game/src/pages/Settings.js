import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Container, Switch, FormControlLabel, Box, Typography } from '@mui/material';

const Settings = () => {
    const [soundEnabled, setSoundEnabled] = useState(true);

    const handleSoundToggle = () => {
        setSoundEnabled((prev) => !prev);
    };

    return (
        <Box display="flex" flexDirection="column" minHeight="100vh" sx={{ width: 445 }}>
            <Navbar />
            <Container maxWidth="md" style={{ padding: '20px', textAlign: 'center', flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom style={{ marginTop: '40px' }}>
                    Settings
                </Typography>
                <FormControlLabel
                    control={<Switch checked={soundEnabled} onChange={handleSoundToggle} />}
                    label="Sound"
                />
            </Container>
            <Footer />
            <Box mt={8} /> {/* Footer'ın yukarıda yer alması için boşluk ekliyoruz */}
        </Box>
    );
};

export default Settings;
