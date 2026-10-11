import { useState, useEffect } from 'react';
import './AdminBooks.css';
import BookForm from '../components/BookForm';
import BookList from '../components/BookList';
import { API_URL } from '../config';

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [editingBook, setEditingBook] = useState(null);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  // Increasing this number makes useEffect load the books again (after add/edit/delete)
  const [refreshCount, setRefreshCount] = useState(0);
  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(`${API_URL}/books`);
        const data = await res.json();
        if (res.ok) setBooks(data);
      } catch {
        setMessage('Could not load books.');
        setIsError(true);
      }
    }
    loadBooks();
  }, [refreshCount]);

  // Sends the request and shows the backend's answer (the backend checks for admin)
  async function sendRequest(url, method, bookData, successText) {
    try {
      const res = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: bookData ? JSON.stringify(bookData) : null,
      });
      const data = await res.json();
      setMessage(res.ok ? successText : data.message);
      setIsError(!res.ok);
      if (res.ok) {
        setEditingBook(null);
        setRefreshCount(refreshCount + 1);
      }
    } catch {
      setMessage('Could not reach the server.');
      setIsError(true);
    }
  }

  function handleSave(bookData) {
    if (editingBook) {
      sendRequest(`${API_URL}/books/${editingBook._id}`, 'PUT', bookData, 'Book updated!');
    } else {
      sendRequest(`${API_URL}/books`, 'POST', bookData, 'Book added!');
    }
  }

  function handleDelete(id) {
    if (window.confirm('Delete this book?')) {
      sendRequest(`${API_URL}/books/${id}`, 'DELETE', null, 'Book deleted!');
    }
  }

  return (
    <div className="admin-page">
      <h2>Admin Book Management</h2>
      <p className="subtitle">Add, edit, or remove books. You must be logged in as an admin.</p>
      {message && <div className={`alert-box ${isError ? 'error' : 'success'}`}>{message}</div>}

      <div className="admin-card">
        <BookForm
          key={editingBook ? editingBook._id : 'new'}
          editingBook={editingBook}
          onSave={handleSave}
          onCancel={() => setEditingBook(null)}
        />
      </div>

      <div className="admin-card">
        <h3>All Books ({books.length})</h3>
        <BookList books={books} onEdit={setEditingBook} onDelete={handleDelete} />
      </div>
    </div>
  );
}

export default AdminBooks;
