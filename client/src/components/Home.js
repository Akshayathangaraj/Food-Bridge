import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // 👈 Import custom styles
import logo from '../assets/logo.png';
const Home = () => {
  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about-us');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="glass-navbar">
        <div className="nav-left">
          <img src={logo} alt="Food Bridge Logo" className="logo" />
          <span className="nav-brand">Food Bridge</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/signup">Signup</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><a href="#about-us" onClick={scrollToAbout}>About Us</a></li>
          <li><a href="#contact-us">Contact Us</a></li>
        </ul>
      </nav>

      {/* Hero Section */}
      <header className="hero-section">
        <img src={logo} alt="Food Bridge" className="hero-logo" />
        <h1>Welcome to <span className="highlight">Food Bridge</span></h1>
        <p>Connecting hearts through shared meals 🍽️</p>
        <Link to="/signup" className="cta-button">Join Us Now</Link>
      </header>


      {/* About Us */}
      <section id="about-us" className="container my-5">
  <h2>About Us</h2>
  <p>
    Food Bridge is a platform dedicated to reducing food waste by connecting donors and receivers in your community.
    Our mission is to build a sustainable environment by sharing leftover food efficiently.
  </p>

  <div className="about-me mt-4">
    <h3>About Me</h3>
    <p>
      Hi! I'm <strong>Akshaya Thangaraj</strong>, an IT student and the developer behind <em>Food Bridge</em>.
      I'm passionate about building tech solutions that bring positive change to communities and solve real-world problems.
    </p>
    <p>
      The idea for Food Bridge came from observing how much food goes to waste every day, while many people still go hungry.
      I wanted to create a simple, reliable platform that empowers people to make a difference whether by donating surplus food
      or connecting with those in need.
    </p>
    <p>
      I believe in using technology not just for innovation, but for impact. This project reflects my vision of a kinder, more connected world.
    </p>
    <p>
      Thank you for visiting Food Bridge. Together, let's bridge the gap and build a more sustainable future!
    </p>
  </div>
</section>



      {/* Contact Us */}
      <section id="contact-us" className="container my-5">
        <h2>Contact Us</h2>
        <p><strong>Email:</strong> akshayathangaraj02@gmail.com</p>
        <p><strong>Phone:</strong> 960077xxxx</p>
        <p><strong>Address:</strong> Kovilpatti, Tamil Nadu</p>
      </section>

      {/* Footer */}
      <footer className="footer">
        &copy; {new Date().getFullYear()} Food Bridge. All rights reserved.
      </footer>
    </div>
  );
};

export default Home;
