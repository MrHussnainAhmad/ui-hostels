// src/pages/manager/CreateHostel.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hostelsApi, createFormData } from '../../lib/api';
import ImageUpload from '../../components/ImageUpload';

type RoomType = 'SHARED' | 'PRIVATE' | 'SHARED_FULLROOM';

interface RoomTypeConfig {
  type: RoomType;
  totalRooms: number;
  personsInRoom: number;
  price: number;
  fullRoomPriceDiscounted?: number | null;
}

const ROOM_TYPE_LABELS: Record<RoomType, string> = {
  SHARED: 'Shared Room',
  PRIVATE: 'Private Room',
  SHARED_FULLROOM: 'Shared Full Room',
};

const ROOM_TYPE_DESCRIPTIONS: Record<RoomType, string> = {
  SHARED: 'Multiple students share a room, price per person',
  PRIVATE: 'Single student gets entire room, price per room',
  SHARED_FULLROOM: 'Students can book full room or share, price per person with optional group discount',
};

const CreateHostel: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roomImageFiles, setRoomImageFiles] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    hostelName: '',
    city: '',
    address: '',
    nearbyLocations: [''],
    hostelFor: 'BOYS' as 'BOYS' | 'GIRLS',
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

  // Room types state - can have multiple
  const [roomTypes, setRoomTypes] = useState<RoomTypeConfig[]>([
    { type: 'SHARED', totalRooms: 1, personsInRoom: 2, price: 0 },
  ]);

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

  // Room type handlers
  const handleRoomTypeChange = (index: number, field: keyof RoomTypeConfig, value: any) => {
    const updated = [...roomTypes];
    updated[index] = { ...updated[index], [field]: value };
    setRoomTypes(updated);
  };

  const addRoomType = () => {
    // Find which types are not yet added
    const existingTypes = roomTypes.map(rt => rt.type);
    const availableTypes: RoomType[] = ['SHARED', 'PRIVATE', 'SHARED_FULLROOM'].filter(
      t => !existingTypes.includes(t as RoomType)
    ) as RoomType[];

    if (availableTypes.length === 0) {
      setError('All room types have been added');
      return;
    }

    setRoomTypes([
      ...roomTypes,
      { type: availableTypes[0], totalRooms: 1, personsInRoom: availableTypes[0] === 'PRIVATE' ? 1 : 2, price: 0 },
    ]);
  };

  const removeRoomType = (index: number) => {
    if (roomTypes.length === 1) {
      setError('At least one room type is required');
      return;
    }
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const getAvailableTypesForSelect = (currentType: RoomType): RoomType[] => {
    const existingTypes = roomTypes.map(rt => rt.type);
    return ['SHARED', 'PRIVATE', 'SHARED_FULLROOM'].filter(
      t => t === currentType || !existingTypes.includes(t as RoomType)
    ) as RoomType[];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (roomImageFiles.length === 0) {
      setError('Please upload at least one room image');
      return;
    }

    if (roomTypes.length === 0) {
      setError('Please add at least one room type');
      return;
    }

    // Validate room types
    for (const rt of roomTypes) {
      if (rt.price <= 0) {
        setError(`Please enter a valid price for ${ROOM_TYPE_LABELS[rt.type]}`);
        return;
      }
      if (rt.totalRooms <= 0) {
        setError(`Please enter valid total rooms for ${ROOM_TYPE_LABELS[rt.type]}`);
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        nearbyLocations: formData.nearbyLocations.filter((n) => n.trim()),
        seoKeywords: formData.seoKeywords.filter((n) => n.trim()),
        roomTypes: roomTypes.map(rt => ({
          type: rt.type,
          totalRooms: Number(rt.totalRooms),
          personsInRoom: Number(rt.personsInRoom),
          price: Number(rt.price),
          fullRoomPriceDiscounted: rt.fullRoomPriceDiscounted ? Number(rt.fullRoomPriceDiscounted) : null,
        })),
        facilities: {
          ...formData.facilities,
          electricityRatePerUnit: formData.facilities.electricityRatePerUnit
            ? Number(formData.facilities.electricityRatePerUnit)
            : null,
          wifiMaxUsers: formData.facilities.wifiMaxUsers ? Number(formData.facilities.wifiMaxUsers) : null,
          customFacilities: formData.facilities.customFacilities.filter((n) => n.trim()),
        },
      };

      const formDataToSend = createFormData(payload, [
        { fieldName: 'roomImages', files: roomImageFiles },
      ]);

      await hostelsApi.create(formDataToSend);
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

          {/* Room Types Section */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg">Room Types</h3>
                <p className="text-sm text-gray-500">Add different types of rooms available in your hostel</p>
              </div>
              {roomTypes.length < 3 && (
                <button
                  type="button"
                  onClick={addRoomType}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 text-sm"
                >
                  + Add Room Type
                </button>
              )}
            </div>

            <div className="space-y-4">
              {roomTypes.map((roomType, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-indigo-600">Room Type {index + 1}</h4>
                    {roomTypes.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeRoomType(index)}
                        className="text-red-600 hover:text-red-800 text-sm"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Type</label>
                      <select
                        value={roomType.type}
                        onChange={(e) => handleRoomTypeChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border rounded-md"
                      >
                        {getAvailableTypesForSelect(roomType.type).map((type) => (
                          <option key={type} value={type}>
                            {ROOM_TYPE_LABELS[type]}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-500 mt-1">
                        {ROOM_TYPE_DESCRIPTIONS[roomType.type]}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Total Rooms</label>
                      <input
                        type="number"
                        value={roomType.totalRooms}
                        onChange={(e) => handleRoomTypeChange(index, 'totalRooms', e.target.value)}
                        min={1}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">Persons per Room</label>
                      <input
                        type="number"
                        value={roomType.personsInRoom}
                        onChange={(e) => handleRoomTypeChange(index, 'personsInRoom', e.target.value)}
                        min={1}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1">
                        {roomType.type === 'PRIVATE' ? 'Price per Room (Rs.)' : 'Price per Person (Rs.)'}
                      </label>
                      <input
                        type="number"
                        value={roomType.price || ''}
                        onChange={(e) => handleRoomTypeChange(index, 'price', e.target.value)}
                        min={1}
                        className="w-full px-3 py-2 border rounded-md"
                        required
                      />
                    </div>

                    {roomType.type === 'SHARED_FULLROOM' && (
                      <div className="col-span-2">
                        <label className="block text-sm font-medium mb-1">
                          Full Room Discounted Price (Rs., optional)
                        </label>
                        <input
                          type="number"
                          value={roomType.fullRoomPriceDiscounted || ''}
                          onChange={(e) =>
                            handleRoomTypeChange(index, 'fullRoomPriceDiscounted', e.target.value || null)
                          }
                          className="w-full px-3 py-2 border rounded-md"
                          placeholder="Discount if entire room is booked by one group"
                        />
                        <p className="text-xs text-gray-500 mt-1">
                          Total price if a group books the entire room (optional discount)
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
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

          {/* Room Images */}
          <div className="border-t pt-4">
            <ImageUpload
              label="Room Images (Max 10)"
              multiple
              maxFiles={10}
              value={roomImageFiles}
              onChange={setRoomImageFiles}
            />
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