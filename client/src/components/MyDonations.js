import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const MyDonations = () => {
  const { t } = useTranslation();
  const [myDonations, setMyDonations] = useState([]);

  useEffect(() => {
    fetchMyDonations();
  }, []);

  const fetchMyDonations = async () => {
    try {
      const userId = localStorage.getItem('userId');
      const res = await axios.get(`https://food-bridge-server.onrender.com/api/donations/user/${userId}`);
      setMyDonations(res.data);
    } catch (error) {
      console.error('Failed to fetch user donations:', error);
    }
  };

  // Subtract 5.5 hours from UTC and format to readable string
  const formatDateMinus5H30 = (dateStr) => {
    const originalDate = new Date(dateStr);
    const adjustedDate = new Date(originalDate.getTime() - (5.5 * 60 * 60 * 1000));
    return adjustedDate.toLocaleString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleDelete = async (donationId) => {
    if (window.confirm(t('confirmDelete'))) {
      try {
        await axios.delete(`https://food-bridge-server.onrender.com/api/donations/${donationId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
          }
        });
        setMyDonations(prev => prev.filter(d => d._id !== donationId));
        alert(t('deletedSuccessfully'));
      } catch (error) {
        console.error('Failed to delete donation:', error);
        alert(t('deleteFailed'));
      }
    }
  };

  const handleEdit = (donation) => {
    // Redirect to edit page or open modal (you can replace with actual navigation)
    alert(t('editNotImplemented') + `\n\nID: ${donation._id}`);
    // Example: navigate(`/edit-donation/${donation._id}`);
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">{t('myDonations')}</h2>
      {myDonations.length === 0 ? (
        <p className="text-gray-600">{t('noDonationsFound')}</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myDonations.map(d => (
            <div key={d._id} className="border p-4 rounded shadow">
              <h3 className="text-lg font-semibold">{d.name}</h3>
              <p><strong>{t('food')}:</strong> {d.foodDescription}</p>
              <p><strong>{t('availableAt')}:</strong> {formatDateMinus5H30(d.availableDateTime)}</p>
              <p><strong>{t('address')}:</strong><br />
                {d.address.detailedAddress}, {d.address.district}, {d.address.state} - {d.address.pincode}
              </p>
              {d.claimed ? (
                <p className="mt-2 text-red-600 font-semibold">{t('claimed')}</p>
              ) : (
                <p className="mt-2 text-green-600">{t('notClaimed')}</p>
              )}

              {/* Action Buttons */}
              <div className="mt-3 flex gap-2">
                <button
                  className="bg-yellow-500 text-white px-3 py-1 rounded"
                  onClick={() => handleEdit(d)}
                >
                  {t('edit')}
                </button>
                <button
                  className="bg-red-600 text-white px-3 py-1 rounded"
                  onClick={() => handleDelete(d._id)}
                >
                  {t('delete')}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyDonations;
