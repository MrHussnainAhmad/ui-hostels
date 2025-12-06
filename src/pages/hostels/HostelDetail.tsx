import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { hostelsApi, reservationsApi, chatApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useSEO } from '../../hooks/useSEO';

// ==================== TYPES ====================
interface RoomTypeConfig {
  type: 'SHARED' | 'PRIVATE' | 'SHARED_FULLROOM';
  totalRooms: number;
  availableRooms: number;
  personsInRoom: number;
  price: number;
  fullRoomPriceDiscounted?: number | null;
  urgentBookingPrice?: number | null;
}

const ROOM_TYPE_LABELS: Record<string, string> = {
  SHARED: 'Shared Room',
  PRIVATE: 'Private Room',
  SHARED_FULLROOM: 'Full Room Share',
};

// ==================== ICONS ====================
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

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'fill-red-500 text-red-500' : 'text-gray-500'}`}
    fill={filled ? 'currentColor' : 'none'}
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const ChevronLeftIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
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

const WifiIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DropletIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

const ThermometerIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-4 h-4 text-amber-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockSmallIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-16 h-16 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

// ==================== HELPER FUNCTION ====================
const getOrdinalSuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

// ==================== IMAGE GALLERY ====================
const ImageGallery: React.FC<{ images: string[]; hostelName: string }> = ({
  images,
  hostelName,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] bg-gray-100 rounded-2xl flex items-center justify-center">
        <BuildingIcon />
      </div>
    );
  }

  const next = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      <div className="relative grid grid-cols-4 gap-2 h-[360px] lg:h-[440px]">
        <div
          className="col-span-4 lg:col-span-2 lg:row-span-2 relative rounded-2xl lg:rounded-l-2xl overflow-hidden cursor-pointer group"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={images[0]}
            alt={hostelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {images.slice(1, 5).map((img, idx) => (
          <div
            key={idx}
            className={`hidden lg:block relative overflow-hidden cursor-pointer group ${
              idx === 1 ? 'rounded-tr-2xl' : ''
            } ${idx === 3 ? 'rounded-br-2xl' : ''}`}
            onClick={() => {
              setCurrentIndex(idx + 1);
              setShowLightbox(true);
            }}
          >
            <img
              src={img}
              alt={`${hostelName} - ${idx + 2}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            {idx === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white text-xs">
                  <GridIcon />
                  <p className="font-medium mt-1">
                    +{images.length - 5} more
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Mobile "show all" */}
        <button
          type="button"
          onClick={() => setShowLightbox(true)}
          className="lg:hidden absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/95 border border-gray-200 rounded-lg shadow-sm text-xs font-light text-gray-700"
        >
          <GridIcon />
          Show all {images.length} photos
        </button>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          <button
            type="button"
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-xs">
            {currentIndex + 1} / {images.length}
          </div>
          <button
            type="button"
            onClick={prev}
            className="absolute left-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            onClick={next}
            className="absolute right-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRightIcon />
          </button>
          <img
            src={images[currentIndex]}
            alt={`${hostelName} - ${currentIndex + 1}`}
            className="max-w-full max-h-[80vh] object-contain"
          />
        </div>
      )}
    </>
  );
};

// ==================== FACILITY ITEM ====================
const FacilityItem: React.FC<{
  icon: React.ReactNode;
  label: string;
  available: boolean;
}> = ({ icon, label, available }) => (
  <div
    className={`flex items-center gap-3 p-3 rounded-lg border ${
      available
        ? 'border-emerald-100 bg-emerald-50'
        : 'border-gray-100 bg-gray-50'
    }`}
  >
    <div className={available ? 'text-emerald-600' : 'text-gray-400'}>
      {icon}
    </div>
    <span
      className={`text-sm font-light ${
        available ? 'text-gray-800' : 'text-gray-400 line-through'
      }`}
    >
      {label}
    </span>
    {available ? <CheckIcon /> : <XMarkIcon />}
  </div>
);

