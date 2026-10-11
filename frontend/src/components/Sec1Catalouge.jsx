import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sec1Catalouge.css';
import BookCard from './Sec1a';

function Sec1Catalouge() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  // Increasing this number makes useEffect load the books again (e.g. after borrowing)
  const [refreshCount, setRefreshCount] = useState(0);
  const navigate = useNavigate();
import React, { useState, useEffect } from 'react';
import './Sec1Catalouge.css';
import Card from './Sec1a';
import CatalogueFilter from './CatalogueFilter';
import sampleBooks from '../data/sampleBooks';
import { API_URL } from '../config';

function Sec1Catalouge() {
  const [books, setBooks] = useState(sampleBooks);
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  // Runs when the page opens, when the search text changes, and after a borrow
  useEffect(() => {
    async function loadBooks() {
      try {
        const res = await fetch(`http://localhost:5001/api/books?search=${encodeURIComponent(search)}`);
        const data = await res.json();
        if (res.ok) setBooks(data);
      } catch {
        setMessage('Could not load books. Is the backend running?');
        setIsError(true);
      }
      setLoading(false);
    }
    loadBooks();
  }, [search, refreshCount]);

  async function handleBorrow(book) {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    let isMounted = true;

    async function loadBooks() {
      try {
        const queryParams = new URLSearchParams();
        if (category) {
          queryParams.append('category', category);
        }
        if (onlyAvailable) {
          queryParams.append('available', 'true');
        }

        const queryString = queryParams.toString();
        const url = queryString
          ? `${API_URL}/books?${queryString}`
          : `${API_URL}/books`;

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (isMounted) {
            setBooks(data);
          }
        }
      } catch (error) {
        console.error('Error loading books:', error);
      }
    }

    loadBooks();

    return () => {
      isMounted = false;
    };
  }, [category, onlyAvailable]);

  async function handleSearch(e) {
    e.preventDefault();
    try {
      const queryParams = new URLSearchParams();
      if (searchTerm) {
        queryParams.append('search', searchTerm);
      }
      if (category) {
        queryParams.append('category', category);
      }
      if (onlyAvailable) {
        queryParams.append('available', 'true');
      }

      const queryString = queryParams.toString();
      const url = queryString
        ? `${API_URL}/books?${queryString}`
        : `${API_URL}/books`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setBooks(data);
      }
    } catch (error) {
      console.error('Error searching books:', error);
    }
  }

    try {
      // The backend finds the student from the token, checks stock and creates the loan
      const res = await fetch('http://localhost:5001/api/circulation/borrow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ bookId: book._id }),
      });
      const data = await res.json();
      setMessage(res.ok ? `"${book.title}" borrowed! See it in My Books.` : data.message);
      setIsError(!res.ok);
      if (res.ok) setRefreshCount(refreshCount + 1);
    } catch {
      setMessage('Could not reach the server.');
      setIsError(true);
    }
  }

  return (
    <section className="catalogue">
      <div className="catalogue-header">
        <h2>Book Catalogue</h2>
        <p>Search the collection and borrow any available book.</p>
      </div>

      <input
        type="search"
        className="search-input"
        aria-label="Search books"
        placeholder="Search by title, author or ISBN..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {message && <div className={`alert-box ${isError ? 'error' : 'success'}`}>{message}</div>}
      {loading && <p className="status-message">Loading books...</p>}
      {!loading && books.length === 0 && <p className="status-message">No books found.</p>}

      <div className="book-grid">
        {books.map((book) => (
          <BookCard key={book._id} book={book} onBorrow={handleBorrow} />
        ))}
      </div>
    </section>
  function handleReset() {
    setSearchTerm('');
    setCategory('');
    setOnlyAvailable(false);
  }

  return (
    <div className="catalogue">
      <div className="catalogue-header">
        <h3>Catalogue</h3>
      </div>

      <CatalogueFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        category={category}
        onCategoryChange={setCategory}
        onlyAvailable={onlyAvailable}
        onAvailableChange={setOnlyAvailable}
        onSearch={handleSearch}
        onReset={handleReset}
      />

      <Card books={books} />
    </div>
  );
}

export default Sec1Catalouge;