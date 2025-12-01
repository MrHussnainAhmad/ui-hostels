// src/pages/student/StudentDashboard.tsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usersApi, bookingsApi, reservationsApi } from '../../lib/api';
import { useSEO } from '../../hooks/useSEO';

// ==================== ICONS ====================
const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const ExclamationIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const LogOutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const CurrencyIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FlagIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
  </svg>
);

// ==================== LOADING SKELETON ====================
const LoadingSkeleton = () => (
  <div className="min-h-screen bg-slate-50/50 p-4 sm:p-6 lg:p-8 animate-pulse">
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center">
        <div className="h-8 w-48 bg-slate-200 rounded-lg" />
        <div className="h-10 w-32 bg-slate-200 rounded-xl" />
      </div>
      
      {/* Cards Skeleton */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 bg-white rounded-2xl border border-slate-100" />
          <div className="h-64 bg-white rounded-2xl border border-slate-100" />
        </div>
        <div className="h-80 bg-white rounded-2xl border border-slate-100" />
      </div>
    </div>
  </div>
);

// ==================== STATUS BADGE COMPONENT ====================
const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const styles: Record<string, string> = {
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    PENDING: 'bg-amber-50 text-amber-700 border-amber-200',
    LEFT: 'bg-slate-100 text-slate-600 border-slate-200',
    REJECTED: 'bg-red-50 text-red-700 border-red-200',
    ACCEPTED: 'bg-blue-50 text-blue-700 border-blue-200',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full border ${styles[status] || styles.PENDING}`}>
      {status === 'APPROVED' && <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5" />}
      {status === 'PENDING' && <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-1.5 animate-pulse" />}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

// ==================== EMPTY STATE COMPONENT ====================
const EmptyState: React.FC<{ title: string; description: string; action?: React.ReactNode }> = ({ 
  title, 
  description, 
  action 
}) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 mx-auto bg-slate-100 rounded-full flex items-center justify-center mb-4">
      <BuildingIcon />
    </div>
    <h3 className="text-sm font-medium text-slate-900 mb-1">{title}</h3>
    <p className="text-sm text-slate-500 mb-4">{description}</p>
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

  // SEO
  useSEO({
    title: 'Student Dashboard | HostelHub Bahawalpur',
    description: 'Manage your hostel bookings, reservations, and profile. View your current accommodation and booking history.',
    keywords: 'student dashboard, hostel booking, manage reservation, Bahawalpur hostel',
    canonical: 'https://hostelhub.pk/student/dashboard'
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
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Loading State
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Verification Required State
  if (!profile?.selfVerified) {
    return (
      <main className="min-h-screen bg-slate-50/50 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-8 text-center">
            {/* Icon */}
            <div className="w-16 h-16 mx-auto bg-amber-50 rounded-2xl flex items-center justify-center mb-6">
              <ShieldCheckIcon />
            </div>
            
            {/* Content */}
            <h1 className="text-xl font-semibold text-slate-900 mb-2">
              Complete Your Verification
            </h1>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Please complete your self-verification to access all dashboard features and book hostels.
            </p>
            
            {/* Action */}
            <Link
              to="/student/verify"
              className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-amber-500 text-white font-medium rounded-xl hover:bg-amber-600 active:scale-[0.98] transition-all duration-200"
            >
              Complete Verification
              <ArrowRightIcon />
            </Link>
            
            {/* Helper Text */}
            <p className="mt-6 text-sm text-slate-500">
              Verification takes only 2 minutes
            </p>
          </div>
        </div>
      </main>
    );
  }

  // Data Processing
  const activeBooking = bookings.find((b) => b.status === 'APPROVED');
  const pendingBookings = bookings.filter((b) => b.status === 'PENDING');
  const pendingReservations = reservations.filter((r) => r.status === 'PENDING');
  const acceptedReservations = reservations.filter((r) => r.status === 'ACCEPTED');

  // Stats
  const stats = [
    { 
      label: 'Total Bookings', 
      value: bookings.length, 
      icon: <BuildingIcon />,
      color: 'bg-blue-50 text-blue-600'
    },
    { 
      label: 'Pending', 
      value: pendingBookings.length + pendingReservations.length, 
      icon: <ClockIcon />,
      color: 'bg-amber-50 text-amber-600'
    },
    { 
      label: 'Active', 
      value: activeBooking ? 1 : 0, 
      icon: <CheckCircleIcon />,
      color: 'bg-emerald-50 text-emerald-600'
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ==================== HEADER ==================== */}
        <header className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {profile?.user?.email?.split('@')[0] || 'Student'}
            </h1>
            <p className="text-slate-500 mt-1">
              Manage your hostel bookings and reservations
            </p>
          </div>
          
          <Link
            to="/hostels"
            className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all duration-200"
          >
            <SearchIcon />
            Browse Hostels
          </Link>
        </header>

        {/* ==================== STATS CARDS ==================== */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-md hover:border-slate-200 transition-all duration-200"
            >
              <div className={`w-10 h-10 ${stat.color} rounded-xl flex items-center justify-center mb-3`}>
                {stat.icon}
              </div>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
              <p className="text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          
          {/* ==================== MAIN CONTENT ==================== */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Active Booking Card */}
            {activeBooking && (
              <section className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg shadow-emerald-500/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                      <BuildingIcon />
                    </div>
                    <div>
                      <p className="text-emerald-100 text-sm">Current Hostel</p>
                      <h2 className="text-xl font-semibold">{activeBooking.hostel.hostelName}</h2>
                    </div>
                  </div>
                  <span className="px-3 py-1 bg-white/20 rounded-full text-sm backdrop-blur-sm">
                    Active
                  </span>
                </div>
                
                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2 text-emerald-100">
                    <LocationIcon />
                    <span className="text-sm">{activeBooking.hostel.city}, {activeBooking.hostel.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-emerald-100">
                    <CurrencyIcon />
                    <span className="text-sm">Rs. {activeBooking.amount?.toLocaleString()} paid</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <Link
                    to="/student/chat"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-emerald-600 text-sm font-medium rounded-xl hover:bg-emerald-50 transition-colors"
                  >
                    <ChatIcon />
                    Chat with Manager
                  </Link>
                  <button
                    onClick={() => navigate('/student/leave')}
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/20 backdrop-blur-sm transition-colors"
                  >
                    <LogOutIcon />
                    Leave Hostel
                  </button>
                </div>
              </section>
            )}

            {/* Accepted Reservations */}
            {acceptedReservations.length > 0 && (
              <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                    <h2 className="font-semibold text-slate-900">Ready to Book</h2>
                    <span className="ml-auto text-xs text-slate-500">{acceptedReservations.length} available</span>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {acceptedReservations.map((reservation) => (
                    <div key={reservation.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                          <BuildingIcon />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{reservation.hostel.hostelName}</p>
                          <p className="text-sm text-slate-500">{reservation.hostel.city}</p>
                        </div>
                      </div>
                      <Link
                        to={`/hostels/${reservation.hostelId}/book`}
                        className="inline-flex items-center gap-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Book Now
                        <ArrowRightIcon />
                      </Link>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Pending Items */}
            {(pendingBookings.length > 0 || pendingReservations.length > 0) && (
              <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <ClockIcon />
                    <h2 className="font-semibold text-slate-900">Pending Approvals</h2>
                  </div>
                </div>
                <div className="divide-y divide-slate-100">
                  {pendingBookings.map((booking) => (
                    <div key={booking.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
                          <BuildingIcon />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{booking.hostel.hostelName}</p>
                          <p className="text-sm text-slate-500">Rs. {booking.amount?.toLocaleString()}</p>
                        </div>
                      </div>
                      <StatusBadge status="PENDING" />
                    </div>
                  ))}
                  {pendingReservations.map((reservation) => (
                    <div key={reservation.id} className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-600">
                          <ClockIcon />
                        </div>
                        <div>
                          <p className="font-medium text-slate-900">{reservation.hostel.hostelName}</p>
                          <p className="text-sm text-slate-500">{reservation.hostel.city}</p>
                        </div>
                      </div>
                      <span className="text-sm text-slate-500">Awaiting response</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Booking History */}
            <section className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <h2 className="font-semibold text-slate-900">Booking History</h2>
                  <span className="text-sm text-slate-500">{bookings.length} total</span>
                </div>
              </div>
              
              {bookings.length === 0 ? (
                <EmptyState
                  title="No bookings yet"
                  description="Start by browsing available hostels"
                  action={
                    <Link
                      to="/hostels"
                      className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      Browse Hostels
                      <ArrowRightIcon />
                    </Link>
                  }
                />
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Hostel
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map((booking) => (
                        <tr key={booking.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                                <BuildingIcon />
                              </div>
                              <span className="font-medium text-slate-900">{booking.hostel.hostelName}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-slate-600">
                            Rs. {booking.amount?.toLocaleString()}
                          </td>
                          <td className="px-6 py-4">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 text-slate-500 text-sm">
                            <div className="flex items-center gap-1.5">
                              <CalendarIcon />
                              {new Date(booking.createdAt).toLocaleDateString('en-PK', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                              })}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            {booking.status === 'APPROVED' && (
                              <Link
                                to={`/student/report/${booking.id}`}
                                className="inline-flex items-center gap-1 text-sm text-red-600 hover:text-red-700 font-medium"
                              >
                                <FlagIcon />
                                Report
                              </Link>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </section>
          </div>

          {/* ==================== SIDEBAR ==================== */}
          <aside className="space-y-6">
            
            {/* Profile Card */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Profile Information</h2>
              </div>
              <div className="p-6">
                {/* Avatar */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-xl font-semibold shadow-lg shadow-blue-500/20">
                    {profile?.user?.email?.charAt(0).toUpperCase() || 'S'}
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {profile?.user?.email?.split('@')[0] || 'Student'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <span className="w-2 h-2 bg-emerald-500 rounded-full" />
                      <span className="text-sm text-emerald-600">Verified</span>
                    </div>
                  </div>
                </div>
                
                {/* Details */}
                <div className="space-y-4">
                  {[
                    { label: 'Email', value: profile?.user?.email },
                    { label: "Father's Name", value: profile?.fatherName },
                    { label: 'Institute', value: profile?.instituteName },
                    { label: 'Phone', value: profile?.phoneNumber },
                    { label: 'WhatsApp', value: profile?.whatsappNumber },
                  ].map((item, index) => (
                    <div key={index} className="flex justify-between items-start">
                      <span className="text-sm text-slate-500">{item.label}</span>
                      <span className="text-sm text-slate-900 font-medium text-right max-w-[60%] truncate">
                        {item.value || '-'}
                      </span>
                    </div>
                  ))}
                </div>
                
                {/* Edit Button */}
                <button className="w-full mt-6 px-4 py-2.5 border border-slate-200 text-slate-700 text-sm font-medium rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors">
                  Edit Profile
                </button>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="font-semibold text-slate-900">Quick Actions</h2>
              </div>
              <div className="p-4 space-y-2">
                {[
                  { label: 'Browse Hostels', to: '/hostels', icon: <SearchIcon /> },
                  { label: 'My Messages', to: '/student/chat', icon: <ChatIcon /> },
                  { label: 'Report an Issue', to: '/student/report', icon: <FlagIcon /> },
                ].map((action, index) => (
                  <Link
                    key={index}
                    to={action.to}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500 group-hover:bg-slate-200 transition-colors">
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium text-slate-700">{action.label}</span>
                    </div>
                    <ArrowRightIcon />
                  </Link>
                ))}
              </div>
            </div>

            {/* Help Card */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white">
              <h3 className="font-semibold mb-2">Need Help?</h3>
              <p className="text-slate-300 text-sm mb-4">
                Contact our support team for any assistance with your booking.
              </p>
              <a
                href="https://wa.me/923001234567"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg text-sm hover:bg-white/20 transition-colors"
              >
                <ChatIcon />
                WhatsApp Support
              </a>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default StudentDashboard;