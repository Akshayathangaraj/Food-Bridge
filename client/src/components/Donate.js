import React, { useState } from 'react';
import axios from 'axios';
import './Donate.css';
import { useTranslation } from 'react-i18next';

const tamilNaduDistricts = [
  "Ariyalur", "Chengalpattu", "Chennai", "Coimbatore", "Cuddalore",
  "Dharmapuri", "Dindigul", "Erode", "Kallakurichi", "Kanchipuram",
  "Kanniyakumari", "Karur", "Krishnagiri", "Madurai", "Mayiladuthurai",
  "Nagapattinam", "Namakkal", "Nilgiris", "Perambalur", "Pudukkottai",
  "Ramanathapuram", "Ranipet", "Salem", "Sivaganga", "Tenkasi", "Thanjavur",
  "Theni", "Thoothukudi", "Tiruchirappalli", "Tirunelveli", "Tirupathur",
  "Tiruppur", "Tiruvallur", "Tiruvannamalai", "Tiruvarur", "Vellore",
  "Viluppuram", "Virudhunagar"
];

const Donate = () => {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: '',
    foodDescription: '',
    availableDateTime: '',
    phone: '',
    detailedAddress: '',
    state: '',
    district: '',
    pincode: ''
  });

  const [districtOptions, setDistrictOptions] = useState([]);
  const [message, setMessage] = useState('');

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    if (name === 'state') {
      if (value === 'Tamil Nadu') {
        setDistrictOptions(tamilNaduDistricts);
      } else {
        setDistrictOptions([]);
      }
      setFormData(prev => ({ ...prev, district: '' }));
    }
  };
console.log("Submitting form with data:", formData);

  const handleSubmit = async e => {
    e.preventDefault();
    const { name, foodDescription, availableDateTime, phone, detailedAddress, state, district, pincode } = formData;

    if (!name || !foodDescription || !availableDateTime || !phone || !detailedAddress || !state || !district || !pincode) {
      return setMessage(t('allFieldsRequired'));
    }

    try {
      await axios.post('https://food-bridge-server.onrender.com/api/donate', {
        name,
        foodDescription,
        availableDateTime,
        phone,
        address: { detailedAddress, state, district, pincode }
      });
      setMessage(t('submissionSuccess'));
      setFormData({
        name: '', foodDescription: '', availableDateTime: '', phone: '',
        detailedAddress: '', state: '', district: '', pincode: ''
      });
      setDistrictOptions([]);
    } catch (err) {
      setMessage(t('submissionFailed'));
    }
  };

  return (
    <div className="donate-container">
      <h2 className="donate-title">{t('donateFood')}</h2>
      <form onSubmit={handleSubmit} className="donate-form">
        <label>
          {t('yourName')}
          <input
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder={t('enterYourFullName')}
          />
        </label>

        <label>
          {t('foodDescription')}
          <textarea
            name="foodDescription"
            value={formData.foodDescription}
            onChange={handleChange}
            placeholder={t('describeFood')}
            rows={3}
          />
        </label>

        <label>
          {t('availableDateTime')}
          <input
            name="availableDateTime"
            type="datetime-local"
            value={formData.availableDateTime}
            onChange={handleChange}
          />
        </label>

        <label>
          {t('phoneNumber')}
          <input
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            placeholder={t('enterPhoneNumber')}
          />
        </label>

        <label>
          {t('detailedAddress')}
          <textarea
            name="detailedAddress"
            value={formData.detailedAddress}
            onChange={handleChange}
            placeholder={t('enterFullAddress')}
            rows={3}
          />
        </label>

        <label>
          {t('state')}
          <select name="state" value={formData.state} onChange={handleChange}>
            <option value="">{t('selectState')}</option>
            <option value="Tamil Nadu">{t('tamilNadu')}</option>
            {/* Add more states if needed */}
          </select>
        </label>

        <label>
          {t('district')}
          <select
            name="district"
            value={formData.district}
            onChange={handleChange}
            disabled={!formData.state}
          >
            <option value="">{t('selectDistrict')}</option>
            {districtOptions.map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </label>

        <label>
          {t('pincode')}
          <input
            name="pincode"
            type="text"
            value={formData.pincode}
            onChange={handleChange}
            placeholder={t('enterPincode')}
          />
        </label>

        <button type="submit" className="donate-submit-btn">
          {t('submitDonation')}
        </button>

        {message && (
          <p className={`donate-message ${message.includes(t('submissionSuccess')) ? 'success' : 'error'}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default Donate;
