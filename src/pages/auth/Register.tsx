// src/pages/auth/Register.tsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useSEO } from '../../hooks/useSEO';

// ==================== ICONS ====================
const MailIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

const LockIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const EyeIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
    />
  </svg>
);

const AlertCircleIcon = () => (
  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg
    className="w-4 h-4 transition-transform group-hover:translate-x-0.5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
    />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0
           3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const GlobeIcon = () => (
  <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

// ==================== ROLE CARD ====================
interface RoleCardProps {
  role: 'STUDENT' | 'MANAGER';
  selected: boolean;
  onSelect: () => void;
  icon: React.ReactNode;
  title: string;
  description: string;
}

const RoleCard: React.FC<RoleCardProps> = ({
  selected,
  onSelect,
  icon,
  title,
  description,
}) => (
  <button
    type="button"
    onClick={onSelect}
    className={`relative flex-1 p-4 rounded-lg border text-left transition-colors ${
      selected
        ? 'border-gray-900 bg-gray-50'
        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    {selected && (
      <div className="absolute top-3 right-3 w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center">
        <CheckIcon />
      </div>
    )}
    <div
      className={`w-9 h-9 rounded-md flex items-center justify-center mb-3 ${
        selected ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-600'
      }`}
    >
      {icon}
    </div>
    <p className={`text-sm ${selected ? 'text-gray-900' : 'text-gray-700'} font-medium`}>
      {title}
    </p>
    <p className="text-xs text-gray-500 mt-1">{description}</p>
  </button>
);

// ==================== PASSWORD STRENGTH ====================
const PasswordStrength: React.FC<{ password: string }> = ({ password }) => {
  const getStrength = () => {
    let strength = 0;
    if (password.length >= 6) strength++;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  };

  if (!password) return null;

  const strength = getStrength();
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-blue-500', 'bg-emerald-500'];

  return (
    <div className="mt-2">
      <div className="flex gap-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i < strength ? colors[strength - 1] : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p
        className={`text-xs mt-1 ${
          strength < 3 ? 'text-gray-500' : 'text-emerald-600'
        }`}
      >
        {labels[strength - 1]}
      </p>
    </div>
  );
};

// ==================== LOCATION NOTICE ====================
const LocationNotice: React.FC = () => (
  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
    <div className="flex gap-3">
      <div className="flex-shrink-0">
        <div className="w-9 h-9 bg-amber-100 rounded-md flex items-center justify-center">
          <MapPinIcon />
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-xs font-medium text-amber-800 tracking-wide">
            Currently serving Bahawalpur, Pakistan
          </h4>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-amber-200 text-amber-800">
            Beta
          </span>
        </div>
        <p className="text-xs text-amber-700">
          We&apos;re currently operating exclusively in Bahawalpur. Expanding to other cities
          soon.
        </p>

        <div className="mt-3 pt-3 border-t border-amber-200">
          <div className="flex items-start gap-2">
            <GlobeIcon />
            <div>
              <p className="text-xs font-medium text-amber-800">
                Interested in listing from another city or country?
              </p>
              <p className="text-xs text-amber-700 mt-1">
                Email us at{' '}
                <a
                  href="mailto:hostels.official@gmail.com"
                  className="font-semibold text-amber-900 hover:underline inline-flex items-center gap-1"
                >
                  hostels.official@gmail.com
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                    />
                  </svg>
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================
const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'STUDENT' | 'MANAGER'>('STUDENT');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  // SEO
  useSEO({
    title: 'Register | HostelHub Bahawalpur - Create Your Account',
    description:
      'Create a HostelHub account to find or manage hostels in Bahawalpur, Pakistan. Register as a student or hostel manager.',
    keywords:
      'register, sign up, create account, student registration, hostel manager, Bahawalpur hostel',
    canonical: 'https://hostelhub.pk/register',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      setError('Please accept the terms and conditions to continue.');
      return;
    }

    if (role === 'STUDENT' && !fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await authApi.register({
        email,
        password,
        role,
        fullName: role === 'STUDENT' ? fullName.trim() : undefined,
      });
      const { user, token } = response.data.data;
      setAuth(user, token);

      if (role === 'STUDENT') {
        navigate('/student/verify');
      } else {
        navigate('/manager/verification');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] min-h-screen">
        {/* ==================== LEFT: UNIQUE PREVIEW / ANIMATION ==================== */}
        <section className="hidden lg:flex items-center justify-center border-r border-gray-100 bg-gray-50">
          <div className="w-full max-w-md px-10">
            {/* Heading */}
            <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
              HostelHub Network
            </p>
            <h2 className="text-2xl font-light text-gray-900 mb-3">
              One profile for your entire hostel journey.
            </h2>
            <p className="text-sm text-gray-500 font-light mb-8">
              Use the same account to find hostels as a student or manage listings as a hostel
              manager in Bahawalpur.
            </p>

            {/* Network visualization */}
            <div className="relative h-64 mb-8">
              {/* Outer subtle circle */}
              <div className="absolute inset-6 rounded-full border border-gray-200" />
              {/* Inner gradient circle */}
              <div className="absolute inset-14 rounded-full bg-gradient-to-br from-gray-900 via-gray-800 to-black shadow-xl" />

              {/* Central node */}
              <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="w-20 h-20 rounded-full bg-white/10 border border-white/30 flex items-center justify-center shadow-lg backdrop-blur-sm">
                  <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                    <BuildingIcon />
                  </div>
                </div>
              </div>

              {/* Connected floating nodes (animated) */}
              <div className="absolute left-1/2 -translate-x-1/2 top-3">
                <div className="px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 text-[11px] text-gray-700 font-light flex items-center gap-1 animate-pulse">
                  <UserIcon />
                  Students
                </div>
              </div>

              <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <div className="px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 text-[11px] text-gray-700 font-light flex items-center gap-1">
                  <HomeIcon />
                  Hostels
                </div>
              </div>

              <div className="absolute left-4 bottom-10">
                <div className="px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 text-[11px] text-gray-700 font-light flex items-center gap-1">
                  <MapPinIcon />
                  Bahawalpur
                </div>
              </div>

              <div className="absolute right-10 bottom-4">
                <div className="px-3 py-1.5 rounded-full bg-white shadow-sm border border-gray-100 text-[11px] text-gray-700 font-light flex items-center gap-1">
                  <span className="inline-flex w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  Live network
                </div>
              </div>

              {/* Lines to hint connections */}
              <div className="absolute inset-0 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 200 200">
                  <line
                    x1="100"
                    y1="100"
                    x2="100"
                    y2="25"
                    stroke="#E5E7EB"
                    strokeWidth="0.7"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1="100"
                    y1="100"
                    x2="175"
                    y2="100"
                    stroke="#E5E7EB"
                    strokeWidth="0.7"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1="100"
                    y1="100"
                    x2="35"
                    y2="150"
                    stroke="#E5E7EB"
                    strokeWidth="0.7"
                    strokeDasharray="3 2"
                  />
                  <line
                    x1="100"
                    y1="100"
                    x2="150"
                    y2="165"
                    stroke="#E5E7EB"
                    strokeWidth="0.7"
                    strokeDasharray="3 2"
                  />
                </svg>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 text-xs text-gray-500 font-light">
              <div>
                <p className="text-gray-400 mb-1">Profiles created</p>
                <p className="text-sm text-gray-900 font-light">3,000+</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Verified hostels</p>
                <p className="text-sm text-gray-900 font-light">50+</p>
              </div>
              <div>
                <p className="text-gray-400 mb-1">Avg. rating</p>
                <p className="text-sm text-gray-900 font-light flex items-center gap-1">
                  4.8
                  <span className="text-amber-400">★</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== RIGHT: REGISTER FORM ==================== */}
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-8">
              <Link to="/" className="inline-flex items-center">
                <img
                  src="/logo.png"
                  alt="HostelHub"
                  className="h-9 w-auto object-contain"
                />
                <span className="sr-only">HostelHub</span>
              </Link>
            </div>

            {/* Header */}
            <div className="mb-6">
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                Create account
              </p>
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-1">
                Join HostelHub Bahawalpur
              </h1>
              <p className="text-sm text-gray-500 font-light">
                Sign up as a student or hostel manager to get started.
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 flex gap-3">
                <div className="mt-0.5">
                  <AlertCircleIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">Registration failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Form card */}
            <div className="border border-gray-100 bg-white px-5 py-6 sm:px-6 sm:py-7">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Role selection */}
                <div>
                  <label className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">
                    I am a
                  </label>
                  <div className="flex gap-3">
                    <RoleCard
                      role="STUDENT"
                      selected={role === 'STUDENT'}
                      onSelect={() => setRole('STUDENT')}
                      icon={<UserIcon />}
                      title="Student"
                      description="Looking for hostel"
                    />
                    <RoleCard
                      role="MANAGER"
                      selected={role === 'MANAGER'}
                      onSelect={() => setRole('MANAGER')}
                      icon={<HomeIcon />}
                      title="Manager"
                      description="List my hostel"
                    />
                  </div>
                </div>

                {/* Location notice (managers only) */}
                {role === 'MANAGER' && <LocationNotice />}

                {/* Full Name (students only) */}
                {role === 'STUDENT' && (
                  <div>
                    <label
                      htmlFor="fullName"
                      className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon />
                      </div>
                      <input
                        id="fullName"
                        type="text"
                        required={role === 'STUDENT'}
                        autoComplete="name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Your full name"
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-light"
                      />
                    </div>
                  </div>
                )}

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MailIcon />
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-light"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a strong password"
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-light"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  <PasswordStrength password={password} />
                </div>

                {/* Terms */}
                <div className="flex items-start gap-3">
                  <input
                    id="terms"
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    className="mt-0.5 w-4 h-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                  />
                  <label
                    htmlFor="terms"
                    className="text-xs text-gray-600 font-light"
                  >
                    I agree to the{' '}
                    <Link to="/terms" className="text-gray-900 hover:underline font-normal">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link to="/privacy" className="text-gray-900 hover:underline font-normal">
                      Privacy Policy
                    </Link>
                    .
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading || !acceptTerms}
                  className="group w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 text-sm font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create account</span>
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center">
                <span className="px-3 bg-white text-xs text-gray-400 tracking-widest uppercase font-medium">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Login link */}
            <Link
              to="/login"
              className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 bg-white text-sm font-light text-gray-900 py-2.5 hover:bg-gray-50 transition-colors"
            >
              Sign in instead
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Register;