// ==================== ROOM TYPE CARD ====================
const RoomTypeCard: React.FC<{
  roomType: RoomTypeConfig;
  isSelected: boolean;
  onSelect: () => void;
  isAfter12th: boolean;
}> = ({ roomType, isSelected, onSelect, isAfter12th }) => {
  const priceLabel = roomType.type === 'PRIVATE' ? '/room' : '/person';

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`flex flex-col items-start gap-2 p-4 rounded-lg border-2 text-left transition-colors ${
        isSelected
          ? 'border-gray-900 bg-gray-50'
          : 'border-gray-200 bg-white hover:border-gray-300'
      }`}
      disabled={roomType.availableRooms === 0}
    >
      <div className="flex items-center justify-between w-full mb-1">
        <span
          className={`px-2 py-1 rounded text-xs font-medium ${
            roomType.type === 'PRIVATE'
              ? 'bg-purple-50 text-purple-700'
              : roomType.type === 'SHARED'
              ? 'bg-blue-50 text-blue-700'
              : 'bg-emerald-50 text-emerald-700'
          }`}
        >
          {ROOM_TYPE_LABELS[roomType.type]}
        </span>
        <span
          className={`w-4 h-4 rounded-full border flex items-center justify-center ${
            isSelected ? 'border-gray-900 bg-gray-900' : 'border-gray-300'
          }`}
        >
          {isSelected && (
            <span className="w-2 h-2 rounded-full bg-white" />
          )}
        </span>
      </div>

      <div className="flex items-baseline gap-1">
        <span className="text-xl font-light text-gray-900">
          Rs. {roomType.price.toLocaleString()}
        </span>
        <span className="text-xs text-gray-500">
          {priceLabel}/month
        </span>
      </div>

      {/* Urgent Booking Price */}
      {roomType.urgentBookingPrice && (
        <div className="mt-1">
          <div className="flex items-baseline gap-1">
            <span className="text-sm font-light text-orange-600">
              Rs. {roomType.urgentBookingPrice.toLocaleString()}
            </span>
            <span className="text-xs text-orange-500">
              urgent {priceLabel}
            </span>
          </div>
          <p className="text-[11px] text-orange-500 font-light mt-0.5">
            Must leave on 1st of next month
          </p>
        </div>
      )}

      {/* Booking Restriction Notice */}
      {isAfter12th && !roomType.urgentBookingPrice && (
        <div className="mt-1">
          <p className="text-[11px] text-red-500 font-light">
            After 12th: Only urgent booking available
          </p>
          <p className="text-[10px] text-gray-500 font-light">
            Regular booking available 1st-12th only
          </p>
        </div>
      )}

      <div className="flex items-center gap-4 text-xs text-gray-600 mt-1">
        <div className="flex items-center gap-1">
          <UsersIcon />
          <span>{roomType.personsInRoom} persons</span>
        </div>
        <div className="flex items-center gap-1">
          <HomeIcon />
          <span>
            {roomType.availableRooms}/{roomType.totalRooms} available
          </span>
        </div>
      </div>

      {roomType.type === 'SHARED_FULLROOM' &&
        roomType.fullRoomPriceDiscounted && (
          <p className="text-xs text-emerald-600 mt-1 font-light">
            Full room discount: Rs.{' '}
            {roomType.fullRoomPriceDiscounted.toLocaleString()}
          </p>
        )}

      {roomType.availableRooms === 0 && (
        <p className="text-xs text-red-500 mt-1 font-light">
          No rooms available
        </p>
      )}
    </button>
  );
};

// ==================== REVIEW CARD ====================
const ReviewCard: React.FC<{ review: any }> = ({ review }) => {
  const student = review.student;
  const user = review.user;

  const name: string =
    student?.fullName ||
    student?.name ||
    user?.name;

  const email: string | undefined =
    student?.user?.email || user?.email;

  const initial =
    (name && name.trim().charAt(0).toUpperCase()) ||
    (email && email.trim().charAt(0).toUpperCase()) ||
    'U';

  const formattedDate = new Date(review.createdAt).toLocaleDateString(
    'en-US',
    {
      month: 'long',
      year: 'numeric',
    }
  );

  return (
    <article className="p-4 border border-gray-100 bg-white rounded-lg">
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-medium">
          {initial}
        </div>
        <div className="flex-1">
          <div className="flex items-start justify-between mb-1.5">
            <div>
              <p className="text-sm font-light text-gray-900">
                {name}
              </p>
              <p className="text-xs text-gray-500">{formattedDate}</p>
            </div>
            <div className="flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <StarIcon key={i} filled={i < review.rating} />
              ))}
            </div>
          </div>
          <p className="text-sm text-gray-600 font-light">
            {review.comment}
          </p>
        </div>
      </div>
    </article>
  );
};

