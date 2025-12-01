// src/components/Layout.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

// ==================== ICONS ====================
const BuildingIcon = () => (
  <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

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
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const DashboardIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
  </svg>
);

const BrowseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const UserIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const SettingsIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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
const UserAvatar: React.FC<{ email: string; size?: 'sm' | 'md' }> = ({ email, size = 'md' }) => {
  const initial = email?.charAt(0).toUpperCase() || 'U';
  const sizes = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base'
  };
  
  return (
    <div className={`${sizes[size]} bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-semibold`}>
      {initial}
    </div>
  );
};

// ==================== ROLE BADGE ====================
const RoleBadge: React.FC<{ role: string }> = ({ role }) => {
  const roleStyles: Record<string, string> = {
    ADMIN: 'bg-purple-100 text-purple-700',
    SUBADMIN: 'bg-blue-100 text-blue-700',
    MANAGER: 'bg-emerald-100 text-emerald-700',
    STUDENT: 'bg-amber-100 text-amber-700',
  };

  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${roleStyles[role] || 'bg-slate-100 text-slate-700'}`}>
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
  const isActive = location.pathname === to || location.pathname.startsWith(to + '/');
  
  return (
    <Link
      to={to}
      onClick={onClick}
      className={`
        flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActive 
          ? 'bg-slate-900 text-white' 
          : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
        }
      `}
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      ref={ref}
      className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
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

  // Close mobile menu on route change
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

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==================== NAVBAR ==================== */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            
            {/* Left Side - Logo & Nav */}
            <div className="flex items-center gap-8">
              {/* Logo */}
              <Link 
                to="/" 
                className="flex items-center gap-2.5 text-slate-900 hover:opacity-80 transition-opacity"
              >
                <div className="w-9 h-9 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                  <BuildingIcon />
                </div>
                <span className="text-xl font-bold tracking-tight">HostelHub</span>
              </Link>

              {/* Desktop Navigation */}
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

            {/* Right Side - Auth */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <>
                  {/* User Menu - Desktop */}
                  <div className="hidden md:block relative">
                    <button
                      onClick={() => setUserMenuOpen(!userMenuOpen)}
                      className="flex items-center gap-3 p-1.5 pr-3 rounded-full hover:bg-slate-100 transition-colors"
                    >
                      <UserAvatar email={user?.email || ''} size="sm" />
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-slate-700 max-w-[150px] truncate">
                          {user?.email}
                        </span>
                        <ChevronDownIcon />
                      </div>
                    </button>

                    <DropdownMenu isOpen={userMenuOpen} onClose={() => setUserMenuOpen(false)}>
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <UserAvatar email={user?.email || ''} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 truncate">
                              {user?.email}
                            </p>
                            <RoleBadge role={user?.role || ''} />
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link
                          to={getDashboardLink()}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <DashboardIcon />
                          Dashboard
                        </Link>
                        <Link
                          to="/profile"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <UserIcon />
                          Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                        >
                          <SettingsIcon />
                          Settings
                        </Link>
                      </div>

                      {/* Logout */}
                      <div className="pt-2 border-t border-slate-100">
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogoutIcon />
                          Sign out
                        </button>
                      </div>
                    </DropdownMenu>
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    {mobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
                  </button>
                </>
              ) : (
                <>
                  {/* Auth Links - Desktop */}
                  <div className="hidden sm:flex items-center gap-3">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="group flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-all duration-200"
                    >
                      Get Started
                      <ArrowRightIcon />
                    </Link>
                  </div>

                  {/* Auth Links - Mobile */}
                  <div className="flex sm:hidden items-center gap-2">
                    <Link
                      to="/login"
                      className="px-3 py-2 text-sm font-medium text-slate-600"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      className="px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg"
                    >
                      Register
                    </Link>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ==================== MOBILE MENU ==================== */}
        {isAuthenticated && mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white animate-in slide-in-from-top duration-200">
            <div className="px-4 py-4 space-y-1">
              {/* User Info */}
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
                <UserAvatar email={user?.email || ''} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 truncate">
                    {user?.email}
                  </p>
                  <RoleBadge role={user?.role || ''} />
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
              <div className="pt-4 mt-4 border-t border-slate-200">
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <LogoutIcon />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ==================== MAIN CONTENT ==================== */}
      <main className="flex-1">
        {children}
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo & Copyright */}
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center text-white">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-sm text-slate-500">
                © {new Date().getFullYear()} HostelHub. All rights reserved.
              </span>
            </div>

            {/* Links */}
            <div className="flex items-center gap-6">
              <Link to="/about" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                About
              </Link>
              <Link to="/privacy" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Privacy
              </Link>
              <Link to="/terms" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Terms
              </Link>
              <Link to="/contact" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
                Contact
              </Link>
            </div>

            {/* Location Badge */}
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              Bahawalpur, Pakistan
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;