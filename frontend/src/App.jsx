import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Sec1Catalouge from './components/Sec1Catalouge';
import Return from './pages/Return';
import Login from './pages/Login';
import AdminBooks from './pages/AdminBooks';
import Borrow from './pages/Borrow';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Sec1Catalouge />} />
            <Route path="/borrow" element={<Borrow />} />
            <Route path="/return" element={<Return />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminBooks />} />
          </Routes>
        </main>

        <footer className="app-footer">
          Twirling Lotus Library &middot; Library Management System
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;