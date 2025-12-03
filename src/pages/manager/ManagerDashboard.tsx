import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { usersApi, hostelsApi, verificationsApi, feesApi } from '../../lib/api';

// ==================== TYPES ====================
interface RoomTypeConfig {
  type: 'SHARED' | 'PRIVATE' | 'SHARED_FULLROOM';
  totalRooms: number;
  availableRooms: number;
  personsInRoom: number;
  price: number;
  fullRoomPriceDiscounted?: number | null;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  SHARED: 'Shared',
  PRIVATE: 'Private',
  SHARED_FULLROOM: 'Full Room',
};

// ==================== HELPERS ====================
const calculateRoomTotals = (hostel: any): { totalRooms: number; availableRooms: number } => {
  const roomTypes: RoomTypeConfig[] = Array.isArray(hostel.roomTypes) ? hostel.roomTypes : [];
  return {
    totalRooms: roomTypes.reduce((sum, rt) => sum + (rt.totalRooms || 0), 0),
    availableRooms: roomTypes.reduce((sum, rt) => sum + (rt.availableRooms || 0), 0),
  };
};

const getRoomTypesDisplay = (hostel: any): string => {
  const roomTypes: RoomTypeConfig[] = Array.isArray(hostel.roomTypes) ? hostel.roomTypes : [];
  if (roomTypes.length === 0) return 'N/A';
  return roomTypes
    .map(
      (rt) =>
        `${ROOM_TYPE_LABELS[rt.type] || rt.type}: ${rt.availableRooms}/${rt.totalRooms}`
    )
    .join(' • ');
};

