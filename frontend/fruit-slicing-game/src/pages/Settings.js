// import React, { useState, useEffect, useRef } from 'react';
// import Navbar from '../components/Navbar';
// import Footer from '../components/Footer';
// import { Container, Switch, FormControlLabel, Box, Typography, Divider } from '@mui/material';
// import '../style/Settings.css'; // CSS dosyasını içe aktarın

// const Settings = () => {
//     const [soundEnabled, setSoundEnabled] = useState(true);
//     const [darkMode, setDarkMode] = useState(false);
//     const [notificationsEnabled, setNotificationsEnabled] = useState(true);
//     const audioRef = useRef(null);

//     useEffect(() => {
//         if (darkMode) {
//             document.body.classList.add('dark-mode');
//             document.body.classList.remove('light-mode');
//         } else {
//             document.body.classList.add('light-mode');
//             document.body.classList.remove('dark-mode');
//         }
//     }, [darkMode]);

//     useEffect(() => {
//         if (soundEnabled) {
//             audioRef.current.play();
//         } else {
//             audioRef.current.pause();
//         }
//     }, [soundEnabled]);

//     const handleSoundToggle = () => {
//         setSoundEnabled((prev) => !prev);
//     };

//     const handleDarkModeToggle = () => {
//         setDarkMode((prev) => !prev);
//     };

//     const handleNotificationsToggle = () => {
//         setNotificationsEnabled((prev) => !prev);
//     };

//     return (
//         <Box display="flex" flexDirection="column" minHeight="100vh" className={`settings-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
//             <Navbar />
//             <Container maxWidth="md" className="settings-content">
//                 <Typography variant="h4" gutterBottom className="settings-title">
//                     Settings
//                 </Typography>
//                 <Box display="flex" flexDirection="column" alignItems="flex-start">
//                     <FormControlLabel
//                         control={<Switch checked={soundEnabled} onChange={handleSoundToggle} />}
//                         label="Sound"
//                     />
//                     <Divider sx={{ my: 2, width: '100%' }} />
//                     <FormControlLabel
//                         control={<Switch checked={darkMode} onChange={handleDarkModeToggle} />}
//                         label="Dark Mode"
//                     />
//                     <Divider sx={{ my: 2, width: '100%' }} />
//                     <FormControlLabel
//                         control={<Switch checked={notificationsEnabled} onChange={handleNotificationsToggle} />}
//                         label="Notifications"
//                     />
//                     <audio ref={audioRef} src="/menu.mp3" loop />
//                 </Box>
//             </Container>
//             <Box mt={8} />
//             <Footer />
//         </Box>
//     );
// };

// export default Settings;
