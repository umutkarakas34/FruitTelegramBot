import React, { useEffect, useState } from 'react';
import './App.css';
import Game from './Game';
import Home from './pages/Home';
import Task from './pages/Task';
import Referrals from './pages/Referrals';
import Loading from './pages/Loading';
import ErrorScreen from './components/Error';
import ErrorBoundary from './components/ErrorBoundary';
import DailyRewards from './pages/DailyRewards';
import RewardPage from './pages/RewardPage';
import Footer from './components/Footer';
import Statistics from './pages/Statistics';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';

console.warn = function () { };
console.error = function () { };

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isTelegramWebApp, setIsTelegramWebApp] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Telegram SDK yüklendiğinde çalışacak kod
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;

    script.onload = script.onreadystatechange = () => {
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
        if (window.Telegram && window.Telegram.WebApp && window.Telegram.WebApp.initData) {

          // Web App tam ekran yap
          window.Telegram.WebApp.expand();

          // Web App hazır
          window.Telegram.WebApp.ready();
          if (!sessionStorage.getItem('reloaded')) {
            sessionStorage.setItem('reloaded', 'true');
            window.location.reload();
          }
          setIsTelegramWebApp(true);
        } else {
          setIsTelegramWebApp(false);
          navigate('/error'); // Tarayıcıdan erişimi engellemek için hata sayfasına yönlendir
        }
        setIsChecking(false);
      }
    };

    document.body.appendChild(script);

    // Temizleme işlemi (cleanup)
    return () => {
      document.body.removeChild(script);
    };
  }, [navigate]);

  // Footer'ın görüneceği sayfaları belirtiyoruz
  const showFooter = ['/home', '/task', '/referrals'].includes(location.pathname);

  return (
    <div className="App">
      <ErrorBoundary>
        {isChecking ? (
          <Loading /> // SDK yüklenirken gösterilecek geçici bir ekran
        ) : isTelegramWebApp ? (
          <div className="content">
            <Routes>
              <Route path="/" element={<Loading />} />
              <Route path="/home" element={<Home />} />
              <Route path="/game" element={<Game />} />
              <Route path="/task" element={<Task />} />
              <Route path="/referrals" element={<Referrals />} />
              <Route path="/reward" element={<RewardPage />} />
              <Route path="/daily-rewards" element={<DailyRewards />} />
              <Route path="/statistics" element={<Statistics />} />
              <Route path="/error" element={<ErrorScreen />} />
              <Route path="*" element={<ErrorScreen />} />
            </Routes>
          </div>
        ) : (
          <ErrorScreen />
        )}
        {showFooter && <Footer />}
      </ErrorBoundary>
    </div>
  );
}

export default function AppWithRouter() {
  return (
    <Router>
      <App />
    </Router>
  );
}
