import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersApi, bookingsApi, reservationsApi } from '../../lib/api';
import { useSEO } from '../../hooks/useSEO';

// ==================== ICONS ====================
const BuildingIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
    />
  </svg>
);

const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
    />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const FlagIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
    />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.34 16.5c-.77.833.192 2.5 1.732 2.5z"
    />
  </svg>
);

// ==================== LOADING SKELETON ====================
const LoadingSkeleton = () => (
  <main className="min-h-screen bg-white">
    <div className="max-w-6xl mx-auto px-6 py-10 animate-pulse">
      <div className="flex justify-between items-center mb-8">
        <div className="h-6 w-40 bg-gray-100" />
        <div className="h-9 w-32 bg-gray-100" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-40 bg-white border border-gray-100" />
          <div className="h-64 bg-white border border-gray-100" />
        </div>
        <div className="h-80 bg-white border border-gray-100" />
      </div>
    </div>
  </main>
);

// ==================== STATUS BADGE ====================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    APPROVED: 'bg-green-50 text-green-700 border-green-200',
    PENDING: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    LEFT: 'bg-gray-50 text-gray-600 border-gray-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
    DISAPPROVED: 'bg-red-50 text-red-700 border-red-200',
    COMPLETED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  };

  const label = status.charAt(0) + status.slice(1).toLowerCase();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 text-xs font-light border rounded-full ${
        styles[status] || styles.PENDING
      }`}
    >
      {status === 'APPROVED' && (
        <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5" />
      )}
      {status === 'PENDING' && (
        <span className="w-1.5 h-1.5 bg-yellow-500 rounded-full mr-1.5 animate-pulse" />
      )}
      {label}
    </span>
  );
};

// ==================== COMPACT BOOKING TYPE BADGE (NEW) ====================
const CompactTypeBadge: React.FC<{ type: string }> = ({ type }) => {
  if (type === 'URGENT') {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 rounded">
        <span className="text-[10px]">⚡</span>
        Urgent
      </span>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2 py-0.5 text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
      Regular
    </span>
  );
};

// ==================== BOOKING TYPE BADGE ====================
const BookingTypeBadge: React.FC<{ type: string; urgentLeaveDate?: string }> = ({ type, urgentLeaveDate }) => {
  if (type === 'URGENT') {
    return (
      <div className="flex flex-col gap-1">
        <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200 rounded-full">
          ⚡ Urgent Booking
        </span>
        {urgentLeaveDate && (
          <span className="text-xs text-orange-600 font-light">
            Leave by: {new Date(urgentLeaveDate).toLocaleDateString()}
          </span>
        )}
      </div>
    );
  }
  
  return (
    <span className="inline-flex items-center px-2.5 py-1 text-xs font-medium bg-green-50 text-green-700 border border-green-200 rounded-full">
      Regular Booking
    </span>
  );
};

// ==================== EMPTY STATE ====================
const EmptyState: React.FC<{
  title: string;
  description: string;
  action?: React.ReactNode;
}> = ({ title, description, action }) => (
  <div className="text-center py-10">
    <div className="w-14 h-14 mx-auto bg-gray-50 rounded-full flex items-center justify-center mb-4">
      <BuildingIcon />
    </div>
    <h3 className="text-sm font-light text-gray-900 mb-1">{title}</h3>
    <p className="text-sm text-gray-500 font-light mb-3">{description}</p>
    {action}
  </div>
);

// ==================== MAIN COMPONENT ====================
const StudentDashboard: React.FC = () => {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // NEW: Check if today is after 12th
  const today = new Date();
  const dayOfMonth = today.getDate();
  const isAfter12th = dayOfMonth > 12;

  useSEO({
    title: 'Student Dashboard | HostelHub',
    description:
      'Manage your hostel bookings, reservations, and profile. View your current accommodation and booking history.',
    keywords:
      'student dashboard, hostel booking, manage reservation, hostel',
  });

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
      console.error('Error loading student dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const displayName =
    profile?.fullName || profile?.user?.email?.split('@')[0] || 'Student';

  const displayInitial = (
    profile?.fullName ||
    profile?.user?.email ||
    'S'
  )
    .charAt(0)
    .toUpperCase();

  if (loading) return <LoadingSkeleton />;

  // Require self verification
  if (!profile?.selfVerified) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full border border-amber-200 bg-white px-6 py-8 text-center">
          <div className="w-14 h-14 mx-auto bg-amber-50 rounded-full flex items-center justify-center mb-4">
            <ShieldCheckIcon />
          </div>
          <h1 className="text-xl font-light text-gray-900 mb-2">
            Complete Your Verification
          </h1>
          <p className="text-sm text-gray-600 font-light mb-6">
            Please complete your self-verification to access all dashboard
            features and book hostels.
          </p>
          <Link
            to="/student/verify"
            className="inline-flex items-center justify-center gap-2 w-full bg-gray-900 text-white py-3 text-sm font-light hover:bg-gray-800 transition-colors"
          >
            Complete Verification
            <ArrowRightIcon />
          </Link>
          <p className="mt-4 text-xs text-gray-400 font-light">
            Verification usually takes less than 2 minutes.
          </p>
        </div>
      </main>
    );
  }

  const activeBooking = bookings.find((b) => b.status === 'APPROVED');
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const pendingReservations = reservations.filter(
    (r) => r.status === 'PENDING'
  );

  // Filter accepted reservations to hide ones for which a booking already exists
  const acceptedReservations = reservations
    .filter((r) => r.status === 'ACCEPTED')
    .filter(
      (reservation) =>
        !bookings.some(
          (b) => b.hostel?.id === reservation.hostelId
        )
    );

  const stats = [
    {
      label: 'Total Bookings',
      value: bookings.length,
      icon: <BuildingIcon />,
    },
    {
      label: 'Pending',
      value: pendingBookings.length + pendingReservations.length,
      icon: <ClockIcon />,
    },
    {
      label: 'Active',
      value: activeBooking ? 1 : 0,
      icon: <CheckCircleIcon />,
    },
  ];

  // Booking restriction notice
  const bookingRestrictionNotice = () => {
    if (!isAfter12th) return null;

    return (
      <div className="mb-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
            <AlertIcon />
          </div>
          <div>
            <h3 className="text-sm font-medium text-orange-800 mb-1">
              Booking Date Restriction Active
            </h3>
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
    );
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
              Student Dashboard
            </div>
            <h1 className="text-2xl font-light text-gray-900">
              Welcome back, {displayName}
            </h1>
            <p className="text-sm text-gray-500 font-light mt-1">
              Manage your hostel bookings and reservations.
            </p>
          </div>
          <Link
            to="/hostels"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors"
          >
            <SearchIcon />
            Browse Hostels
          </Link>
        </header>

        {/* Booking Restriction Notice */}
        {bookingRestrictionNotice()}

        {/* Stats */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {stats.map((stat, i) => (
            <div
              key={i}
              className="border border-gray-100 bg-white px-5 py-4 hover:border-gray-200 hover:shadow-sm transition-shadow"
            >
              <div className="w-9 h-9 border border-gray-100 bg-gray-50 flex items-center justify-center mb-3 text-gray-600">
                {stat.icon}
              </div>
              <p className="text-2xl font-light text-gray-900">
                {stat.value}
              </p>
              <p className="text-sm text-gray-500 font-light">
                {stat.label}
              </p>
            </div>
          ))}
        </section>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Active booking */}
            {activeBooking && (
              <section className="border border-gray-100 bg-gray-50 px-6 py-6 rounded-lg">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 bg-white border border-gray-100 flex items-center justify-center text-gray-700">
                      <BuildingIcon />
                    </div>
                    <div>
                      <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
                        Current Hostel
                      </div>
                      <h2 className="text-lg font-light text-gray-900">
                        {activeBooking.hostel.hostelName}
                      </h2>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="px-3 py-1 text-xs font-light border border-green-200 bg-green-50 text-green-700 rounded-full">
                      Active
                    </span>
                    <BookingTypeBadge 
                      type={activeBooking.bookingType || 'REGULAR'} 
                      urgentLeaveDate={activeBooking.urgentLeaveDate}
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4 mb-5 text-sm font-light">
                  <div className="flex items-center gap-2 text-gray-600">
                    <LocationIcon />
                    <span>
                      {activeBooking.hostel.city},{' '}
                      {activeBooking.hostel.address}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <CurrencyIcon />
                    <span>
                      Rs. {activeBooking.amount?.toLocaleString()} paid
                    </span>
                  </div>
                </div>

                {/* Urgent Booking Warning */}
                {activeBooking.bookingType === 'URGENT' && activeBooking.urgentLeaveDate && (
                  <div className="mb-5 p-3 border border-orange-200 bg-orange-50 rounded-lg">
                    <div className="flex items-start gap-2">
                      <span className="text-orange-600 mt-0.5">⚠️</span>
                      <div>
                        <p className="text-sm font-medium text-orange-800 mb-1">
                          Urgent Booking - Important Notice
                        </p>
                        <p className="text-sm text-orange-700 font-light">
                          You must leave on <span className="font-medium">
                            {new Date(activeBooking.urgentLeaveDate).toLocaleDateString()}
                          </span> (1st of next month).
                        </p>
                        <p className="text-sm text-orange-600 font-light mt-1">
                          You will need to rebook for the following month.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/student/chat"
                    className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white text-sm font-light text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    <ChatIcon />
                    Chat with Manager
                  </Link>
                  <button
                    onClick={() => navigate('/student/leave')}
                    className="inline-flex items-center gap-2 px-4 py-2 border border-red-300 text-sm font-light text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOutIcon />
                    Leave Hostel
                  </button>
                </div>
              </section>
            )}

            {/* Accepted reservations (Ready to Book) */}
            {acceptedReservations.length > 0 && (
              <section className="border border-gray-100 bg-white rounded-lg">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <h2 className="text-sm font-light text-gray-900">
                    Ready to Book
                  </h2>
                  <span className="ml-auto text-xs text-gray-500 font-light">
                    {acceptedReservations.length} available
                  </span>
                </div>
                <div className="divide-y divide-gray-100">
                  {acceptedReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                          <BuildingIcon />
                        </div>
                        <div>
                          <p className="text-sm font-light text-gray-900">
                            {reservation.hostel.hostelName}
                          </p>
                          <p className="text-xs text-gray-500 font-light">
                            {reservation.hostel.city}
                          </p>
                        </div>
                      </div>
                      <Link
                        to={`/hostels/${reservation.hostelId}/book?reservationId=${reservation.id}`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-gray-900 text-white text-xs font-light hover:bg-gray-800 transition-colors"
                      >
                        Book Now
                        <ArrowRightIcon />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pending Approvals */}
            {(pendingBookings.length > 0 ||
              pendingReservations.length > 0) && (
              <section className="border border-gray-100 bg-white rounded-lg">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                  <ClockIcon />
                  <h2 className="text-sm font-light text-gray-900">
                    Pending Approvals
                  </h2>
                </div>
                <div className="divide-y divide-gray-100">
                  {pendingBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-yellow-50 border border-yellow-100 rounded-lg flex items-center justify-center text-yellow-700">
                          <BuildingIcon />
                        </div>
                        <div>
                          <p className="text-sm font-light text-gray-900">
                            {booking.hostel.hostelName}
                          </p>
                          <p className="text-xs text-gray-500 font-light">
                            Rs. {booking.amount?.toLocaleString()}
                          </p>
                          <div className="mt-1">
                            <CompactTypeBadge type={booking.bookingType || 'REGULAR'} />
                          </div>
                        </div>
                      </div>
                      <StatusBadge status="PENDING" />
                    </div>
                  ))}
                  {pendingReservations.map((reservation) => (
                    <div
                      key={reservation.id}
                      className="px-6 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-500">
                          <ClockIcon />
                        </div>
                        <div>
                          <p className="text-sm font-light text-gray-900">
                            {reservation.hostel.hostelName}
                          </p>
                          <p className="text-xs text-gray-500 font-light">
                            {reservation.hostel.city}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs text-gray-500 font-light">
                        Awaiting response
                      </span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Booking history - IMPROVED CARD LAYOUT */}
            <section className="border border-gray-100 bg-white rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
                <h2 className="text-sm font-light text-gray-900">
                  Booking History
                </h2>
                <span className="text-xs text-gray-500 font-light">
                  {bookings.length} total
                </span>
              </div>

              {bookings.length === 0 ? (
                <EmptyState
                  title="No bookings yet"
                  description="Start by browsing available hostels."
                  action={
                    <Link
                      to="/hostels"
                      className="inline-flex items-center gap-1 text-xs text-gray-900 hover:underline font-light"
                    >
                      Browse Hostels
                      <ArrowRightIcon />
                    </Link>
                  }
                />
              ) : (
                <div className="divide-y divide-gray-100">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="px-6 py-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-4">
                        {/* Left side - Hostel info */}
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="w-10 h-10 bg-gray-50 border border-gray-100 rounded-lg flex items-center justify-center text-gray-500 flex-shrink-0">
                            <BuildingIcon />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {booking.hostel.hostelName}
                            </p>
                            <p className="text-xs text-gray-500 font-light mt-0.5">
                              Rs. {booking.amount?.toLocaleString()}
                            </p>
                            
                            {/* Type and Date row */}
                            <div className="flex flex-wrap items-center gap-2 mt-2">
                              <CompactTypeBadge type={booking.bookingType || 'REGULAR'} />
                              <span className="text-gray-300">•</span>
                              <span className="inline-flex items-center gap-1 text-xs text-gray-500 font-light">
                                <CalendarIcon />
                                {new Date(booking.createdAt).toLocaleDateString('en-PK', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>

                            {/* Urgent leave date - shown on separate line if exists */}
                            {booking.bookingType === 'URGENT' && booking.urgentLeaveDate && (
                              <div className="mt-2 inline-flex items-center gap-1.5 px-2 py-1 bg-orange-50 border border-orange-100 rounded text-xs text-orange-700">
                                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Leave by {new Date(booking.urgentLeaveDate).toLocaleDateString('en-PK', {
                                  day: 'numeric',
                                  month: 'short',
                                })}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Right side - Status and actions */}
                        <div className="flex flex-col items-end gap-2 flex-shrink-0">
                          <StatusBadge status={booking.status} />
                          {booking.status === 'APPROVED' && (
                            <Link
                              to={`/student/report/${booking.id}`}
                              className="inline-flex items-center gap-1 text-xs text-red-600 hover:text-red-700 font-light"
                            >
                              <FlagIcon />
                              Report
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <aside className="space-y-6">
            {/* Profile card */}
            <section className="border border-gray-100 bg-white rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-light text-gray-900">
                  Profile Information
                </h2>
              </div>
              <div className="px-6 py-5">
                <div className="flex items-center gap-4 mb-5">
                  <div className="w-12 h-12 bg-gray-900 rounded-full flex items-center justify-center text-white text-lg font-light">
                    {displayInitial}
                  </div>
                  <div>
                    <p className="text-sm font-light text-gray-900">
                      {displayName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-xs text-green-600 font-light">
                        Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-xs">
                  {[
                    { label: 'Email', value: profile?.user?.email },
                    { label: "Father's Name", value: profile?.fatherName },
                    { label: 'Institute', value: profile?.instituteName },
                    { label: 'Phone', value: profile?.phoneNumber },
                    { label: 'WhatsApp', value: profile?.whatsappNumber },
                  ].map((item, idx) => (
                    <div
                      key={idx}
                      className="flex justify-between items-start gap-3"
                    >
                      <span className="text-gray-500 font-light">
                        {item.label}
                      </span>
                      <span className="text-gray-900 font-light text-right max-w-[60%] truncate">
                        {item.value || '-'}
                      </span>
                    </div>
                  ))}
                </div>

                <button className="w-full mt-5 px-4 py-2 border border-gray-200 text-xs font-light text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors">
                  Edit Profile
                </button>
              </div>
            </section>

            {/* Booking Info Card */}
            <section className="border border-gray-100 bg-white rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-light text-gray-900">
                  Booking Information
                </h2>
              </div>
              <div className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-green-50 border border-green-100 rounded-lg flex items-center justify-center text-green-600">
                      ✓
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Regular Booking</p>
                      <p className="text-xs text-gray-500 font-light">
                        Available 1st-12th of month
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="w-8 h-8 bg-orange-50 border border-orange-100 rounded-lg flex items-center justify-center text-orange-600">
                      ⚡
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Urgent Booking</p>
                      <p className="text-xs text-gray-500 font-light">
                        Available anytime, leave 1st next month
                      </p>
                    </div>
                  </div>
                </div>
                
                {/* Current Date Info */}
                <div className="mt-4 p-3 border border-blue-200 bg-blue-50 rounded">
                  <p className="text-xs text-blue-800 font-light">
                    Today: {today.toLocaleDateString('en-PK', { 
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                  {isAfter12th && (
                    <p className="text-xs text-orange-600 font-light mt-1">
                      Only urgent bookings allowed today
                    </p>
                  )}
                </div>
              </div>
            </section>

            {/* Quick actions */}
            <section className="border border-gray-100 bg-white rounded-lg">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-light text-gray-900">
                  Quick Actions
                </h2>
              </div>
              <div className="p-3 space-y-1">
                {[
                  {
                    label: 'Browse Hostels',
                    to: '/hostels',
                    icon: <SearchIcon />,
                  },
                  {
                    label: 'My Messages',
                    to: '/student/chat',
                    icon: <ChatIcon />,
                  },
                  {
                    label: 'Report an Issue',
                    to: '/student/report',
                    icon: <FlagIcon />,
                  },
                ].map((a, i) => (
                  <Link
                    key={i}
                    to={a.to}
                    className="flex items-center justify-between px-3 py-2 rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-50 border border-gray-100 rounded-md flex items-center justify-center text-gray-600">
                        {a.icon}
                      </div>
                      <span className="text-sm text-gray-800 font-light">
                        {a.label}
                      </span>
                    </div>
                    <ArrowRightIcon />
                  </Link>
                ))}
              </div>
            </section>

            {/* Help card */}
            <section className="bg-gray-900 text-white px-6 py-5 rounded-lg">
              <h3 className="text-sm font-light mb-2">Need Help?</h3>
              <p className="text-xs text-gray-300 font-light mb-4">
                Contact our support team if you have any questions about your
                bookings.
              </p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 border border-white/30 text-xs font-light hover:bg-white/10 transition-colors rounded"
              >
                <ChatIcon />
                WhatsApp Support
              </a>
            </section>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default StudentDashboard;