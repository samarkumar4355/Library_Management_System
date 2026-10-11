import { useState } from 'react';

// Styles for this form are in pages/Login.css
import React, { useState } from 'react';
import './LoginForm.css';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onLogin({ email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="auth-sub-form">
      <label>Email</label>
      <input
        type="email"
        placeholder="your.email@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      <label>Password</label>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="auth-btn">Log In</button>
    </form>
  );
}

export default LoginForm;
