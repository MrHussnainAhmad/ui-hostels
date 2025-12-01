import React from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

const Home: React.FC = () => {
  const { isAuthenticated } = useAuthStore();

  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">
        Welcome to HostelHub
      </h1>
      <p className="text-xl text-gray-600 mb-8">
        Find your perfect hostel accommodation
      </p>
      {!isAuthenticated && (
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-indigo-600 text-white px-6 py-3 rounded-md text-lg hover:bg-indigo-700"
          >
            Get Started
          </Link>
          <Link
            to="/hostels"
            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-md text-lg hover:bg-gray-300"
          >
            Browse Hostels
          </Link>
        </div>
      )}
    </div>
  );
};

export default Home;