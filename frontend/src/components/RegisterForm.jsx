import { useState } from 'react';

// Styles for this form are in pages/Login.css
import React, { useState } from 'react';
import './RegisterForm.css';

function RegisterForm({ onRegister }) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState('other');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    onRegister({ name, gender, email, password });
  }

  return (
    <form onSubmit={handleSubmit} className="auth-sub-form">
      <label>Full Name</label>
      <input
        type="text"
        placeholder="e.g. John Doe"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />

      <label>Gender</label>
      <select
        value={gender}
        onChange={(e) => setGender(e.target.value)}
      >
        <option value="male">Male</option>
        <option value="female">Female</option>
        <option value="other">Other</option>
      </select>

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
        placeholder="At least 6 characters"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />

      <button type="submit" className="auth-btn">Register</button>
    </form>
  );
}

export default RegisterForm;
