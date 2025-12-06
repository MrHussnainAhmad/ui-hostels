// src/pages/ProfilePage.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  usersApi,
  bookingsApi,
  hostelsApi,
  verificationsApi,
} from '../lib/api';
import { useAuthStore } from '../store/authStore';

// ======================= Icons =======================
const DangerIcon = () => (
  <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24">
    <path
      d="M12 9v4m0 4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24">
    <path
      d="M5.121 17.804A9 9 0 1119 10.5M15 9a3 3 0 11-6 0 3 3 0 016 0z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const MailIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
    <path
      d="M4 6h16v12H4V6z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4 7l8 5 8-5"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
    <path
      d="M7 4h2l2 5-2.5 1.5a11 11 0 005 5L17 13l5 2v2a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
    <path
      d="M12 21s7-4.434 7-11A7 7 0 105 10c0 6.566 7 11 7 11z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const BankIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
    <path
      d="M3 10l9-7 9 7M4 10h16v8H4v-8zM3 19h18"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
    <path
      d="M5 21V5a2 2 0 012-2h6l6 6v12M9 8h1M9 12h1M14 8h1M14 12h1M9 21v-4a1 1 0 011-1h2a1 1 0 011 1v4"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24">
    <path
      d="M8 3v3m8-3v3M5 7h14v12H5V7z"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const StatCard: React.FC<{
  label: string;
  value: string | number;
}> = ({ label, value }) => (
  <div className="border border-gray-100 bg-white px-5 py-4">
    <p className="text-xs text-gray-500 font-light mb-1">{label}</p>
    <p className="text-2xl font-light text-gray-900">{value}</p>
  </div>
);

// ======================= MAIN PAGE =======================
const ProfilePage: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [studentData, setStudentData] = useState<any | null>(null);
  const [managerData, setManagerData] = useState<any | null>(null);
  const [managerVerification, setManagerVerification] = useState<any | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [hostelStudents, setHostelStudents] = useState<Record<string, number>>({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [deleteWarning, setDeleteWarning] = useState('');
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const role = user?.role ?? null;

  useEffect(() => {
    if (!role) {
      setLoading(false);
      return;
    }
    loadProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [role]);

  const loadProfile = async () => {
    try {
      if (role === 'STUDENT') {
        const [sRes, bRes] = await Promise.all([
          usersApi.getStudentProfile(),
          bookingsApi.getMy(),
        ]);
        setStudentData(sRes.data.data);
        setBookings(bRes.data.data);
      }

      if (role === 'MANAGER') {
        const [mRes, vRes] = await Promise.all([
          usersApi.getManagerProfile(),
          verificationsApi.getMy(),
        ]);
        const managerProfile = mRes.data.data;
        setManagerData(managerProfile);
        const verifications: any[] = vRes.data.data || [];
        setManagerVerification(verifications[0] || null);

        // Fetch students per hostel
        if (managerProfile?.hostels?.length) {
          const counts: Record<string, number> = {};
          await Promise.all(
            managerProfile.hostels.map(async (h: any) => {
              try {
                const res = await hostelsApi.getStudents(h.id);
                counts[h.id] = res.data.data.length || 0;
              } catch {
                counts[h.id] = 0;
              }
            })
          );
          setHostelStudents(counts);
        }
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
      if (err?.response?.status === 401 || err?.response?.status === 403) {
        logout();
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const openDeleteModal = () => {
    if (role === 'STUDENT' && studentData) {
      const active = bookings.find((b) => b.status === 'APPROVED');
      if (active) {
        setDeleteWarning(
          `You have an active booking at ${active.hostel.hostelName}. If you proceed and confirm, your booking will be cancelled and your account will be deleted.`
        );
      } else {
        setDeleteWarning('You are proceeding to delete your account.');
      }
    }

    if (role === 'MANAGER' && managerData) {
      const activeHostels = managerData.hostels || [];
      if (activeHostels.length > 0) {
        const names = activeHostels.map((h: any) => h.hostelName).join(', ');
        setDeleteWarning(
          `You have active hostels (${names}). If you proceed and confirm, your hostels will be terminated and your account will be deleted.`
        );
      } else {
        setDeleteWarning('You are proceeding to delete your account.');
      }
    }

    setConfirmText('');
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (confirmText.trim() !== 'I want to delete.') return;

    try {
      setDeleting(true);
      await usersApi.deleteMyAccount();

      // Client-side logout + redirect
      logout();
      navigate('/login');
    } catch (err) {
      console.error('Delete account error:', err);
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400 text-sm">Loading profile...</p>
      </main>
    );
  }

  // ===================== STUDENT PROFILE =====================
  if (role === 'STUDENT' && studentData) {
    const nameFromEmail =
      studentData.user?.email?.split('@')[0] || 'Student';
    const displayName = studentData.fullName || nameFromEmail;
    const totalBookings = bookings.length;

    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-6 py-10 space-y-8">
          {/* Header */}
          <header className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
              <UserIcon />
            </div>
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
                Profile
              </p>
              <h1 className="text-2xl font-light text-gray-900">
                {displayName}
              </h1>
              <p className="text-sm text-gray-500 font-light">
                Student account overview & history.
              </p>
            </div>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Bookings" value={totalBookings} />
            <StatCard
              label="Active Bookings"
              value={bookings.filter((b) => b.status === 'APPROVED').length}
            />
            <StatCard
              label="Completed / Left"
              value={bookings.filter(
                (b) => b.status === 'LEFT' || b.status === 'COMPLETED'
              ).length}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Personal Details */}
              <section className="border border-gray-100 bg-white px-6 py-6">
                <h2 className="text-sm font-light text-gray-900 mb-4">
                  Personal Details
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Name</p>
                    <p className="text-gray-900 font-light">
                      {displayName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Father&apos;s Name</p>
                    <p className="text-gray-900 font-light">
                      {studentData.fatherName || '-'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div>
                      <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                        <MailIcon />
                        Email
                      </p>
                      <p className="text-gray-900 font-light break-all">
                        {studentData.user.email}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">
                      Institute
                    </p>
                    <p className="text-gray-900 font-light">
                      {studentData.instituteName || '-'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                      <LocationIcon />
                      Permanent Address
                    </p>
                    <p className="text-gray-900 font-light">
                      {studentData.permanentAddress || '-'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Contact */}
              <section className="border border-gray-100 bg-white px-6 py-6">
                <h2 className="text-sm font-light text-gray-900 mb-4">
                  Contact Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                      <PhoneIcon />
                      Phone
                    </p>
                    <p className="text-gray-900 font-light">
                      {studentData.phoneNumber || '-'}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                      <PhoneIcon />
                      WhatsApp
                    </p>
                    <p className="text-gray-900 font-light">
                      {studentData.whatsappNumber || '-'}
                    </p>
                  </div>
                </div>
              </section>

              {/* Booking History */}
              <section className="border border-gray-100 bg-white px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-light text-gray-900">
                    Booking History
                  </h2>
                  <span className="text-xs text-gray-500 font-light">
                    {totalBookings} total
                  </span>
                </div>

                {bookings.length === 0 ? (
                  <p className="text-sm text-gray-500 font-light">
                    No bookings yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {bookings.map((b) => (
                      <article
                        key={b.id}
                        className="border border-gray-100 bg-gray-50 px-4 py-3 text-sm flex justify-between gap-4"
                      >
                        <div>
                          <p className="text-gray-900 font-light">
                            {b.hostel.hostelName}
                          </p>
                          <p className="text-xs text-gray-500 font-light flex items-center gap-1 mt-1">
                            <CalendarIcon />
                            {new Date(b.createdAt).toLocaleDateString(
                              'en-PK',
                              {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              }
                            )}{' '}
                            • {b.status}
                          </p>
                        </div>
                        <div className="text-right text-xs text-gray-500 font-light">
                          <p>Amount</p>
                          <p className="text-gray-900">
                            Rs. {b.amount?.toLocaleString()}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </div>

            {/* Right Column */}
            <aside className="space-y-6">
              {/* Account Card */}
              <section className="border border-gray-100 bg-white px-6 py-6">
                <h2 className="text-sm font-light text-gray-900 mb-4">
                  Account
                </h2>
                <p className="text-xs text-gray-500 font-light mb-3">
                  Deleting your account will remove all your bookings, chats,
                  and personal data. This action cannot be undone.
                </p>
                <button
                  onClick={openDeleteModal}
                  className="w-full px-4 py-2.5 bg-red-600 text-white text-sm font-light hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </section>
            </aside>
          </div>

          {/* Delete Modal */}
          {confirmOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
              <div className="bg-white w-full max-w-md px-6 py-6 border border-gray-200">
                <div className="flex items-start gap-2 mb-3">
                  <DangerIcon />
                  <div>
                    <h3 className="text-lg font-light text-gray-900">
                      Confirm Deletion
                    </h3>
                    <p className="text-xs text-gray-500 font-light">
                      This action is permanent and cannot be reversed.
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 font-light mb-4">
                  {deleteWarning}
                </p>

                <p className="text-xs text-gray-600 font-light mb-2">
                  Type{' '}
                  <span className="font-medium">
                    &quot;I want to delete.&quot;
                  </span>{' '}
                  to confirm:
                </p>

                <input
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900"
                  placeholder='I want to delete.'
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-5">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="px-4 py-2 border text-sm font-light"
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={
                      confirmText.trim() !== 'I want to delete.' || deleting
                    }
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-light disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Proceed'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // ===================== MANAGER PROFILE =====================
  if (role === 'MANAGER' && managerData) {
    const email = managerData.user?.email;
    const displayName = managerData.fullName || email?.split('@')[0] || 'Manager';
    const hostels = managerData.hostels || [];
    const totalHostels = hostels.length;

    return (
      <main className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">
          {/* Header */}
          <header className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white">
              <UserIcon />
            </div>
            <div>
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400">
                Profile
              </p>
              <h1 className="text-2xl font-light text-gray-900">
                {displayName}
              </h1>
              <p className="text-sm text-gray-500 font-light">
                Manager details, hostels & banking information.
              </p>
            </div>
          </header>

          {/* Stats */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard label="Total Hostels" value={totalHostels} />
            <StatCard
              label="Total Students"
              value={Object.values(hostelStudents).reduce(
                (sum, n) => sum + n,
                0
              )}
            />
            <StatCard
              label="Verified Status"
              value={managerData.verified ? 'Verified' : 'Pending'}
            />
          </section>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Manager Info */}
              <section className="border border-gray-100 bg-white px-6 py-6">
                <h2 className="text-sm font-light text-gray-900 mb-4">
                  Manager Information
                </h2>
                <div className="grid sm:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Name</p>
                    <p className="text-gray-900 font-light">
                      {displayName}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-xs mb-1">Phone</p>
                    <p className="text-gray-900 font-light">
                      {managerData.phone || '-'}
                    </p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                      <MailIcon />
                      Email
                    </p>
                    <p className="text-gray-900 font-light break-all">
                      {email}
                    </p>
                  </div>
                  {managerVerification && (
                    <>
                      <div>
                        <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                          <LocationIcon />
                          City
                        </p>
                        <p className="text-gray-900 font-light">
                          {managerVerification.city}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          Hostel For
                        </p>
                        <p className="text-gray-900 font-light">
                          {managerVerification.hostelFor}
                        </p>
                      </div>
                      <div className="sm:col-span-2">
                        <p className="text-gray-400 text-xs mb-1 flex items-center gap-1">
                          <LocationIcon />
                          Address
                        </p>
                        <p className="text-gray-900 font-light">
                          {managerVerification.address}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </section>

              {/* Banking & Payments */}
              <section className="border border-gray-100 bg-white px-6 py-6">
                <h2 className="text-sm font-light text-gray-900 mb-4">
                  Payment & Bank Details
                </h2>
                {managerVerification ? (
                  <div className="space-y-4 text-sm">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          Easypaisa Number
                        </p>
                        <p className="text-gray-900 font-light">
                          {managerVerification.easypaisaNumber || '-'}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-400 text-xs mb-1">
                          JazzCash Number
                        </p>
                        <p className="text-gray-900 font-light">
                          {managerVerification.jazzcashNumber || '-'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-gray-400 text-xs mb-2 flex items-center gap-1">
                        <BankIcon />
                        Bank Accounts
                      </p>
                      {managerVerification.customBanks &&
                      managerVerification.customBanks.length > 0 ? (
                        <div className="space-y-1 text-xs text-gray-700">
                          {managerVerification.customBanks.map(
                            (b: any, idx: number) => (
                              <p key={idx} className="font-light">
                                {b.bankName} — {b.accountNumber}
                                {b.iban ? ` — ${b.iban}` : ''}
                              </p>
                            )
                          )}
                        </div>
                      ) : (
                        <p className="text-xs text-gray-500 font-light">
                          No bank accounts added.
                        </p>
                      )}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 font-light">
                    No verification details found yet.
                  </p>
                )}
              </section>

              {/* Hostels & Students */}
              <section className="border border-gray-100 bg-white px-6 py-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-light text-gray-900">
                    My Hostels
                  </h2>
                  <span className="text-xs text-gray-500 font-light">
                    {totalHostels} total
                  </span>
                </div>

                {hostels.length === 0 ? (
                  <p className="text-sm text-gray-500 font-light">
                    You have not created any hostels yet.
                  </p>
                ) : (
                  <div className="space-y-3">
                    {hostels.map((h: any) => (
                      <article
                        key={h.id}
                        className="border border-gray-100 bg-gray-50 px-4 py-3 text-sm flex justify-between gap-4"
                      >
                        <div>
                          <p className="text-gray-900 font-light flex items-center gap-2">
                            <BuildingIcon />
                            {h.hostelName}
                          </p>
                          <p className="text-xs text-gray-500 font-light mt-1">
                            {h.city}
                          </p>
                        </div>
                        <div className="text-right text-xs text-gray-500 font-light">
                          <p>Students</p>
                          <p className="text-gray-900">
                            {hostelStudents[h.id] ?? 0}
                          </p>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>

              {/* Building Images Gallery */}
              {managerVerification &&
                managerVerification.buildingImages &&
                managerVerification.buildingImages.length > 0 && (
                  <section className="border border-gray-100 bg-white px-6 py-6">
                    <h2 className="text-sm font-light text-gray-900 mb-3">
                      Building Images
                    </h2>
                    <div className="flex gap-3 overflow-x-auto pb-2">
                      {managerVerification.buildingImages.map(
                        (url: string, idx: number) => (
                          <div
                            key={idx}
                            className="min-w-[140px] h-[100px] rounded-md overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0"
                          >
                            <img
                              src={url}
                              alt={`Building ${idx + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )
                      )}
                    </div>
                  </section>
                )}
            </div>

            {/* Right Column */}
            <aside className="space-y-6">
              {/* Account Card */}
              <section className="border border-gray-100 bg-white px-6 py-6">
                <h2 className="text-sm font-light text-gray-900 mb-4">
                  Account
                </h2>
                <p className="text-xs text-gray-500 font-light mb-3">
                  Deleting your manager account will remove all your hostels,
                  bookings, reports, chats and verification data. This action
                  cannot be undone.
                </p>
                <button
                  onClick={openDeleteModal}
                  className="w-full px-4 py-2.5 bg-red-600 text-white text-sm font-light hover:bg-red-700 transition-colors"
                >
                  Delete Account
                </button>
              </section>
            </aside>
          </div>

          {/* Delete Modal */}
          {confirmOpen && (
            <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
              <div className="bg-white w-full max-w-md px-6 py-6 border border-gray-200">
                <div className="flex items-start gap-2 mb-3">
                  <DangerIcon />
                  <div>
                    <h3 className="text-lg font-light text-gray-900">
                      Confirm Deletion
                    </h3>
                    <p className="text-xs text-gray-500 font-light">
                      This action is permanent and cannot be reversed.
                    </p>
                  </div>
                </div>

                <p className="text-sm text-gray-600 font-light mb-4">
                  {deleteWarning}
                </p>

                <p className="text-xs text-gray-600 font-light mb-2">
                  Type{' '}
                  <span className="font-medium">
                    &quot;I want to delete.&quot;
                  </span>{' '}
                  to confirm:
                </p>

                <input
                  className="w-full border border-gray-300 px-3 py-2 text-sm font-light focus:outline-none focus:border-gray-900"
                  placeholder='I want to delete.'
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                />

                <div className="flex justify-end gap-2 mt-5">
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="px-4 py-2 border text-sm font-light"
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={
                      confirmText.trim() !== 'I want to delete.' || deleting
                    }
                    onClick={handleDelete}
                    className="px-4 py-2 bg-red-600 text-white text-sm font-light disabled:opacity-50"
                  >
                    {deleting ? 'Deleting…' : 'Proceed'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    );
  }

  // Fallback
  return (
    <main className="min-h-screen bg-white flex items-center justify-center">
      <p className="text-gray-400 text-sm">No profile data available.</p>
    </main>
  );
};

export default ProfilePage;
