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
      setError('Please upload payment proof image');
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
      setError(err.response?.data?.message || 'Failed to submit fee');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Submit Monthly Admin Fee</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Month</label>
            <input
              type="month"
              name="month"
              value={formData.month}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <ImageUpload
            label="Payment Proof"
            value={paymentProofFiles}
            onChange={setPaymentProofFiles}
          />

          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-800">
              Fee: Rs. 100 per active student per month
            </p>
          </div>

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate('/manager')}
              className="flex-1 bg-gray-200 text-gray-800 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? 'Submitting...' : 'Submit Fee'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SubmitFee;