import React from 'react';
import { X, SlidersHorizontal } from 'lucide-react';
import { useStore } from '../store';
import { Filters } from '../types';

interface FilterSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ isOpen, onClose }) => {
  const { filters, setFilters } = useStore();
  const [localFilters, setLocalFilters] = React.useState<Filters>(filters);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setFilters(localFilters);
    onClose();
  };

  const clearFilters = () => {
    const emptyFilters: Filters = {};
    setLocalFilters(emptyFilters);
    setFilters(emptyFilters);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Sidebar */}
      <div className={`fixed md:sticky top-0 left-0 h-screen md:h-auto w-80 bg-white z-50 md:z-0 overflow-y-auto transition-transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-2">
              <SlidersHorizontal className="w-5 h-5 text-gray-900" />
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            </div>
            <button onClick={onClose} className="md:hidden p-1 hover:bg-gray-100 rounded-lg">
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Property Type */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">PROPERTY TYPE</h3>
            <div className="space-y-2">
              {['PG', 'Hostel', 'Apartment'].map((type) => (
                <label key={type} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="propertyType"
                    value={type}
                    checked={localFilters.propertyType === type}
                    onChange={(e) => handleFilterChange('propertyType', e.target.value)}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500"
                  />
                  <span className="text-sm text-gray-700">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Gender Specific */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">GENDER SPECIFIC</h3>
            <select
              value={localFilters.genderSpecific || ''}
              onChange={(e) => handleFilterChange('genderSpecific', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Any Gender</option>
              <option value="Male">Male Only</option>
              <option value="Female">Female Only</option>
              <option value="Co-living">Co-living</option>
            </select>
          </div>

          {/* Furnishing */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">FURNISHING</h3>
            <select
              value={localFilters.furnishing || ''}
              onChange={(e) => handleFilterChange('furnishing', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            >
              <option value="">Any Status</option>
              <option value="Fully Furnished">Fully Furnished</option>
              <option value="Semi-Furnished">Semi-Furnished</option>
              <option value="Unfurnished">Unfurnished</option>
            </select>
          </div>

          {/* Max Rent */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">MAX RENT</h3>
            <div className="space-y-3">
              <input
                type="range"
                min="0"
                max="50000"
                step="1000"
                value={localFilters.maxRent || 30000}
                onChange={(e) => handleFilterChange('maxRent', parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
              />
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">₹0</span>
                <span className="font-semibold text-primary-600">
                  ₹{(localFilters.maxRent || 30000).toLocaleString('en-IN')}
                </span>
                <span className="text-gray-600">₹50,000+</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              onClick={applyFilters}
              className="w-full px-4 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={clearFilters}
              className="w-full px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterSidebar;
