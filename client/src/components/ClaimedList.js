// src/pages/ClaimedList.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './ClaimedList.css';
import { useTranslation } from 'react-i18next';

const ClaimedList = () => {
  const { t } = useTranslation();
  const [claimed, setClaimed] = useState([]);

  const token = localStorage.getItem('token');

  useEffect(() => {
  const fetchClaimedDonations = async () => {
    try {
      const res = await axios.get('https://food-bridge-server.onrender.com/api/claimed-donations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setClaimed(res.data);
    } catch (err) {
      console.error('Failed to fetch claimed donations');
    }
  };

  fetchClaimedDonations();
}, [token]); // Add `token` if it might change
 (
    <div className="claimed-container">
      <h2>{t('claimedList')}</h2>
      {claimed.length === 0 ? (
        <p>{t('noClaimedYet')}</p>
      ) : (
        claimed.map((item) => (
          <div key={item._id} className="claimed-card">
            <h4>{item.foodDescription}</h4>
            <p>{new Date(item.availableDateTime).toLocaleString()}</p>
            <p>
  {item?.address?.district || 'N/A'} – {item?.address?.detailedAddress || 'N/A'}
</p>

          </div>
        ))
      )}
    </div>
  );
};

export default ClaimedList;
