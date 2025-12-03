// src/pages/hostels/HostelList.tsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { hostelsApi } from '../../lib/api';
import { useSEO } from '../../hooks/useSEO';

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

// ==================== ICONS ====================
const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const FilterIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg className={`w-4 h-4 ${filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg 
    className={`w-5 h-5 ${filled ? 'fill-red-500 text-red-500' : 'text-white'}`} 
    fill={filled ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const XIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-16 h-16 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// ==================== SKELETON LOADER ====================
const HostelCardSkeleton = () => (
  <div className="bg-white rounded-2xl overflow-hidden border border-slate-200 animate-pulse">
    <div className="h-52 bg-slate-200" />
    <div className="p-5">
      <div className="flex justify-between items-start mb-3">
        <div className="h-6 bg-slate-200 rounded w-2/3" />
        <div className="h-6 w-16 bg-slate-200 rounded-full" />
      </div>
      <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-6 w-20 bg-slate-200 rounded-lg" />
        <div className="h-6 w-20 bg-slate-200 rounded-lg" />
      </div>
      <div className="flex justify-between items-center pt-4 border-t border-slate-100">
        <div className="h-6 bg-slate-200 rounded w-24" />
        <div className="h-10 w-28 bg-slate-200 rounded-lg" />
      </div>
    </div>
  </div>
);

// ==================== FILTER CHIP ====================
const FilterChip: React.FC<{ 
  label: string; 
  onRemove: () => void;
}> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 text-sm font-medium rounded-full">
    {label}
    <button 
      onClick={onRemove}
      className="hover:bg-slate-200 rounded-full p-0.5 transition-colors"
    >
      <XIcon />
    </button>
  </span>
);

// ==================== HOSTEL CARD ====================
interface HostelCardProps {
  hostel: any;
  viewMode: 'grid' | 'list';
}

const HostelCard: React.FC<HostelCardProps> = ({ hostel, viewMode }) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Parse roomTypes from the hostel data
  const roomTypes: RoomTypeConfig[] = Array.isArray(hostel.roomTypes) ? hostel.roomTypes : [];

  // Calculate totals from roomTypes array
  const totalRooms = roomTypes.reduce((sum, rt) => sum + (rt.totalRooms || 0), 0);
  const availableRooms = roomTypes.reduce((sum, rt) => sum + (rt.availableRooms || 0), 0);

  // Get the lowest price for display
  const getLowestPrice = (): number => {
    if (roomTypes.length === 0) return 0;
    const prices = roomTypes.map(rt => rt.price || 0).filter(p => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  // Get price label based on room types
  const getPriceLabel = (): string => {
    if (roomTypes.length === 0) return '/month';
    // If all rooms are private, show /room, otherwise /person
    const allPrivate = roomTypes.every(rt => rt.type === 'PRIVATE');
    return allPrivate ? '/room' : '/person';
  };

  // Get room type display string
  const getRoomTypesDisplay = (): string => {
    if (roomTypes.length === 0) return 'N/A';
    return roomTypes.map(rt => ROOM_TYPE_LABELS[rt.type] || rt.type).join(', ');
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-300 flex">
        {/* Image */}
        <div className="relative w-72 h-52 flex-shrink-0">
          {hostel.roomImages?.[0] ? (
            <img
              src={hostel.roomImages[0]}
              alt={hostel.hostelName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-slate-100 flex items-center justify-center">
              <BuildingIcon />
            </div>
          )}
          
          {/* Wishlist Button */}
          <button
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white shadow-sm transition-all"
          >
            <HeartIcon filled={isWishlisted} />
          </button>

          {/* Type Badge */}
          <div className="absolute bottom-3 left-3">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              hostel.hostelFor === 'BOYS' 
                ? 'bg-blue-500 text-white' 
                : 'bg-pink-500 text-white'
            }`}>
              {hostel.hostelFor === 'BOYS' ? '👨 Boys' : '👩 Girls'}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-5 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors">
                    {hostel.hostelName}
                  </h3>
                  {hostel.isVerified && <VerifiedIcon />}
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 text-sm mt-1">
                  <MapPinIcon />
                  <span>{hostel.city}, {hostel.address}</span>
                </div>
              </div>
              
              {/* Rating */}
              <div className="flex items-center gap-1 bg-slate-50 px-2.5 py-1.5 rounded-lg">
                <StarIcon filled />
                <span className="font-semibold text-slate-900">{hostel.averageRating?.toFixed(1) || '0.0'}</span>
                <span className="text-slate-500 text-sm">({hostel.reviewCount || 0})</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
                <HomeIcon />
                {getRoomTypesDisplay()}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg">
                <UsersIcon />
                {availableRooms} rooms available
              </span>
            </div>

            {/* Amenities Preview */}
            {hostel.facilities?.customFacilities && hostel.facilities.customFacilities.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {hostel.facilities.customFacilities.slice(0, 4).map((amenity: string, i: number) => (
                  <span key={i} className="text-xs text-slate-500 bg-slate-50 px-2 py-1 rounded">
                    {amenity}
                  </span>
                ))}
                {hostel.facilities.customFacilities.length > 4 && (
                  <span className="text-xs text-slate-400">+{hostel.facilities.customFacilities.length - 4} more</span>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 mt-4 border-t border-slate-100">
            <div>
              <span className="text-2xl font-bold text-slate-900">
                Rs. {getLowestPrice().toLocaleString()}
              </span>
              <span className="text-slate-500 text-sm">{getPriceLabel()}/month</span>
            </div>
            <Link
              to={`/hostels/${hostel.id}`}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
            >
              View Details
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-slate-200 hover:border-slate-300 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        {hostel.roomImages?.[0] ? (
          <img
            src={hostel.roomImages[0]}
            alt={hostel.hostelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <BuildingIcon />
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        
        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-white hover:scale-110 shadow-sm transition-all"
        >
          <HeartIcon filled={isWishlisted} />
        </button>

        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
            hostel.hostelFor === 'BOYS' 
              ? 'bg-blue-500 text-white' 
              : 'bg-pink-500 text-white'
          }`}>
            {hostel.hostelFor === 'BOYS' ? '👨 Boys' : '👩 Girls'}
          </span>
        </div>

        {/* Price Tag */}
        <div className="absolute bottom-3 left-3">
          <div className="bg-white/95 backdrop-blur-sm px-3 py-1.5 rounded-lg shadow-sm">
            <span className="text-lg font-bold text-slate-900">
              Rs. {getLowestPrice().toLocaleString()}
            </span>
            <span className="text-slate-500 text-sm">{getPriceLabel()}</span>
          </div>
        </div>

        {/* Verified Badge */}
        {hostel.isVerified && (
          <div className="absolute bottom-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1">
            <VerifiedIcon />
            Verified
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-slate-700 transition-colors line-clamp-1">
            {hostel.hostelName}
          </h3>
          <div className="flex items-center gap-1 flex-shrink-0 ml-2">
            <StarIcon filled />
            <span className="font-semibold text-slate-900">{hostel.averageRating?.toFixed(1) || '0.0'}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-slate-500 text-sm mb-4">
          <MapPinIcon />
          <span className="line-clamp-1">{hostel.city}, {hostel.address}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-lg">
            <HomeIcon />
            {getRoomTypesDisplay()}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-medium rounded-lg">
            {availableRooms}/{totalRooms} rooms
          </span>
        </div>

        {/* Action */}
        <Link
          to={`/hostels/${hostel.id}`}
          className="flex items-center justify-center gap-2 w-full py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
        >
          View Details
          <ArrowRightIcon />
        </Link>
      </div>
    </div>
  );
};

// ==================== EMPTY STATE ====================
const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
      <BuildingIcon />
    </div>
    <h3 className="text-xl font-semibold text-slate-900 mb-2">No hostels found</h3>
    <p className="text-slate-500 max-w-md mx-auto mb-6">
      We couldn't find any hostels matching your criteria. Try adjusting your filters or search for a different location.
    </p>
    <button 
      onClick={() => window.location.reload()}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
    >
      Clear Filters
    </button>
  </div>
);

// ==================== MAIN COMPONENT ====================
const HostelList: React.FC = () => {
  const [hostels, setHostels] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    city: '',
    hostelFor: '',
    roomType: '',
    minPrice: '',
    maxPrice: '',
  });

  useSEO({
    title: 'Browse Hostels | HostelHub Bahawalpur',
    description: 'Find the best hostels in Bahawalpur. Browse verified hostels for boys and girls with genuine reviews and instant booking.',
    keywords: 'hostels Bahawalpur, student accommodation, boys hostel, girls hostel',
  });

  useEffect(() => {
    loadHostels();
  }, []);

  const loadHostels = async () => {
    try {
      const params: any = {};
      if (filters.city) params.city = filters.city;
      if (filters.hostelFor) params.hostelFor = filters.hostelFor;
      if (filters.roomType) params.roomType = filters.roomType;
      if (filters.minPrice) params.minPrice = Number(filters.minPrice);
      if (filters.maxPrice) params.maxPrice = Number(filters.maxPrice);

      const response = await hostelsApi.search(params);
      setHostels(response.data.data);
    } catch (error) {
      console.error('Error loading hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    loadHostels();
  };

  const clearFilter = (filterKey: string) => {
    setFilters(prev => ({ ...prev, [filterKey]: '' }));
  };

  const activeFilters = Object.entries(filters).filter(([_, value]) => value !== '');

  return (
    <div className="min-h-screen bg-slate-50">
      {/* ==================== HERO SECTION ==================== */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Find Your Perfect
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400"> Hostel</span>
            </h1>
            <p className="text-slate-400 text-lg mb-8">
              Browse through {hostels.length}+ verified hostels in Bahawalpur
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="bg-white rounded-2xl p-2 shadow-xl">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1 relative">
                  <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">
                    <MapPinIcon />
                  </div>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                    placeholder="Search by city or area..."
                    className="w-full pl-11 pr-4 py-3 text-slate-900 placeholder-slate-400 bg-slate-50 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center gap-2 px-4 py-3 text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors sm:w-auto"
                >
                  <FilterIcon />
                  <span>Filters</span>
                  {activeFilters.length > 0 && (
                    <span className="w-5 h-5 bg-slate-900 text-white text-xs rounded-full flex items-center justify-center">
                      {activeFilters.length}
                    </span>
                  )}
                </button>
                <button
                  type="submit"
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
                >
                  <SearchIcon />
                  <span>Search</span>
                </button>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
                      Hostel For
                    </label>
                    <select
                      value={filters.hostelFor}
                      onChange={(e) => setFilters({ ...filters, hostelFor: e.target.value })}
                      className="w-full px-4 py-2.5 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">All</option>
                      <option value="BOYS">Boys Only</option>
                      <option value="GIRLS">Girls Only</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
                      Room Type
                    </label>
                    <select
                      value={filters.roomType}
                      onChange={(e) => setFilters({ ...filters, roomType: e.target.value })}
                      className="w-full px-4 py-2.5 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    >
                      <option value="">All Types</option>
                      <option value="SHARED">Shared Room</option>
                      <option value="PRIVATE">Private Room</option>
                      <option value="SHARED_FULLROOM">Full Room Share</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
                      Min Price
                    </label>
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                      placeholder="Rs. 0"
                      className="w-full px-4 py-2.5 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5 text-left">
                      Max Price
                    </label>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                      placeholder="Rs. 50,000"
                      className="w-full px-4 py-2.5 text-slate-900 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900"
                    />
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* ==================== RESULTS SECTION ==================== */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              {loading ? 'Searching...' : `${hostels.length} Hostels Found`}
            </h2>
            {activeFilters.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activeFilters.map(([key, value]) => (
                  <FilterChip 
                    key={key} 
                    label={`${key}: ${value}`} 
                    onRemove={() => clearFilter(key)} 
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-900"
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400">
                <ChevronDownIcon />
              </div>
            </div>

            {/* View Toggle */}
            <div className="hidden sm:flex items-center bg-white border border-slate-200 rounded-xl p-1">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'grid' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <GridIcon />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-colors ${
                  viewMode === 'list' 
                    ? 'bg-slate-900 text-white' 
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ListIcon />
              </button>
            </div>
          </div>
        </div>

        {/* Results Grid/List */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {[...Array(6)].map((_, i) => (
              <HostelCardSkeleton key={i} />
            ))}
          </div>
        ) : hostels.length === 0 ? (
          <EmptyState />
        ) : (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {hostels.map((hostel) => (
              <HostelCard key={hostel.id} hostel={hostel} viewMode={viewMode} />
            ))}
          </div>
        )}

        {/* Load More */}
        {!loading && hostels.length > 0 && (
          <div className="text-center mt-10">
            <button className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition-all">
              Load More Hostels
              <ChevronDownIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelList;