import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi, hostelsApi, verificationsApi, feesApi } from '../../lib/api';

const ManagerDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [hostels, setHostels] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [feeSummary, setFeeSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, verificationsRes] = await Promise.all([
        usersApi.getManagerProfile(),
        verificationsApi.getMy(),
      ]);
      setProfile(profileRes.data.data);
      setVerifications(verificationsRes.data.data);

      if (profileRes.data.data.verified) {
        const [hostelsRes, feeRes] = await Promise.all([
          hostelsApi.getMy(),
          feesApi.getPendingSummary(),
        ]);
        setHostels(hostelsRes.data.data);
        setFeeSummary(feeRes.data.data);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  const latestVerification = verifications[0];

  if (!profile?.verified) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        
        {latestVerification?.status === 'PENDING' ? (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-yellow-800 mb-2">
              Verification Pending
            </h2>
            <p className="text-yellow-700">
              Your verification is under review. Please wait for admin approval.
            </p>
          </div>
        ) : latestVerification?.status === 'REJECTED' ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Verification Rejected
            </h2>
            <p className="text-red-700 mb-4">
              Reason: {latestVerification.adminComment || 'No reason provided'}
            </p>
            <Link
              to="/manager/verification"
              className="bg-red-500 text-white px-6 py-2 rounded-md hover:bg-red-600"
            >
              Submit Again
            </Link>
          </div>
        ) : (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-blue-800 mb-2">
              Complete Verification
            </h2>
            <p className="text-blue-700 mb-4">
              Please submit your verification to start managing hostels.
            </p>
            <Link
              to="/manager/verification"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600"
            >
              Submit Verification
            </Link>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manager Dashboard</h1>
        <Link
          to="/manager/hostels/create"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Add New Hostel
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Hostels</h3>
          <p className="text-3xl font-bold">{hostels.length}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Total Rooms</h3>
          <p className="text-3xl font-bold">
            {hostels.reduce((sum, h) => sum + h.totalRooms, 0)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-gray-500 text-sm">Available Rooms</h3>
          <p className="text-3xl font-bold">
            {hostels.reduce((sum, h) => sum + h.availableRooms, 0)}
          </p>
        </div>
      </div>

      {/* Monthly Fee Summary */}
      {feeSummary.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Monthly Fee Summary</h2>
          <div className="space-y-3">
            {feeSummary.map((fee) => (
              <div
                key={fee.hostelId}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium">{fee.hostelName}</p>
                  <p className="text-sm text-gray-600">
                    {fee.activeStudents} students × Rs. 100 = Rs. {fee.feeAmount}
                  </p>
                </div>
                {fee.submitted ? (
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      fee.status === 'APPROVED'
                        ? 'bg-green-100 text-green-800'
                        : fee.status === 'PENDING'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {fee.status}
                  </span>
                ) : (
                  <Link
                    to={`/manager/fees/submit?hostelId=${fee.hostelId}`}
                    className="bg-indigo-600 text-white px-4 py-1 rounded-md hover:bg-indigo-700 text-sm"
                  >
                    Pay Fee
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Hostels List */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">My Hostels</h2>
        {hostels.length === 0 ? (
          <p className="text-gray-500">No hostels yet. Create your first hostel.</p>
        ) : (
          <div className="space-y-4">
            {hostels.map((hostel) => (
              <div
                key={hostel.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold">{hostel.hostelName}</h3>
                  <p className="text-sm text-gray-600">
                    {hostel.city} • {hostel.availableRooms}/{hostel.totalRooms} rooms
                  </p>
                  <p className="text-sm text-gray-600">
                    Rating: {hostel.averageRating.toFixed(1)} ({hostel.reviewCount} reviews)
                  </p>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/manager/hostels/${hostel.id}/students`}
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 text-sm"
                  >
                    Students
                  </Link>
                  <Link
                    to={`/manager/hostels/${hostel.id}/bookings`}
                    className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600 text-sm"
                  >
                    Bookings
                  </Link>
                  <Link
                    to={`/manager/hostels/${hostel.id}/reservations`}
                    className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600 text-sm"
                  >
                    Reservations
                  </Link>
                  <Link
                    to={`/manager/hostels/${hostel.id}/edit`}
                    className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600 text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          to="/manager/fees"
          className="bg-white rounded-lg shadow p-4 text-center hover:bg-gray-50"
        >
          <p className="font-medium">Fee History</p>
        </Link>
        <Link
          to="/manager/reports"
          className="bg-white rounded-lg shadow p-4 text-center hover:bg-gray-50"
        >
          <p className="font-medium">Reports</p>
        </Link>
        <Link
          to="/manager/chat"
          className="bg-white rounded-lg shadow p-4 text-center hover:bg-gray-50"
        >
          <p className="font-medium">Messages</p>
        </Link>
        <Link
          to="/manager/verification"
          className="bg-white rounded-lg shadow p-4 text-center hover:bg-gray-50"
        >
          <p className="font-medium">Verification Status</p>
        </Link>
      </div>
    </div>
  );
};

export default ManagerDashboard;