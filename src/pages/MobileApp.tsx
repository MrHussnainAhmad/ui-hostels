import React, { useState, useCallback, memo, useEffect, useRef } from "react";
import { useSEO } from "../hooks/useSEO";

// Image imports
import loginEn from "/app/En.jpeg";
import loginPe from "/app/Pe.jpeg";
import loginUr from "/app/ur.jpeg";
import StudentDash from "/app/StDash.jpeg";
import StudentBooking from "/app/StBooking.jpeg";
import StudentHostelDetail from "/app/StHostelDetail.jpeg";
import ManagerDash from "/app/MnDash.jpeg";
import ManagerHostels from "/app/MnHostels.jpeg";
import ManagerCreateHostels from "/app/MnCreateHostel.jpeg";

// ==================== DATA ====================
const SCREEN_SETS: [string, string, string][] = [
  [loginPe, loginUr, loginEn],
  [StudentDash, StudentHostelDetail, StudentBooking],
  [ManagerDash, ManagerHostels, ManagerCreateHostels],
];

let Year = new Date().getFullYear();

const FEATURES = [
  {
    title: "Instant Booking",
    description: "Reserve your perfect hostel in seconds with our streamlined booking flow",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
      </svg>
    ),
  },
  {
    title: "Verified Listings",
    description: "Every hostel is personally verified with real photos and honest reviews",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
      </svg>
    ),
  },
  {
    title: "Secure Payments",
    description: "Bank-level encryption protects every transaction you make",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
  },
  {
    title: "24/7 Support",
    description: "Our dedicated team is always ready to assist you anytime",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
      </svg>
    ),
  },
];

const STATS = [
  { value: "500+", label: "Verified Hostels", suffix: "" },
  { value: "10K+", label: "Happy Students", suffix: "" },
  { value: "15+", label: "Cities", suffix: "" },
  { value: "4.8", label: "App Rating", suffix: "★" },
];

