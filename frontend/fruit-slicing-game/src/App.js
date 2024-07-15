import './App.css';
import Game from './Game';
import Home from './pages/Home';
import Task from './pages/Task';
import Referrals from './pages/Referrals';
import Settings from './pages/Settings';
import Loading from './pages/Loading'; // Loading bileşenini ekleyin
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Loading />} /> {/* İlk olarak Loading bileşeni gösterilecek */}
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
