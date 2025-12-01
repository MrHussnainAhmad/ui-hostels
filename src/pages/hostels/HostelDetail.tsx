// src/pages/hostels/HostelDetail.tsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { hostelsApi, reservationsApi, chatApi } from '../../lib/api';
import { useAuthStore } from '../../store/authStore';
import { useSEO } from '../../hooks/useSEO';

// ==================== ICONS ====================
const MapPinIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const StarIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg className={`w-5 h-5 ${filled ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const HeartIcon = ({ filled = false }: { filled?: boolean }) => (
  <svg 
    className={`w-6 h-6 ${filled ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} 
    fill={filled ? 'currentColor' : 'none'} 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const ShareIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const ChatIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
);

const CalendarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const BookmarkIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const XMarkIcon = () => (
  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const UsersIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
  </svg>
);

const HomeIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const WifiIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
  </svg>
);

const BoltIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const DropletIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
  </svg>
);

const ThermometerIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const ShieldCheckIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const ClockIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-20 h-20 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const VerifiedIcon = () => (
  <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
  </svg>
);

const GridIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
  </svg>
);

// ==================== IMAGE GALLERY ====================
const ImageGallery: React.FC<{ images: string[]; hostelName: string }> = ({ images, hostelName }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showLightbox, setShowLightbox] = useState(false);

  if (!images || images.length === 0) {
    return (
      <div className="aspect-[16/9] lg:aspect-[21/9] bg-slate-100 rounded-2xl flex items-center justify-center">
        <BuildingIcon />
      </div>
    );
  }

  const next = () => setCurrentIndex((prev) => (prev + 1) % images.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  return (
    <>
      {/* Main Gallery */}
      <div className="grid grid-cols-4 gap-2 h-[400px] lg:h-[500px]">
        {/* Main Image */}
        <div 
          className="col-span-4 lg:col-span-2 lg:row-span-2 relative rounded-l-2xl overflow-hidden cursor-pointer group"
          onClick={() => setShowLightbox(true)}
        >
          <img
            src={images[0]}
            alt={hostelName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        </div>

        {/* Side Images */}
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
            
            {/* Show More Overlay */}
            {idx === 3 && images.length > 5 && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="text-center text-white">
                  <GridIcon />
                  <p className="font-semibold mt-1">+{images.length - 5} more</p>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Mobile Show All Button */}
        <button
          onClick={() => setShowLightbox(true)}
          className="lg:hidden absolute bottom-4 right-4 flex items-center gap-2 px-4 py-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg text-sm font-medium text-slate-700"
        >
          <GridIcon />
          Show all {images.length} photos
        </button>
      </div>

      {/* Lightbox */}
      {showLightbox && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">
          {/* Close Button */}
          <button
            onClick={() => setShowLightbox(false)}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <CloseIcon />
          </button>

          {/* Counter */}
          <div className="absolute top-4 left-4 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation */}
          <button
            onClick={prev}
            className="absolute left-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronLeftIcon />
          </button>
          <button
            onClick={next}
            className="absolute right-4 p-3 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <ChevronRightIcon />
          </button>

          {/* Image */}
          <img
            src={images[currentIndex]}
            alt={`${hostelName} - ${currentIndex + 1}`}
            className="max-w-full max-h-[85vh] object-contain"
          />

          {/* Thumbnails */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-16 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  currentIndex === idx ? 'border-white' : 'border-transparent opacity-50 hover:opacity-75'
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
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
  <div className={`flex items-center gap-3 p-3 rounded-xl ${
    available ? 'bg-emerald-50' : 'bg-slate-50'
  }`}>
    <div className={available ? 'text-emerald-600' : 'text-slate-400'}>
      {icon}
    </div>
    <span className={`text-sm font-medium ${available ? 'text-slate-700' : 'text-slate-400 line-through'}`}>
      {label}
    </span>
    {available ? <CheckIcon /> : <XMarkIcon />}
  </div>
);

// ==================== REVIEW CARD ====================
const ReviewCard: React.FC<{ review: any }> = ({ review }) => {
  const initial = review.user?.email?.charAt(0).toUpperCase() || 'U';
  
  return (
    <div className="p-5 bg-slate-50 rounded-xl">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0">
          {initial}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-medium text-slate-900">{review.user?.name || 'Anonymous'}</p>
              <p className="text-sm text-slate-500">
                {new Date(review.createdAt).toLocaleDateString('en-US', {
                  month: 'long',
                  year: 'numeric'
                })}
              </p>
            </div>
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < review.rating} />
              ))}
            </div>
          </div>
          <p className="text-slate-600 leading-relaxed">{review.comment}</p>
        </div>
      </div>
    </div>
  );
};

