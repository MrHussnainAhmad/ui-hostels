import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hostelsApi } from '../../lib/api';

const CreateHostel: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    hostelName: '',
    city: '',
    address: '',
    nearbyLocations: [''],
    totalRooms: 1,
    hostelType: 'SHARED' as 'SHARED' | 'PRIVATE' | 'SHARED_FULLROOM',
    hostelFor: 'BOYS' as 'BOYS' | 'GIRLS',
    personsInRoom: 2,
    roomPrice: '',
    pricePerHeadShared: '',
    pricePerHeadFullRoom: '',
    fullRoomPriceDiscounted: '',
    roomImages: [''],
    rules: '',
    seoKeywords: [''],
    facilities: {
      hotColdWaterBath: false,
      drinkingWater: false,
      electricityBackup: false,
      electricityType: 'INCLUDED' as 'INCLUDED' | 'SELF',
      electricityRatePerUnit: '',
      wifiEnabled: false,
      wifiPlan: '',
      wifiMaxUsers: '',
      wifiAvgSpeed: '',
      customFacilities: [''],
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({ ...formData, [name]: (e.target as HTMLInputElement).checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFacilityChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        facilities: { ...formData.facilities, [name]: (e.target as HTMLInputElement).checked },
      });
    } else {
      setFormData({
        ...formData,
        facilities: { ...formData.facilities, [name]: value },
      });
    }
  };

  const handleArrayChange = (field: string, index: number, value: string, isFacility = false) => {
    if (isFacility) {
      const arr = [...formData.facilities.customFacilities];
      arr[index] = value;
      setFormData({ ...formData, facilities: { ...formData.facilities, customFacilities: arr } });
    } else {
      const arr = [...(formData as any)[field]];
      arr[index] = value;
      setFormData({ ...formData, [field]: arr });
    }
  };

  const addArrayItem = (field: string, isFacility = false) => {
    if (isFacility) {
      setFormData({
        ...formData,
        facilities: {
          ...formData.facilities,
          customFacilities: [...formData.facilities.customFacilities, ''],
        },
      });
    } else {
      setFormData({ ...formData, [field]: [...(formData as any)[field], ''] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const payload = {
        ...formData,
        totalRooms: Number(formData.totalRooms),
        personsInRoom: Number(formData.personsInRoom),
        roomPrice: formData.roomPrice ? Number(formData.roomPrice) : null,
        pricePerHeadShared: formData.pricePerHeadShared ? Number(formData.pricePerHeadShared) : null,
        pricePerHeadFullRoom: formData.pricePerHeadFullRoom ? Number(formData.pricePerHeadFullRoom) : null,
        fullRoomPriceDiscounted: formData.fullRoomPriceDiscounted ? Number(formData.fullRoomPriceDiscounted) : null,
        nearbyLocations: formData.nearbyLocations.filter((n) => n.trim()),
        roomImages: formData.roomImages.filter((n) => n.trim()),
        seoKeywords: formData.seoKeywords.filter((n) => n.trim()),
        facilities: {
          ...formData.facilities,
          electricityRatePerUnit: formData.facilities.electricityRatePerUnit
            ? Number(formData.facilities.electricityRatePerUnit)
            : null,
          wifiMaxUsers: formData.facilities.wifiMaxUsers ? Number(formData.facilities.wifiMaxUsers) : null,
          customFacilities: formData.facilities.customFacilities.filter((n) => n.trim()),
        },
      };

      await hostelsApi.create(payload);
      navigate('/manager');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create hostel');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Create New Hostel</h1>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hostel Name</label>
              <input
                type="text"
                name="hostelName"
                value={formData.hostelName}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Hostel For</label>
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
            <div>
              <label className="block text-sm font-medium mb-1">Hostel Type</label>
              <select
                name="hostelType"
                value={formData.hostelType}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              >
                <option value="SHARED">Shared</option>
                <option value="PRIVATE">Private</option>
                <option value="SHARED_FULLROOM">Shared Full Room</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Persons per Room</label>
              <input
                type="number"
                name="personsInRoom"
                value={formData.personsInRoom}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Total Rooms</label>
              <input
                type="number"
                name="totalRooms"
                value={formData.totalRooms}
                onChange={handleChange}
                min={1}
                className="w-full px-3 py-2 border rounded-md"
                required
              />
            </div>
          </div>

          {/* Pricing */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Pricing</h3>
            <div className="grid grid-cols-2 gap-4">
              {formData.hostelType === 'PRIVATE' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Room Price (Rs.)</label>
                  <input
                    type="number"
                    name="roomPrice"
                    value={formData.roomPrice}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              )}
              {formData.hostelType === 'SHARED' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Price Per Head Shared (Rs.)</label>
                  <input
                    type="number"
                    name="pricePerHeadShared"
                    value={formData.pricePerHeadShared}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border rounded-md"
                    required
                  />
                </div>
              )}
              {formData.hostelType === 'SHARED_FULLROOM' && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Price Per Head Full Room (Rs.)</label>
                    <input
                      type="number"
                      name="pricePerHeadFullRoom"
                      value={formData.pricePerHeadFullRoom}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Room Discounted Price (Rs., optional)</label>
                    <input
                      type="number"
                      name="fullRoomPriceDiscounted"
                      value={formData.fullRoomPriceDiscounted}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border rounded-md"
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Facilities */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Facilities</h3>
            <div className="grid grid-cols-2 gap-4">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="hotColdWaterBath"
                  checked={formData.facilities.hotColdWaterBath}
                  onChange={handleFacilityChange}
                  className="mr-2"
                />
                Hot/Cold Water Bath
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="drinkingWater"
                  checked={formData.facilities.drinkingWater}
                  onChange={handleFacilityChange}
                  className="mr-2"
                />
                Drinking Water
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="electricityBackup"
                  checked={formData.facilities.electricityBackup}
                  onChange={handleFacilityChange}
                  className="mr-2"
                />
                Electricity Backup
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="wifiEnabled"
                  checked={formData.facilities.wifiEnabled}
                  onChange={handleFacilityChange}
                  className="mr-2"
                />
                WiFi Enabled
              </label>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium mb-1">Electricity Type</label>
                <select
                  name="electricityType"
                  value={formData.facilities.electricityType}
                  onChange={handleFacilityChange}
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="INCLUDED">Included</option>
                  <option value="SELF">Self (Pay per unit)</option>
                </select>
              </div>
              {formData.facilities.electricityType === 'SELF' && (
                <div>
                  <label className="block text-sm font-medium mb-1">Rate per Unit (Rs.)</label>
                  <input
                    type="number"
                    name="electricityRatePerUnit"
                    value={formData.facilities.electricityRatePerUnit}
                    onChange={handleFacilityChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
              )}
            </div>

            {formData.facilities.wifiEnabled && (
              <div className="grid grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">WiFi Plan</label>
                  <input
                    type="text"
                    name="wifiPlan"
                    value={formData.facilities.wifiPlan}
                    onChange={handleFacilityChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Max Users</label>
                  <input
                    type="number"
                    name="wifiMaxUsers"
                    value={formData.facilities.wifiMaxUsers}
                    onChange={handleFacilityChange}
                    className="w-full px-3 py-2 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Avg Speed</label>
                  <input
                    type="text"
                    name="wifiAvgSpeed"
                    value={formData.facilities.wifiAvgSpeed}
                    onChange={handleFacilityChange}
                    className="w-full px-3 py-2 border rounded-md"
                    placeholder="e.g., 50 Mbps"
                  />
                </div>
              </div>
            )}

            <div className="mt-4">
              <label className="block text-sm font-medium mb-1">Custom Facilities</label>
              {formData.facilities.customFacilities.map((facility, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={facility}
                  onChange={(e) => handleArrayChange('customFacilities', idx, e.target.value, true)}
                  className="w-full px-3 py-2 border rounded-md mb-2"
                  placeholder="e.g., Laundry, Gym, Mess"
                />
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('customFacilities', true)}
                className="text-indigo-600 text-sm"
              >
                + Add Custom Facility
              </button>
            </div>
          </div>

          {/* Images */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Room Images (URLs)</h3>
            {formData.roomImages.map((img, idx) => (
              <input
                key={idx}
                type="url"
                value={img}
                onChange={(e) => handleArrayChange('roomImages', idx, e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-2"
                placeholder="https://example.com/room.jpg"
              />
            ))}
            <button type="button" onClick={() => addArrayItem('roomImages')} className="text-indigo-600 text-sm">
              + Add Image
            </button>
          </div>

          {/* Nearby Locations */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Nearby Locations</h3>
            {formData.nearbyLocations.map((loc, idx) => (
              <input
                key={idx}
                type="text"
                value={loc}
                onChange={(e) => handleArrayChange('nearbyLocations', idx, e.target.value)}
                className="w-full px-3 py-2 border rounded-md mb-2"
                placeholder="e.g., University, Mall, Hospital"
              />
            ))}
            <button type="button" onClick={() => addArrayItem('nearbyLocations')} className="text-indigo-600 text-sm">
              + Add Location
            </button>
          </div>

          {/* Rules */}
          <div className="border-t pt-4">
            <h3 className="font-semibold mb-3">Rules</h3>
            <textarea
              name="rules"
              value={formData.rules}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter hostel rules..."
            />
          </div>

          {/* Submit */}
          <div className="flex space-x-4 pt-4">
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
              {loading ? 'Creating...' : 'Create Hostel'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateHostel;