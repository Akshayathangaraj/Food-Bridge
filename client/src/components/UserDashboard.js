import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');
  const firstName = localStorage.getItem('firstName');

  useEffect(() => {
    if (!userId) {
      alert("Please log in to access the dashboard.");
      navigate('/login');
    }
  }, [userId, navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-navbar">
        <div className="nav-left">
          <span className="welcome-text">👋 Welcome, {firstName || 'User'}</span>
        </div>
        <div className="nav-right">
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <main className="dashboard-main">
        <h2>Your Dashboard</h2>
        <p>User ID: <strong>{userId}</strong></p>
        
        <div className="dashboard-buttons">
          <a href={`/user/${userId}/donate`} className="highlighted-link">🍱 Donate Food</a>
          <a href={`/user/${userId}/food-available`} className="highlighted-link">🔍 View Available Food</a>
          <a href={`/user/${userId}/my-donations`} className="highlighted-link">📦 My Donations</a>
          <a href={`/user/${userId}/claimed-food`} className="highlighted-link">✅ Claimed Food List</a>
        </div>
      </main>
    </div>
  );
};

export default UserDashboard;
