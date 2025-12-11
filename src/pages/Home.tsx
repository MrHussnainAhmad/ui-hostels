import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { useSEO } from '../hooks/useSEO';
import { hostelsApi } from '../lib/api';

// ==================== TYPES ====================
interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  hostel: {
    id: string;
    hostelName: string;
    city: string;
  };
  student: {
    id: string;
    fullName?: string; // <-- use fullName from StudentProfile
    user: {
      email: string;
    };
  };
}

// ==================== ICONS ====================
const BuildingIcon = () => (
  <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
    />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
    />
  </svg>
);

const WifiIcon = () => (
  <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0"
    />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
    />
  </svg>
);

const StarIcon = ({ filled = true }: { filled?: boolean }) => (
  <svg
    className={`w-5 h-5 ${filled ? 'text-amber-400' : 'text-gray-200'}`}
    fill="currentColor"
    viewBox="0 0 20 20"
  >
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const QuoteIcon = () => (
  <svg className="w-8 h-8 text-gray-100" fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

// ==================== REVIEW CARD COMPONENT ====================
const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
  const getInitials = () => {
    if (review.student?.fullName) {
      return review.student.fullName
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return review.student?.user?.email?.charAt(0).toUpperCase() || 'U';
  };

  const getDisplayName = () => {
    if (review.student?.fullName) {
      return review.student.fullName;
    }
    const email = review.student?.user?.email || 'Anonymous';
    return email.slice(0, 3) + '***';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <article className="relative p-6 bg-white border border-gray-100 rounded-lg hover:border-gray-200 hover:shadow-md transition-shadow">
      {/* Quote Icon */}
      <div className="absolute top-4 right-4">
        <QuoteIcon />
      </div>

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} filled={i < review.rating} />
        ))}
      </div>

      {/* Comment */}
      <blockquote className="text-gray-600 font-light leading-relaxed mb-6">
        “{review.comment}”
      </blockquote>

      {/* Footer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center text-white text-sm font-medium">
            {getInitials()}
          </div>
          <div>
            <p className="text-sm font-light text-gray-900">{getDisplayName()}</p>
            <p className="text-xs text-gray-500 font-light">{formatDate(review.createdAt)}</p>
          </div>
        </div>

        {/* Hostel Link */}
        <Link
          to={`/hostels/${review.hostel.id}`}
          className="text-xs text-gray-500 font-light hover:text-gray-900 transition-colors flex items-center gap-1 max-w-[140px] truncate"
          title={review.hostel.hostelName}
        >
          <BuildingIcon />
          <span className="truncate">{review.hostel.hostelName}</span>
        </Link>
      </div>
    </article>
  );
};

// ==================== REVIEWS SKELETON ====================
const ReviewsSkeleton = () => (
  <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="p-6 bg-white border border-gray-100 rounded-lg animate-pulse">
        <div className="flex gap-1 mb-4">
          {[...Array(5)].map((_, j) => (
            <div key={j} className="w-5 h-5 bg-gray-200 rounded" />
          ))}
        </div>
        <div className="space-y-2 mb-6">
          <div className="h-4 bg-gray-200 rounded w-full" />
          <div className="h-4 bg-gray-200 rounded w-5/6" />
          <div className="h-4 bg-gray-200 rounded w-4/6" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full" />
          <div className="space-y-1">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-3 bg-gray-200 rounded w-16" />
          </div>
        </div>
      </div>
    ))}
  </div>
);

