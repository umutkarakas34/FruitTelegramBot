import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../style/Loading.css';

const Loading = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/home'); // 3 saniye sonra ana sayfaya yönlendirme
    }, 10000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="loading-screen">
      <h1>Crypto Game</h1>
      <p>Loading...</p>
      <div className="hidden-content">
        <div className="navbar-placeholder"></div>
        <div className="profile-placeholder"></div>
        <div className="game-placeholder"></div>
        <div className="footer-placeholder"></div>
      </div>
    </div>
  );
};

export default Loading;
