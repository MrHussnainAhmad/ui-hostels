import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usersApi } from '../../lib/api';

const SelfVerify: React.FC = () => {
  const [formData, setFormData] = useState({
    fatherName: '',
    instituteName: '',
    permanentAddress: '',
    phoneNumber: '',
    whatsappNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await usersApi.selfVerify(formData);
      navigate('/student');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Verification failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-12 max-w-3xl">
        {/* Page Header */}
        <div className="mb-8">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
            Student Verification
          </div>
          <h1 className="text-3xl font-light text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-sm text-gray-500 font-light max-w-2xl">
            Please provide the following information so we can verify your
            student status and keep your bookings safe.
          </p>
        </div>

        {/* Card */}
        <div className="border border-gray-100 bg-white px-6 py-7 sm:px-8 sm:py-8">
          {/* Error */}
          {error && (
            <div className="mb-6 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-light">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Father Name */}
            <div>
              <label
                htmlFor="fatherName"
                className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
              >
                Father&apos;s Name
              </label>
              <input
                id="fatherName"
                type="text"
                name="fatherName"
                value={formData.fatherName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-light"
                placeholder="e.g. Muhammad Ali"
              />
            </div>

            {/* Institute Name */}
            <div>
              <label
                htmlFor="instituteName"
                className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
              >
                Institute Name (School / College / University)
              </label>
              <input
                id="instituteName"
                type="text"
                name="instituteName"
                value={formData.instituteName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-light"
                placeholder="e.g. Islamia University Bahawalpur"
              />
            </div>

            {/* Address */}
            <div>
              <label
                htmlFor="permanentAddress"
                className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
              >
                Permanent Address
              </label>
              <textarea
                id="permanentAddress"
                name="permanentAddress"
                rows={3}
                value={formData.permanentAddress}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-light"
                placeholder="House / Street / Area / City"
              />
            </div>

            {/* Phone + WhatsApp */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="phoneNumber"
                  className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
                >
                  Phone Number
                </label>
                <input
                  id="phoneNumber"
                  type="tel"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-light"
                  placeholder="03xx-xxxxxxx"
                />
              </div>

              <div>
                <label
                  htmlFor="whatsappNumber"
                  className="block text-xs font-medium tracking-widest uppercase text-gray-400 mb-2"
                >
                  WhatsApp Number
                </label>
                <input
                  id="whatsappNumber"
                  type="tel"
                  name="whatsappNumber"
                  value={formData.whatsappNumber}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 transition-colors font-light"
                  placeholder="03xx-xxxxxxx"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gray-900 text-white py-2.5 text-sm font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Complete Verification'}
            </button>
          </form>

          {/* Hint */}
          <p className="mt-4 text-xs text-gray-400 font-light">
            Your information is only used for verification and will not be shared
            publicly.
          </p>
        </div>
      </div>
    </main>
  );
};

export default SelfVerify;