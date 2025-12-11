import React, { useState } from "react";
import { useSEO } from "../hooks/useSEO";
import loginEn from "/app/En.jpeg";
import loginPe from "/app/Pe.jpeg";
import loginUr from "/app/ur.jpeg";
import StudentDash from "/app/StDash.jpeg";
import StudentBooking from "/app/StBooking.jpeg";
import StudentHostelDetail from "/app/StHostelDetail.jpeg";
import ManagerDash from "/app/MnDash.jpeg";
import ManagerHostels from "/app/MnHostels.jpeg";
import ManagerCreateHostels from "/app/MnCreateHostel.jpeg";

// ==================== REUSABLE PHONE GROUP COMPONENT ====================
interface PhoneGroupProps {
  images: [string, string, string]; // [Left, Right, Center]
  id?: string;
}

const PhoneGroup: React.FC<PhoneGroupProps> = ({ images, id }) => {
  return (
    <div
      id={id}
      className="relative w-full max-w-4xl h-full flex justify-center items-center pt-10 md:pt-20 scale-[0.45] sm:scale-75 md:scale-100 transform-gpu transition-transform duration-300 flex-shrink-0 snap-center"
    >
      {/* Left Phone */}
      <div
        className="absolute w-[280px] h-[550px] bg-white rounded-[3rem] border-8 border-gray-900 shadow-2xl transition-all duration-500 ease-out hover:z-30 hover:scale-105"
        style={{
          transform: "translateX(-160px) translateZ(-50px) rotateY(15deg)",
          zIndex: 10,
        }}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-xl z-20"></div>
        <div className="w-full h-full bg-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <img
            src={images[0]}
            alt="App Screen Left"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Right Phone */}
      <div
        className="absolute w-[280px] h-[550px] bg-white rounded-[3rem] border-8 border-gray-900 shadow-2xl transition-all duration-500 ease-out hover:z-30 hover:scale-105"
        style={{
          transform: "translateX(160px) translateZ(-50px) rotateY(-15deg)",
          zIndex: 10,
        }}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-7 bg-gray-900 rounded-b-xl z-20"></div>
        <div className="w-full h-full bg-gray-100 rounded-[2.5rem] overflow-hidden flex flex-col relative">
          <img
            src={images[1]}
            alt="App Screen Right"
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* Center Phone */}
      <div
        className="absolute w-[300px] h-[580px] bg-white rounded-[3.5rem] border-8 border-gray-900 shadow-2xl transition-all duration-500 ease-out hover:scale-105"
        style={{
          transform: "translateZ(50px)",
          zIndex: 20,
        }}
      >
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-36 h-7 bg-gray-900 rounded-b-xl z-20"></div>
        <div className="w-full h-full bg-gray-100 rounded-[3rem] overflow-hidden flex flex-col relative">
          <img
            src={images[2]}
            alt="App Screen Center"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
};

