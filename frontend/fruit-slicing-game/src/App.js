import React, { useEffect } from 'react';
import './App.css';
import Game from './Game';
import Home from './pages/Home';
import Task from './pages/Task';
import Referrals from './pages/Referrals';
import Settings from './pages/Settings';
import Loading from './pages/Loading';
import ErrorScreen from './components/Error';
import ErrorBoundary from './components/ErrorBoundary';
import DailyRewards from './pages/DailyRewards';
import RewardPage from './pages/RewardPage';
import Footer from './components/Footer'; // Footer bileşeni eklendi
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

function App() {
  const location = useLocation();

  useEffect(() => {
    // Telegram SDK yüklendiğinde çalışacak kod
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;

    // iOS'ta onload yerine onreadystatechange kullanarak yüklemeyi kontrol et
    script.onload = script.onreadystatechange = () => {
      if (!script.readyState || /loaded|complete/.test(script.readyState)) {
        if (window.Telegram.WebApp) {
          // Web App hazır
          window.Telegram.WebApp.ready();

          // Web App tam ekran yap
          window.Telegram.WebApp.expand();
        } else {
          console.error('Telegram Web App is not available');
        }
      }
    };

    document.body.appendChild(script);

    // Temizleme işlemi (cleanup)
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  // Footer'ın görüneceği sayfaları belirtiyoruz
  const showFooter = ['/home', '/task', '/referrals'].includes(location.pathname);

  return (
    <div className="App">
      <ErrorBoundary>
        <div className="content">
          <Routes>
            <Route path="/" element={<Loading />} />
            <Route path="/home" element={<Home />} />
            <Route path="/game" element={<Game />} />
            <Route path="/task" element={<Task />} />
            <Route path="/referrals" element={<Referrals />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/reward" element={<RewardPage />} />
            <Route path="/daily-rewards" element={<DailyRewards />} />
            <Route path="*" element={<ErrorScreen />} />
          </Routes>
        </div>
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
