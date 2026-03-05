import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
import { Property } from '../types';
import { useStore } from '../store';
import { useNavigate } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, featured = false }) => {
  const navigate = useNavigate();
  const { wishlist, addToWishlist, removeFromWishlist } = useStore();
  const isWishlisted = wishlist.includes(property.propertyId);

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isWishlisted) {
      removeFromWishlist(property.propertyId);
    } else {
      addToWishlist(property.propertyId);
    }
  };

  const handleCardClick = () => {
    navigate(`/property/${property.propertyId}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 group"
    >
      {/* Image */}
      <div className="relative h-56 overflow-hidden">
        <img
          src={property.images[0]}
          alt={property.propertyName}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {featured && (
            <span className="px-3 py-1 bg-white text-xs font-semibold rounded-full shadow-md">
              GUEST FAVORITE
            </span>
          )}
          {property.availableRooms === 0 && (
            <span className="px-3 py-1 bg-gray-800 text-white text-xs font-semibold rounded-full">
              Sold Out
            </span>
          )}
          {property.availableRooms === 1 && (
            <span className="px-3 py-1 bg-primary-600 text-white text-xs font-semibold rounded-full animate-pulse">
              Only 1 room left
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-3 right-3 p-2 bg-white/80 hover:bg-white rounded-full shadow-md transition-colors"
        >
          <Heart
            className={`w-5 h-5 ${isWishlisted ? 'fill-primary-600 text-primary-600' : 'text-gray-700'}`}
          />
        </button>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Location & Rating */}
        <div className="flex items-start justify-between mb-2">
          <div className="flex-1">
            <div className="flex items-center text-gray-600 text-sm mb-1">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{property.location}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 truncate">
              {property.propertyName}
            </h3>
          </div>
          
          {property.rating && (
            <div className="flex items-center ml-2">
              <Star className="w-4 h-4 text-yellow-400 fill-yellow-400 mr-1" />
              <span className="text-sm font-semibold text-gray-900">{property.rating}</span>
            </div>
          )}
        </div>

        {/* Property Type */}
        <p className="text-sm text-gray-600 mb-3">{property.propertyType}</p>

        {/* Rooms Available */}
        <p className="text-sm text-gray-600 mb-3">
          {property.availableRooms > 0 
            ? `${property.availableRooms} room${property.availableRooms > 1 ? 's' : ''} available`
            : 'No rooms available'
          }
        </p>

        {/* Price */}
        <div className="flex items-baseline">
          <span className="text-xl font-bold text-gray-900">₹{property.rentPerMonth.toLocaleString('en-IN')}</span>
          <span className="text-sm text-gray-600 ml-1">/month</span>
        </div>
      </div>
    </div>
  );
};

export default PropertyCard;
