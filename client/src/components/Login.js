import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next'; 
import './Login.css';

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('https://food-bridge-server.onrender.com/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(t('loginSuccess') + ' ' + data.firstName);
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({ userId: data.userId, firstName: data.firstName }));
        localStorage.setItem('userId', data.userId);
        localStorage.setItem('firstName', data.firstName);
        navigate('/user-dashboard');
      } else {
        setError(data.message || t('loginFailed'));
      }
    } catch (err) {
      setError(t('loginError'));
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{t('login')}</h2>
      <form onSubmit={handleSubmit} className="form-box">
        <div className="form-group">
          <label htmlFor="identifier">{t('emailOrPhone')}</label>
          <input
            type="text"
            id="identifier"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            required
            placeholder={t('enterEmailOrPhone')}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">{t('password')}</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder={t('enterPassword')}
          />
        </div>

        {error && <p className="form-error">{error}</p>}

        <button type="submit" className="submit-btn">{t('login')}</button>
      </form>

      <div className="form-footer">
        <p>
          {t('noAccount')} <Link to="/Signup">{t('signupHere')}</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
