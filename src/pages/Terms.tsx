// src/pages/Terms.tsx
import React from 'react';

const Terms: React.FC = () => {
  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <header className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-light text-gray-900 mb-2">
            Terms of Use
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
            These Terms of Use (&quot;Terms&quot;) govern your use of the
            Hostels platform (&quot;Hostels&quot;, &quot;we&quot;, &quot;our&quot;,
            &quot;us&quot;). By creating an account or using the website, you
            agree to these Terms.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            1. Platform Only
          </h2>
          <p>
            Hostels is <span className="font-normal">not a hostel owner</span>.
            We only provide a platform where managers post hostels and students
            can browse, reserve and book. Any stay, payment or agreement is
            strictly between manager and student.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            2. Accounts & Roles
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <span className="font-medium">Students</span> use Hostels to find
              accommodation, send reservations, create bookings and chat with
              managers.
            </li>
            <li>
              <span className="font-medium">Managers</span> list hostels, set
              room types and prices, and manage student bookings.
            </li>
            <li>
              <span className="font-medium">Admins/Sub-admins</span> review
              verifications, fees and reports, and may moderate accounts.
            </li>
            <li>
              You are responsible for all activity under your account and for
              keeping your login details secure.
            </li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            3. Payments & Responsibility
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Payments are made directly between students and managers (e.g.
              Easypaisa, JazzCash, bank transfer). Hostels does not hold or
              guarantee your funds.
            </li>
            <li>
              Hostels is <span className="font-normal">not responsible</span>{' '}
              for any scams, non‑payment, refund disputes or personal agreements
              between students and managers.
            </li>
            <li>
              Always use the in‑app <span className="font-normal">Chat</span>{' '}
              before sending money and do not send funds if something seems
              suspicious.
            </li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            4. Manager Platform Fee
          </h2>
          <p>
            Managers agree to pay a platform fee of:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Rs. 100 per student admission (one‑time per new student).</li>
            <li>Rs. 100 per active student per month.</li>
          </ul>
          <p>
            This fee is paid by managers to keep the Hostels platform live.
            Students do not pay this fee directly to Hostels.
          </p>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            5. Behaviour & Misuse
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              You must not post fake listings, use fake profiles, harass others
              or misuse the reporting/chat features.
            </li>
            <li>
              You must follow local laws, hostel rules and any lawful
              instructions from relevant authorities.
            </li>
            <li>
              Hostels may suspend or terminate accounts that break these Terms
              or create risk for other users.
            </li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            6. Account Actions & Warnings
          </h2>
          <p>
            In case of serious issues (such as scams, fraud or repeated abuse),
            Hostels may, at its own discretion:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Temporarily suspend or permanently terminate accounts.</li>
            <li>
              Add warnings or visible posters/notices for specific hostels or
              students to inform the community.
            </li>
          </ul>

          <h2 className="text-base font-medium text-gray-900 mt-4">
            7. Changes to Terms
          </h2>
          <p>
            We may update these Terms at any time. Updated versions will be
            available on this page. Your continued use of Hostels means you
            accept the updated Terms.
          </p>
        </section>
      </div>
    </main>
  );
};

export default Terms;