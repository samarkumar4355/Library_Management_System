import './BookList.css';

// Table of all books with Edit and Delete buttons (used on the Admin page)
function BookList({ books, onEdit, onDelete }) {
  if (books.length === 0) {
    return <p className="empty-books-text">No books in the library yet.</p>;
  }

  return (
    <div className="book-list-container">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>ISBN</th>
            <th>Category</th>
            <th>Copies</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book._id}>
              <td className="title-cell">{book.title}</td>
              <td>{book.author}</td>
              <td>{book.isbn}</td>
              <td>{book.category}</td>
              <td>{book.availableCopies} / {book.totalCopies}</td>
              <td className="actions-cell">
                <button className="action-btn edit-btn" onClick={() => onEdit(book)}>Edit</button>
                <button className="action-btn delete-btn" onClick={() => onDelete(book._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default BookList;
