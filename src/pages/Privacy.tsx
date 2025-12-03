// src/pages/Policy.tsx
import React from 'react';

const Policy: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
            Privacy & Safety Policy
          </h1>
          <p className="text-xs text-gray-400">
            Last updated:{' '}
            {new Date().toLocaleDateString('en-PK', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </p>
        </header>

        <section className="space-y-4 text-sm text-gray-700 font-light">
          <p>
            This Privacy & Safety Policy explains how <span className="font-normal">HOSTELSHUB</span>{' '}
            works, what we are responsible for, and what you agree to when you use our platform
            as a student or manager.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            1. We are a platform, not hostel owners
          </h2>
          <p>
            HOSTELSHUB is <span className="font-normal">not a hostel owner or property dealer</span>.
            We only provide an online platform where hostel managers post their hostels and
            students can browse, reserve and book those hostels.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            2. Payments, scams & responsibility
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              All payments and agreements are strictly between{' '}
              <span className="font-normal">student and manager</span>. HOSTELSHUB does not hold
              your money and is <span className="font-normal">not responsible</span> for any loss,
              scam or dispute.
            </li>
            <li>
              Always use the <span className="font-normal">“Chat with Manager”</span> feature
              before sending money. Confirm details (amount, account number, room type, dates,
              etc.) directly with the manager.
            </li>
            <li>
              Do <span className="font-normal">not</span> send money to anyone without first
              talking to the manager inside the platform. If something feels suspicious, stop
              immediately and report it.
            </li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            3. Manager platform fee
          </h2>
          <p>
            To keep HOSTELSHUB running and improve the service,{' '}
            <span className="font-normal">managers</span> agree to pay:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rs. 100 per student admission (one‑time per new student).</li>
            <li>Rs. 100 per active student per month (monthly platform fee).</li>
          </ul>
          <p>
            Students <span className="font-normal">do not</span> pay this platform fee directly
            to HOSTELSHUB. It is collected from managers only.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            4. Account actions in case of scams
          </h2>
          <p>
            If we receive serious reports or clear proof of fraud, scams or abuse, Hostels may:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Suspend or permanently terminate manager and/or student accounts.</li>
            <li>
              Add warnings or visible notices (posters/flags) on specific hostels or users to
              create awareness for others.
            </li>
          </ul>
          <p>
            These actions are at the discretion of Hostels and may be taken even if the issue
            happened outside the platform but is related to a booking arranged through Hostels.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            5. Data we collect & how we use it
          </h2>
          <p>
            We only collect information needed to run the platform and keep it safe, such as:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Account details (email, role, basic profile information).</li>
            <li>
              Student and manager profile data (contact info, hostel details, verification data,
              payment proofs).
            </li>
            <li>Booking, reservation and fee records.</li>
            <li>Messages and reports shared through the platform.</li>
          </ul>
          <p>
            This information is used to operate your account, show hostel listings, process
            bookings and fees, and help detect and investigate abuse or fraud. We do{' '}
            <span className="font-normal">not</span> sell your personal data to third parties.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            6. Sharing of information
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Student details are shared with managers when you book or reserve a hostel, so
              they can contact you and manage your stay.
            </li>
            <li>
              Manager and hostel details are shown to students so they can decide whether to
              book or reserve.
            </li>
            <li>
              Admins and support staff can access relevant data to handle verifications, fees
              and reports.
            </li>
            <li>
              We may share data if required by law or to protect our rights, users or the
              public.
            </li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            7. Your responsibilities
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Use real, accurate information in your profile and verification.</li>
            <li>Follow hostel rules and local laws.</li>
            <li>
              Do not misuse chat, bookings or reports to harass, spam or falsely accuse others.
            </li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            8. Changes to this policy
          </h2>
          <p>
            We may update this Privacy & Safety Policy from time to time. Updates will be
            published at <span className="font-mono text-xs">/policy</span>. Continuing to use
            HOSTELSHUB means you accept the latest version.
          </p>

          <p className="text-[11px] text-gray-400 font-light mt-4">
            This page is for general guidance only and does not replace independent legal
            advice. If you have any questions or concerns, please contact us through the
            support or contact options in the app.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Policy;