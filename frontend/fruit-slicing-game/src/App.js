import './App.css';
import Game from './Game';
import Home from './pages/Home';
import Task from './pages/Task';
import Referrals from './pages/Referrals';
import Settings from './pages/Settings';
import Loading from './pages/Loading'; // Loading bileşenini ekleyin
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    // Telegram SDK yüklendiğinde çalışacak kod
    const script = document.createElement('script');
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.TelegramGameProxy) {
        // window.TelegramGameProxy.ready();
      } else {
        console.error('Telegram Game Proxy is not available');
      }
    };
  }, []);

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Loading />} />
          <Route path="/home" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/task" element={<Task />} />
          <Route path="/referrals" element={<Referrals />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
