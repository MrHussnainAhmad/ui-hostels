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
  SHARED: 'Multiple students share a room, price per person.',
  PRIVATE: 'Single student gets entire room, price per room.',
  SHARED_FULLROOM:
    'Students can book full room or share, price per person with optional group discount.',
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

  const [roomTypes, setRoomTypes] = useState<RoomTypeConfig[]>([
    { type: 'SHARED', totalRooms: 1, personsInRoom: 2, price: 0 },
  ]);

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

  const handleFacilityChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setFormData({
        ...formData,
        facilities: {
          ...formData.facilities,
          [name]: (e.target as HTMLInputElement).checked,
        },
      });
    } else {
      setFormData({
        ...formData,
        facilities: { ...formData.facilities, [name]: value },
      });
    }
  };

  const handleArrayChange = (
    field: string,
    index: number,
    value: string,
    isFacility = false
  ) => {
    if (isFacility) {
      const arr = [...formData.facilities.customFacilities];
      arr[index] = value;
      setFormData({
        ...formData,
        facilities: { ...formData.facilities, customFacilities: arr },
      });
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
      setFormData({
        ...formData,
        [field]: [...(formData as any)[field], ''],
      });
    }
  };

  const handleRoomTypeChange = (
    index: number,
    field: keyof RoomTypeConfig,
    value: any
  ) => {
    const updated = [...roomTypes];
    updated[index] = { ...updated[index], [field]: value };
    setRoomTypes(updated);
  };

  const addRoomType = () => {
    const existingTypes = roomTypes.map((rt) => rt.type);
    const availableTypes: RoomType[] = ['SHARED', 'PRIVATE', 'SHARED_FULLROOM'].filter(
      (t) => !existingTypes.includes(t as RoomType)
    ) as RoomType[];

    if (availableTypes.length === 0) {
      setError('All room types have been added.');
      return;
    }

    const newType = availableTypes[0];
    setRoomTypes([
      ...roomTypes,
      {
        type: newType,
        totalRooms: 1,
        personsInRoom: newType === 'PRIVATE' ? 1 : 2,
        price: 0,
      },
    ]);
  };

  const removeRoomType = (index: number) => {
    if (roomTypes.length === 1) {
      setError('At least one room type is required.');
      return;
    }
    setRoomTypes(roomTypes.filter((_, i) => i !== index));
  };

  const getAvailableTypesForSelect = (currentType: RoomType): RoomType[] => {
    const existingTypes = roomTypes.map((rt) => rt.type);
    return ['SHARED', 'PRIVATE', 'SHARED_FULLROOM'].filter(
      (t) => t === currentType || !existingTypes.includes(t as RoomType)
    ) as RoomType[];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (roomImageFiles.length === 0) {
      setError('Please upload at least one room image.');
      return;
    }

    if (roomTypes.length === 0) {
      setError('Please add at least one room type.');
      return;
    }

    for (const rt of roomTypes) {
      if (rt.price <= 0) {
        setError(
          `Please enter a valid price for ${ROOM_TYPE_LABELS[rt.type]}`
        );
        return;
      }
      if (rt.totalRooms <= 0) {
        setError(
          `Please enter valid total rooms for ${ROOM_TYPE_LABELS[rt.type]}`
        );
        return;
      }
    }

    setLoading(true);

    try {
      const payload = {
        ...formData,
        nearbyLocations: formData.nearbyLocations.filter((n) => n.trim()),
        seoKeywords: formData.seoKeywords.filter((n) => n.trim()),
        roomTypes: roomTypes.map((rt) => ({
          type: rt.type,
          totalRooms: Number(rt.totalRooms),
          personsInRoom: Number(rt.personsInRoom),
          price: Number(rt.price),
          fullRoomPriceDiscounted: rt.fullRoomPriceDiscounted
            ? Number(rt.fullRoomPriceDiscounted)
            : null,
        })),
        facilities: {
          ...formData.facilities,
          electricityRatePerUnit: formData.facilities.electricityRatePerUnit
            ? Number(formData.facilities.electricityRatePerUnit)
            : null,
          wifiMaxUsers: formData.facilities.wifiMaxUsers
            ? Number(formData.facilities.wifiMaxUsers)
            : null,
          customFacilities:
            formData.facilities.customFacilities.filter((n) => n.trim()),
        },
      };

      const formDataToSend = createFormData(payload, [
        { fieldName: 'roomImages', files: roomImageFiles },
      ]);

      await hostelsApi.create(formDataToSend);
      navigate('/manager');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create hostel.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-10">
        {/* Header */}
        <div className="mb-8">
          <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
            Manager • Hostels
          </div>
          <h1 className="text-2xl font-light text-gray-900 mb-1">
            Create New Hostel
          </h1>
          <p className="text-sm text-gray-500 font-light">
            Add details about your hostel, room types, and facilities.
          </p>
        </div>

        {/* Card */}
        <div className="border border-gray-100 bg-white px-6 py-7 sm:px-8 sm:py-8">
          {error && (
            <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 font-light">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Info */}
            <section className="space-y-4">
              <div>
                <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                  Basic Information
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-light">
                      Hostel Name
                    </label>
                    <input
                      type="text"
                      name="hostelName"
                      value={formData.hostelName}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
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
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Address
                </label>
                <textarea
                  name="address"
                  rows={2}
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
                />
              </div>

              <div className="w-full sm:w-1/3">
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
            </section>

            {/* Room Types */}
            <section className="border-t border-gray-100 pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
                    Room Types
                  </div>
                  <p className="text-xs text-gray-500 font-light">
                    Add all room configurations you offer.
                  </p>
                </div>
                {roomTypes.length < 3 && (
                  <button
                    type="button"
                    onClick={addRoomType}
                    className="px-4 py-2 bg-gray-900 text-white text-xs font-light hover:bg-gray-800 transition-colors"
                  >
                    + Add Room Type
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {roomTypes.map((roomType, index) => (
                  <div
                    key={index}
                    className="border border-gray-200 bg-gray-50 px-4 py-4"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-light text-gray-900">
                        Room Type {index + 1}
                      </h4>
                      {roomTypes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRoomType(index)}
                          className="text-xs text-red-600 font-light hover:text-red-700"
                        >
                          Remove
                        </button>
                      )}
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-light">
                          Type
                        </label>
                        <select
                          value={roomType.type}
                          onChange={(e) =>
                            handleRoomTypeChange(
                              index,
                              'type',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                        >
                          {getAvailableTypesForSelect(
                            roomType.type
                          ).map((type) => (
                            <option key={type} value={type}>
                              {ROOM_TYPE_LABELS[type]}
                            </option>
                          ))}
                        </select>
                        <p className="text-[11px] text-gray-500 font-light mt-1">
                          {ROOM_TYPE_DESCRIPTIONS[roomType.type]}
                        </p>
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-light">
                          Total Rooms
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={roomType.totalRooms}
                          onChange={(e) =>
                            handleRoomTypeChange(
                              index,
                              'totalRooms',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-light">
                          Persons per Room
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={roomType.personsInRoom}
                          onChange={(e) =>
                            handleRoomTypeChange(
                              index,
                              'personsInRoom',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-xs text-gray-500 mb-1 font-light">
                          {roomType.type === 'PRIVATE'
                            ? 'Price per Room (Rs.)'
                            : 'Price per Person (Rs.)'}
                        </label>
                        <input
                          type="number"
                          min={1}
                          value={roomType.price || ''}
                          onChange={(e) =>
                            handleRoomTypeChange(
                              index,
                              'price',
                              e.target.value
                            )
                          }
                          className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                          required
                        />
                      </div>

                      {roomType.type === 'SHARED_FULLROOM' && (
                        <div className="sm:col-span-2">
                          <label className="block text-xs text-gray-500 mb-1 font-light">
                            Full Room Discounted Price (Rs., optional)
                          </label>
                          <input
                            type="number"
                            value={
                              roomType.fullRoomPriceDiscounted || ''
                            }
                            onChange={(e) =>
                              handleRoomTypeChange(
                                index,
                                'fullRoomPriceDiscounted',
                                e.target.value || null
                              )
                            }
                            className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                            placeholder="Total price if one group books the entire room"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Facilities */}
            <section className="border-t border-gray-100 pt-6 space-y-4">
              <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-1">
                Facilities
              </div>
              <div className="grid sm:grid-cols-2 gap-3 text-xs text-gray-700">
                <label className="flex items-center gap-2 font-light">
                  <input
                    type="checkbox"
                    name="hotColdWaterBath"
                    checked={formData.facilities.hotColdWaterBath}
                    onChange={handleFacilityChange}
                    className="w-4 h-4 text-gray-900 border-gray-300"
                  />
                  Hot / Cold Water Bath
                </label>
                <label className="flex items-center gap-2 font-light">
                  <input
                    type="checkbox"
                    name="drinkingWater"
                    checked={formData.facilities.drinkingWater}
                    onChange={handleFacilityChange}
                    className="w-4 h-4 text-gray-900 border-gray-300"
                  />
                  Drinking Water
                </label>
                <label className="flex items-center gap-2 font-light">
                  <input
                    type="checkbox"
                    name="electricityBackup"
                    checked={formData.facilities.electricityBackup}
                    onChange={handleFacilityChange}
                    className="w-4 h-4 text-gray-900 border-gray-300"
                  />
                  Electricity Backup
                </label>
                <label className="flex items-center gap-2 font-light">
                  <input
                    type="checkbox"
                    name="wifiEnabled"
                    checked={formData.facilities.wifiEnabled}
                    onChange={handleFacilityChange}
                    className="w-4 h-4 text-gray-900 border-gray-300"
                  />
                  WiFi Enabled
                </label>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-500 mb-1 font-light">
                    Electricity Type
                  </label>
                  <select
                    name="electricityType"
                    value={formData.facilities.electricityType}
                    onChange={handleFacilityChange}
                    className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                  >
                    <option value="INCLUDED">Included</option>
                    <option value="SELF">Self (Pay per unit)</option>
                  </select>
                </div>
                {formData.facilities.electricityType === 'SELF' && (
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-light">
                      Rate per Unit (Rs.)
                    </label>
                    <input
                      type="number"
                      name="electricityRatePerUnit"
                      value={formData.facilities.electricityRatePerUnit}
                      onChange={handleFacilityChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                )}
              </div>

              {formData.facilities.wifiEnabled && (
                <div className="grid sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-light">
                      WiFi Plan
                    </label>
                    <input
                      type="text"
                      name="wifiPlan"
                      value={formData.facilities.wifiPlan}
                      onChange={handleFacilityChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-light">
                      Max Users
                    </label>
                    <input
                      type="number"
                      name="wifiMaxUsers"
                      value={formData.facilities.wifiMaxUsers}
                      onChange={handleFacilityChange}
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1 font-light">
                      Avg Speed
                    </label>
                    <input
                      type="text"
                      name="wifiAvgSpeed"
                      value={formData.facilities.wifiAvgSpeed}
                      onChange={handleFacilityChange}
                      placeholder="e.g., 50 Mbps"
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-gray-900 font-light"
                    />
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs text-gray-500 mb-1 font-light">
                  Custom Facilities
                </label>
                {formData.facilities.customFacilities.map(
                  (facility, idx) => (
                    <input
                      key={idx}
                      type="text"
                      value={facility}
                      onChange={(e) =>
                        handleArrayChange(
                          'customFacilities',
                          idx,
                          e.target.value,
                          true
                        )
                      }
                      className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 mb-2 focus:outline-none focus:border-gray-900 font-light"
                      placeholder="e.g., Laundry, Gym, Mess"
                    />
                  )
                )}
                <button
                  type="button"
                  onClick={() => addArrayItem('customFacilities', true)}
                  className="text-xs text-gray-900 font-light hover:underline"
                >
                  + Add Custom Facility
                </button>
              </div>
            </section>

            {/* Images */}
            <section className="border-t border-gray-100 pt-6">
              <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                Room Images
              </div>
              <ImageUpload
                label="Upload Room Images (max 10)"
                multiple
                maxFiles={10}
                value={roomImageFiles}
                onChange={setRoomImageFiles}
              />
            </section>

            {/* Nearby Locations */}
            <section className="border-t border-gray-100 pt-6">
              <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                Nearby Locations
              </div>
              {formData.nearbyLocations.map((loc, idx) => (
                <input
                  key={idx}
                  type="text"
                  value={loc}
                  onChange={(e) =>
                    handleArrayChange(
                      'nearbyLocations',
                      idx,
                      e.target.value
                    )
                  }
                  className="w-full px-3 py-2 bg-white border border-gray-200 text-sm text-gray-900 mb-2 focus:outline-none focus:border-gray-900 font-light"
                  placeholder="e.g., University, Mall, Hospital"
                />
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('nearbyLocations')}
                className="text-xs text-gray-900 font-light hover:underline"
              >
                + Add Location
              </button>
            </section>

            {/* Rules */}
            <section className="border-t border-gray-100 pt-6">
              <div className="text-xs font-medium tracking-widest uppercase text-gray-400 mb-2">
                Rules
              </div>
              <textarea
                name="rules"
                rows={4}
                value={formData.rules}
                onChange={handleChange}
                placeholder="Enter hostel rules..."
                className="w-full px-4 py-2.5 bg-white border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-gray-900 font-light"
              />
            </section>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
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
                {loading ? 'Creating...' : 'Create Hostel'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
};

export default CreateHostel;