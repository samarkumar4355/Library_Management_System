import { useState } from 'react';
import './BookForm.css';

function BookForm({ editingBook, onSave, onCancel }) {
  const [form, setForm] = useState(
    editingBook || {
      title: '',
      author: '',
      isbn: '',
      category: '',
      totalCopies: '',
      availableCopies: '',
    }
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSave({
      ...form,
      totalCopies: parseInt(form.totalCopies, 10),
      availableCopies: parseInt(form.availableCopies, 10),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="book-form">
      <h3>{editingBook ? 'Edit Book Record' : 'Add New Book'}</h3>
      <input
        name="title"
        placeholder="Book Title"
        value={form.title}
        onChange={handleChange}
        required
      />
      <input
        name="author"
        placeholder="Author"
        value={form.author}
        onChange={handleChange}
        required
      />
      <input
        name="isbn"
        placeholder="ISBN"
        value={form.isbn}
        onChange={handleChange}
        required
      />
      <input
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        required
      />
      <div className="form-row">
        <input
          name="totalCopies"
          type="number"
          min="0"
          placeholder="Total Copies"
          value={form.totalCopies}
          onChange={handleChange}
          required
        />
        <input
          name="availableCopies"
          type="number"
          min="0"
          placeholder="Available Copies"
          value={form.availableCopies}
          onChange={handleChange}
          required
        />
      </div>
      <div className="btn-group">
        <button type="submit" className="btn-primary">
          {editingBook ? 'Update Book' : 'Add Book'}
        </button>
        {editingBook && (
          <button type="button" onClick={onCancel} className="btn-secondary">
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default BookForm;