// ==================== MAIN COMPONENT ====================
const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuthStore();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [reviewsError, setReviewsError] = useState<string | null>(null);

  const getDashboardRoute = () => {
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

  // Fetch random reviews on mount
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        setReviewsLoading(true);
        setReviewsError(null);
        const response = await hostelsApi.getRandomReviews(4);
        setReviews(response.data.data);
      } catch (error: any) {
        console.error('Error fetching reviews:', error);
        setReviewsError('Failed to load reviews');
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchReviews();
  }, []);

  // SEO Configuration
  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'LodgingBusiness',
    name: 'HostelHub Bahawalpur',
    description: 'Premium hostel accommodation and management services in Bahawalpur, Pakistan.',
    url: 'https://hostelhub.pk',
    telephone: '+92-300-1234567',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'University Road',
      addressLocality: 'Bahawalpur',
      addressRegion: 'Punjab',
      postalCode: '63100',
      addressCountry: 'PK',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: '29.3956',
      longitude: '71.6836',
    },
    priceRange: 'PKR 5,000 - PKR 25,000',
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      reviewCount: '520',
    },
  };

  // Apply SEO
  useSEO({
    title: 'HostelHub Bahawalpur | Best Hostel Accommodation & Management in Pakistan',
    description:
      'Find premium hostel accommodation in Bahawalpur, Pakistan. Safe, affordable hostels near Islamia University, QMC & medical colleges. Book your room today!',
    keywords:
      'hostel in Bahawalpur, student hostel Pakistan, boys hostel Bahawalpur, girls hostel Bahawalpur, hostel near IUB, hostel management system, affordable accommodation Bahawalpur',
    canonical: 'https://hostelhub.pk',
    ogTitle: 'HostelHub Bahawalpur | Premium Hostel Accommodation',
    ogDescription: 'Find safe & affordable hostel accommodation in Bahawalpur. Modern facilities, 24/7 security.',
    schema: schemaData,
  });

  const features = [
    {
      icon: <BuildingIcon />,
      title: 'Modern Facilities',
      description: 'Fully furnished rooms with AC, attached bathrooms and dedicated study areas.',
    },
    {
      icon: <ShieldIcon />,
      title: '24/7 Security',
      description: 'CCTV surveillance and on-site staff for a safe living environment.',
    },
    {
      icon: <WifiIcon />,
      title: 'High-Speed WiFi',
      description: 'Reliable internet connection for online classes and entertainment.',
    },
  ];

  const stats = [
    { value: '50+', label: 'Hostels Listed' },
    { value: '2,500+', label: 'Happy Residents' },
    { value: '4.8', label: 'Average Rating', hasStar: true },
    { value: '24/7', label: 'Support Available' },
  ];

  const areas = [
    'University Road',
    'Model Town A',
    'Model Town B',
    'Satellite Town',
    'Near IUB Campus',
    'Near QMC',
    'Chowk Bazaar',
    'Farid Gate',
    'Bindra Road',
    'Al Jadeed Colony',
  ];

  return (
    <main className="min-h-screen bg-white antialiased">
      {/* ==================== HERO SECTION ==================== */}
      <section className="border-b border-gray-100 bg-white">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="pt-16 pb-20 md:pt-20 md:pb-24">
            {/* Location Badge */}
            <div className="flex justify-center mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 border border-gray-200 bg-gray-50 text-gray-600 text-xs font-medium tracking-widest uppercase">
                <LocationIcon />
                <span>Serving Bahawalpur, Pakistan</span>
              </span>
            </div>

            {/* Main Content */}
            <div className="text-center">
              <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900 leading-tight mb-4">
                Find Your Perfect
                <span className="block mt-1 text-gray-900">Hostel Accommodation</span>
              </h1>

              <p className="mt-4 text-lg text-gray-500 font-light max-w-2xl mx-auto">
                Premium hostel management platform in Bahawalpur. Safe, modern, and affordable
                living spaces for students and professionals.
              </p>

              {/* CTA Buttons */}
              {!isAuthenticated ? (
                <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors"
                  >
                    Get Started Free
                    <ArrowRightIcon />
                  </Link>
                  <Link
                    to="/hostels"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 border border-gray-300 bg-white text-sm font-light text-gray-900 hover:bg-gray-50 transition-colors"
                  >
                    Browse Hostels
                  </Link>
                </div>
              ) : (
                <div className="mt-10">
                  <Link
                    to={getDashboardRoute()}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors"
                  >
                    Go to Dashboard
                    <ArrowRightIcon />
                  </Link>
                </div>
              )}

              {/* Trust Indicators */}
              <div className="mt-10 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 text-xs text-gray-500 font-light">
                {['Verified Hostels', 'Secure Booking', '24/7 Support'].map((item) => (
                  <div key={item} className="flex items-center gap-2">
                    <CheckIcon />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== MOBILE APP CTA SECTION ==================== */}
      <section className="py-16 md:py-20 border-b border-gray-100 bg-blue-50"> {/* Subtle blue background */}
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 border border-blue-100 bg-white p-8 md:p-12 rounded-lg shadow-lg"> {/* Added shadow for pop */}
            <div className="text-center md:text-left max-w-xl">
              <div className="text-xs font-medium tracking-widest uppercase text-blue-600 mb-3"> {/* Blue accent for text */}
                Mobile App
              </div>
              <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-4">
                HostelHub in Your Pocket
              </h2>
              <p className="text-gray-500 font-light text-lg mb-8">
                Download our mobile app for a seamless booking experience. Get instant notifications,
                manage your stay, and connect with the community on the go.
              </p>
              <Link
                to="/app"
                className="inline-flex items-center justify-center gap-3 px-8 py-3 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors w-full md:w-auto"
              >
                <img src="/vite.svg" alt="App Icon" className="w-5 h-5" />
                <span>Get the Mobile App</span>
                <ArrowRightIcon />
              </Link>
            </div>
            
            {/* Visual Icon/Graphic */}
            <div className="hidden md:flex items-center justify-center w-full md:w-auto">
               <div className="w-40 h-40 bg-white rounded-3xl flex items-center justify-center shadow-lg border border-gray-200"> {/* Enlarged and more prominent */}
                  <img src="/vite.svg" alt="Mobile App" className="w-24 h-24 opacity-80" /> {/* Enlarged */}
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS SECTION ==================== */}
      <section className="py-12 bg-gray-50 border-b border-gray-100">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-3xl md:text-4xl font-light text-gray-900">
                    {stat.value}
                  </span>
                  {stat.hasStar && <StarIcon />}
                </div>
                <p className="mt-2 text-sm text-gray-500 font-light">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="py-16 md:py-20" id="features">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">
              Why Choose Us
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
              Everything You Need for Comfortable Living
            </h2>
            <p className="text-gray-500 font-light">
              Modern amenities designed for students and working professionals in Bahawalpur.
            </p>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <article
                key={index}
                className="border border-gray-100 bg-white p-6 hover:border-gray-200 transition-colors"
              >
                <div className="w-10 h-10 border border-gray-200 bg-gray-50 flex items-center justify-center text-gray-500">
                  {feature.icon}
                </div>
                <h3 className="mt-5 text-lg font-light text-gray-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-gray-600 font-light">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== REVIEWS SECTION ==================== */}
      <section className="py-16 bg-gray-50 border-y border-gray-100" id="reviews">
        <div className="container mx-auto px-6 max-w-6xl">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-3">
              RealTime Feedback
            </div>
            <h2 className="text-3xl md:text-4xl font-light text-gray-900 mb-3">
              What Students Say About Hostels
            </h2>
            <p className="text-gray-500 font-light">
              Genuine reviews from students living in hostels across Bahawalpur.
            </p>
          </div>

          {/* Reviews Grid */}
          {reviewsLoading ? (
            <ReviewsSkeleton />
          ) : reviewsError ? (
            <div className="text-center py-10">
              <p className="text-gray-500 font-light">{reviewsError}</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 border border-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <StarIcon filled={false} />
              </div>
              <p className="text-gray-600 font-light text-lg">No reviews yet</p>
              <p className="text-gray-400 font-light text-sm mt-1">
                Be the first to review a hostel!
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          )}

          {/* View All Link */}
          {reviews.length > 0 && (
            <div className="text-center mt-10">
              <Link
                to="/hostels"
                className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 text-sm font-light transition-colors"
              >
                Explore all hostels
                <ArrowRightIcon />
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="bg-gray-900 text-white border border-gray-900 px-8 py-10 md:px-12 md:py-12">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-light mb-3">
                Ready to Find Your Ideal Hostel?
              </h2>
              <p className="text-sm md:text-base text-gray-300 font-light">
                Join thousands of students who found their perfect accommodation through
                HostelHub in Bahawalpur.
              </p>

              {!isAuthenticated && (
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3 bg-white text-gray-900 text-sm font-light hover:bg-gray-100 transition-colors"
                  >
                    Start Your Search
                    <ArrowRightIcon />
                  </Link>
                  <Link
                    to="/contact"
                    className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-white/40 text-sm font-light hover:bg-white/10 transition-colors"
                  >
                    Contact Us
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== AREAS SECTION (Local SEO) ==================== */}
      <section className="py-12 border-t border-gray-100 bg-white">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="text-center">
            <h2 className="text-lg md:text-xl font-light text-gray-900 mb-6">
              Serving Major Areas in Bahawalpur
            </h2>
            <div className="flex flex-wrap justify-center gap-2 md:gap-3">
              {areas.map((area, index) => (
                <span
                  key={index}
                  className="px-3 py-1 text-xs md:text-sm font-light border border-gray-200 bg-gray-50 text-gray-700"
                >
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;