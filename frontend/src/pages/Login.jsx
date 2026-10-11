import { useState } from 'react';
import './Login.css';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  async function handleLogin(details) {
    try {
      const res = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.message);
        setIsError(true);
        return;
      }
      localStorage.setItem('token', data.token);

      // Ask the backend whose token this is, so we can show the name and role
      const userRes = await fetch('http://localhost:5001/api/auth/', {
        headers: { Authorization: `Bearer ${data.token}` },
      });
      const userData = await userRes.json();
      localStorage.setItem('user', JSON.stringify(userData.user));
      setUser(userData.user);
    } catch {
      setMessage('Could not reach the server.');
      setIsError(true);
    }
  }

  async function handleRegister(details) {
    try {
      const res = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details),
      });
      const data = await res.json();
      setMessage(res.ok ? 'Registration successful! Please log in.' : data.message);
      setIsError(!res.ok);
      if (res.ok) setShowRegister(false);
    } catch {
      setMessage('Could not reach the server.');
      setIsError(true);
import React, { useState, useEffect } from 'react';
import './Login.css';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { API_URL } from '../config';

function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      return;
    }

    async function loadUser() {
      try {
        const response = await fetch(`${API_URL}/auth/`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setCurrentUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Error fetching current user:', err);
      }
    }

    loadUser();
  }, []);

  async function handleLogin({ email, password }) {
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('token', data.token);
      setMessage('Login successful!');

      const userRes = await fetch(`${API_URL}/auth/`, {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (userRes.ok) {
        const userData = await userRes.json();
        setCurrentUser(userData.user);
      }
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  async function handleRegister(userData) {
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      setMessage('Registration successful! Please log in.');
      setIsRegister(false);
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setMessage('');
  }

  if (user) {
    return (
      <div className="auth-card">
        <div className="auth-avatar">{user.name[0]}</div>
        <h2>Welcome, {user.name}!</h2>
        <p className="auth-detail">{user.email}</p>
        <span className="role-pill">{user.role}</span>
        <button onClick={handleLogout} className="btn-logout">Log Out</button>
    setCurrentUser(null);
    setMessage('Logged out successfully.');
    setIsError(false);
  }

  if (currentUser) {
    return (
      <div className="auth-container">
        <h2>Welcome, {currentUser.name}!</h2>
        <p><strong>Email:</strong> {currentUser.email}</p>
        <p><strong>Role:</strong> {currentUser.role}</p>
        <button onClick={handleLogout} className="auth-btn logout-btn">Log Out</button>
      </div>
    );
  }

  return (
    <div className="auth-card">
      <h2>{showRegister ? 'Create an Account' : 'Welcome Back'}</h2>
      {message && <div className={`alert-box ${isError ? 'error' : 'success'}`}>{message}</div>}

      {showRegister ? <RegisterForm onRegister={handleRegister} /> : <LoginForm onLogin={handleLogin} />}

      <p className="auth-toggle">
        {showRegister ? 'Already registered? ' : "Don't have an account? "}
        <button type="button" className="btn-toggle" onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Log in here' : 'Register here'}
    <div className="auth-container">
      <h2>{isRegister ? 'Register an Account' : 'Log In'}</h2>

      {message && (
        <div className={`auth-alert ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      {isRegister ? (
        <RegisterForm onRegister={handleRegister} />
      ) : (
        <LoginForm onLogin={handleLogin} />
      )}

      <p className="auth-toggle">
        {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage('');
          }}
          className="toggle-btn"
        >
          {isRegister ? 'Log In here' : 'Register here'}
        </button>
      </p>
    </div>
  );
}

export default Login;