// ==================== PHONE MOCKUP ====================
const PhoneMockup = memo<{ src: string; position: "left" | "center" | "right" }>(({ src, position }) => {
  const config = {
    left: {
      transform: "translateX(-55%) rotateY(18deg) rotateZ(2deg)",
      zIndex: 10,
      opacity: 0.9,
      scale: "scale-90",
    },
    center: {
      transform: "translateZ(60px)",
      zIndex: 30,
      opacity: 1,
      scale: "scale-100",
    },
    right: {
      transform: "translateX(55%) rotateY(-18deg) rotateZ(-2deg)",
      zIndex: 10,
      opacity: 0.9,
      scale: "scale-90",
    },
  };

  const { transform, zIndex, opacity, scale } = config[position];

  return (
    <div
      className={`absolute ${scale} transition-all duration-500 ease-out`}
      style={{ transform, zIndex, opacity }}
    >
      {/* Phone Frame */}
      <div className="relative">
        {/* Glow Effect */}
        <div className="absolute -inset-4 bg-gradient-to-b from-violet-500/20 via-transparent to-cyan-500/20 rounded-[3.5rem] blur-2xl opacity-60" />

        {/* Device */}
        <div className="relative w-[240px] h-[490px] bg-gradient-to-b from-gray-800 via-gray-900 to-black rounded-[3rem] p-[3px] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5),0_30px_60px_-30px_rgba(0,0,0,0.6)]">
          {/* Inner bezel */}
          <div className="w-full h-full bg-black rounded-[2.8rem] p-[2px] overflow-hidden">
            {/* Screen */}
            <div className="relative w-full h-full rounded-[2.6rem] overflow-hidden bg-gray-900">
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-[90px] h-[28px] bg-black rounded-full z-20 flex items-center justify-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gray-800" />
                <div className="w-3 h-3 rounded-full bg-gray-800 ring-1 ring-gray-700" />
              </div>

              {/* Screen Content */}
              <img
                src={src}
                alt="HostelHub App Screen"
                loading="lazy"
                className="w-full h-full object-cover"
              />

              {/* Screen Reflection */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-white/10 pointer-events-none" />
            </div>
          </div>

          {/* Side Buttons */}
          <div className="absolute -right-[2px] top-28 w-[3px] h-12 bg-gray-700 rounded-l-sm" />
          <div className="absolute -right-[2px] top-44 w-[3px] h-12 bg-gray-700 rounded-l-sm" />
          <div className="absolute -left-[2px] top-32 w-[3px] h-16 bg-gray-700 rounded-r-sm" />
        </div>
      </div>
    </div>
  );
});

// ==================== PHONE GROUP ====================
const PhoneGroup = memo<{ images: [string, string, string]; className?: string }>(({ images, className = "" }) => (
  <div className={`relative flex items-center justify-center ${className}`} style={{ perspective: "1200px" }}>
    <PhoneMockup src={images[0]} position="left" />
    <PhoneMockup src={images[1]} position="right" />
    <PhoneMockup src={images[2]} position="center" />
  </div>
));

// ==================== NAVIGATION BUTTON ====================
const NavButton = memo<{ direction: "prev" | "next"; onClick: () => void }>(({ direction, onClick }) => (
  <button
    onClick={onClick}
    aria-label={direction === "prev" ? "Previous" : "Next"}
    className={`
      absolute top-1/2 -translate-y-1/2 z-40
      w-12 h-12 md:w-14 md:h-14
      flex items-center justify-center
      bg-white/90 backdrop-blur-xl
      border border-gray-200/50
      rounded-full shadow-lg shadow-black/5
      text-gray-700 hover:text-gray-900
      hover:bg-white hover:scale-110 hover:shadow-xl
      active:scale-95
      transition-all duration-300 ease-out
      ${direction === "prev" ? "left-4 md:left-12" : "right-4 md:right-12"}
    `}
  >
    <svg
      className="w-5 h-5 md:w-6 md:h-6"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d={direction === "prev" ? "M15.75 19.5L8.25 12l7.5-7.5" : "M8.25 4.5l7.5 7.5-7.5 7.5"}
      />
    </svg>
  </button>
));

// ==================== MAIN COMPONENT ====================
const MobileApp: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useSEO({
    title: "HostelHub App - Find & Book Student Hostels in Pakistan",
    description:
      "Download HostelHub to discover 500+ verified hostels. Real photos, genuine reviews, instant booking. Trusted by 10,000+ students across 15+ cities in Pakistan.",
    keywords:
      "hostel app pakistan, student hostel booking, bahawalpur hostels, lahore hostels, verified hostels, hostelhub download, student accommodation pakistan",
    ogTitle: "HostelHub - Smart Hostel Booking for Students",
    ogDescription: "Find your perfect student accommodation. Verified listings, secure payments, instant bookings.",
    schema: {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: "HostelHub",
      operatingSystem: "Android",
      applicationCategory: "TravelApplication",
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.8", ratingCount: "1250" },
      offers: { "@type": "Offer", price: "0", priceCurrency: "PKR" },
      downloadUrl:
        "https://github.com/MrHussnainAhmad/hostel-mobile-app/releases/download/HostelsHub/HostelsHub-v1.0.0.apk",
    },
  });

  // CLOCKWISE: Next button decreases rotation (rotates right/clockwise)
  // COUNTER-CLOCKWISE: Prev button increases rotation (rotates left/counter-clockwise)
  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % 3);
    setRotation((prev) => prev - 120); // Clockwise rotation
  }, []);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + 3) % 3);
    setRotation((prev) => prev + 120); // Counter-clockwise rotation
  }, []);

  const goToSlide = useCallback((index: number) => {
    const diff = index - currentIndex;
    setCurrentIndex(index);
    // Maintain clockwise direction for forward movement
    setRotation((prev) => prev - diff * 120);
  }, [currentIndex]);

  // Reset the auto-rotation timer
  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      goNext();
    }, 6000);
  }, [goNext]);

  // Auto-rotation effect - changes every 6 seconds
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      goNext();
    }, 6000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [goNext]);

  // Wrapped navigation functions that reset the timer
  const handleNext = useCallback(() => {
    goNext();
    resetTimer();
  }, [goNext, resetTimer]);

  const handlePrev = useCallback(() => {
    goPrev();
    resetTimer();
  }, [goPrev, resetTimer]);

  const handleGoToSlide = useCallback((index: number) => {
    goToSlide(index);
    resetTimer();
  }, [goToSlide, resetTimer]);

  // Touch handlers for swipe
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStart === null) return;
      const touchEnd = e.changedTouches[0].clientX;
      const diff = touchStart - touchEnd;

      // Swipe left (next) = clockwise, Swipe right (prev) = counter-clockwise
      if (diff > 50) {
        handleNext(); // Swipe left → go next → clockwise
      } else if (diff < -50) {
        handlePrev(); // Swipe right → go prev → counter-clockwise
      }

      setTouchStart(null);
    },
    [touchStart, handleNext, handlePrev]
  );

  return (
    <main className="min-h-screen bg-[#fafafa] overflow-hidden">
      {/* ==================== HERO ==================== */}
      <section className="relative min-h-screen flex flex-col">
        {/* Background */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Gradient Mesh */}
          <div
            className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-gradient-to-r from-violet-200 via-purple-200 to-fuchsia-200 rounded-full blur-3xl opacity-40 animate-pulse"
            style={{ animationDuration: "8s" }}
          />
          <div
            className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-r from-cyan-200 via-blue-200 to-indigo-200 rounded-full blur-3xl opacity-40 animate-pulse"
            style={{ animationDuration: "10s", animationDelay: "1s" }}
          />

          {/* Grid Pattern */}
          <div
            className="absolute inset-0 opacity-[0.015]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <header
            className={`pt-8 pb-6 px-6 text-center transition-all duration-1000 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-8"
            }`}
          >
            <div className="max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200/60 shadow-sm mb-8">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-sm font-medium text-gray-600">Now available for Android</span>
              </div>

              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 tracking-tight mb-6 leading-[1.1]">
                Find Your Perfect
                <span className="block bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  Student Home
                </span>
              </h1>

              <p className="text-lg md:text-xl text-gray-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                Discover verified hostels across Pakistan. Real photos, honest reviews, and instant booking — all in one
                beautiful app.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="https://github.com/MrHussnainAhmad/hostel-mobile-app/releases/download/HostelsHub/HostelsHub-v1.0.0.apk"
                  className="group relative inline-flex items-center gap-3 bg-gray-900 text-white font-semibold py-4 px-8 rounded-2xl shadow-xl shadow-gray-900/20 hover:shadow-2xl hover:shadow-gray-900/30 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
                >
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <img src="/button.png" alt="Android Logo" className="w-5 h-5 relative" />
                  <span className="relative">Download for Android</span>
                  <svg
                    className="relative w-5 h-5 group-hover:translate-x-1 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </a>

                <span className="text-sm text-gray-400 font-medium">v1.0.0 • Free Download</span>
              </div>
            </div>
          </header>

          {/* Phone Showcase */}
          <div
            className={`flex-1 relative transition-all duration-1000 delay-300 ${
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"
            }`}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <NavButton direction="prev" onClick={handlePrev} />
            <NavButton direction="next" onClick={handleNext} />

            {/* Desktop 3D Carousel - CLOCKWISE ROTATION */}
            <div
              className="hidden md:flex items-center justify-center h-full min-h-[800px] py-12"
              style={{ perspective: "2000px" }}
            >
              <div
                className="relative"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotation}deg)`,
                  transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {SCREEN_SETS.map((set, i) => (
                  <div
                    key={i}
                    className="absolute flex items-center justify-center"
                    style={{
                      transform: `rotateY(${i * 120}deg) translateZ(550px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <PhoneGroup images={set} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile 3D Carousel - CLOCKWISE ROTATION */}
            <div
              className="md:hidden flex items-center justify-center h-full min-h-[450px]"
              style={{ perspective: "1500px" }}
            >
              <div
                className="relative w-full h-full"
                style={{
                  transformStyle: "preserve-3d",
                  transform: `rotateY(${rotation}deg)`,
                  transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              >
                {SCREEN_SETS.map((set, i) => (
                  <div
                    key={i}
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      transform: `rotateY(${i * 120}deg) translateZ(320px)`,
                      backfaceVisibility: "hidden",
                    }}
                  >
                    <PhoneGroup images={set} className="scale-[0.55]" />
                  </div>
                ))}
              </div>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3">
              {[0, 1, 2].map((i) => (
                <button
                  key={i}
                  onClick={() => handleGoToSlide(i)}
                  className={`
                    h-2 rounded-full transition-all duration-300
                    ${currentIndex === i ? "w-8 bg-gray-900" : "w-2 bg-gray-300 hover:bg-gray-400"}
                  `}
                  aria-label={`View screen set ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ==================== STATS ==================== */}
      <section className="relative py-24 px-6 bg-white border-y border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {STATS.map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight mb-2">
                  {stat.value}
                  <span className="text-violet-500">{stat.suffix}</span>
                </div>
                <div className="text-sm md:text-base text-gray-500 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== FEATURES ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight mb-4">
              Everything you need
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto">
              Powerful features designed to make finding your perfect hostel effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, idx) => (
              <article
                key={idx}
                className="group relative p-8 bg-white rounded-3xl border border-gray-100 hover:border-gray-200 hover:shadow-xl hover:shadow-gray-100/50 hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-violet-500/25 group-hover:scale-110 group-hover:shadow-xl group-hover:shadow-violet-500/30 transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500 leading-relaxed">{feature.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== CTA ==================== */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 md:p-16 text-center">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-violet-500/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-indigo-500/20 rounded-full blur-3xl" />

            <div className="relative z-10">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4">
                Ready to find your
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-cyan-400">
                  perfect hostel?
                </span>
              </h2>
              <p className="text-lg text-gray-400 mb-10 max-w-xl mx-auto">
                Join thousands of students who have already found their ideal accommodation with HostelHub.
              </p>

              <a
                href="https://github.com/MrHussnainAhmad/hostel-mobile-app/releases/download/HostelsHub/HostelsHub-v1.0.0.apk"
                className="inline-flex items-center gap-3 bg-white text-gray-900 font-semibold py-4 px-10 rounded-2xl shadow-2xl hover:shadow-white/20 hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
              >
                Download Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ==================== FOOTER ==================== */}
      <footer className="py-12 px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="HostelHub" className="h-8" />
            </div>

            <div className="flex items-center gap-1">
              <span className="text-sm text-gray-500 mr-2">Trusted by students</span>
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              ))}
            </div>

            <p className="text-sm text-gray-400">© {Year} HostelHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
};

export default MobileApp;