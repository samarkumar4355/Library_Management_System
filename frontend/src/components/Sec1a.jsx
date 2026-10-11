import { useState } from 'react';
import './Sec1a.css';

// Shows one book with its cover image and Borrow button
function BookCard({ book, onBorrow }) {
  const isAvailable = book.availableCopies > 0;

  // Clean ISBN (extract digits & valid characters)
  const cleanIsbn = (book.isbn || '').replace(/[^0-9X]/gi, '');
  const coverUrl =
    book.coverImage ||
    (cleanIsbn.length >= 8
      ? `https://covers.openlibrary.org/b/isbn/${cleanIsbn}-M.jpg`
      : '/default-cover.svg');

  const [hasError, setHasError] = useState(false);

  return (
    <div className="book-card">
      <div className="book-cover-container">
        {!hasError ? (
          <img
            src={coverUrl}
            alt={book.title}
            className="book-cover-img"
            loading="lazy"
            onError={() => setHasError(true)}
          />
        ) : (
          <div className="book-cover-fallback">
            <img src="/lotus.svg" alt="" className="fallback-lotus" />
            <span className="fallback-title">{book.title}</span>
            <span className="fallback-author">by {book.author}</span>
          </div>
        )}
      </div>

      <span className="book-category">{book.category}</span>
      <h3 className="book-title">{book.title}</h3>
      <p className="book-author">by {book.author}</p>

      <div className="book-meta">
        <span className="copies-label">Available copies</span>
        <span className={`copies-count ${isAvailable ? 'in-stock' : 'out-of-stock'}`}>
          {book.availableCopies} / {book.totalCopies}
        </span>
      </div>

      <button className="btn-borrow" onClick={() => onBorrow(book)} disabled={!isAvailable}>
        {isAvailable ? 'Borrow' : 'Currently unavailable'}
      </button>
    </div>
  );
}

export default BookCard;