const MobileApp: React.FC = () => {
  const [rotation, setRotation] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  useSEO({
    title: "Download HostelHub App - #1 Hostel Booking Platform in Pakistan",
    description:
      "Join thousands of students using HostelHub to find verified hostels. View real photos, read reviews, and book instantly. 500+ Hostels, 10k+ Students.",
    keywords:
      "hostel app pakistan, bahawalpur hostels, student accommodation, online hostel booking, verified hostels, hostelhub app",
    ogTitle: "HostelHub - The Smart Way to Find Hostels",
    ogDescription:
      "Find your perfect student home with HostelHub. Verified listings, secure payments, and instant bookings.",
    schema: {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "HostelHub",
      applicationCategory: "LifestyleApplication",
      operatingSystem: "Android, iOS",
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.8",
        ratingCount: "1250",
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "PKR",
      },
    },
  });

  const features = [
    {
      title: "Easy Booking",
      description: "Book verified hostels instantly",
      icon: "📱",
    },
    {
      title: "Secure Payments",
      description: "Safe & transparent transactions",
      icon: "💳",
    },
    {
      title: "Student Community",
      description: "Connect with peers near you",
      icon: "🎓",
    },
    {
      title: "24/7 Support",
      description: "We are always here to help",
      icon: "🎧",
    },
  ];

  const stats = [
    { label: "Verified Hostels", value: "500+" },
    { label: "Active Students", value: "10k+" },
    { label: "Cities Covered", value: "15+" },
    { label: "5-Star Reviews", value: "2k+" },
  ];

  // Screen Sets
  const screenSets = [
    [loginPe, loginUr, loginEn], // Auth Flow
    [StudentDash, StudentHostelDetail, StudentBooking], // Discovery
    [ManagerDash, ManagerHostels, ManagerCreateHostels], // Management
  ];

  const nextSet = () => {
    setRotation((prev) => prev - 120);
  };

  const prevSet = () => {
    setRotation((prev) => prev + 120);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      nextSet();
    } else if (isRightSwipe) {
      prevSet();
    }
    
    // Reset
    setTouchStart(null);
    setTouchEnd(null);
  };

  return (
    <div className="min-h-screen bg-white">
      <style>{`
        .perspective-container {
          perspective: 2000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
      `}</style>

      {/* Hero Section */}
      <div className="bg-gray-900 text-white pt-12 pb-24 px-6 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute right-0 top-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute left-0 bottom-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="max-w-md mx-auto relative z-10 text-center">
          <img
            src="/logo.png"
            alt="HostelHub Logo"
            className="h-16 mx-auto mb-6 object-contain"
          />
          <h1 className="text-3xl font-bold mb-4">HostelHub Mobile</h1>
          <p className="text-gray-300 text-lg mb-8">
            The smartest way to find your next home away from home.
          </p>

          <a
            href="https://github.com/MrHussnainAhmad/hostel-mobile-app/releases/download/HostelsHub/HostelsHub-v1.0.0.apk"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-3 bg-white text-gray-900 font-bold py-4 px-8 rounded-full shadow-lg hover:bg-gray-50 transition-all transform active:scale-95 w-full sm:w-auto"
          >
            <img src="/vite.svg" alt="Vite Logo" className="w-6 h-6" />
            <span>Download V1.0.0</span>
          </a>
          <p className="mt-4 text-xs text-gray-400">
            Version 1.0.0 • Early Access
          </p>
        </div>
      </div>

      {/* 3D Phone Mockup Section */}
      <div className="relative w-full h-[400px] md:h-[700px] mb-12 flex justify-center items-center overflow-hidden">
        
        {/* Desktop View: Single Group */}
        <div className="hidden md:flex w-full h-full justify-center items-center perspective-container">
          <PhoneGroup images={screenSets[0] as [string, string, string]} />
        </div>

        {/* Mobile View: 3D Rotating Carousel */}
        <div 
          className="md:hidden w-full h-full flex justify-center items-center relative perspective-container"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          
          {/* Controls */}
          <button 
            onClick={prevSet}
            className="absolute left-4 z-30 p-3 bg-white/90 rounded-full shadow-lg text-gray-800 hover:bg-white transition-colors border border-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>

          <button 
            onClick={nextSet}
            className="absolute right-4 z-30 p-3 bg-white/90 rounded-full shadow-lg text-gray-800 hover:bg-white transition-colors border border-gray-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>

          {/* Carousel Container */}
          <div 
            className="relative w-[300px] h-full transform-style-3d transition-transform duration-700 ease-out"
            style={{ transform: `rotateY(${rotation}deg)` }}
          >
             {screenSets.map((set, i) => (
               <div 
                 key={i}
                 className="absolute inset-0 flex justify-center items-center"
                 style={{ 
                   transform: `rotateY(${i * 120}deg) translateZ(350px)`
                 }}
               >
                  <PhoneGroup images={set as [string, string, string]} />
               </div>
             ))}
          </div>

        </div>
      </div>

      <div className="max-w-md lg:max-w-7xl mx-auto px-6 pb-12 space-y-12 lg:space-y-20">
        {/* Stats Section */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="bg-gray-50 p-4 lg:p-8 rounded-2xl text-center border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="text-2xl lg:text-4xl font-bold text-gray-900 mb-2">
                {stat.value}
              </div>
              <div className="text-xs lg:text-sm text-gray-500 font-medium uppercase tracking-wide">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div>
          <h2 className="text-xl lg:text-3xl font-bold text-gray-900 mb-6 lg:mb-12 text-center">
            Everything you need
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex flex-col lg:items-center text-left lg:text-center p-6 bg-white rounded-2xl shadow-sm border border-gray-100 hover:border-gray-200 hover:-translate-y-1 hover:shadow-md transition-all duration-300"
              >
                <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gray-900 text-white rounded-xl flex items-center justify-center text-2xl lg:text-3xl flex-shrink-0 mb-4">
                  {feature.icon}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Trust/Footer */}
        <div className="text-center border-t border-gray-100 pt-8 lg:pt-12">
          <p className="text-gray-400 text-sm lg:text-base mb-4">
            Trusted by students across Pakistan
          </p>
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className="w-5 h-5 lg:w-6 lg:h-6 text-yellow-400 fill-current"
                viewBox="0 0 24 24"
              >
                <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileApp;