import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { hostelsApi, reservationsApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';

const HostelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [message, setMessage] = useState('');
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

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

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    setReserving(true);
    try {
      await reservationsApi.create({ hostelId: id, message });
      alert('Reservation submitted successfully!');
      navigate('/student');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reserve');
    } finally {
      setReserving(false);
    }
  };

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/hostels/${id}/book`);
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!hostel) {
    return <div className="text-center py-10">Hostel not found</div>;
  }

  const getPrice = () => {
    if (hostel.hostelType === 'PRIVATE') return `Rs. ${hostel.roomPrice}/room`;
    if (hostel.hostelType === 'SHARED') return `Rs. ${hostel.pricePerHeadShared}/person`;
    return `Rs. ${hostel.pricePerHeadFullRoom}/person`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{hostel.hostelName}</h1>
            <p className="text-gray-600">
              {hostel.city}, {hostel.address}
            </p>
            <div className="flex items-center mt-2">
              <span className="text-yellow-400 text-xl">★</span>
              <span className="ml-1">
                {hostel.averageRating.toFixed(1)} ({hostel.reviewCount} reviews)
              </span>
              <span
                className={`ml-4 px-3 py-1 rounded-full text-sm ${
                  hostel.hostelFor === 'BOYS'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-pink-100 text-pink-800'
                }`}
              >
                {hostel.hostelFor}
              </span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-indigo-600">{getPrice()}</p>
            <p className="text-gray-500">
              {hostel.availableRooms} of {hostel.totalRooms} rooms available
            </p>
          </div>
        </div>
      </div>

      {/* Images */}
      {hostel.roomImages?.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Room Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {hostel.roomImages.map((img: string, idx: number) => (
              <img
                key={idx}
                src={img}
                alt={`Room ${idx + 1}`}
                className="w-full h-40 object-cover rounded-md"
              />
            ))}
          </div>
        </div>
      )}

      {/* Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Details</h2>
          <div className="space-y-2">
            <p><strong>Type:</strong> {hostel.hostelType.replace('_', ' ')}</p>
            <p><strong>Persons per Room:</strong> {hostel.personsInRoom}</p>
            <p><strong>Nearby:</strong> {hostel.nearbyLocations?.join(', ') || 'N/A'}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Facilities</h2>
          <div className="grid grid-cols-2 gap-2 text-sm">
            {hostel.facilities?.hotColdWaterBath && (
              <span className="text-green-600">✓ Hot/Cold Water</span>
            )}
            {hostel.facilities?.drinkingWater && (
              <span className="text-green-600">✓ Drinking Water</span>
            )}
            {hostel.facilities?.electricityBackup && (
              <span className="text-green-600">✓ Electricity Backup</span>
            )}
            {hostel.facilities?.wifiEnabled && (
              <span className="text-green-600">✓ WiFi Available</span>
            )}
            {hostel.facilities?.customFacilities?.map((f: string, i: number) => (
              <span key={i} className="text-green-600">✓ {f}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Rules */}
      {hostel.rules && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Rules</h2>
          <p className="whitespace-pre-wrap">{hostel.rules}</p>
        </div>
      )}

      {/* Actions */}
      {user?.role === 'STUDENT' && hostel.availableRooms > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Book or Reserve</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Message (optional for reservation)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Any special requests..."
              />
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleReserve}
                disabled={reserving}
                className="flex-1 bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 disabled:opacity-50"
              >
                {reserving ? 'Reserving...' : 'Reserve for Later'}
              </button>
              <button
                onClick={handleBook}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
              >
                Book Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reviews */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Reviews</h2>
        {hostel.reviews?.length === 0 ? (
          <p className="text-gray-500">No reviews yet.</p>
        ) : (
          <div className="space-y-4">
            {hostel.reviews?.map((review: any) => (
              <div key={review.id} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <span className="text-yellow-400">
                    {'★'.repeat(review.rating)}
                    {'☆'.repeat(5 - review.rating)}
                  </span>
                  <span className="ml-2 text-sm text-gray-500">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelDetail;