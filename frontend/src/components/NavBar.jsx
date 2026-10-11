import { Link, NavLink } from 'react-router-dom';
import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';

// NavLink works like Link, but adds the "active" class to the current page's link
function NavBar() {
  return (
    <nav className="navbar">
      <Link to="/" className="brand-logo">
        <img src="/lotus.svg" alt="Lotus logo" className="logo-img" />
        <span className="brand-title">LibraryMS</span>
      </Link>

      <ul className="nav-menu">
        <li><NavLink to="/" end className="nav-link">Home</NavLink></li>
        <li><NavLink to="/books" className="nav-link">Catalogue</NavLink></li>
        <li><NavLink to="/return" className="nav-link">My Books</NavLink></li>
        <li><NavLink to="/login" className="nav-link">Login</NavLink></li>
        <li><NavLink to="/admin" className="nav-link admin-badge">Admin</NavLink></li>
      <Link to="/">
        <img src="/lotus.svg" alt="Lotus logo" className="logo" />
      </Link>
      <ul>
        <li><Link to="/">Home</Link></li>
        <li><Link to="/books">Books</Link></li>
        <li><Link to="/borrow">Borrow</Link></li>
        <li><Link to="/return">Return</Link></li>
      </ul>
    </nav>
  );
}

export default NavBar;