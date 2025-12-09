import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { feesApi, createFormData } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';

interface PendingSummary {
  hostelId: string;
  hostelName: string;
  month: string;
  activeStudents: number;
  paidStudentCount: number;
  additionalStudents: number;
  feeAmount: number;
  additionalFeeAmount: number;
  submitted: boolean;
  status: string | null;
  needsAdditionalPayment: boolean;
  note: string;
}

const SubmitFee: React.FC = () => {
  const [searchParams] = useSearchParams();
  const hostelId = searchParams.get('hostelId') || '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [summaryLoading, setSummaryLoading] = useState(true);
  const [error, setError] = useState('');
  const [paymentProofFiles, setPaymentProofFiles] = useState<File[]>([]);
  
  const [pendingSummary, setPendingSummary] = useState<PendingSummary | null>(null);

  const currentMonth = new Date().toISOString().slice(0, 7);

  const [formData, setFormData] = useState({
    hostelId,
    month: currentMonth,
  });

  useEffect(() => {
    const loadPendingSummary = async () => {
      if (!hostelId) {
        setSummaryLoading(false);
        return;
      }
      
      try {
        const response = await feesApi.getPendingSummary();
        const summary = response.data.data;
        const hostelSummary = summary.find((s: PendingSummary) => s.hostelId === hostelId);
        setPendingSummary(hostelSummary || null);
      } catch (err) {
        console.error('Error loading pending summary:', err);
      } finally {
        setSummaryLoading(false);
      }
    };
    
    loadPendingSummary();
  }, [hostelId]);

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
      alert(pendingSummary?.needsAdditionalPayment 
        ? 'Additional fee submitted successfully!' 
        : 'Fee submitted successfully!');
      navigate('/manager');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to submit fee.');
    } finally {
      setLoading(false);
    }
  };

  // Calculate what amount to display
  const getAmountToPayDisplay = () => {
    if (!pendingSummary) return null;

    if (pendingSummary.needsAdditionalPayment) {
      return {
        label: 'Additional Amount to Pay',
        amount: pendingSummary.additionalFeeAmount,
        isAdditional: true,
      };
    }

    return {
      label: 'Total Amount to Pay',
      amount: pendingSummary.feeAmount,
      isAdditional: false,
    };
  };

  const amountDisplay = getAmountToPayDisplay();

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Fees
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            {pendingSummary?.needsAdditionalPayment 
              ? 'Submit Additional Fee Payment'
              : 'Submit Monthly Admin Fee'}
          </h1>
          <p className="text-sm text-gray-500 font-light">
            {pendingSummary?.needsAdditionalPayment
              ? 'New students joined after your previous fee was approved. Please pay the additional amount.'
              : 'Upload payment proof and select the month for this hostel\'s platform fee.'}
          </p>
        </div>

        {/* Loading State */}
        {summaryLoading && (
          <div className="mb-6 border border-gray-200 bg-gray-50 px-4 py-4 rounded-lg">
            <p className="text-sm text-gray-500 font-light">Loading fee summary...</p>
          </div>
        )}

        {/* Additional Payment Alert */}
        {pendingSummary?.needsAdditionalPayment && (
          <div className="mb-6 border border-orange-300 bg-orange-50 px-4 py-4 rounded-lg">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-medium text-orange-800">
                  Additional Payment Required
                </h3>
                <p className="text-sm text-orange-700 font-light mt-1">
                  {pendingSummary.additionalStudents} new student(s) joined after your previous fee was approved.
                  Please submit payment for the additional amount.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Pending Summary Card */}
        {pendingSummary && !summaryLoading && (
          <div className={`mb-6 border px-4 py-4 rounded-lg ${
            pendingSummary.needsAdditionalPayment 
              ? 'border-orange-200 bg-orange-50' 
              : 'border-blue-200 bg-blue-50'
          }`}>
            <h3 className={`text-sm font-medium mb-3 ${
              pendingSummary.needsAdditionalPayment ? 'text-orange-800' : 'text-blue-800'
            }`}>
              Fee Calculation Summary
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className={`font-light ${pendingSummary.needsAdditionalPayment ? 'text-orange-700' : 'text-blue-700'}`}>
                  Hostel:
                </span>
                <span className={`font-medium ${pendingSummary.needsAdditionalPayment ? 'text-orange-900' : 'text-blue-900'}`}>
                  {pendingSummary.hostelName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className={`font-light ${pendingSummary.needsAdditionalPayment ? 'text-orange-700' : 'text-blue-700'}`}>
                  Month:
                </span>
                <span className={`font-medium ${pendingSummary.needsAdditionalPayment ? 'text-orange-900' : 'text-blue-900'}`}>
                  {pendingSummary.month}
                </span>
              </div>

              {/* Divider */}
              <div className={`border-t my-2 ${pendingSummary.needsAdditionalPayment ? 'border-orange-300' : 'border-blue-300'}`}></div>

              {/* Show breakdown if additional payment needed */}
              {pendingSummary.needsAdditionalPayment ? (
                <>
                  <div className="flex justify-between">
                    <span className="text-orange-700 font-light">Already Paid For:</span>
                    <span className="text-orange-900 font-medium">
                      {pendingSummary.paidStudentCount} students (Rs. {pendingSummary.paidStudentCount * 100})
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-700 font-light">New Students:</span>
                    <span className="text-orange-900 font-medium">
                      {pendingSummary.additionalStudents} students
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-700 font-light">Total Students Now:</span>
                    <span className="text-orange-900 font-medium">
                      {pendingSummary.activeStudents} students
                    </span>
                  </div>
                  <div className={`border-t my-2 border-orange-300`}></div>
                  <div className="flex justify-between">
                    <span className="text-orange-800 font-medium">Additional Amount Due:</span>
                    <span className="text-orange-900 font-bold text-lg">
                      Rs. {pendingSummary.additionalFeeAmount.toLocaleString()}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex justify-between">
                    <span className="text-blue-700 font-light">Active Regular Students:</span>
                    <span className="text-blue-900 font-medium">
                      {pendingSummary.activeStudents || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-800 font-medium">Total Fee Amount:</span>
                    <span className="text-blue-900 font-bold text-lg">
                      Rs. {pendingSummary.feeAmount?.toLocaleString() || 0}
                    </span>
                  </div>
                </>
              )}

              {/* Note */}
              <div className={`mt-3 pt-3 border-t ${
                pendingSummary.needsAdditionalPayment ? 'border-orange-300' : 'border-blue-300'
              }`}>
                <p className={`text-xs font-light ${
                  pendingSummary.needsAdditionalPayment ? 'text-orange-600' : 'text-blue-600'
                }`}>
                  <span className="font-medium">Note:</span> {pendingSummary.note}
                </p>
              </div>
            </div>
          </div>
        )}

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

            {/* Amount to Pay Display */}
            {amountDisplay && (
              <div className={`border px-4 py-3 rounded ${
                amountDisplay.isAdditional 
                  ? 'border-orange-200 bg-orange-50' 
                  : 'border-green-200 bg-green-50'
              }`}>
                <p className={`text-xs font-light mb-1 ${
                  amountDisplay.isAdditional ? 'text-orange-600' : 'text-green-600'
                }`}>
                  {amountDisplay.label}
                </p>
                <p className={`text-2xl font-light ${
                  amountDisplay.isAdditional ? 'text-orange-900' : 'text-green-900'
                }`}>
                  Rs. {amountDisplay.amount.toLocaleString()}
                </p>
              </div>
            )}

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
              <p className="font-medium mb-1">Fee Calculation Rules:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>Fee is Rs. 100 per <span className="font-medium">regular</span> student per month</li>
                <li><span className="font-medium">Urgent bookings are excluded</span> from fee calculation</li>
                <li>Student leaving doesn&apos;t reduce fee for that month</li>
                {pendingSummary?.needsAdditionalPayment && (
                  <li><span className="font-medium">You are paying for {pendingSummary.additionalStudents} new student(s)</span> who joined after your previous payment</li>
                )}
                <li>Make sure you&apos;ve paid the correct amount before submitting</li>
              </ul>
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
                className={`w-full sm:w-1/2 py-2.5 text-white text-sm font-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                  pendingSummary?.needsAdditionalPayment
                    ? 'bg-orange-600 hover:bg-orange-700'
                    : 'bg-gray-900 hover:bg-gray-800'
                }`}
              >
                {loading 
                  ? 'Submitting...' 
                  : pendingSummary?.needsAdditionalPayment 
                    ? 'Submit Additional Payment'
                    : 'Submit Fee'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SubmitFee;