import React from 'react';
import { SlidersHorizontal, ChevronDown } from 'lucide-react';
import Navbar from '../components/Navbar';
import PropertyCard from '../components/PropertyCard';
import FilterSidebar from '../components/FilterSidebar';
import { useStore } from '../store';
import { Property } from '../types';

const Accommodations: React.FC = () => {
  const { properties, filters } = useStore();
  const [showFilters, setShowFilters] = React.useState(false);
  const [sortBy, setSortBy] = React.useState<'price-low' | 'price-high' | 'rating' | 'newest'>('newest');

  // Filter properties
  const filteredProperties = React.useMemo(() => {
    let result = [...properties];

    // Apply filters
    if (filters.propertyType) {
      result = result.filter(p => p.propertyType === filters.propertyType);
    }

    if (filters.maxRent) {
      result = result.filter(p => p.rentPerMonth <= filters.maxRent!);
    }

    if (filters.city) {
      result = result.filter(p => p.city.toLowerCase().includes(filters.city!.toLowerCase()));
    }

    // Apply sorting
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.rentPerMonth - b.rentPerMonth);
        break;
      case 'price-high':
        result.sort((a, b) => b.rentPerMonth - a.rentPerMonth);
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [properties, filters, sortBy]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Find Accommodation</h1>
          <p className="text-gray-600">{filteredProperties.length} properties available</p>
        </div>

        {/* Mobile Filter Button */}
        <div className="md:hidden mb-4 flex gap-2">
          <button
            onClick={() => setShowFilters(true)}
            className="flex-1 flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-600" />
            <span className="font-medium text-gray-900">Filters</span>
          </button>

          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="appearance-none px-4 py-3 pr-10 bg-white border border-gray-300 rounded-lg font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
            >
              <option value="newest">Newest</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-600 pointer-events-none" />
          </div>
        </div>

        {/* Desktop Sort */}
        <div className="hidden md:flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            {filters.propertyType && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                {filters.propertyType}
              </span>
            )}
            {filters.maxRent && (
              <span className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">
                Max ₹{filters.maxRent.toLocaleString('en-IN')}
              </span>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none px-4 py-2 pr-10 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent cursor-pointer"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-6">
          {/* Filters Sidebar - Desktop */}
          <div className="hidden md:block w-80 flex-shrink-0">
            <FilterSidebar isOpen={true} onClose={() => {}} />
          </div>

          {/* Filters Sidebar - Mobile */}
          <FilterSidebar isOpen={showFilters} onClose={() => setShowFilters(false)} />

          {/* Property Grid */}
          <div className="flex-1">
            {filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.propertyId} property={property} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <SlidersHorizontal className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No properties found</h3>
                <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Accommodations;
