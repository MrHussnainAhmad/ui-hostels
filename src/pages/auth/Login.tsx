// src/pages/auth/Login.tsx
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

const WifiIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    />
  </svg>
);

// ==================== MAIN COMPONENT ====================
const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  // SEO
  useSEO({
    title: 'Login | HostelHub Bahawalpur - Access Your Account',
    description:
      'Login to your HostelHub account. Manage hostel bookings, reservations, and find accommodation in Bahawalpur, Pakistan.',
    keywords: 'login, hostel login, student login, manager login, HostelHub Bahawalpur',
    canonical: 'https://hostelhub.pk/login',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await authApi.login({ email, password });
      const { user, token } = response.data.data;
      setAuth(user, token);

      switch (user.role) {
        case 'ADMIN':
        case 'SUBADMIN':
          navigate('/admin');
          break;
        case 'MANAGER':
          navigate('/manager');
          break;
        case 'STUDENT':
          navigate('/student');
          break;
        default:
          navigate('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Invalid email or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] min-h-screen">
        {/* ==================== LEFT: LOGIN FORM ==================== */}
        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            {/* Logo */}
            <div className="mb-10">
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
                Welcome back
              </p>
              <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-1">
                Sign in to HostelHub
              </h1>
              <p className="text-sm text-gray-500 font-light">
                Access your dashboard to manage bookings and your accommodation in Bahawalpur.
              </p>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 flex gap-3">
                <div className="mt-0.5">
                  <AlertCircleIcon />
                </div>
                <div>
                  <p className="text-sm font-medium text-red-800">Login failed</p>
                  <p className="text-sm text-red-600 mt-0.5">{error}</p>
                </div>
              </div>
            )}

            {/* Form Card */}
            <div className="border border-gray-100 bg-white px-5 py-6 sm:px-6 sm:py-7">
              <form onSubmit={handleSubmit} className="space-y-5">
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
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor="password"
                      className="block text-xs font-medium tracking-widest uppercase text-gray-400"
                    >
                      Password
                    </label>
                    <Link
                      to="/forgot-password"
                      className="text-xs text-gray-500 font-light hover:text-gray-900 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon />
                    </div>
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="current-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
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
                </div>

                {/* Remember me */}
                <div className="flex items-center">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 text-gray-900 border-gray-300 focus:ring-gray-900"
                  />
                  <label
                    htmlFor="remember"
                    className="ml-2 text-xs text-gray-600 font-light"
                  >
                    Remember me for 30 days
                  </label>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="group w-full inline-flex items-center justify-center gap-2 bg-gray-900 text-white py-2.5 text-sm font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <SpinnerIcon />
                      <span>Signing in...</span>
                    </>
                  ) : (
                    <>
                      <span>Sign in</span>
                      <ArrowRightIcon />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-7">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200" />
                </div>
                <div className="relative flex justify-center">
                  <span className="px-3 bg-white text-[10px] text-gray-400 tracking-widest uppercase font-medium">
                    New to HostelHub?
                  </span>
                </div>
              </div>

              {/* Register link */}
              <Link
                to="/register"
                className="w-full inline-flex items-center justify-center gap-2 border border-gray-200 bg-white text-sm font-light text-gray-900 py-2.5 hover:bg-gray-50 transition-colors"
              >
                Create an account
              </Link>
            </div>

            {/* Terms */}
            <p className="mt-6 text-xs text-gray-500 font-light">
              By signing in, you agree to our{' '}
              <Link to="/terms" className="text-gray-900 hover:underline">
                Terms
              </Link>{' '}
              and{' '}
              <Link to="/privacy" className="text-gray-900 hover:underline">
                Privacy Policy
              </Link>
            </p>
          </div>
        </section>

        {/* ==================== RIGHT: DASHBOARD PREVIEW ==================== */}
        <section className="hidden lg:block relative bg-gradient-to-br from-gray-900 via-slate-900 to-black text-white overflow-hidden">
          {/* Background accents */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
          <div className="absolute bottom-[-5rem] left-[-5rem] w-96 h-96 bg-white/5 rounded-full blur-3xl" />

          <div className="relative h-full flex items-center">
            <div className="w-full max-w-lg mx-auto px-10 py-12">
              {/* Top label */}
              <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                HostelHub Dashboard
              </p>
              <h2 className="text-2xl font-light text-white mb-6">
                See your next hostel stay before you check in.
              </h2>

              {/* Main preview card */}
              <div className="bg-white/5 border border-white/15 rounded-2xl p-5 backdrop-blur-md shadow-xl hover:border-white/30 transition-colors">
                {/* Card header */}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
                      Upcoming stay
                    </p>
                    <p className="text-sm font-light text-white">
                      University Road Boys Hostel
                    </p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 text-[10px] font-medium tracking-widest uppercase bg-green-500/10 text-green-200 border border-green-400/40">
                    Approved
                  </span>
                </div>

                {/* Image / map preview */}
                <div className="relative mb-4">
                  <div className="aspect-[16/9] rounded-xl bg-gradient-to-br from-slate-800 via-slate-900 to-black overflow-hidden border border-white/10">
                    <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_10%_20%,#ffffff_0,transparent_55%),radial-gradient(circle_at_80%_0,#22c55e_0,transparent_45%)]" />
                    <div className="relative h-full w-full flex items-end p-4">
                      <div className="bg-black/50 px-3 py-2 rounded-md">
                        <p className="text-xs text-gray-200">Bahawalpur • University Road</p>
                        <p className="text-sm text-white font-light">
                          Check‑in: 5th August · Room 204
                        </p>
                      </div>
                    </div>

                    {/* Pulsing location dot */}
                    <div className="absolute left-1/3 top-1/3">
                      <span className="absolute inline-flex h-7 w-7 rounded-full bg-emerald-400/30 animate-ping" />
                      <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-400" />
                    </div>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3 mb-4 text-xs text-gray-300 font-light">
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">Monthly rent</p>
                    <p className="text-sm text-white font-light">PKR 15,000</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">Next payment</p>
                    <p className="text-sm text-white font-light">1st Sep</p>
                  </div>
                  <div>
                    <p className="text-[11px] text-gray-400 mb-1">WiFi</p>
                    <p className="text-sm text-emerald-300 font-light flex items-center gap-1">
                      <WifiIcon />
                      <span>Connected</span>
                    </p>
                  </div>
                </div>

                {/* Timeline */}
                <div className="mt-2">
                  <p className="text-[11px] text-gray-400 mb-2 tracking-widest uppercase">
                    Booking progress
                  </p>
                  <div className="flex items-center justify-between">
                    {['Requested', 'Verified', 'Move‑in'].map((step, index) => (
                      <div key={step} className="flex flex-col items-center gap-1 flex-1">
                        <div className="flex items-center justify-center">
                          <div
                            className={
                              index < 2
                                ? 'w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-[11px] text-black'
                                : 'w-6 h-6 rounded-full border border-gray-400 flex items-center justify-center text-[11px] text-gray-300'
                            }
                          >
                            {index + 1}
                          </div>
                          {index < 2 && (
                            <div className="h-px flex-1 bg-gradient-to-r from-emerald-400 to-emerald-300 ml-2" />
                          )}
                        </div>
                        <span className="text-[11px] text-gray-300 font-light">{step}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Small reassurance row */}
              <div className="mt-8 grid grid-cols-3 gap-4 text-xs font-light text-gray-300">
                <div>
                  <p className="text-gray-400 mb-1">Students hosted</p>
                  <p className="text-sm text-white">2,500+</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Verified hostels</p>
                  <p className="text-sm text-white">50+</p>
                </div>
                <div>
                  <p className="text-gray-400 mb-1">Avg. rating</p>
                  <p className="text-sm text-white flex items-center gap-1">
                    4.8
                    <span className="text-amber-300">★</span>
                  </p>
                </div>
              </div>

              {/* Bottom line */}
              <p className="mt-6 text-[11px] text-gray-400 font-light">
                Log in to see your own bookings, payments and hostel details in this dashboard.
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Login;