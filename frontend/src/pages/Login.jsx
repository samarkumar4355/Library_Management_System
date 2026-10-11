import { useState } from 'react';
import './Login.css';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { API_URL } from '../config';

function Login() {
  const [showRegister, setShowRegister] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')));

  async function handleLogin(details) {
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
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
      const userRes = await fetch(`${API_URL}/auth/`, {
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
      const res = await fetch(`${API_URL}/auth/register`, {
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
        <div className="auth-avatar">{user.name ? user.name[0] : 'U'}</div>
        <h2>Welcome, {user.name}!</h2>
        <p className="auth-detail">{user.email}</p>
        <span className="role-pill">{user.role}</span>
        <button onClick={handleLogout} className="btn-logout">Log Out</button>
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
        </button>
      </p>
    </div>
  );
}

export default Login;
