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
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const MapPinIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const ListIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    className={`w-4 h-4 ${filled ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
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
  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-3.5 h-3.5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

// ==================== SKELETON ====================
const HostelCardSkeleton = () => (
  <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden animate-pulse">
    <div className="h-44 bg-gray-100" />
    <div className="p-5 space-y-3">
      <div className="h-5 bg-gray-100 rounded w-2/3" />
      <div className="h-4 bg-gray-100 rounded w-1/3" />
      <div className="h-4 bg-gray-100 rounded w-1/2" />
      <div className="flex justify-between items-center pt-3 border-t border-gray-100">
        <div className="h-5 bg-gray-100 rounded w-20" />
        <div className="h-8 bg-gray-100 rounded w-24" />
      </div>
    </div>
  </div>
);

// ==================== FILTER CHIP ====================
const FilterChip: React.FC<{
  label: string;
  onRemove: () => void;
}> = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-light rounded-full">
    {label}
    <button
      type="button"
      onClick={onRemove}
      className="hover:bg-gray-200 rounded-full p-0.5 transition-colors"
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

  const roomTypes: RoomTypeConfig[] = Array.isArray(hostel.roomTypes)
    ? hostel.roomTypes
    : [];

  const totalRooms = roomTypes.reduce(
    (sum, rt) => sum + (rt.totalRooms || 0),
    0
  );
  const availableRooms = roomTypes.reduce(
    (sum, rt) => sum + (rt.availableRooms || 0),
    0
  );

  const getLowestPrice = (): number => {
    if (roomTypes.length === 0) return 0;
    const prices = roomTypes
      .map((rt) => rt.price || 0)
      .filter((p) => p > 0);
    return prices.length > 0 ? Math.min(...prices) : 0;
  };

  const getPriceLabel = (): string =>
    roomTypes.length > 0 &&
    roomTypes.every((rt) => rt.type === 'PRIVATE')
      ? '/room'
      : '/person';

  const getRoomTypesDisplay = (): string => {
    if (roomTypes.length === 0) return 'N/A';
    return roomTypes
      .map((rt) => ROOM_TYPE_LABELS[rt.type] || rt.type)
      .join(', ');
  };

  // List view
  if (viewMode === 'list') {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden flex hover:border-gray-200 hover:shadow-sm transition-all">
        <div className="relative w-64 h-44 flex-shrink-0">
          {hostel.roomImages?.[0] ? (
            <img
              src={hostel.roomImages[0]}
              alt={hostel.hostelName}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
              <BuildingIcon />
            </div>
          )}
          <button
            type="button"
            onClick={() => setIsWishlisted(!isWishlisted)}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <HeartIcon filled={isWishlisted} />
          </button>
          <div className="absolute bottom-3 left-3">
            <span
              className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${
                hostel.hostelFor === 'BOYS'
                  ? 'bg-blue-500'
                  : 'bg-pink-500'
              }`}
            >
              {hostel.hostelFor === 'BOYS' ? 'Boys Hostel' : 'Girls Hostel'}
            </span>
          </div>
        </div>

        <div className="flex-1 p-5 flex flex-col">
          <div className="flex-1">
            <div className="flex items-start justify-between gap-2 mb-2">
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-base font-light text-gray-900 line-clamp-1">
                    {hostel.hostelName}
                  </h3>
                  {hostel.isVerified && <VerifiedIcon />}
                </div>
                <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                  <MapPinIcon />
                  <span className="line-clamp-1">
                    {hostel.city}
                    {hostel.address && `, ${hostel.address}`}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs bg-gray-50 px-2 py-1 rounded">
                <StarIcon filled />
                <span className="font-light text-gray-900">
                  {hostel.averageRating
                    ? hostel.averageRating.toFixed(1)
                    : '0.0'}
                </span>
                <span className="text-gray-500">
                  ({hostel.reviewCount || 0})
                </span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-3">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-light rounded">
                <HomeIcon />
                {getRoomTypesDisplay()}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-light rounded">
                <UsersIcon />
                {availableRooms} available
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 mt-4 border-t border-gray-100">
            <div>
              <p className="text-xs text-gray-500 font-light mb-0.5">
                From
              </p>
              <span className="text-xl font-light text-gray-900">
                Rs. {getLowestPrice().toLocaleString()}
              </span>
              <span className="text-xs text-gray-500 ml-1">
                {getPriceLabel()}/month
              </span>
            </div>
            <Link
              to={`/hostels/${hostel.id}`}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-xs font-light rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Details
              <ArrowRightIcon />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid view
  return (
    <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden hover:border-gray-200 hover:shadow-sm transition-all">
      <div className="relative h-44">
        {hostel.roomImages?.[0] ? (
          <img
            src={hostel.roomImages[0]}
            alt={hostel.hostelName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gray-100 flex items-center justify-center">
            <BuildingIcon />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
        <button
          type="button"
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
        >
          <HeartIcon filled={isWishlisted} />
        </button>
        <div className="absolute top-3 left-3">
          <span
            className={`px-2.5 py-1 rounded-full text-xs font-medium text-white ${
              hostel.hostelFor === 'BOYS'
                ? 'bg-blue-500'
                : 'bg-pink-500'
            }`}
          >
            {hostel.hostelFor === 'BOYS' ? 'Boys' : 'Girls'}
          </span>
        </div>
        {hostel.isVerified && (
          <div className="absolute bottom-3 right-3 bg-emerald-500 text-white px-2 py-1 rounded text-[11px] font-medium flex items-center gap-1">
            <VerifiedIcon />
            Verified
          </div>
        )}
      </div>

      <div className="p-5 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-light text-gray-900 line-clamp-1">
            {hostel.hostelName}
          </h3>
          <div className="flex items-center gap-1 text-xs">
            <StarIcon filled />
            <span className="font-light text-gray-900">
              {hostel.averageRating
                ? hostel.averageRating.toFixed(1)
                : '0.0'}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MapPinIcon />
          <span className="line-clamp-1">
            {hostel.city}
            {hostel.address && `, ${hostel.address}`}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-gray-50 text-gray-700 text-xs font-light rounded">
            <HomeIcon />
            {getRoomTypesDisplay()}
          </span>
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 text-xs font-light rounded">
            {availableRooms}/{totalRooms} rooms
          </span>
        </div>

        <div className="flex items-center justify-between pt-2">
          <div>
            <p className="text-[11px] text-gray-500 font-light mb-0.5">
              From
            </p>
            <span className="text-lg font-light text-gray-900">
              Rs. {getLowestPrice().toLocaleString()}
            </span>
            <span className="text-[11px] text-gray-500 ml-1">
              {getPriceLabel()}/month
            </span>
          </div>
          <Link
            to={`/hostels/${hostel.id}`}
            className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-900 text-white text-xs font-light rounded-lg hover:bg-gray-800 transition-colors"
          >
            View
            <ArrowRightIcon />
          </Link>
        </div>
      </div>
    </div>
  );
};

// ==================== EMPTY STATE ====================
const EmptyState = () => (
  <div className="text-center py-16">
    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-5">
      <BuildingIcon />
    </div>
    <h3 className="text-lg font-light text-gray-900 mb-2">
      No hostels found
    </h3>
    <p className="text-sm text-gray-500 font-light max-w-md mx-auto mb-5">
      We couldn&apos;t find any hostels matching your criteria. Try adjusting
      your filters or search for a different location.
    </p>
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-xs font-light rounded-lg hover:bg-gray-800 transition-colors"
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
    description:
      'Find the best hostels in Bahawalpur. Browse verified hostels for boys and girls with genuine reviews and instant booking.',
    keywords:
      'hostels Bahawalpur, student accommodation, boys hostel, girls hostel',
  });

  useEffect(() => {
    loadHostels();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      let data = response.data.data as any[];

      if (sortBy === 'price-low') {
        data = [...data].sort((a, b) => {
          const aPrice = a.roomTypes?.[0]?.price || 0;
          const bPrice = b.roomTypes?.[0]?.price || 0;
          return aPrice - bPrice;
        });
      } else if (sortBy === 'price-high') {
        data = [...data].sort((a, b) => {
          const aPrice = a.roomTypes?.[0]?.price || 0;
          const bPrice = b.roomTypes?.[0]?.price || 0;
          return bPrice - aPrice;
        });
      } else if (sortBy === 'rating') {
        data = [...data].sort(
          (a, b) => (b.averageRating || 0) - (a.averageRating || 0)
        );
      }

      setHostels(data);
    } catch (error) {
      console.error('Error loading hostels:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    loadHostels();
  };

  const clearFilter = (filterKey: string) => {
    setFilters((prev) => ({ ...prev, [filterKey]: '' }));
  };

  const activeFilters = Object.entries(filters).filter(
    ([, value]) => value !== ''
  );

  const filterLabels: Record<string, string> = {
    city: 'City',
    hostelFor: 'For',
    roomType: 'Room',
    minPrice: 'Min',
    maxPrice: 'Max',
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Page Title */}
        <header className="mb-8">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Browse Hostels
          </div>
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-1">
            Find your next accommodation
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Explore verified hostels in Bahawalpur for students.
          </p>
        </header>

        <div className="grid lg:grid-cols-[260px,1fr] gap-8">
          {/* Sidebar: Search & Filters */}
          <aside className="border border-gray-100 bg-white p-4 sm:p-5">
            <form onSubmit={handleSearch} className="space-y-4">
              {/* City search */}
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  City / Area
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                    <MapPinIcon />
                  </div>
                  <input
                    type="text"
                    value={filters.city}
                    onChange={(e) =>
                      setFilters({ ...filters, city: e.target.value })
                    }
                    placeholder="e.g. Bahawalpur, University Road"
                    className="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
              </div>

              {/* Hostel For */}
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Hostel For
                </label>
                <select
                  value={filters.hostelFor}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      hostelFor: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                >
                  <option value="">Any</option>
                  <option value="BOYS">Boys Only</option>
                  <option value="GIRLS">Girls Only</option>
                </select>
              </div>

              {/* Room Type */}
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Room Type
                </label>
                <select
                  value={filters.roomType}
                  onChange={(e) =>
                    setFilters({
                      ...filters,
                      roomType: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                >
                  <option value="">Any</option>
                  <option value="SHARED">Shared Room</option>
                  <option value="PRIVATE">Private Room</option>
                  <option value="SHARED_FULLROOM">Full Room Share</option>
                </select>
              </div>

              {/* Price Range */}
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Price Range (per month)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        minPrice: e.target.value,
                      })
                    }
                    placeholder="Min"
                    className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                  />
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        maxPrice: e.target.value,
                      })
                    }
                    placeholder="Max"
                    className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
              </div>

              {/* Apply & Clear */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-gray-900 text-white text-xs font-light hover:bg-gray-800 transition-colors"
                >
                  <SearchIcon />
                  Apply Filters
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({
                      city: '',
                      hostelFor: '',
                      roomType: '',
                      minPrice: '',
                      maxPrice: '',
                    });
                    setLoading(true);
                    loadHostels();
                  }}
                  className="px-3 py-2.5 border border-gray-200 text-xs text-gray-700 font-light hover:bg-gray-50 transition-colors"
                >
                  Clear
                </button>
              </div>

              {/* Active filters */}
              {activeFilters.length > 0 && (
                <div className="pt-3 border-t border-gray-100 space-y-2">
                  <div className="text-[11px] text-gray-500 font-light">
                    Active filters
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeFilters.map(([key, value]) => (
                      <FilterChip
                        key={key}
                        label={`${filterLabels[key] || key}: ${value}`}
                        onRemove={() => clearFilter(key)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </form>
          </aside>

          {/* Results */}
          <section>
            {/* Top bar: count, sort, view toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <div>
                <h2 className="text-sm sm:text-base font-light text-gray-900">
                  {loading
                    ? 'Searching hostels...'
                    : `${hostels.length} hostels found`}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => {
                      setSortBy(e.target.value);
                      setLoading(true);
                      loadHostels();
                    }}
                    className="pl-3 pr-8 py-2 bg-white border border-gray-200 text-xs sm:text-sm font-light text-gray-700 rounded-lg focus:outline-none focus:border-gray-900"
                  >
                    <option value="newest">Newest First</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                  <div className="absolute inset-y-0 right-2 flex items-center pointer-events-none">
                    <ChevronDownIcon />
                  </div>
                </div>
                <div className="hidden sm:flex items-center border border-gray-200 rounded-lg p-0.5">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1.5 rounded-md ${
                      viewMode === 'grid'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <GridIcon />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1.5 rounded-md ${
                      viewMode === 'list'
                        ? 'bg-gray-900 text-white'
                        : 'text-gray-500 hover:text-gray-900'
                    }`}
                  >
                    <ListIcon />
                  </button>
                </div>
              </div>
            </div>

            {loading ? (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {Array.from({ length: 4 }).map((_, i) => (
                  <HostelCardSkeleton key={i} />
                ))}
              </div>
            ) : hostels.length === 0 ? (
              <EmptyState />
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === 'grid'
                    ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-2'
                    : 'grid-cols-1'
                }`}
              >
                {hostels.map((hostel) => (
                  <HostelCard
                    key={hostel.id}
                    hostel={hostel}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default HostelList;