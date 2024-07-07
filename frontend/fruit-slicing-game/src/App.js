import './App.css';
import Game from './Game';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { CSSTransition } from 'react-transition-group';
import './style/Transition.css';

function App() {
  const [showHome, setShowHome] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowHome(true);
    }, 3000); // 3 saniye sonra ana sayfayı göster
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      <div className="App">
        <CSSTransition
          in={showHome}
          timeout={500}
          classNames="fade"
          unmountOnExit
        >
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/game" element={<Game />} />
          </Routes>
        </CSSTransition>
        {!showHome && (
          <div className="loading-screen">
            <h1>Crypto Game</h1>
            <p>Loading...</p>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