// ==================== SKELETON LOADER ====================
const DetailSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-[400px] lg:h-[500px] bg-slate-200 rounded-2xl mb-8" />
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="h-8 bg-slate-200 rounded w-2/3" />
        <div className="h-6 bg-slate-200 rounded w-1/3" />
        <div className="h-32 bg-slate-200 rounded-xl" />
      </div>
      <div className="h-96 bg-slate-200 rounded-2xl" />
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
  const { user, isAuthenticated } = useAuthStore();
  const navigate = useNavigate();

  useSEO({
    title: hostel ? `${hostel.hostelName} | HostelHub` : 'Loading... | HostelHub',
    description: hostel?.description || 'View hostel details on HostelHub',
  });

  useEffect(() => {
    loadHostel();
  }, [id]);

  const loadHostel = async () => {
    try {
      const response = await hostelsApi.getById(id!);
      setHostel(response.data.data);
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

    setReserving(true);
    try {
      await reservationsApi.create({ hostelId: id, message });
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
    navigate(`/hostels/${id}/book`);
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
    if (navigator.share) {
      await navigator.share({
        title: hostel.hostelName,
        text: `Check out ${hostel.hostelName} on HostelHub`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <DetailSkeleton />
        </div>
      </div>
    );
  }

  if (!hostel) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <BuildingIcon />
          <h2 className="text-2xl font-bold text-slate-900 mt-4 mb-2">Hostel Not Found</h2>
          <p className="text-slate-500 mb-6">The hostel you're looking for doesn't exist or has been removed.</p>
          <Link
            to="/hostels"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors"
          >
            <ChevronLeftIcon />
            Back to Hostels
          </Link>
        </div>
      </div>
    );
  }

  const getPrice = () => {
    if (hostel.hostelType === 'PRIVATE') return hostel.roomPrice;
    if (hostel.hostelType === 'SHARED') return hostel.pricePerHeadShared;
    return hostel.pricePerHeadFullRoom;
  };

  const getPriceLabel = () => {
    return hostel.hostelType === 'PRIVATE' ? '/room' : '/person';
  };

  const getTypeLabel = () => {
    switch (hostel.hostelType) {
      case 'SHARED': return 'Shared Room';
      case 'PRIVATE': return 'Private Room';
      case 'SHARED_FULLROOM': return 'Full Room Share';
      default: return hostel.hostelType;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
        {/* ==================== BREADCRUMB ==================== */}
        <nav className="flex items-center gap-2 text-sm mb-6">
          <Link to="/" className="text-slate-500 hover:text-slate-700 transition-colors">Home</Link>
          <span className="text-slate-400">/</span>
          <Link to="/hostels" className="text-slate-500 hover:text-slate-700 transition-colors">Hostels</Link>
          <span className="text-slate-400">/</span>
          <span className="text-slate-900 font-medium">{hostel.hostelName}</span>
        </nav>

        {/* ==================== IMAGE GALLERY ==================== */}
        <ImageGallery images={hostel.roomImages} hostelName={hostel.hostelName} />

        {/* ==================== MAIN CONTENT ==================== */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          {/* Left Column - Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900">
                      {hostel.hostelName}
                    </h1>
                    {hostel.isVerified && <VerifiedIcon />}
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <MapPinIcon />
                    <span>{hostel.city}, {hostel.address}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <HeartIcon filled={isWishlisted} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                  >
                    <ShareIcon />
                  </button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex flex-wrap items-center gap-4 mt-4">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 rounded-lg">
                  <StarIcon filled />
                  <span className="font-semibold text-slate-900">{hostel.averageRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-slate-500">({hostel.reviewCount || 0} reviews)</span>
                </div>
                <span className={`px-3 py-1.5 rounded-lg text-sm font-semibold ${
                  hostel.hostelFor === 'BOYS' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'bg-pink-100 text-pink-700'
                }`}>
                  {hostel.hostelFor === 'BOYS' ? '👨 Boys Only' : '👩 Girls Only'}
                </span>
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold">
                  {hostel.availableRooms} rooms available
                </span>
              </div>
            </div>

            {/* Description Divider */}
            <div className="h-px bg-slate-200" />

            {/* Key Details */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">About this hostel</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <HomeIcon />
                    <span className="text-sm">Room Type</span>
                  </div>
                  <p className="font-semibold text-slate-900">{getTypeLabel()}</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <UsersIcon />
                    <span className="text-sm">Persons/Room</span>
                  </div>
                  <p className="font-semibold text-slate-900">{hostel.personsInRoom} persons</p>
                </div>
                <div className="p-4 bg-white border border-slate-200 rounded-xl">
                  <div className="flex items-center gap-2 text-slate-500 mb-1">
                    <CalendarIcon />
                    <span className="text-sm">Total Rooms</span>
                  </div>
                  <p className="font-semibold text-slate-900">{hostel.totalRooms} rooms</p>
                </div>
              </div>
            </div>

            {/* Nearby Locations */}
            {hostel.nearbyLocations && hostel.nearbyLocations.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Nearby Locations</h2>
                <div className="flex flex-wrap gap-2">
                  {hostel.nearbyLocations.map((location: string, idx: number) => (
                    <span 
                      key={idx}
                      className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm"
                    >
                      <MapPinIcon />
                      {location}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            <div>
              <h2 className="text-xl font-semibold text-slate-900 mb-4">Facilities & Amenities</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <FacilityItem 
                  icon={<WifiIcon />} 
                  label="WiFi Available" 
                  available={hostel.facilities?.wifiEnabled} 
                />
                <FacilityItem 
                  icon={<BoltIcon />} 
                  label="Electricity Backup" 
                  available={hostel.facilities?.electricityBackup} 
                />
                <FacilityItem 
                  icon={<ThermometerIcon />} 
                  label="Hot/Cold Water" 
                  available={hostel.facilities?.hotColdWaterBath} 
                />
                <FacilityItem 
                  icon={<DropletIcon />} 
                  label="Drinking Water" 
                  available={hostel.facilities?.drinkingWater} 
                />
                {hostel.facilities?.customFacilities?.map((facility: string, idx: number) => (
                  <FacilityItem 
                    key={idx}
                    icon={<CheckIcon />} 
                    label={facility} 
                    available={true} 
                  />
                ))}
              </div>
            </div>

            {/* Rules */}
            {hostel.rules && (
              <div>
                <h2 className="text-xl font-semibold text-slate-900 mb-4">Hostel Rules</h2>
                <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <ShieldCheckIcon />
                    </div>
                    <div>
                      <h3 className="font-medium text-amber-800 mb-2">House Rules</h3>
                      <p className="text-amber-700 whitespace-pre-wrap leading-relaxed">
                        {hostel.rules}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Reviews */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-slate-900">
                  Reviews ({hostel.reviewCount || 0})
                </h2>
                {hostel.reviews?.length > 3 && (
                  <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors">
                    View all reviews
                  </button>
                )}
              </div>

              {!hostel.reviews || hostel.reviews.length === 0 ? (
                <div className="p-8 bg-slate-50 rounded-xl text-center">
                  <p className="text-slate-500">No reviews yet. Be the first to review!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {hostel.reviews.slice(0, 3).map((review: any) => (
                    <ReviewCard key={review.id} review={review} />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                {/* Price */}
                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-slate-900">
                      Rs. {getPrice()?.toLocaleString()}
                    </span>
                    <span className="text-slate-500">{getPriceLabel()}/month</span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">
                    {hostel.availableRooms} of {hostel.totalRooms} rooms available
                  </p>
                </div>

                {/* Actions */}
                {user?.role === 'STUDENT' && hostel.availableRooms > 0 && (
                  <div className="space-y-3">
                    <button
                      onClick={handleBook}
                      className="w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 active:scale-[0.98] transition-all"
                    >
                      Book Now
                    </button>
                    <button
                      onClick={() => setShowReserveModal(true)}
                      className="w-full py-3 px-4 bg-white text-slate-700 font-medium rounded-xl border border-slate-200 hover:bg-slate-50 hover:border-slate-300 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <BookmarkIcon />
                      Reserve for Later
                    </button>
                    <button
                      onClick={handleChat}
                      className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      <ChatIcon />
                      Chat with Manager
                    </button>
                  </div>
                )}

                {user?.role === 'STUDENT' && hostel.availableRooms === 0 && (
                  <div className="space-y-3">
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center">
                      <p className="text-red-700 font-medium">No Rooms Available</p>
                      <p className="text-sm text-red-600 mt-1">All rooms are currently occupied</p>
                    </div>
                    <button
                      onClick={handleChat}
                      className="w-full py-3 px-4 bg-emerald-600 text-white font-medium rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
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
                      className="block w-full py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 text-center transition-colors"
                    >
                      Sign in to Book
                    </Link>
                    <p className="text-sm text-slate-500 text-center">
                      New to HostelHub?{' '}
                      <Link to="/register" className="text-slate-900 font-medium hover:underline">
                        Create an account
                      </Link>
                    </p>
                  </div>
                )}

                {/* Divider */}
                <div className="h-px bg-slate-200 my-6" />

                {/* Manager Info */}
                <div>
                  <p className="text-sm text-slate-500 mb-3">Hosted by</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-slate-700 to-slate-900 rounded-full flex items-center justify-center text-white font-semibold">
                      {hostel.manager?.email?.charAt(0).toUpperCase() || 'M'}
                    </div>
                    <div>
                      <p className="font-medium text-slate-900">
                        {hostel.manager?.name || 'Hostel Manager'}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-slate-500">
                        <ClockIcon />
                        <span>Usually responds within 1 hour</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Report Link */}
              <p className="text-center mt-4">
                <button className="text-sm text-slate-500 hover:text-slate-700 underline transition-colors">
                  Report this listing
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== RESERVE MODAL ==================== */}
      {showReserveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-slate-900">Reserve Room</h3>
              <button
                onClick={() => setShowReserveModal(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <CloseIcon />
              </button>
            </div>
            
            <p className="text-slate-600 mb-4">
              Reserve a room at {hostel.hostelName}. The manager will contact you to confirm.
            </p>

            <div className="mb-4">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Message (Optional)
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent resize-none"
                placeholder="Any special requests or questions..."
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowReserveModal(false)}
                className="flex-1 py-3 px-4 bg-slate-100 text-slate-700 font-medium rounded-xl hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleReserve}
                disabled={reserving}
                className="flex-1 py-3 px-4 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
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
    </div>
  );
};

export default HostelDetail;