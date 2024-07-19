import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../style/Loading.css';

const Loading = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const telegramId = params.get('telegram_id');
    const username = params.get('username');
    const firstname = params.get('firstname');
    const lastname = params.get('lastname');
    const referralCode = params.get('referralCode');

    const timer = setTimeout(() => {
      // Kullanıcıyı Home sayfasına yönlendirme
      navigate(`/home?telegram_id=${telegramId}&username=${username}&firstname=${firstname}&lastname=${lastname}&referralCode=${referralCode}`);
    }, 300); // 3 saniye bekletme

    return () => clearTimeout(timer);
  }, [navigate, location]);

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
