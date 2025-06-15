import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import logo from '../assets/logo.png';
import { useTranslation } from 'react-i18next';

const Home = () => {
  const { t } = useTranslation();

  const scrollToAbout = (e) => {
    e.preventDefault();
    const aboutSection = document.getElementById('about-us');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="home-container">
      <nav className="glass-navbar">
        <div className="nav-left">
          <img src={logo} alt="Food Bridge Logo" className="logo" />
          <span className="nav-brand">Food Bridge</span>
        </div>
        <ul className="nav-links">
          <li><Link to="/signup">{t('signup')}</Link></li>
          <li><Link to="/login">{t('login')}</Link></li>
          <li><a href="#about-us" onClick={scrollToAbout}>{t('aboutUs')}</a></li>
          <li><a href="#contact-us">{t('contactUs')}</a></li>
        </ul>
      </nav>

      <header className="hero-section">
        <img src={logo} alt="Food Bridge" className="hero-logo" />
        <h1>{t('welcome')} <span className="highlight">Food Bridge</span></h1>
        <p>{t('tagline')}</p>
        <Link to="/signup" className="cta-button">{t('joinNow')}</Link>
      </header>

      <section id="about-us" className="container my-5">
        <h2>{t('aboutUs')}</h2>
        <p>{t('aboutDesc')}</p>

        <div className="about-me mt-4">
          <h3>{t('aboutMe')}</h3>
          <p>{t('intro')}</p>
          <p>{t('idea')}</p>
          <p>{t('vision')}</p>
          <p>{t('thanks')}</p>
        </div>
      </section>

      <section id="user-guide" className="container my-5">
        <h2>How to Use Food Bridge</h2>

        <h4>1. 📝 Sign Up or Log In</h4>
        <p>Create an account with your name, location, phone number (OTP verified), and password.</p>
        <p><strong>Test credentials:</strong> Phone: <code>+91 1234567890</code>, OTP: <code>098765</code></p>

        <h4>2. 🍱 Donate Food</h4>
        <p>Go to <strong>Donate Food</strong> on your dashboard, describe the food, set the time it’s available, and enter the address.</p>

        <h4>3. 🔍 View Available Food</h4>
        <p>Click <strong>View Available Food</strong> to see donations in your area. Use the district filter to narrow results.</p>

        <h4>4. 🤝 Claim a Donation</h4>
        <p>Find something useful? Click <strong>Claim</strong>. Once confirmed, you’ll receive the donor's contact number.</p>

        <h4>5. 📦 Manage My Donations</h4>
        <p>As a donor, edit or delete your donations from <strong>My Donations</strong>. Changes update instantly.</p>

        <h4>6. ✅ Claimed Food List</h4>
        <p>Track what you’ve claimed in the <strong>Claimed Food List</strong> – all in one place.</p>

        <h4>7. 🚪 Log Out</h4>
        <p>Don't forget to logout using the button in the top right of your dashboard when done.</p>

        <p className="mt-3">🙌 Let’s reduce food waste and feed the hungry — one meal at a time.</p>
      </section>

      <section id="contact-us" className="container my-5">
        <h2>{t('contactUs')}</h2>
        <p><strong>{t('email')}:</strong> akshayathangaraj02@gmail.com</p>
        <p><strong>{t('phone')}:</strong> 960077xxxx</p>
        <p><strong>{t('address')}:</strong> Kovilpatti, Tamil Nadu</p>
      </section>

      <footer className="footer">
        &copy; {new Date().getFullYear()} Food Bridge. {t('allRightsReserved')}
      </footer>
    </div>
  );
};

export default Home;
