import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { verificationsApi, createFormData } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';

const SubmitVerification: React.FC = () => {
  const [buildingImageFiles, setBuildingImageFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    initialHostelNames: [''],
    ownerName: '',
    city: '',
    address: '',
    hostelFor: 'BOYS' as 'BOYS' | 'GIRLS',
    easypaisaNumber: '',
    jazzcashNumber: '',
    customBanks: [{ bankName: '', accountNumber: '', iban: '' }],
    acceptedRules: false,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        [name]: (e.target as HTMLInputElement).checked,
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (
    field: string,
    index: number,
    value: string
  ) => {
    const arr = [...(formData as any)[field]];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayItem = (field: string) => {
    const arr = [...(formData as any)[field], ''];
    setFormData({ ...formData, [field]: arr });
  };

  const handleBankChange = (
    index: number,
    field: string,
    value: string
  ) => {
    const banks = [...formData.customBanks];
    (banks[index] as any)[field] = value;
    setFormData({ ...formData, customBanks: banks });
  };

  const addBank = () => {
    setFormData({
      ...formData,
      customBanks: [
        ...formData.customBanks,
        { bankName: '', accountNumber: '', iban: '' },
      ],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (buildingImageFiles.length === 0) {
      setError('Please upload at least one building image.');
      return;
    }

    if (!formData.acceptedRules) {
      setError('You must accept the platform rules to continue.');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        initialHostelNames: formData.initialHostelNames.filter((n) =>
          n.trim()
        ),
        customBanks: formData.customBanks.filter(
          (b) => b.bankName && b.accountNumber
        ),
      };

      const formDataToSend = createFormData(payload, [
        { fieldName: 'buildingImages', files: buildingImageFiles },
      ]);

      await verificationsApi.submit(formDataToSend);
      navigate('/manager');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Verification
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Manager Verification
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Provide your details and hostel information to verify your
            manager account.
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
            {/* Owner & Basic Info */}
            <section className="space-y-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Owner Name
                </label>
                <input
                  type="text"
                  name="ownerName"
                  value={formData.ownerName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                />
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-light">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-light">
                    Hostel For
                  </label>
                  <select
                    name="hostelFor"
                    value={formData.hostelFor}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                  >
                    <option value="BOYS">Boys</option>
                    <option value="GIRLS">Girls</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Address
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={2}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                />
              </div>
            </section>

            {/* Initial Hostel Names */}
            <section className="border-t border-gray-100 pt-5 space-y-3">
              <div className="text-xs font-medium tracking-widest uppercase text-gray-400">
                Initial Hostel Names
              </div>
              <p className="text-xs text-gray-500 font-light">
                Add the names of the hostels you plan to list first.
              </p>
              {formData.initialHostelNames.map((name, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={name}
                  onChange={(e) =>
                    handleArrayChange(
                      'initialHostelNames',
                      idx,
                      e.target.value
                    )
                  }
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 mb-2 focus:outline-none focus:border-gray-900 font-light"
                  placeholder={`Hostel ${idx + 1}`}
                />
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('initialHostelNames')}
                className="text-xs text-gray-900 font-light hover:underline"
              >
                + Add another hostel
              </button>
            </section>

            {/* Building Images */}
            <section className="border-t border-gray-100 pt-5">
              <ImageUpload
                label="Building Images (max 5)"
                multiple
                maxFiles={5}
                value={buildingImageFiles}
                onChange={setBuildingImageFiles}
              />
            </section>

            {/* Payment Methods */}
            <section className="border-t border-gray-100 pt-5 space-y-4">
              <div className="text-xs font-medium tracking-widest uppercase text-gray-400">
                Payment Methods
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-light">
                    Easypaisa Number
                  </label>
                  <input
                    type="text"
                    name="easypaisaNumber"
                    value={formData.easypaisaNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-light">
                    JazzCash Number
                  </label>
                  <input
                    type="text"
                    name="jazzcashNumber"
                    value={formData.jazzcashNumber}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Bank Accounts
                </label>
                {formData.customBanks.map((bank, idx) => (
                  <div
                    key={idx}
                    className="grid sm:grid-cols-3 gap-2 mb-2"
                  >
                    <input
                      type="text"
                      value={bank.bankName}
                      onChange={(e) =>
                        handleBankChange(
                          idx,
                          'bankName',
                          e.target.value
                        )
                      }
                      className="px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                      placeholder="Bank Name"
                    />
                    <input
                      type="text"
                      value={bank.accountNumber}
                      onChange={(e) =>
                        handleBankChange(
                          idx,
                          'accountNumber',
                          e.target.value
                        )
                      }
                      className="px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                      placeholder="Account Number"
                    />
                    <input
                      type="text"
                      value={bank.iban}
                      onChange={(e) =>
                        handleBankChange(
                          idx,
                          'iban',
                          e.target.value
                        )
                      }
                      className="px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                      placeholder="IBAN (optional)"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addBank}
                  className="text-xs text-gray-900 font-light hover:underline"
                >
                  + Add another bank
                </button>
              </div>
            </section>

            {/* Terms */}
            <section className="border-t border-gray-100 pt-5">
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  name="acceptedRules"
                  checked={formData.acceptedRules}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 text-gray-900 border-gray-300"
                  required
                />
                <p className="text-xs text-gray-600 font-light">
                  I confirm that the information provided is accurate and I
                  agree to the platform rules and terms of service.
                </p>
              </div>
            </section>

            {/* Actions */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-gray-900 text-white text-sm font-light hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Submitting...' : 'Submit Verification'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default SubmitVerification;