// ==================== MAIN COMPONENT ====================
const ManagerDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [hostels, setHostels] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<any[]>([]);
  const [feeSummary, setFeeSummary] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadData = async () => {
    try {
      const [profileRes, verificationsRes] = await Promise.all([
        usersApi.getManagerProfile(),
        verificationsApi.getMy(),
      ]);

      const managerProfile = profileRes.data.data;
      setProfile(managerProfile);
      setVerifications(verificationsRes.data.data);

      if (managerProfile.verified) {
        const [hostelsRes, feeRes] = await Promise.all([
          hostelsApi.getMy(),
          feesApi.getPendingSummary(),
        ]);
        setHostels(hostelsRes.data.data);
        setFeeSummary(feeRes.data.data);
      }
    } catch (error) {
      console.error('Error loading manager dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateAllHostelsTotals = () => {
    let totalRooms = 0;
    let availableRooms = 0;

    hostels.forEach((hostel) => {
      const totals = calculateRoomTotals(hostel);
      totalRooms += totals.totalRooms;
      availableRooms += totals.availableRooms;
    });

    return { totalRooms, availableRooms };
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <p className="text-sm text-gray-400 font-light">
          Loading manager dashboard...
        </p>
      </main>
    );
  }

  const latestVerification = verifications[0];

  // Not verified state
  if (!profile?.verified) {
    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-4xl mx-auto px-6 py-10 space-y-6">
          <header>
            <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
              Manager Dashboard
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">
              Account Verification
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Complete verification to start creating and managing hostels.
            </p>
          </header>

          {latestVerification?.status === 'PENDING' ? (
            <section className="border border-yellow-200 bg-yellow-50 px-6 py-6">
              <h2 className="text-lg font-light text-yellow-900 mb-2">
                Verification Pending
              </h2>
              <p className="text-sm text-yellow-800 font-light">
                Your verification request is under review. You&apos;ll be able to
                manage hostels once an admin approves your details.
              </p>
            </section>
          ) : latestVerification?.status === 'REJECTED' ? (
            <section className="border border-red-200 bg-red-50 px-6 py-6">
              <h2 className="text-lg font-light text-red-900 mb-2">
                Verification Rejected
              </h2>
              <p className="text-sm text-red-700 font-light mb-3">
                Reason:{' '}
                {latestVerification.adminComment ||
                  'No reason provided by admin.'}
              </p>
              <Link
                to="/manager/verification"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-red-600 text-white text-sm font-light hover:bg-red-700 transition-colors"
              >
                Submit Again
              </Link>
            </section>
          ) : (
            <section className="border border-blue-200 bg-blue-50 px-6 py-6">
              <h2 className="text-lg font-light text-blue-900 mb-2">
                Complete Verification
              </h2>
              <p className="text-sm text-blue-800 font-light mb-3">
                Submit your verification details to start listing hostels and
                managing students.
              </p>
              <Link
                to="/manager/verification"
                className="inline-flex items-center justify-center px-5 py-2.5 bg-blue-600 text-white text-sm font-light hover:bg-blue-700 transition-colors"
              >
                Submit Verification
              </Link>
            </section>
          )}
        </div>
      </main>
    );
  }

  const { totalRooms, availableRooms } = calculateAllHostelsTotals();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
              Manager Dashboard
            </div>
            <h1 className="text-2xl font-light text-gray-900 mb-1">
              Hello, {profile?.user?.email || 'Manager'}
            </h1>
            <p className="text-sm text-gray-500 font-light">
              Overview of your hostels, rooms and monthly fees.
            </p>
          </div>
          <Link
            to="/manager/hostels/create"
            className="inline-flex items-center justify-center px-5 py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Add New Hostel
          </Link>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-gray-100 bg-white px-5 py-4">
            <p className="text-xs text-gray-500 font-light mb-1">
              Total Hostels
            </p>
            <p className="text-2xl font-light text-gray-900">
              {hostels.length}
            </p>
          </div>
          <div className="border border-gray-100 bg-white px-5 py-4">
            <p className="text-xs text-gray-500 font-light mb-1">
              Total Rooms
            </p>
            <p className="text-2xl font-light text-gray-900">
              {totalRooms}
            </p>
          </div>
          <div className="border border-gray-100 bg-white px-5 py-4">
            <p className="text-xs text-gray-500 font-light mb-1">
              Available Rooms
            </p>
            <p className="text-2xl font-light text-gray-900">
              {availableRooms}
            </p>
          </div>
        </section>

        {/* Monthly Fee Summary */}
        {feeSummary.length > 0 && (
          <section className="border border-gray-100 bg-white px-6 py-6">
            <h2 className="text-sm font-light text-gray-900 mb-4">
              Monthly Platform Fee Summary
            </h2>
            <div className="space-y-3">
              {feeSummary.map((fee) => (
                <div
                  key={fee.hostelId}
                  className="flex items-center justify-between gap-4 border border-gray-100 bg-gray-50 px-4 py-3 text-sm"
                >
                  <div>
                    <p className="text-sm font-light text-gray-900">
                      {fee.hostelName}
                    </p>
                    <p className="text-xs text-gray-600 font-light">
                      {fee.activeStudents} students × Rs. 100 = Rs.{' '}
                      {fee.feeAmount}
                    </p>
                  </div>
                  {fee.submitted ? (
                    <span
                      className={`inline-flex items-center px-3 py-1 text-xs font-light border rounded-full ${
                        fee.status === 'APPROVED'
                          ? 'bg-green-50 text-green-700 border-green-200'
                          : fee.status === 'PENDING'
                          ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                          : 'bg-red-50 text-red-700 border-red-200'
                      }`}
                    >
                      {fee.status}
                    </span>
                  ) : (
                    <Link
                      to={`/manager/fees/submit?hostelId=${fee.hostelId}`}
                      className="inline-flex items-center px-4 py-1.5 bg-gray-900 text-white text-xs font-light rounded hover:bg-gray-800 transition-colors"
                    >
                      Pay Fee
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Hostels List */}
        <section className="border border-gray-100 bg-white px-6 py-6">
          <h2 className="text-sm font-light text-gray-900 mb-4">
            My Hostels
          </h2>
          {hostels.length === 0 ? (
            <p className="text-sm text-gray-500 font-light">
              No hostels yet. Create your first hostel to get started.
            </p>
          ) : (
            <div className="space-y-4">
              {hostels.map((hostel) => {
                const {
                  totalRooms: hostelTotal,
                  availableRooms: hostelAvailable,
                } = calculateRoomTotals(hostel);

                return (
                  <article
                    key={hostel.id}
                    className="border border-gray-100 bg-gray-50 px-4 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-sm"
                  >
                    <div>
                      <h3 className="text-sm font-light text-gray-900 mb-0.5">
                        {hostel.hostelName}
                      </h3>
                      <p className="text-xs text-gray-600 font-light">
                        {hostel.city} • {hostelAvailable}/{hostelTotal} rooms
                        available
                      </p>
                      <p className="text-[11px] text-gray-500 font-light mt-1">
                        {getRoomTypesDisplay(hostel)}
                      </p>
                      <p className="text-xs text-gray-600 font-light mt-1">
                        Rating:{' '}
                        {(hostel.averageRating || 0).toFixed(1)} (
                        {hostel.reviewCount || 0} reviews)
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Link
                        to={`/manager/hostels/${hostel.id}/students`}
                        className="px-3 py-1.5 bg-green-600 text-white text-xs font-light rounded hover:bg-green-700 transition-colors"
                      >
                        Students
                      </Link>
                      <Link
                        to={`/manager/hostels/${hostel.id}/bookings`}
                        className="px-3 py-1.5 bg-blue-600 text-white text-xs font-light rounded hover:bg-blue-700 transition-colors"
                      >
                        Bookings
                      </Link>
                      <Link
                        to={`/manager/hostels/${hostel.id}/reservations`}
                        className="px-3 py-1.5 bg-purple-600 text-white text-xs font-light rounded hover:bg-purple-700 transition-colors"
                      >
                        Reservations
                      </Link>
                      <Link
                        to={`/manager/hostels/${hostel.id}/edit`}
                        className="px-3 py-1.5 bg-gray-600 text-white text-xs font-light rounded hover:bg-gray-700 transition-colors"
                      >
                        Edit
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        {/* Quick Links */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            to="/manager/fees"
            className="border border-gray-100 bg-white px-4 py-4 text-center text-sm text-gray-900 font-light hover:bg-gray-50 transition-colors"
          >
            Fee History
          </Link>
          <Link
            to="/manager/reports"
            className="border border-gray-100 bg-white px-4 py-4 text-center text-sm text-gray-900 font-light hover:bg-gray-50 transition-colors"
          >
            Reports
          </Link>
          <Link
            to="/manager/chat"
            className="border border-gray-100 bg-white px-4 py-4 text-center text-sm text-gray-900 font-light hover:bg-gray-50 transition-colors"
          >
            Messages
          </Link>
          <Link
            to="/manager/verification"
            className="border border-gray-100 bg-white px-4 py-4 text-center text-sm text-gray-900 font-light hover:bg-gray-50 transition-colors"
          >
            Verification Status
          </Link>
        </section>
      </div>
    </main>
  );
};

export default ManagerDashboard;