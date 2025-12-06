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
    bookingType: 'REGULAR', // NEW: Default to REGULAR
    transactionDate: '',
    transactionTime: '',
    fromAccount: '',
    toAccount: '',
  });

  const reservationId = new URLSearchParams(location.search).get('reservationId');
  const roomTypeFromParams = new URLSearchParams(location.search).get('roomType');

  // NEW: Check if today is after 12th
  const today = new Date();
  const dayOfMonth = today.getDate();
  const isAfter12th = dayOfMonth > 12;

  useEffect(() => {
    loadHostel();
  }, [id]);

  const loadHostel = async () => {
    try {
      const response = await hostelsApi.getById(id!);
      const data = response.data.data;
      setHostel(data);
      
      // Set room type from params or default
      const roomType = roomTypeFromParams || (data?.roomTypes?.length > 0 ? data.roomTypes[0].type : '');
      
      // NEW: If after 12th, force URGENT booking type
      if (isAfter12th) {
        setFormData(prev => ({
          ...prev,
          roomType,
          bookingType: 'URGENT'
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          roomType
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
    
    if (!selectedRoomType) return 0;
    
    // NEW: Return urgent price if booking type is URGENT and urgent price exists
    if (formData.bookingType === 'URGENT' && selectedRoomType.urgentBookingPrice) {
      return selectedRoomType.urgentBookingPrice;
    }
    
    return selectedRoomType.price;
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

    // NEW: Validate that after 12th, only URGENT booking is allowed
    if (isAfter12th && formData.bookingType !== 'URGENT') {
      setError('After 12th of the month, only urgent bookings are allowed. Please select URGENT booking type.');
      return;
    }

    // NEW: Validate that urgent booking has urgent price set
    if (formData.bookingType === 'URGENT') {
      const selectedRoomType = hostel.roomTypes.find(
        (rt: any) => rt.type === formData.roomType
      );
      if (!selectedRoomType?.urgentBookingPrice) {
        setError('Urgent booking price is not set for this room type. Please contact the manager or select a different room type.');
        return;
      }
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
      
      // Show different message for urgent booking
      if (formData.bookingType === 'URGENT') {
        alert('Urgent booking submitted successfully! You must leave on 1st of next month. Wait for manager approval.');
      } else {
        alert('Booking submitted successfully! Wait for manager approval.');
      }
      
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

  const selectedRoomType = hostel.roomTypes?.find(
    (rt: any) => rt.type === formData.roomType
  );
  const urgentBookingPrice = selectedRoomType?.urgentBookingPrice;

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
          
          {/* NEW: Booking restriction notice */}
          {isAfter12th && (
            <div className="mt-3 p-3 border border-orange-200 bg-orange-50 rounded-lg">
              <div className="flex items-start gap-2">
                <span className="text-orange-600 text-sm">⚠️</span>
                <div>
                  <p className="text-sm text-orange-800 font-medium mb-1">
                    Booking Date Restriction Active
                  </p>
                  <p className="text-sm text-orange-700 font-light">
                    Today is {dayOfMonth}{dayOfMonth === 1 ? 'st' : dayOfMonth === 2 ? 'nd' : dayOfMonth === 3 ? 'rd' : 'th'} of the month.
                    Only <span className="font-medium">urgent bookings</span> are allowed after the 12th.
                  </p>
                  <p className="text-sm text-orange-600 font-light mt-1">
                    Urgent bookings require leaving on 1st of next month and rebooking.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Card */}
        <div className="border border-gray-100 bg-white px-6 py-7 sm:px-8 sm:py-8">
          {/* Amount notice */}
          <div className="border border-yellow-200 bg-yellow-50 px-4 py-3 mb-5">
            <div className="flex justify-between items-center mb-2">
              <p className="text-sm text-gray-900 font-light">
                Amount to Pay:
              </p>
              <div className="text-right">
                <span className="text-lg font-normal text-gray-900">
                  Rs. {getPrice().toLocaleString()}
                </span>
                {formData.bookingType === 'URGENT' && (
                  <p className="text-xs text-orange-600 font-light">
                    (Urgent Booking Price)
                  </p>
                )}
                {formData.bookingType === 'REGULAR' && (
                  <p className="text-xs text-gray-500 font-light">
                    (Regular Price)
                  </p>
                )}
              </div>
            </div>
            
            {/* NEW: Show comparison if urgent price exists */}
            {urgentBookingPrice && formData.bookingType === 'REGULAR' && (
              <div className="mt-2 pt-2 border-t border-yellow-300">
                <p className="text-xs text-gray-600 font-light">
                  Regular: Rs. {selectedRoomType?.price?.toLocaleString()} • 
                  Urgent: Rs. {urgentBookingPrice.toLocaleString()}
                </p>
              </div>
            )}
            
            <p className="text-xs text-yellow-800 font-light mt-2">
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
                      {rt.type} • 
                      Regular: Rs. {rt.price} • 
                      {rt.urgentBookingPrice ? `Urgent: Rs. ${rt.urgentBookingPrice}` : 'No urgent price'}
                    </option>
                  ))}
              </select>
            </div>

            {/* NEW: Booking Type */}
            <div>
              <label className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                Booking Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.bookingType === 'REGULAR' 
                    ? 'border-gray-900 bg-gray-50' 
                    : 'border-gray-200 hover:border-gray-300'
                } ${isAfter12th ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <input
                    type="radio"
                    name="bookingType"
                    value="REGULAR"
                    checked={formData.bookingType === 'REGULAR'}
                    onChange={handleChange}
                    disabled={isAfter12th}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-sm font-light text-gray-900 mb-1">Regular</div>
                    <div className="text-xs text-gray-500">
                      Available 1st-12th
                    </div>
                  </div>
                </label>
                
                <label className={`flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-colors ${
                  formData.bookingType === 'URGENT' 
                    ? 'border-orange-500 bg-orange-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}>
                  <input
                    type="radio"
                    name="bookingType"
                    value="URGENT"
                    checked={formData.bookingType === 'URGENT'}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <div className="text-center">
                    <div className="text-sm font-light text-gray-900 mb-1">Urgent</div>
                    <div className="text-xs text-gray-500">
                      Must leave 1st next month
                    </div>
                  </div>
                </label>
              </div>
              
              {/* NEW: Urgent booking notice */}
              {formData.bookingType === 'URGENT' && (
                <div className="mt-2 p-2 border border-orange-200 bg-orange-50 rounded">
                  <p className="text-xs text-orange-700 font-light">
                    <span className="font-medium">Important:</span> Urgent booking requires leaving on 1st of next month.
                    You will need to rebook for the following month.
                  </p>
                </div>
              )}
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
                {submitting 
                  ? 'Submitting...' 
                  : formData.bookingType === 'URGENT' 
                    ? 'Submit Urgent Booking' 
                    : 'Submit Booking'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default BookHostel;