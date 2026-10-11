import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Return.css';

function Return() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  // Increasing this number makes useEffect load the loans again (e.g. after a return)
  const [refreshCount, setRefreshCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadLoans() {
      try {
        // The backend only sends back the loans that belong to this token's user
        const res = await fetch('http://localhost:5001/api/circulation/my-loans', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) setLoans(data.loans);
        else {
          setMessage(data.message);
          setIsError(true);
        }
      } catch {
        setMessage('Could not load your books.');
        setIsError(true);
      }
      setLoading(false);
    }
    if (token) loadLoans();
  }, [token, refreshCount]);

  async function handleReturn(loanId) {
    try {
      const res = await fetch(`http://localhost:5001/api/circulation/return/${loanId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setMessage(data.message);
      setIsError(!res.ok);
      if (res.ok) setRefreshCount(refreshCount + 1);
    } catch {
      setMessage('Could not reach the server.');
      setIsError(true);
    }
  }

  if (!token) {
    return (
      <div className="return-page empty-box">
        <h2>My Books</h2>
        <p>Please log in to see the books you have borrowed.</p>
        <Link to="/login" className="btn-primary">Log In</Link>
      </div>
    );
  }

  return (
    <div className="return-page">
      <h2>My Books</h2>
      <p className="subtitle">Your borrowed books and their due dates.</p>

      {message && <div className={`alert-box ${isError ? 'error' : 'success'}`}>{message}</div>}
      {loading && <p className="status-message">Loading your books...</p>}

      {!loading && loans.length === 0 && (
        <div className="empty-box">
          <p>You have not borrowed any books yet.</p>
          <Link to="/books" className="btn-primary">Browse Catalogue</Link>
        </div>
      )}

      <div className="loans-grid">
        {loans.map((loan) => (
          <div key={loan._id} className="loan-card">
            <h3>{loan.bookTitle}</h3>
            <p>by {loan.bookAuthor}</p>
            <p>Due: <strong>{new Date(loan.dueDate).toLocaleDateString()}</strong></p>
            <div className="loan-footer">
              <span className={`status-badge ${loan.status.toLowerCase()}`}>{loan.status}</span>
              {loan.status === 'Issued' && (
                <button className="btn-return" onClick={() => handleReturn(loan._id)}>Return</button>
              )}
            </div>
          </div>
        ))}
      </div>
import React, { useState } from 'react';
import './Return.css';
import TransactionCard from '../components/TransactionCard';

function Return() {
  const [transactionId, setTransactionId] = useState('');
  const [adminToken, setAdminToken] = useState(localStorage.getItem('token') || '');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [returnedRecord, setReturnedRecord] = useState(null);

  async function handleReturnBook(e) {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setReturnedRecord(null);

    const token = adminToken || localStorage.getItem('token');
    if (!token) {
      setIsError(true);
      setMessage('Admin authorization token is required to process returns.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:5001/api/circulation/return/${transactionId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to return book');
      }

      setMessage(data.message || 'Book returned successfully!');
      setReturnedRecord(data.transaction);
      setTransactionId('');
    } catch (err) {
      setIsError(true);
      setMessage(err.message);
    }
  }

  return (
    <div className="circulation-container">
      <h2>Return Book</h2>
      <p className="circulation-subtitle">
        Process a book return and restore inventory count using the Transaction ID.
      </p>

      {message && (
        <div className={`circulation-alert ${isError ? 'error' : 'success'}`}>
          {message}
        </div>
      )}

      <TransactionCard
        title="Return Completed"
        transaction={returnedRecord}
      />

      <form onSubmit={handleReturnBook} className="circulation-form">
        <label>Transaction ID</label>
        <input
          type="text"
          placeholder="Enter the transaction ID to return"
          value={transactionId}
          onChange={(e) => setTransactionId(e.target.value)}
          required
        />

        <label>Admin Token</label>
        <input
          type="text"
          placeholder="Paste admin JWT token if not logged in as admin"
          value={adminToken}
          onChange={(e) => setAdminToken(e.target.value)}
        />

        <button type="submit" className="circulation-btn return-btn">Process Return</button>
      </form>
import React from 'react';
import './Return.css';

function Return() {
  return (
    <div className="return-page">
      <h2>Return Books</h2>
      <p>This is the book return page. Feature coming soon.</p>
    </div>
  );
}

export default Return;
