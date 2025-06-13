import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const FoodAvailable = () => {
  const { t } = useTranslation();
  const [donations, setDonations] = useState([]);
  const [search, setSearch] = useState('');
  const [showContact, setShowContact] = useState({});

  useEffect(() => {
    fetchDonations();
  }, []);

  const fetchDonations = async () => {
    try {
      const res = await axios.get('https://food-bridge-server.onrender.com/api/donations');
      setDonations(res.data);

      const claimedContacts = {};
      res.data.forEach(donation => {
        if (donation.claimed) {
          claimedContacts[donation._id] = donation.phone;
        }
      });
      setShowContact(claimedContacts);
    } catch (error) {
      console.error('Failed to fetch donations:', error);
    }
  };

  const handleClaim = async (id, name, phone) => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert(t('pleaseLogin'));
      return;
    }

    if (window.confirm(t('confirmClaim', { name }))) {
      try {
        await axios.put(
          `http://localhost:5000/api/donations/${id}/claim`,
          { userId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        setShowContact(prev => ({ ...prev, [id]: phone }));

        setDonations(prevDonations =>
          prevDonations.map(d =>
            d._id === id ? { ...d, claimed: true } : d
          )
        );
      } catch (error) {
        console.error('Failed to claim donation:', error);
        alert(t('claimFailed'));
      }
    }
  };

  // Timezone-aware filtering using Asia/Kolkata (IST)
  const filteredDonations = donations.filter(d => {
    const matchesDistrict = d.address.district.toLowerCase().includes(search.toLowerCase());

    // Current time in IST
    const nowISTString = new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const nowIST = new Date(nowISTString);

    // Donation availableDateTime converted to IST date string and then to Date object
    const donationISTString = new Date(d.availableDateTime).toLocaleString('en-US', { timeZone: 'Asia/Kolkata' });
    const donationDateIST = new Date(donationISTString);

    const notExpired = donationDateIST > nowIST;

    return matchesDistrict && notExpired;
  });

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('availableDonations')}</h2>
      <input
        type="text"
        placeholder={t('searchByDistrict')}
        className="w-full p-2 mb-4 border rounded"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDonations.map(d => (
          <div key={d._id} className="border p-4 rounded shadow">
            <h3 className="text-lg font-semibold">{d.name}</h3>
            <p><strong>{t('food')}:</strong> {d.foodDescription}</p>
            <p><strong>{t('availableAt')}:</strong> {new Date(d.availableDateTime).toLocaleString()}</p>
            <p><strong>{t('address')}:</strong><br />
              {d.address.detailedAddress}, {d.address.district}, {d.address.state} - {d.address.pincode}
            </p>
            {!d.claimed ? (
              <button
                className="mt-2 bg-blue-600 text-white px-3 py-1 rounded"
                onClick={() => handleClaim(d._id, d.name, d.phone)}
              >
                {t('claim')}
              </button>
            ) : (
              <p className="mt-2 text-red-600 font-semibold">{t('claimed')}</p>
            )}
            {showContact[d._id] && (
              <p className="mt-2 text-green-600"><strong>{t('contact')}:</strong> {showContact[d._id]}</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FoodAvailable;