// ==================== SKELETON ====================
const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[360px] lg:h-[440px] bg-gray-100 rounded-2xl mb-8" />
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="h-6 bg-gray-100 rounded w-2/3" />
        <div className="h-5 bg-gray-100 rounded w-1/3" />
        <div className="h-24 bg-gray-100 rounded" />
      </div>
      <div className="h-80 bg-gray-100 rounded-2xl" />
    </div>
  </div>
);

// ==================== MAIN COMPONENT ====================
const HostelDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [hostel, setHostel] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [reserving, setReserving] = useState(false);
  const [message, setMessage] = useState('');
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showReserveModal, setShowReserveModal] = useState(false);
  const [selectedRoomType, setSelectedRoomType] = useState<string | null>(
    null
  );
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  // Check if today is after 12th
  const today = new Date();
  const dayOfMonth = today.getDate();
  const isAfter12th = dayOfMonth > 12;

  useSEO({
    title: hostel ? `${hostel.hostelName} | HostelHub` : 'Hostel Details | HostelHub',
    description: hostel?.description || 'View hostel details on HostelHub.',
  });

  useEffect(() => {
    loadHostel();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const loadHostel = async () => {
    try {
      const response = await hostelsApi.getById(id!);
      const data = response.data.data;
      setHostel(data);

      const roomTypes = data.roomTypes as RoomTypeConfig[];
      // If after 12th, prefer room types with urgent booking price
      let availableType = null;
      if (isAfter12th) {
        availableType = roomTypes.find(rt => 
          rt.availableRooms > 0 && rt.urgentBookingPrice
        );
      }
      // Fallback to any available room type
      if (!availableType) {
        availableType = roomTypes.find((rt) => rt.availableRooms > 0);
      }
      if (availableType) {
        setSelectedRoomType(availableType.type);
      }
    } catch (error) {
      console.error('Error loading hostel:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedRoomType) {
      alert('Please select a room type');
      return;
    }
    if (!id) {
      alert('Hostel ID not found');
      return;
    }
    setReserving(true);
    try {
      await reservationsApi.create({
        hostelId: id,
        roomType: selectedRoomType,
        message,
      });
      setShowReserveModal(false);
      navigate('/student');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to reserve');
    } finally {
      setReserving(false);
    }
  };

  const handleBook = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedRoomType) {
      alert('Please select a room type');
      return;
    }
    navigate(`/hostels/${id}/book?roomType=${selectedRoomType}`);
  };

  const handleChat = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!hostel?.manager?.id) {
      alert('Manager information is not available.');
      return;
    }
    try {
      await chatApi.startConversation({ managerId: hostel.manager.id });
      navigate('/student/chat');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to start chat');
    }
  };

  const handleShare = async () => {
    if (!hostel) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: hostel.hostelName,
          text: `Check out ${hostel.hostelName} on HostelHub`,
          url: window.location.href,
        });
      } catch {
        // ignore cancel
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-white py-8">
        <div className="max-w-6xl mx-auto px-6">
          <DetailSkeleton />
        </div>
      </main>
    );
  }

  if (!hostel) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center border border-gray-100 bg-white px-6 py-8 max-w-md w-full">
          <BuildingIcon />
          <h2 className="text-xl font-light text-gray-900 mt-4 mb-2">
            Hostel Not Found
          </h2>
          <p className="text-sm text-gray-500 font-light mb-4">
            The hostel you are looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            to="/hostels"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors"
          >
            <ChevronLeftIcon />
            Back to Hostels
          </Link>
        </div>
      </main>
    );
  }

  const roomTypes = hostel.roomTypes as RoomTypeConfig[];
  const selectedRoom = roomTypes.find(
    (rt) => rt.type === selectedRoomType
  );
  const totalAvailable = roomTypes.reduce(
    (sum, rt) => sum + rt.availableRooms,
    0
  );
  const hasAvailableRooms = totalAvailable > 0;

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
          <Link
            to="/"
            className="hover:text-gray-900 transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            to="/hostels"
            className="hover:text-gray-900 transition-colors"
          >
            Hostels
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-light">
            {hostel.hostelName}
          </span>
        </nav>

        {/* Gallery */}
        <ImageGallery
          images={hostel.roomImages}
          hostelName={hostel.hostelName}
        />

        {/* Booking Restriction Notice */}
        {isAfter12th && (
          <div className="mt-6 p-4 border border-orange-200 bg-orange-50 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertIcon />
              </div>
              <div>
                <h3 className="text-sm font-medium text-orange-800 mb-1">
                  Booking Date Restriction
                </h3>
                <p className="text-sm text-orange-700 font-light">
                  Today is {dayOfMonth}{getOrdinalSuffix(dayOfMonth)} of the month.
                  Only <span className="font-medium">urgent bookings</span> are allowed after the 12th.
                  Urgent bookings require leaving on the 1st of next month.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <section>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h1 className="text-2xl lg:text-3xl font-light text-gray-900">
                      {hostel.hostelName}
                    </h1>
                    {hostel.isVerified && <VerifiedIcon />}
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600 font-light">
                    <MapPinIcon />
                    <span>
                      {hostel.city}
                      {hostel.address && `, ${hostel.address}`}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2.5 border border-gray-200 bg-white rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <HeartIcon filled={isWishlisted} />
                  </button>
                  <button
                    type="button"
                    onClick={handleShare}
                    className="p-2.5 border border-gray-200 bg-white rounded-full hover:bg-gray-50 transition-colors"
                  >
                    <ShareIcon />
                  </button>
                </div>
              </div>

              {/* Quick stats */}
              <div className="flex flex-wrap items-center gap-3 mt-4 text-xs">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-800 rounded-full">
                  <StarIcon filled />
                  <span className="font-light">
                    {hostel.averageRating
                      ? hostel.averageRating.toFixed(1)
                      : '0.0'}
                  </span>
                  <span className="text-gray-500">
                    ({hostel.reviewCount || 0} reviews)
                  </span>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                    hostel.hostelFor === 'BOYS'
                      ? 'bg-blue-50 text-blue-700'
                      : 'bg-pink-50 text-pink-700'
                  }`}
                >
                  {hostel.hostelFor === 'BOYS'
                    ? 'Boys Hostel'
                    : 'Girls Hostel'}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700">
                  {totalAvailable} spots available
                </span>
              </div>
            </section>

            <div className="h-px bg-gray-100" />

            {/* Room types */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-light text-gray-900">
                  Available Room Types
                </h2>
                {isAfter12th && (
                  <span className="text-xs text-orange-600 font-medium bg-orange-50 px-2 py-1 rounded">
                    Urgent Booking Only
                  </span>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {roomTypes.map((rt) => (
                  <RoomTypeCard
                    key={rt.type}
                    roomType={rt}
                    isSelected={selectedRoomType === rt.type}
                    onSelect={() =>
                      rt.availableRooms > 0 &&
                      setSelectedRoomType(rt.type)
                    }
                    isAfter12th={isAfter12th}
                  />
                ))}
              </div>
            </section>

            {/* Nearby */}
            {hostel.nearbyLocations &&
              hostel.nearbyLocations.length > 0 && (
                <section>
                  <h2 className="text-lg font-light text-gray-900 mb-3">
                    Nearby Locations
                  </h2>
                  <div className="flex flex-wrap gap-2">
                    {hostel.nearbyLocations.map(
                      (loc: string, idx: number) => (
                        <span
                          key={idx}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 border border-gray-100 text-xs text-gray-700 rounded-full"
                        >
                          <MapPinIcon />
                          {loc}
                        </span>
                      )
                    )}
                  </div>
                </section>
              )}

            {/* Facilities */}
            <section>
              <h2 className="text-lg font-light text-gray-900 mb-3">
                Facilities & Amenities
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FacilityItem
                  icon={<WifiIcon />}
                  label="WiFi Available"
                  available={!!hostel.facilities?.wifiEnabled}
                />
                <FacilityItem
                  icon={<BoltIcon />}
                  label="Electricity Backup"
                  available={!!hostel.facilities?.electricityBackup}
                />
                <FacilityItem
                  icon={<ThermometerIcon />}
                  label="Hot / Cold Water"
                  available={!!hostel.facilities?.hotColdWaterBath}
                />
                <FacilityItem
                  icon={<DropletIcon />}
                  label="Drinking Water"
                  available={!!hostel.facilities?.drinkingWater}
                />
                {hostel.facilities?.customFacilities?.map(
                  (facility: string, idx: number) => (
                    <FacilityItem
                      key={idx}
                      icon={<CheckIcon />}
                      label={facility}
                      available
                    />
                  )
                )}
              </div>
            </section>

            {/* Rules */}
            {hostel.rules && (
              <section>
                <h2 className="text-lg font-light text-gray-900 mb-3">
                  Hostel Rules
                </h2>
                <div className="border border-amber-200 bg-amber-50 px-4 py-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-amber-100 rounded-md flex items-center justify-center">
                      <ShieldCheckIcon />
                    </div>
                    <div>
                      <p className="text-sm text-amber-800 font-light whitespace-pre-wrap leading-relaxed">
                        {hostel.rules}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            {/* Reviews */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-light text-gray-900">
                  Reviews ({hostel.reviewCount || 0})
                </h2>
                {hostel.reviews?.length > 3 && (
                  <button className="text-xs text-gray-500 font-light hover:text-gray-900 transition-colors">
                    View all reviews
                  </button>
                )}
              </div>
              {!hostel.reviews || hostel.reviews.length === 0 ? (
                <div className="border border-gray-100 bg-gray-50 px-6 py-8 text-center rounded-lg">
                  <p className="text-sm text-gray-500 font-light">
                    No reviews yet. Be the first to review.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {hostel.reviews
                    .slice(0, 3)
                    .map((review: any) => (
                      <ReviewCard
                        key={review.id}
                        review={review}
                      />
                    ))}
                </div>
              )}
            </section>
          </div>

          {/* Right column: booking card */}
          <aside className="lg:col-span-1">
            <div className="border border-gray-100 bg-white rounded-2xl p-6 sticky top-6">
              {selectedRoom ? (
                <div className="mb-5">
                  <p className="text-xs text-gray-500 font-light mb-1">
                    Selected:{' '}
                    {ROOM_TYPE_LABELS[selectedRoom.type]}
                  </p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-light text-gray-900">
                      Rs. {selectedRoom.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-gray-500">
                      {selectedRoom.type === 'PRIVATE'
                        ? '/room'
                        : '/person'}
                      /month
                    </span>
                  </div>
                  
                  {/* Show urgent booking price if available */}
                  {selectedRoom.urgentBookingPrice && (
                    <div className="mt-2">
                      <p className="text-xs text-orange-600 font-light mb-0.5">
                        Urgent Booking:
                      </p>
                      <div className="flex items-baseline gap-1">
                        <span className="text-lg font-light text-orange-600">
                          Rs. {selectedRoom.urgentBookingPrice.toLocaleString()}
                        </span>
                        <span className="text-xs text-orange-500">
                          {selectedRoom.type === 'PRIVATE'
                            ? '/room'
                            : '/person'}
                        </span>
                      </div>
                      {isAfter12th && (
                        <p className="text-[11px] text-orange-500 font-light mt-0.5">
                          Required after 12th
                        </p>
                      )}
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500 font-light mt-2">
                    {selectedRoom.availableRooms} of{' '}
                    {selectedRoom.totalRooms} rooms available
                  </p>
                </div>
              ) : (
                <div className="mb-5">
                  <p className="text-sm text-gray-600 font-light">
                    Select a room type to see pricing.
                  </p>
                </div>
              )}

              {user?.role === 'STUDENT' && hasAvailableRooms && (
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleBook}
                    disabled={!selectedRoomType}
                    className="w-full py-2.5 bg-gray-900 text-white text-sm font-light rounded-xl hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isAfter12th ? 'Book Urgent' : 'Book Now'}
                  </button>
                  
                  {/* Notice for urgent booking requirement */}
                  {isAfter12th && (
                    <div className="p-3 border border-orange-200 bg-orange-50 rounded-lg">
                      <p className="text-xs text-orange-700 font-light">
                        <span className="font-medium">Note:</span> After 12th, only urgent bookings are allowed.
                        You must leave on 1st of next month and rebook.
                      </p>
                    </div>
                  )}
                  
                  <button
                    type="button"
                    onClick={() => setShowReserveModal(true)}
                    disabled={!selectedRoomType}
                    className="w-full py-2.5 border border-gray-200 bg-white text-sm font-light text-gray-900 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <BookmarkIcon />
                    Reserve for Later
                  </button>
                  <button
                    type="button"
                    onClick={handleChat}
                    className="w-full py-2.5 bg-emerald-600 text-white text-sm font-light rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ChatIcon />
                    Chat with Manager
                  </button>
                </div>
              )}

              {user?.role === 'STUDENT' && !hasAvailableRooms && (
                <div className="space-y-3">
                  <div className="p-4 border border-red-200 bg-red-50 rounded-xl text-center">
                    <p className="text-sm text-red-700 font-light">
                      No rooms available
                    </p>
                    <p className="text-xs text-red-600 font-light mt-1">
                      All rooms are currently occupied.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleChat}
                    className="w-full py-2.5 bg-emerald-600 text-white text-sm font-light rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <ChatIcon />
                    Contact Manager
                  </button>
                </div>
              )}

              {!isAuthenticated && (
                <div className="space-y-3">
                  <Link
                    to="/login"
                    className="block w-full text-center py-2.5 bg-gray-900 text-white text-sm font-light rounded-xl hover:bg-gray-800 transition-colors"
                  >
                    Sign in to Book
                  </Link>
                  <p className="text-xs text-gray-500 font-light text-center">
                    New to HostelHub?{' '}
                    <Link
                      to="/register"
                      className="text-gray-900 hover:underline"
                    >
                      Create an account
                    </Link>
                  </p>
                </div>
              )}

              <div className="h-px bg-gray-100 my-5" />

              {/* Manager info */}
              <div>
                <p className="text-xs text-gray-500 font-light mb-3">
                  Hosted by
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-medium">
                    {hostel.manager?.email
                      ?.charAt(0)
                      .toUpperCase() || 'M'}
                  </div>
                  <div>
                    <p className="text-sm text-gray-900 font-light">
                      {hostel.manager?.name || 'Hostel Manager'}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-gray-500 font-light mt-0.5">
                      <ClockSmallIcon />
                      <span>Usually responds within 1 hour</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <p className="text-center mt-4">
              <button
                type="button"
                className="text-xs text-gray-400 hover:text-gray-700 underline font-light"
              >
                Report this listing
              </button>
            </p>
          </aside>
        </div>
      </div>

      {/* Reserve Modal */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="bg-white border border-gray-200 rounded-2xl w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-light text-gray-900">
                Reserve Room
              </h3>
              <button
                type="button"
                onClick={() => setShowReserveModal(false)}
                className="p-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            <p className="text-sm text-gray-600 font-light mb-4">
              Reserve a{' '}
              <span className="font-normal">
                {selectedRoomType &&
                  ROOM_TYPE_LABELS[
                    selectedRoomType as keyof typeof ROOM_TYPE_LABELS
                  ]}
              </span>{' '}
              at {hostel.hostelName}. The manager will contact you to
              confirm.
            </p>
            <div className="mb-4">
              <label className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                Message (Optional)
              </label>
              <textarea
                rows={3}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-sm text-gray-900 placeholder-gray-400 rounded-lg focus:outline-none focus:border-gray-900 font-light resize-none"
                placeholder="Any special requests or questions for the manager..."
              />
            </div>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowReserveModal(false)}
                className="flex-1 py-2.5 border border-gray-200 text-sm font-light text-gray-900 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleReserve}
                disabled={reserving}
                className="flex-1 py-2.5 bg-gray-900 text-white text-sm font-light rounded-lg hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {reserving ? (
                  <>
                    <SpinnerIcon />
                    Reserving...
                  </>
                ) : (
                  'Confirm Reservation'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default HostelDetail;