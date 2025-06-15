import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userId = localStorage.getItem('userId');
  const firstName = localStorage.getItem('firstName');

  useEffect(() => {
    if (!userId) {
      alert(t('loginRequired'));
      navigate('/login');
    }
  }, [userId, navigate, t]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="nav-left">
          <span className="welcome-text">
            {t('welcomeUser', { name: firstName || 'User' })}
          </span>
        </div>
        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>{t('logout')}</button>
        </div>
      </nav>

      <main className="dashboard-main">
        <h2>{t('yourDashboard')}</h2>
        <p>{t('userId')}: <strong>{userId}</strong></p>

        <div className="dashboard-buttons">
          <a href={`/user/${userId}/donate`} className="highlighted-link">{t('donateFood')}</a>
          <a href={`/user/${userId}/food-available`} className="highlighted-link">{t('viewAvailableFood')}</a>
          <a href={`/user/${userId}/my-donations`} className="highlighted-link">{t('myDonations')}</a>
          <a href={`/user/${userId}/claimed-donations`} className="highlighted-link">{t('claimedFoodList')}</a>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
