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
