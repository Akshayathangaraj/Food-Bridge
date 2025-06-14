import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { auth } from '../firebase-config';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import './Signup.css';

const districts = [
  'Ariyalur', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri', 'Dindigul',
  'Erode', 'Kanchipuram', 'Kanyakumari', 'Karur', 'Krishnagiri', 'Madurai',
  'Nagapattinam', 'Namakkal', 'Perambalur', 'Pudukkottai', 'Ramanathapuram',
  'Salem', 'Sivaganga', 'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi',
  'Tiruchirappalli', 'Tirunelveli', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai',
  'Tiruvarur', 'Vellore', 'Viluppuram', 'Virudhunagar'
];

const Signup = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    district: '',
    city: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = t('firstName') + ' is required';
    if (!formData.lastName.trim()) newErrors.lastName = t('lastName') + ' is required';
    if (!formData.district) newErrors.district = t('district') + ' is required';
    if (!formData.city.trim()) newErrors.city = t('city') + ' is required';
    if (!formData.phone.trim()) newErrors.phone = t('phone') + ' is required';
    if (!formData.password) newErrors.password = t('password') + ' is required';
    if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = t('confirmPassword') + ' does not match';
    return newErrors;
  };

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      console.log("Initializing reCAPTCHA...");
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log("reCAPTCHA solved");
          handleSendOtp(); 
        },
        'expired-callback': () => {
          console.warn("reCAPTCHA expired. Please refresh.");
        }
      });
    } else {
      console.log("reCAPTCHA already initialized.");
    }
  };

  const handleSendOtp = async () => {
    console.log("Starting OTP send process...");

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      console.warn("Validation failed", validationErrors);
      setErrors(validationErrors);
      return;
    }

    setupRecaptcha();

    const phoneNumber = '+91' + formData.phone;
    const appVerifier = window.recaptchaVerifier;

    try {
      console.log("Attempting to send OTP to:", phoneNumber);
      const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      console.log("OTP sent successfully ✅", result);
      alert('OTP sent successfully ✅');
    } catch (error) {
      console.error('SMS not sent ❌', error);
      alert(error.message || 'Failed to send OTP. Please try again.');
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) return alert('Please enter the OTP');

    try {
      const result = await confirmationResult.confirm(otp);
      console.log("OTP verified ✅", result);
      alert('Phone number verified ✅');
      submitForm(); // proceed to backend
    } catch (error) {
      console.error('OTP verification failed ❌', error);
      alert(error.message || 'Invalid OTP. Please try again.');
    }
  };

  const submitForm = async () => {
    try {
      const response = await axios.post('https://food-bridge-server.onrender.com/api/signup', formData);
      alert(response.data.message);
      console.log("Signup successful ✅", response.data);

      // Reset
      setFormData({
        firstName: '', lastName: '', district: '', city: '',
        email: '', phone: '', password: '', confirmPassword: ''
      });
      setOtp('');
      setOtpSent(false);
    } catch (err) {
      console.error("Signup failed ❌", err);
      if (err.response?.data?.message) {
        alert(err.response.data.message);
      } else {
        alert('Error signing up');
      }
    }
  };

  return (
    <div className="form-container">
      <h2 className="form-title">{t('signup')}</h2>
      <form onSubmit={(e) => { e.preventDefault(); handleSendOtp(); }} className="form-box" noValidate>
        {["firstName", "lastName", "city", "email", "phone", "password", "confirmPassword"].map(field => (
          <div key={field} className="form-group">
            <label htmlFor={field}>
              {t(field)}{field === 'email' ? ` (${t('optional')})` : ''}
            </label>
            <input
              type={field.includes('password') ? 'password' : field === 'email' ? 'email' : field === 'phone' ? 'tel' : 'text'}
              id={field}
              name={field}
              value={formData[field]}
              onChange={handleChange}
              className={errors[field] ? 'error' : ''}
            />
            {errors[field] && <div className="form-error">{errors[field]}</div>}
          </div>
        ))}

        <div className="form-group">
          <label htmlFor="district">{t('district')}</label>
          <select
            id="district"
            name="district"
            value={formData.district}
            onChange={handleChange}
            className={errors.district ? 'error' : ''}
          >
            <option value="">{t('Select District')}</option>
            {districts.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          {errors.district && <div className="form-error">{errors.district}</div>}
        </div>

        {otpSent && (
          <div className="form-group">
            <label htmlFor="otp">Enter OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button type="button" onClick={handleVerifyOtp}>Verify OTP</button>
          </div>
        )}

        <div id="recaptcha-container"></div>

        {!otpSent && <button type="submit" className="submit-btn">{t('submit')}</button>}
      </form>

      <div className="form-footer">
        <p>{t('Already have an account?')} <Link to="/login">{t('Login here')}</Link></p>
      </div>
    </div>
  );
};

export default Signup;
