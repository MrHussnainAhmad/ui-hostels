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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleArrayChange = (field: string, index: number, value: string) => {
    const arr = [...(formData as any)[field]];
    arr[index] = value;
    setFormData({ ...formData, [field]: arr });
  };

  const addArrayItem = (field: string) => {
    const arr = [...(formData as any)[field], ''];
    setFormData({ ...formData, [field]: arr });
  };

  const handleBankChange = (index: number, field: string, value: string) => {
    const banks = [...formData.customBanks];
    (banks[index] as any)[field] = value;
    setFormData({ ...formData, customBanks: banks });
  };

  const addBank = () => {
    setFormData({
      ...formData,
      customBanks: [...formData.customBanks, { bankName: '', accountNumber: '', iban: '' }],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (buildingImageFiles.length === 0) {
      setError('Please upload at least one building image');
      return;
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        initialHostelNames: formData.initialHostelNames.filter(n => n.trim()),
        customBanks: formData.customBanks.filter(b => b.bankName && b.accountNumber),
      };

      const formDataToSend = createFormData(payload, [
        { fieldName: 'buildingImages', files: buildingImageFiles },
      ]);

      await verificationsApi.submit(formDataToSend);
      navigate('/manager');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Manager Verification</h1>

        {error && (
          <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Owner Name
            </label>
            <input
              type="text"
              name="ownerName"
              value={formData.ownerName}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Hostel For
              </label>
              <select
                name="hostelFor"
                value={formData.hostelFor}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="BOYS">Boys</option>
                <option value="GIRLS">Girls</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Address
            </label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Initial Hostel Names
            </label>
            {formData.initialHostelNames.map((name, idx) => (
              <input
                key={idx}
                type="text"
                value={name}
                onChange={(e) => handleArrayChange('initialHostelNames', idx, e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-2"
                placeholder={`Hostel ${idx + 1}`}
              />
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('initialHostelNames')}
              className="text-indigo-600 text-sm"
            >
              + Add Another Hostel
            </button>
          </div>

          {/* Building Images - Updated to use ImageUpload */}
          <ImageUpload
            label="Building Images (Max 5)"
            multiple
            maxFiles={5}
            value={buildingImageFiles}
            onChange={setBuildingImageFiles}
          />

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Easypaisa Number
              </label>
              <input
                type="text"
                name="easypaisaNumber"
                value={formData.easypaisaNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2">
                JazzCash Number
              </label>
              <input
                type="text"
                name="jazzcashNumber"
                value={formData.jazzcashNumber}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Bank Accounts
            </label>
            {formData.customBanks.map((bank, idx) => (
              <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
                <input
                  type="text"
                  value={bank.bankName}
                  onChange={(e) => handleBankChange(idx, 'bankName', e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  placeholder="Bank Name"
                />
                <input
                  type="text"
                  value={bank.accountNumber}
                  onChange={(e) => handleBankChange(idx, 'accountNumber', e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  placeholder="Account Number"
                />
                <input
                  type="text"
                  value={bank.iban}
                  onChange={(e) => handleBankChange(idx, 'iban', e.target.value)}
                  className="px-3 py-2 border rounded-md"
                  placeholder="IBAN (optional)"
                />
              </div>
            ))}
            <button
              type="button"
              onClick={addBank}
              className="text-indigo-600 text-sm"
            >
              + Add Another Bank
            </button>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="acceptedRules"
              checked={formData.acceptedRules}
              onChange={handleChange}
              className="mr-2"
              required
            />
            <label className="text-sm text-gray-700">
              I accept the platform rules and terms of service
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Submitting...' : 'Submit Verification'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SubmitVerification;