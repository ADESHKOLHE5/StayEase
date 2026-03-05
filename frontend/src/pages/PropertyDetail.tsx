import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Star, Wifi, Home, Shield, Zap, Heart, ChevronLeft } from 'lucide-react';
import Navbar from '../components/Navbar';
import { useStore } from '../store';

const PropertyDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { properties, wishlist, addToWishlist, removeFromWishlist, user } = useStore();
  
  const property = properties.find(p => p.propertyId === parseInt(id || '0'));
  const isWishlisted = property ? wishlist.includes(property.propertyId) : false;

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Property not found</h2>
          <button
            onClick={() => navigate('/accommodations')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            ← Back to listings
          </button>
        </div>
      </div>
    );
  }

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist(property.propertyId);
    } else {
      addToWishlist(property.propertyId);
    }
  };

  const handleBookNow = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // In a real app, this would create a booking
    alert('Booking request sent! The owner will review your application.');
  };

  const facilityIcons: Record<string, React.ReactNode> = {
    'WiFi': <Wifi className="w-5 h-5" />,
    'Security': <Shield className="w-5 h-5" />,
    'Parking': <Home className="w-5 h-5" />,
    'Power Backup': <Zap className="w-5 h-5" />,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Images & Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Image Gallery */}
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src={property.images[0]}
                alt={property.propertyName}
                className="w-full h-96 object-cover"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                <span className="px-3 py-1 bg-white text-gray-900 text-sm font-semibold rounded-full shadow-md">
                  {property.propertyType}
                </span>
              </div>

              {/* Wishlist */}
              <button
                onClick={handleWishlistToggle}
                className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-full shadow-md transition-colors"
              >
                <Heart
                  className={`w-6 h-6 ${isWishlisted ? 'fill-primary-600 text-primary-600' : 'text-gray-700'}`}
                />
              </button>
            </div>

            {/* Property Info */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-3">
                    {property.propertyName}
                  </h1>
                  <div className="flex items-center text-gray-600 mb-2">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>{property.location}</span>
                  </div>
                </div>
                
                {property.rating && (
                  <div className="flex items-center bg-gray-50 px-4 py-2 rounded-lg">
                    <Star className="w-5 h-5 text-yellow-400 fill-yellow-400 mr-1" />
                    <span className="font-bold text-gray-900 mr-1">{property.rating}</span>
                    <span className="text-sm text-gray-600">({property.reviewCount} reviews)</span>
                  </div>
                )}
              </div>

              <div className="border-t border-gray-100 pt-4 mt-4">
                <h3 className="text-lg font-bold text-gray-900 mb-3">About this place</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  {property.description}
                </p>
                
                {property.aiSummary && (
                  <div className="bg-primary-50 border border-primary-100 rounded-lg p-4">
                    <p className="text-sm font-medium text-primary-900">
                      AI Summary: {property.aiSummary}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Facilities */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Amenities & Facilities</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {property.facilities.map((facility, index) => (
                  <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="text-primary-600">
                      {facilityIcons[facility] || <Home className="w-5 h-5" />}
                    </div>
                    <span className="text-sm font-medium text-gray-900">{facility}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Availability</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total Rooms</p>
                  <p className="text-2xl font-bold text-gray-900">{property.totalRooms}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600 mb-1">Available Now</p>
                  <p className="text-2xl font-bold text-primary-600">{property.availableRooms}</p>
                </div>
              </div>
              
              {property.availableRooms === 1 && (
                <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg flex items-center space-x-2">
                  <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                  <p className="text-sm font-medium text-amber-800">
                    Only 1 room left - Book now before it's gone!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Booking Card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 sticky top-24">
              <div className="mb-6">
                <div className="flex items-baseline mb-2">
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{property.rentPerMonth.toLocaleString('en-IN')}
                  </span>
                  <span className="text-gray-600 ml-2">/month</span>
                </div>
                <p className="text-sm text-gray-500">
                  Monthly rent (including all charges)
                </p>
              </div>

              {property.availableRooms > 0 ? (
                <>
                  <button
                    onClick={handleBookNow}
                    className="w-full py-4 bg-primary-600 text-white font-bold rounded-xl hover:bg-primary-700 transition-colors shadow-lg shadow-primary-200 mb-3"
                  >
                    Book Now
                  </button>
                  <button className="w-full py-4 border-2 border-gray-300 text-gray-900 font-bold rounded-xl hover:bg-gray-50 transition-colors">
                    View Details
                  </button>
                </>
              ) : (
                <button
                  disabled
                  className="w-full py-4 bg-gray-300 text-gray-500 font-bold rounded-xl cursor-not-allowed"
                >
                  Sold Out
                </button>
              )}

              <div className="mt-6 pt-6 border-t border-gray-100">
                <h4 className="font-bold text-gray-900 mb-3">What you'll get</h4>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <Shield className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Verified property owner</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Zap className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Instant booking confirmation</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <Home className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">Zero brokerage fees</span>
                  </li>
                </ul>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  By booking, you agree to our Terms & Conditions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PropertyDetail;
