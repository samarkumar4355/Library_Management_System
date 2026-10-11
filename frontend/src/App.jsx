import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Sec1Catalouge from './components/Sec1Catalouge';
import Return from './pages/Return';
import Login from './pages/Login';
import AdminBooks from './pages/AdminBooks';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <NavBar />

        <main className="app-main">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/books" element={<Sec1Catalouge />} />
            <Route path="/return" element={<Return />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin" element={<AdminBooks />} />
          </Routes>
        </main>

        <footer className="app-footer">
          Twirling Lotus Library &middot; Library Management System
        </footer>
import Borrow from './pages/Borrow';
import Return from './pages/Return';

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <h1>Library Management System</h1>
        <NavBar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/books" element={<Sec1Catalouge />} />
          <Route path="/borrow" element={<Borrow />} />
          <Route path="/return" element={<Return />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;