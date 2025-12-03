// src/pages/About.tsx
import React from 'react';

const About: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <header>
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
            About Hostels
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Helping students in Bahawalpur find verified hostel accommodation.
          </p>
        </header>

        <section className="space-y-4 text-sm text-gray-700 font-light">
          <p>
            <span className="font-normal">Hostels</span> is a platform built to
            connect students with hostel managers in Bahawalpur, Pakistan. We
            help students discover available hostels, compare room types and
            prices, and communicate directly with managers through a simple and
            secure interface.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-2">
            How it works for students
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Browse hostels by location, room type and price.</li>
            <li>View details, facilities, rules and reviews.</li>
            <li>Reserve or book rooms and chat directly with managers.</li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-2">
            How it works for managers
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Verify your manager account with basic information.</li>
            <li>List hostels with room types, photos, facilities and rules.</li>
            <li>Manage bookings, reservations, students and platform fees from a single dashboard.</li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-2">
            Our role
          </h2>
          <p>
            We are <span className="font-normal">not the hostel owners</span>.
            We do not control hostel operations or payments. We provide tools to
            make it easier for students and managers to connect, stay organized
            and reduce the chances of miscommunication and fraud.
          </p>

          <p className="text-sm text-gray-500 font-light">
            For questions, feedback or support, please visit our{' '}
            <a href="/contact" className="text-gray-900 hover:underline">
              Contact
            </a>{' '}
            page.
          </p>
        </section>
      </div>
    </main>
  );
};

export default About;