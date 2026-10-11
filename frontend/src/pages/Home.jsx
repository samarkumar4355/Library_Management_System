import React from 'react';
import './Home.css';
import Hero from '../components/Hero';
import Sec1Catalouge from '../components/Sec1Catalouge';

function Home() {
  return (
    <div className="home-page">
      <Hero />
      <Sec1Catalouge />
    </div>
  );
}

export default Home;
