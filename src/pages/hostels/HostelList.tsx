import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hostelsApi } from '../../lib/api';

const HostelList: React.FC = () => {
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: '',
    hostelFor: '',
    hostelType: '',
  });

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      const params: any = {};
      if (filters.city) params.city = filters.city;
      if (filters.hostelFor) params.hostelFor = filters.hostelFor;
      if (filters.hostelType) params.hostelType = filters.hostelType;

      const response = await hostelsApi.search(params);
      setHostels(response.data.data);
    } catch (error) {
      console.error('Error loading hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loadHostels();
  };

  const getPrice = (hostel: any) => {
    if (hostel.hostelType === 'PRIVATE') return hostel.roomPrice;
    if (hostel.hostelType === 'SHARED') return hostel.pricePerHeadShared;
    return hostel.pricePerHeadFullRoom;
  };

  if (loading) {
    return <div className="text-center py-10">Loading hostels...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Browse Hostels</h1>

      {/* Search Filters */}
      <form onSubmit={handleSearch} className="bg-white rounded-lg shadow p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              City
            </label>
            <input
              type="text"
              value={filters.city}
              onChange={(e) => setFilters({ ...filters, city: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter city"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              For
            </label>
            <select
              value={filters.hostelFor}
              onChange={(e) => setFilters({ ...filters, hostelFor: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All</option>
              <option value="BOYS">Boys</option>
              <option value="GIRLS">Girls</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type
            </label>
            <select
              value={filters.hostelType}
              onChange={(e) => setFilters({ ...filters, hostelType: e.target.value })}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="">All</option>
              <option value="SHARED">Shared</option>
              <option value="PRIVATE">Private</option>
              <option value="SHARED_FULLROOM">Shared Full Room</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Hostel Grid */}
      {hostels.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          No hostels found. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hostels.map((hostel) => (
            <div key={hostel.id} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="h-48 bg-gray-200">
                {hostel.roomImages?.[0] && (
                  <img
                    src={hostel.roomImages[0]}
                    alt={hostel.hostelName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{hostel.hostelName}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      hostel.hostelFor === 'BOYS'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-pink-100 text-pink-800'
                    }`}
                  >
                    {hostel.hostelFor}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2">
                  {hostel.city}, {hostel.address}
                </p>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-indigo-600 font-semibold">
                    Rs. {getPrice(hostel)}/
                    {hostel.hostelType === 'PRIVATE' ? 'room' : 'person'}
                  </span>
                  <span className="text-sm text-gray-500">
                    {hostel.availableRooms}/{hostel.totalRooms} rooms
                  </span>
                </div>
                <div className="flex items-center mb-3">
                  <span className="text-yellow-400">★</span>
                  <span className="ml-1 text-sm">
                    {hostel.averageRating.toFixed(1)} ({hostel.reviewCount} reviews)
                  </span>
                </div>
                <Link
                  to={`/hostels/${hostel.id}`}
                  className="block text-center bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HostelList;