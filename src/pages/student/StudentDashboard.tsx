import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersApi, bookingsApi, reservationsApi } from '../../lib/api';

const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, bookingsRes, reservationsRes] = await Promise.all([
        usersApi.getStudentProfile(),
        bookingsApi.getMy(),
        reservationsApi.getMy(),
      ]);
      setProfile(profileRes.data.data);
      setBookings(bookingsRes.data.data);
      setReservations(reservationsRes.data.data);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!profile?.selfVerified) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
        <h2 className="text-xl font-semibold text-yellow-800 mb-2">
          Complete Your Verification
        </h2>
        <p className="text-yellow-700 mb-4">
          Please complete your self-verification to access all features.
        </p>
        <Link
          to="/student/verify"
          className="bg-yellow-500 text-white px-6 py-2 rounded-md hover:bg-yellow-600"
        >
          Complete Verification
        </Link>
      </div>
    );
  }

  const activeBooking = bookings.find((b) => b.status === 'APPROVED');
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const pendingReservations = reservations.filter((r) => r.status === 'PENDING');
  const acceptedReservations = reservations.filter((r) => r.status === 'ACCEPTED');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Student Dashboard</h1>
        <Link
          to="/hostels"
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
        >
          Browse Hostels
        </Link>
      </div>

      {/* Profile Info */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Profile Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Email:</span>
            <span className="ml-2">{profile.user.email}</span>
          </div>
          <div>
            <span className="text-gray-500">Father's Name:</span>
            <span className="ml-2">{profile.fatherName}</span>
          </div>
          <div>
            <span className="text-gray-500">Institute:</span>
            <span className="ml-2">{profile.instituteName}</span>
          </div>
          <div>
            <span className="text-gray-500">Phone:</span>
            <span className="ml-2">{profile.phoneNumber}</span>
          </div>
          <div>
            <span className="text-gray-500">WhatsApp:</span>
            <span className="ml-2">{profile.whatsappNumber}</span>
          </div>
          <div>
            <span className="text-gray-500">Status:</span>
            <span className="ml-2 text-green-600">Verified</span>
          </div>
        </div>
      </div>

      {/* Current Hostel */}
      {activeBooking && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-6">
          <h2 className="text-lg font-semibold text-green-800 mb-4">
            Current Hostel
          </h2>
          <div className="flex justify-between items-start">
            <div>
              <p className="font-medium">{activeBooking.hostel.hostelName}</p>
              <p className="text-sm text-gray-600">
                {activeBooking.hostel.city}, {activeBooking.hostel.address}
              </p>
              <p className="text-sm text-gray-600">
                Amount Paid: Rs. {activeBooking.amount}
              </p>
            </div>
            <div className="space-x-2">
              <Link
                to={`/student/chat`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 text-sm"
              >
                Chat with Manager
              </Link>
              <button
                onClick={() => navigate('/student/leave')}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 text-sm"
              >
                Leave Hostel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pending Bookings */}
      {pendingBookings.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Bookings</h2>
          <div className="space-y-3">
            {pendingBookings.map((booking) => (
              <div
                key={booking.id}
                className="flex justify-between items-center p-3 bg-yellow-50 rounded-md"
              >
                <div>
                  <p className="font-medium">{booking.hostel.hostelName}</p>
                  <p className="text-sm text-gray-600">
                    Amount: Rs. {booking.amount}
                  </p>
                </div>
                <span className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-sm">
                  Pending Approval
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Accepted Reservations (Can Book) */}
      {acceptedReservations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">
            Accepted Reservations (Ready to Book)
          </h2>
          <div className="space-y-3">
            {acceptedReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex justify-between items-center p-3 bg-green-50 rounded-md"
              >
                <div>
                  <p className="font-medium">{reservation.hostel.hostelName}</p>
                  <p className="text-sm text-gray-600">
                    {reservation.hostel.city}
                  </p>
                </div>
                <Link
                  to={`/hostels/${reservation.hostelId}/book`}
                  className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 text-sm"
                >
                  Book Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending Reservations */}
      {pendingReservations.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold mb-4">Pending Reservations</h2>
          <div className="space-y-3">
            {pendingReservations.map((reservation) => (
              <div
                key={reservation.id}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-md"
              >
                <div>
                  <p className="font-medium">{reservation.hostel.hostelName}</p>
                  <p className="text-sm text-gray-600">
                    {reservation.hostel.city}
                  </p>
                </div>
                <span className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm">
                  Awaiting Response
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Booking History */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-4">Booking History</h2>
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Hostel
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Amount
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {booking.hostel.hostelName}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      Rs. {booking.amount}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          booking.status === 'APPROVED'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : booking.status === 'LEFT'
                            ? 'bg-gray-100 text-gray-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {booking.status === 'APPROVED' && (
                        <Link
                          to={`/student/report/${booking.id}`}
                          className="text-red-600 hover:text-red-800 text-sm"
                        >
                          Report Issue
                        </Link>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;