import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { hostelsApi, bookingsApi, createFormData } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';

const BookHostel: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();

  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [transactionImageFiles, setTransactionImageFiles] = useState<File[]>([]);
  
  const [formData, setFormData] = useState({
    roomType: '',
    transactionDate: '',
    transactionTime: '',
    fromAccount: '',
    toAccount: '',
  });

  const reservationId = new URLSearchParams(location.search).get('reservationId');

  useEffect(() => {
    loadHostel();
  }, [id]);

  const loadHostel = async () => {
    try {
      const response = await hostelsApi.getById(id!);
      const data = response.data.data;
      setHostel(data);
      if (data?.roomTypes?.length > 0) {
        setFormData((prev) => ({
          ...prev,
          roomType: data.roomTypes[0].type,
        }));
      }
    } catch (error) {
      console.error('Error loading hostel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getPrice = () => {
    if (!hostel || !formData.roomType) return 0;
    const selectedRoomType = hostel.roomTypes.find(
      (rt: any) => rt.type === formData.roomType
    );
    return selectedRoomType ? selectedRoomType.price : 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.roomType) {
      setError('Please select a room type.');
      return;
    }

    if (transactionImageFiles.length === 0) {
      setError('Please upload transaction screenshot.');
      return;
    }

    setSubmitting(true);

    try {
      const data: any = { hostelId: id, ...formData };
      if (reservationId) {
        data.reservationId = reservationId;
      }

      const formDataToSend = createFormData(
        data,
        [{ fieldName: 'transactionImage', files: transactionImageFiles }]
      );

      await bookingsApi.create(formDataToSend);
      // You can replace alert with a toast if you have one globally
      alert('Booking submitted successfully! Wait for manager approval.');
      navigate('/student');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">Loading hostel...</p>
      </main>
    );
  }

  if (!hostel) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="border border-gray-100 bg-white px-6 py-8 text-center max-w-md w-full">
          <h1 className="text-lg font-light text-gray-900 mb-2">
            Hostel not found
          </h1>
          <p className="text-sm text-gray-500 font-light mb-4">
            The hostel you are trying to book could not be found.
          </p>
          <button
            onClick={() => navigate('/hostels')}
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Browse Hostels
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Book Hostel
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            {hostel.hostelName}
          </h1>
          {hostel.city && (
            <p className="text-sm text-gray-500 font-light">
              {hostel.city} {hostel.address && `• ${hostel.address}`}
            </p>
          )}
        </div>

        {/* Card */}
        <div className="border border-gray-100 bg-white px-6 py-7 sm:px-8 sm:py-8">
          {/* Amount notice */}
          <div className="border border-yellow-200 bg-yellow-50 px-4 py-3 mb-5">
            <p className="text-sm text-gray-900 font-light mb-1">
              Amount to Pay:{' '}
              <span className="font-normal">
                Rs. {getPrice().toLocaleString()}
              </span>
            </p>
            <p className="text-xs text-yellow-800 font-light">
              Please transfer the amount to the manager&apos;s account and then
              provide the transaction details below.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-light">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Room type */}
            <div>
              <label
                htmlFor="roomType"
                className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
              >
                Room Type
              </label>
              <select
                id="roomType"
                name="roomType"
                value={formData.roomType}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
              >
                {hostel.roomTypes &&
                  hostel.roomTypes.map((rt: any) => (
                    <option key={rt.type} value={rt.type}>
                      {rt.type} • Rs. {rt.price}
                    </option>
                  ))}
              </select>
            </div>

            {/* Image upload */}
            <div>
              <ImageUpload
                label="Transaction Screenshot"
                value={transactionImageFiles}
                onChange={setTransactionImageFiles}
              />
            </div>

            {/* Date & time */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="transactionDate"
                  className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
                >
                  Transaction Date
                </label>
                <input
                  id="transactionDate"
                  type="date"
                  name="transactionDate"
                  value={formData.transactionDate}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                />
              </div>
              <div>
                <label
                  htmlFor="transactionTime"
                  className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
                >
                  Transaction Time
                </label>
                <input
                  id="transactionTime"
                  type="time"
                  name="transactionTime"
                  value={formData.transactionTime}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                />
              </div>
            </div>

            {/* From account */}
            <div>
              <label
                htmlFor="fromAccount"
                className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
              >
                From Account (Your Account)
              </label>
              <input
                id="fromAccount"
                type="text"
                name="fromAccount"
                value={formData.fromAccount}
                onChange={handleChange}
                required
                placeholder="03001234567 or Account Number"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            {/* To account */}
            <div>
              <label
                htmlFor="toAccount"
                className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
              >
                To Account (Manager&apos;s Account)
              </label>
              <input
                id="toAccount"
                type="text"
                name="toAccount"
                value={formData.toAccount}
                onChange={handleChange}
                required
                placeholder="03009876543 or Account Number"
                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="w-full sm:w-1/2 border border-gray-200 text-gray-900 py-2.5 text-sm font-light hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-1/2 bg-gray-900 text-white py-2.5 text-sm font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Submitting...' : 'Submit Booking'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default BookHostel;