import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './MyDonations.css';
import { useTranslation } from 'react-i18next';

const MyDonations = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [editingDonation, setEditingDonation] = useState(null);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchMyDonations = async () => {
      try {
        const res = await axios.get('https://food-bridge-server.onrender.com/api/my-donations', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDonations(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMyDonations();
  }, [token]); // Only re-run if token changes

  const handleDelete = async (id) => {
    if (!window.confirm(t('confirmDelete'))) return;
    try {
      await axios.delete(`https://food-bridge-server.onrender.com/api/donations/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(t('deleteSuccess'));
      // Re-fetch donations after deletion
      const res = await axios.get('https://food-bridge-server.onrender.com/api/my-donations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(res.data);
    } catch (err) {
      setMessage(t('deleteError'));
    }
  };

  const handleEditClick = (donation) => {
    setEditingDonation(donation._id);
    setFormData({ ...donation });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `https://food-bridge-server.onrender.com/api/donations/${editingDonation}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(t('updateSuccess'));
      setEditingDonation(null);
      // Re-fetch after update
      const res = await axios.get('https://food-bridge-server.onrender.com/api/my-donations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setDonations(res.data);
    } catch (err) {
      setMessage(t('updateError'));
    }
  };

  return (
    <div className="my-donations-container">
      <h2>{t('myDonations')}</h2>
      {message && <p className="status-msg">{message}</p>}
      {donations.length === 0 ? (
        <p>{t('noDonationsYet')}</p>
      ) : (
        donations.map(d => (
          <div key={d._id} className="donation-card">
            {editingDonation === d._id ? (
              <form onSubmit={handleEditSubmit} className="edit-form">
                <input
                  name="foodDescription"
                  value={formData.foodDescription}
                  onChange={handleEditChange}
                />
                <input
                  type="datetime-local"
                  name="availableDateTime"
                  value={formData.availableDateTime?.slice(0, 16)}
                  onChange={handleEditChange}
                />
                <textarea
                  name="address.detailedAddress"
                  value={formData.address?.detailedAddress}
                  onChange={(e) =>
                    setFormData(prev => ({
                      ...prev,
                      address: { ...prev.address, detailedAddress: e.target.value }
                    }))
                  }
                />
                <button type="submit">{t('save')}</button>
                <button type="button" onClick={() => setEditingDonation(null)}>{t('cancel')}</button>
              </form>
            ) : (
              <>
                <h4>{d.foodDescription}</h4>
                <p>{new Date(d.availableDateTime).toLocaleString()}</p>
                <p>{d.address?.detailedAddress}</p>
                <button onClick={() => handleEditClick(d)}>{t('edit')}</button>
                <button onClick={() => handleDelete(d._id)}>{t('delete')}</button>
              </>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyDonations;
