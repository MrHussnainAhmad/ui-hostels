// src/pages/Contact.tsx
import React from 'react';

const Contact: React.FC = () => {
  const supportEmail = 'hostels.official@gmail.com';
  const whatsappNumber = '+92-300-0000000'; // replace with your real number

  const handleEmailClick = () => {
    window.location.href = `mailto:${supportEmail}`;
  };

  const handleWhatsAppClick = () => {
    window.open(`https://wa.me/${whatsappNumber.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <header>
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
            Contact Us
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Get in touch for support, feedback or partnership queries.
          </p>
        </header>

        <section className="border border-gray-100 bg-white px-6 py-6 space-y-4 text-sm text-gray-700 font-light">
          <div>
            <h2 className="text-base font-medium text-gray-900 mb-1">
              Email
            </h2>
            <p className="mb-2">
              For any issues, verification questions, booking disputes or
              feedback, please email us:
            </p>
            <button
              type="button"
              onClick={handleEmailClick}
              className="inline-flex items-center px-4 py-2 bg-gray-900 text-white text-xs font-light rounded-lg hover:bg-gray-800 transition-colors"
            >
              {supportEmail}
            </button>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-900 mb-1">
              WhatsApp (Support)
            </h2>
            <p className="mb-2">
              For quick questions, you can reach us on WhatsApp during working hours:
            </p>
            <button
              type="button"
              onClick={handleWhatsAppClick}
              className="inline-flex items-center px-4 py-2 border border-gray-200 text-xs font-light text-gray-900 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-colors"
            >
              {whatsappNumber}
            </button>
          </div>

          <div>
            <h2 className="text-base font-medium text-gray-900 mb-1">
              What to include in your message
            </h2>
            <ul className="list-disc pl-5 space-y-1">
              <li>Your full name and role (student or manager).</li>
              <li>Your registered email on Hostels.</li>
              <li>
                Relevant hostel name, booking ID or report ID (if you have one).
              </li>
              <li>A short description of your issue or request.</li>
            </ul>
          </div>

          <p className="text-[11px] text-gray-400 font-light">
            We try to respond as soon as possible, but response times may vary
            depending on the number of requests.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Contact;