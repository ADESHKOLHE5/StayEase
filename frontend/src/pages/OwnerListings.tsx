import React from 'react';
import { MapPin, Edit, Plus } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

const OwnerListings: React.FC = () => {
  const navigate = useNavigate();
  const { properties, user } = useStore();
  
  // Get owner's properties
  const ownerProperties = properties.filter(p => p.ownerId === user?.userId);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">My Listings</h1>
            <p className="text-gray-600">{ownerProperties.length} active properties</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
          <button 
            onClick={() => navigate('/owner/dashboard')}
            className="flex-1 px-4 py-2 text-gray-600 font-medium rounded-md hover:bg-white/50"
          >
            Booking Requests
          </button>
          <button className="flex-1 px-4 py-2 bg-white text-gray-900 font-medium rounded-md shadow-sm">
            My Listings
          </button>
        </div>

        {/* Property Cards */}
        {ownerProperties.length > 0 ? (
          <div className="space-y-4">
            {ownerProperties.map((property) => (
              <div key={property.propertyId} className="bg-white rounded-xl overflow-hidden border border-gray-100 hover:shadow-lg transition-shadow">
                <div className="flex flex-col md:flex-row">
                  {/* Image */}
                  <div className="md:w-48 h-48 md:h-auto flex-shrink-0">
                    <img
                      src={property.images[0]}
                      alt={property.propertyName}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-semibold">
                      {property.propertyType}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {property.propertyName}
                        </h3>
                        <div className="flex items-center text-gray-600 text-sm mb-3">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{property.location}</span>
                        </div>
                      </div>
                      
                      <button className="flex items-center space-x-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <Edit className="w-4 h-4" />
                        <span className="text-sm font-medium">Edit</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-3 gap-6">
                      <div>
                        <p className="text-xs text-gray-500 mb-1">MONTHLY RENT</p>
                        <p className="text-lg font-bold text-primary-600">
                          ₹{property.rentPerMonth.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">AVAILABLE</p>
                        <p className="text-lg font-bold text-gray-900">
                          {property.availableRooms} Units
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500 mb-1">TOTAL ROOMS</p>
                        <p className="text-lg font-bold text-gray-900">
                          {property.totalRooms}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center space-x-4 text-sm">
                        {property.availableRooms === 0 && (
                          <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full font-medium">
                            Booking Rejected
                          </span>
                        )}
                      </div>
                      
                      <button className="text-sm font-medium text-primary-600 hover:text-primary-700 transition-colors">
                        Details →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {/* Empty State for More Listings */}
            <div className="bg-white rounded-xl border-2 border-dashed border-gray-200 p-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">List another property</h3>
                <p className="text-gray-600 mb-6">Expand your portfolio and reach more tenants</p>
                <button
                  onClick={() => navigate('/owner/dashboard')}
                  className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Add New Property
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
            <Plus className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No properties listed</h3>
            <p className="text-gray-600 mb-6">Start by adding your first property</p>
            <button
              onClick={() => navigate('/owner/dashboard')}
              className="px-6 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700 transition-colors"
            >
              Add Property
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerListings;
