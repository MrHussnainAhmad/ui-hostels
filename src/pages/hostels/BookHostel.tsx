import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hostelsApi, bookingsApi } from '../../lib/api';

const BookHostel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    transactionImage: '',
    transactionDate: '',
    transactionTime: '',
    fromAccount: '',
    toAccount: '',
  });

  useEffect(() => {
    loadHostel();
  }, [id]);

  const loadHostel = async () => {
    try {
      const response = await hostelsApi.getById(id!);
      setHostel(response.data.data);
    } catch (error) {
      console.error('Error loading hostel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await bookingsApi.create({
        hostelId: id,
        ...formData,
      });
      alert('Booking submitted successfully! Wait for manager approval.');
      navigate('/student');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  const getPrice = () => {
    if (!hostel) return 0;
    if (hostel.hostelType === 'PRIVATE') return hostel.roomPrice;
    if (hostel.hostelType === 'SHARED') return hostel.pricePerHeadShared;
    return hostel.pricePerHeadFullRoom;
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!hostel) {
    return <div className="text-center py-10">Hostel not found</div>;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-2">Book Hostel</h1>
        <p className="text-gray-600 mb-6">{hostel.hostelName}</p>

        <div className="bg-indigo-50 p-4 rounded-md mb-6">
          <p className="text-lg font-semibold text-indigo-800">
            Amount to Pay: Rs. {getPrice()}
          </p>
          <p className="text-sm text-indigo-600">
            Please transfer the amount and provide transaction details below.
          </p>
        </div>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Transaction Screenshot URL
            </label>
            <input
              type="url"
              name="transactionImage"
              value={formData.transactionImage}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="https://example.com/screenshot.jpg"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Transaction Date
              </label>
              <input
                type="date"
                name="transactionDate"
                value={formData.transactionDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Transaction Time
              </label>
              <input
                type="time"
                name="transactionTime"
                value={formData.transactionTime}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              From Account (Your Account)
            </label>
            <input
              type="text"
              name="fromAccount"
              value={formData.fromAccount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="03001234567 or Account Number"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              To Account (Manager's Account)
            </label>
            <input
              type="text"
              name="toAccount"
              value={formData.toAccount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="03009876543 or Account Number"
              required
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {submitting ? 'Submitting...' : 'Submit Booking'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookHostel;