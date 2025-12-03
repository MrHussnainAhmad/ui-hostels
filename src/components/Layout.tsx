// src/components/Layout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// ==================== ICONS ====================
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z"
    />
  </svg>
);

const BrowseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
    />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

// ==================== TYPES ====================
interface LayoutProps {
  children: React.ReactNode;
}

// ==================== USER AVATAR ====================
const UserAvatar: React.FC<{ email: string; size?: 'sm' | 'md' }> = ({
  email,
  size = 'md',
}) => {
  const initial = email?.charAt(0).toUpperCase() || 'U';
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-9 h-9 text-sm',
  };

  return (
    <div
      className={`${sizes[size]} bg-gray-900 rounded-full flex items-center justify-center text-white font-medium`}
    >
      {initial}
    </div>
  );
};

// ==================== ROLE BADGE ====================
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleStyles: Record<string, string> = {
    ADMIN: 'bg-purple-50 text-purple-700 border-purple-200',
    SUBADMIN: 'bg-blue-50 text-blue-700 border-blue-200',
    MANAGER: 'bg-green-50 text-green-700 border-green-200',
    STUDENT: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  };

  return (
    <span
      className={`inline-block px-2 py-0.5 text-[10px] font-medium tracking-widest uppercase border ${
        roleStyles[role] || 'bg-gray-50 text-gray-700 border-gray-200'
      }`}
    >
      {role}
    </span>
  );
};

// ==================== NAV LINK ====================
const NavLink: React.FC<{
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
}> = ({ to, icon, children, onClick }) => {
  const location = useLocation();
  const isActive =
    location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <Link
      to={to}
      onClick={onClick}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-light transition-colors ${
        isActive
          ? 'bg-gray-900 text-white'
          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {icon}
      {children}
    </Link>
  );
};

// ==================== DROPDOWN MENU ====================
const DropdownMenu: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}> = ({ isOpen, onClose, children }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={ref}
      className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 shadow-lg py-2 z-50"
    >
      {children}
    </div>
  );
};

