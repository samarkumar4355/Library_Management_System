import { Link } from 'react-router-dom';
import './Hero.css';

function Hero() {
  return (
    <header className="hero">
      <span className="hero-badge">College Library</span>
      <h1 className="hero-heading">TWIRLING LOTUS</h1>
      <h2 className="hero-title">Twirling in the gyre of knowledge</h2>
      <p className="hero-subtitle">
        Browse the catalogue, borrow a book in one click, and return it when you are done.
      </p>
      <Link to="/books" className="hero-button">Browse Catalogue</Link>
    </header>
  );
}

export default Hero;
