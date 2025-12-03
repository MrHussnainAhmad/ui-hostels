import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { feesApi, createFormData } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';

const SubmitFee: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hostelId = searchParams.get('hostelId') || '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentProofFiles, setPaymentProofFiles] = useState<File[]>([]);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [formData, setFormData] = useState({
    hostelId,
    month: currentMonth,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (paymentProofFiles.length === 0) {
      setError('Please upload payment proof image.');
      return;
    }

    setLoading(true);

    try {
      const formDataToSend = createFormData(formData, [
        { fieldName: 'paymentProofImage', files: paymentProofFiles },
      ]);

      await feesApi.submit(formDataToSend);
      alert('Fee submitted successfully!');
      navigate('/manager');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit fee.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Fees
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Submit Monthly Admin Fee
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Upload payment proof and select the month for this hostel&apos;s
            platform fee.
          </p>
        </div>

        {/* Card */}
        <div className="border border-gray-100 bg-white px-6 py-7 sm:px-8 sm:py-8">
          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-light">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hostel ID (read-only info) */}
            {hostelId && (
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Hostel ID
                </label>
                <input
                  type="text"
                  value={hostelId}
                  disabled
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 text-sm text-gray-700 font-light"
                />
              </div>
            )}

            {/* Month */}
            <div>
              <label
                htmlFor="month"
                className="block text-xs text-gray-500 mb-1 font-light"
              >
                Month
              </label>
              <input
                id="month"
                type="month"
                name="month"
                value={formData.month}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
              />
            </div>

            {/* Payment Proof */}
            <div>
              <ImageUpload
                label="Payment Proof"
                value={paymentProofFiles}
                onChange={setPaymentProofFiles}
              />
            </div>

            {/* Info Notice */}
            <div className="border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-800 font-light">
              Fee is calculated as{' '}
              <span className="font-normal">
                Rs. 100 per active student per month
              </span>
              . Make sure you&apos;ve paid the correct amount before submitting.
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/manager')}
                className="w-full sm:w-1/2 py-2.5 border border-gray-200 text-sm font-light text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-full sm:w-1/2 py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Fee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SubmitFee;