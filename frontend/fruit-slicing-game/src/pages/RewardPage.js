import React, { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import confetti from "canvas-confetti";
import { ReactComponent as Logo } from "../logo1.svg";
import { encryptData, decryptData } from '../utils/encryption'; // Import encryption functions
import api from '../api/api';


const RewardPage = () => {
  const [tickets, setTicket] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { score, userId } = location.state || { score: 0, userId: 0 };
  const canvasRef = useRef(null);

  useEffect(() => {
    const myConfetti = confetti.create(canvasRef.current, { resize: true });
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min, max) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      myConfetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        })
      );
      myConfetti(
        Object.assign({}, defaults, {
          particleCount,
          origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        })
      );
    }, 250);
  }, []);


  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEncryptedTelegramData = localStorage.getItem('sessionData');
        const decryptedTelegramData = JSON.parse(decryptData(storedEncryptedTelegramData));
        const telegramId = JSON.parse(decryptData(decryptedTelegramData.distinct_id));
        const response = await api.get(`/user/get-user-id`, { telegramId });
        setTicket(response.data.ticket);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleHome = () => {
    navigate("/home");
  };
  const handlePlayAgain = async () => {
    try {
      const response = await api.post("/user/increase-ticket", { userId });
      console.log("Ticket increased:", response.data);
      navigate("/game");
    } catch (error) {
      console.error("Error increasing ticket:", error.response ? error.response.data : error.message);
    }
  };

  const getMessage = () => {
    if (score === 0) return "Try again!";
    if (score < 50) return "Great start!";
    if (score < 100) return "Well done!";
    return "Insane skills! You're a master!";
  };

  return (
    <Box
      sx={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        overflow: "auto",
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
        }}
      />
      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          textAlign: "center",
        }}
      >
        <Typography
          variant="h4"
          sx={{ color: "#e36200", fontWeight: "bold", marginBottom: "20px" }}
        >
          {getMessage()}
        </Typography>

        <Box display="flex" alignItems="center" justifyContent="center" mb={2}>
          <Typography
            variant="h3"
            sx={{ color: "#ff9800", fontWeight: "bold", marginBottom: "10px" }}
          >
            {score}
          </Typography>

          <Box
            component={Logo}
            sx={{
              width: "60px", // İkonun boyutu büyütüldü
              height: "70px", // İkonun boyutu büyütüldü
              marginLeft: "8px",
              position: "relative",
              top: "-13px", // İkonu yukarı kaydırmak için
            }}
          />

        </Box>
        <Typography
          variant="body1"
          sx={{ color: "#3f51b5", marginBottom: "20px" }}
        >
          Rewards
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "15px",
            alignItems: "center",
            marginTop: "80px"
          }}
        >
          {tickets > 0 && (
            <Button
              onClick={handlePlayAgain}
              sx={{
                backgroundColor: "#e36200",
                color: "#fff",
                padding: "15px 30px",
                textTransform: "none",
                fontSize: "20px",
                fontWeight: "bold",
                border: "2px solid #673ab7",
                borderRadius: "5px",
                boxShadow: "none",
                minWidth: "200px", // Eşit genişlik
                minHeight: "50px", // Eşit yükseklik
                "&:hover": {
                  backgroundColor: "#000000",
                  boxShadow: "none",
                },
              }}
            >
              Play Again
            </Button>
          )}
          <Button
            onClick={handleHome}
            sx={{
              backgroundColor: "#e36200",
              color: "#ffff",
              padding: "15px 30px",
              textTransform: "none",
              fontSize: "20px",
              fontWeight: "bold",
              border: "2px solid #673ab7",
              borderRadius: "5px",
              boxShadow: "none",
              minWidth: "200px", // Eşit genişlik
              minHeight: "50px", // Eşit yükseklik
              "&:hover": {
                backgroundColor: "#000000",
                boxShadow: "none",
              },
            }}
          >
            Home
          </Button>
        </Box>
      </Box>
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background:
            "radial-gradient(circle, rgba(238,174,202,1) 0%, rgba(148,187,233,1) 100%)",
          zIndex: 0,
          animation: "fadeInBackground 2s ease-in-out",
        }}
      />
      <style>
        {`
          @keyframes fadeInBackground {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }
        `}
      </style>
    </Box>
  );
};

export default RewardPage;