// ==================== MAIN LAYOUT ====================
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, isAuthenticated, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isAuthPage =
    location.pathname === '/login' || location.pathname === '/register';

  // Close menus on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setUserMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'ADMIN':
      case 'SUBADMIN':
        return '/admin';
      case 'MANAGER':
        return '/manager';
      case 'STUDENT':
        return '/student';
      default:
        return '/';
    }
  };

  // Logo destination: if logged in -> role-based dashboard, else -> /
  const logoHref = isAuthenticated ? getDashboardLink() : '/';

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* ==================== NAVBAR (hidden on login/register) ==================== */}
      {!isAuthPage && (
        <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="flex h-16 items-center justify-between">
              {/* Left: Logo & Desktop Nav */}
              <div className="flex items-center gap-8">
                {/* Logo */}
                <Link to={logoHref} className="flex items-center">
                  <img
                    src="/logo.png"
                    alt="HostelHub"
                    className="h-9 w-auto object-contain"
                  />
                  <span className="sr-only">HostelHub</span>
                </Link>

                {/* Desktop Navigation (when authenticated) */}
                {isAuthenticated && (
                  <div className="hidden md:flex items-center gap-1">
                    <NavLink to={getDashboardLink()} icon={<DashboardIcon />}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/hostels" icon={<BrowseIcon />}>
                      Browse Hostels
                    </NavLink>
                  </div>
                )}
              </div>

              {/* Right: Auth/User Menu */}
              <div className="flex items-center gap-3">
                {isAuthenticated ? (
                  <>
                    {/* Desktop user dropdown */}
                    <div className="hidden md:block relative">
                      <button
                        onClick={() => setUserMenuOpen(!userMenuOpen)}
                        className="flex items-center gap-3 px-2 py-1.5 rounded-full hover:bg-gray-50 transition-colors"
                      >
                        <UserAvatar email={user?.email || ''} size="sm" />
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-light text-gray-900 max-w-[160px] truncate">
                            {user?.email}
                          </span>
                          <ChevronDownIcon />
                        </div>
                      </button>

                      <DropdownMenu
                        isOpen={userMenuOpen}
                        onClose={() => setUserMenuOpen(false)}
                      >
                        {/* User Info */}
                        <div className="px-4 py-3 border-b border-gray-100">
                          <div className="flex items-center gap-3">
                            <UserAvatar email={user?.email || ''} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-light text-gray-900 truncate">
                                {user?.email}
                              </p>
                              <div className="mt-1">
                                <RoleBadge role={user?.role || ''} />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-1">
                          <Link
                            to={getDashboardLink()}
                            className="flex items-center gap-3 px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <DashboardIcon />
                            <span>Dashboard</span>
                          </Link>
                          <Link
                            to="/profile"
                            className="flex items-center gap-3 px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <UserIcon />
                            <span>Profile</span>
                          </Link>
                          <Link
                            to="/settings"
                            className="flex items-center gap-3 px-4 py-2 text-sm font-light text-gray-700 hover:bg-gray-50 transition-colors"
                          >
                            <SettingsIcon />
                            <span>Settings</span>
                          </Link>
                        </div>

                        {/* Logout */}
                        <div className="border-t border-gray-100 pt-1 mt-1">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-2 text-sm font-light text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <LogoutIcon />
                            <span>Sign out</span>
                          </button>
                        </div>
                      </DropdownMenu>
                    </div>

                    {/* Mobile menu button */}
                    <button
                      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                      className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                    </button>
                  </>
                ) : (
                  // Non-auth navbar buttons
                  <>
                    <div className="hidden sm:flex items-center gap-3">
                      <Link
                        to="/login"
                        className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors"
                      >
                        Get Started
                        <ArrowRightIcon />
                      </Link>
                    </div>
                    <div className="flex sm:hidden items-center gap-2">
                      <Link
                        to="/login"
                        className="text-sm font-light text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        Sign in
                      </Link>
                      <Link
                        to="/register"
                        className="px-4 py-2 bg-gray-900 text-white text-sm font-light rounded-md hover:bg-gray-800 transition-colors"
                      >
                        Register
                      </Link>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Mobile menu when authenticated */}
          {isAuthenticated && mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-100 bg-white">
              <div className="px-4 py-4 space-y-3">
                {/* User Info */}
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <UserAvatar email={user?.email || ''} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-light text-gray-900 truncate">
                      {user?.email}
                    </p>
                    <div className="mt-1">
                      <RoleBadge role={user?.role || ''} />
                    </div>
                  </div>
                </div>

                {/* Navigation Links */}
                <NavLink
                  to={getDashboardLink()}
                  icon={<DashboardIcon />}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/hostels"
                  icon={<BrowseIcon />}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Browse Hostels
                </NavLink>
                <NavLink
                  to="/profile"
                  icon={<UserIcon />}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Profile
                </NavLink>
                <NavLink
                  to="/settings"
                  icon={<SettingsIcon />}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Settings
                </NavLink>

                {/* Logout */}
                <div className="pt-3 mt-3 border-t border-gray-100">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-light text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogoutIcon />
                    <span>Sign out</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      )}

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1">{children}</main>

      {/* ==================== FOOTER (hidden on login/register) ==================== */}
      {!isAuthPage && (
        <footer className="bg-white border-t border-gray-100 mt-auto">
          <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              {/* Logo & Copy */}
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="HostelHub"
                  className="h-7 w-auto object-contain"
                />
                <span className="text-sm text-gray-500 font-light">
                  © {new Date().getFullYear()} HostelHub. All rights reserved.
                </span>
              </div>

              {/* Links */}
              <div className="flex items-center gap-6">
                <Link
                  to="/about"
                  className="text-sm text-gray-500 font-light hover:text-gray-900 transition-colors"
                >
                  About
                </Link>
                <Link
                  to="/privacy"
                  className="text-sm text-gray-500 font-light hover:text-gray-900 transition-colors"
                >
                  Privacy
                </Link>
                <Link
                  to="/terms"
                  className="text-sm text-gray-500 font-light hover:text-gray-900 transition-colors"
                >
                  Terms
                </Link>
                <Link
                  to="/contact"
                  className="text-sm text-gray-500 font-light hover:text-gray-900 transition-colors"
                >
                  Contact
                </Link>
              </div>

              {/* Location */}
              <div className="flex items-center gap-2 text-sm text-gray-500 font-light">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
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
                <span>Bahawalpur, Pakistan</span>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
};

export default Layout;