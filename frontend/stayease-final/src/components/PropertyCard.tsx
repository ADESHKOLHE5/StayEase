import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardMedia, CardContent, CardActions, Typography, Box, Chip, Button, Rating } from '@mui/material';
import { LocationOn as LocationIcon } from '@mui/icons-material';
import { Property } from '../types';

interface PropertyCardProps {
  property: Property;
  featured?: boolean;
}

const PropertyCard: React.FC<PropertyCardProps> = ({ property, featured = false }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/property/${property.propertyId}`);
  };

  const handleBookNow = () => {
    navigate(`/property/${property.propertyId}`, { state: { autoBook: true } });
  };

  const isSoldOut = property.availableRooms === 0;
  const isLastRoom = property.availableRooms === 1;

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: '0.3s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 6 } }}>
      <Box sx={{ position: 'relative' }}>
        <CardMedia component="img" height="200" image={property.images[0] || 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400'} alt={property.propertyName} />
        
        <Box sx={{ position: 'absolute', top: 12, left: 12, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {featured && <Chip label="GUEST FAVORITE" size="small" sx={{ bgcolor: 'white', fontWeight: 600, fontSize: '0.7rem' }} />}
          {isSoldOut && <Chip label="Sold Out" size="small" sx={{ bgcolor: '#2d3748', color: 'white', fontWeight: 600 }} />}
          {isLastRoom && !isSoldOut && (
            <Chip
              label="Only 1 room left"
              size="small"
              sx={{
                bgcolor: '#e53e3e',
                color: 'white',
                fontWeight: 600,
                animation: 'pulse 2s infinite',
                '@keyframes pulse': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
              }}
            />
          )}
        </Box>
      </Box>

      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary', mb: 0.5, flex: 1 }}>
            <LocationIcon sx={{ fontSize: 16, mr: 0.5 }} />
            <Typography variant="caption" noWrap>{property.location}</Typography>
          </Box>
          {property.rating && property.rating > 0 && (
            <Box sx={{ display: 'flex', alignItems: 'center', ml: 1 }}>
              <Rating value={property.rating} readOnly size="small" precision={0.1} />
              <Typography variant="caption" sx={{ ml: 0.5, fontWeight: 600 }}>{property.rating.toFixed(1)}</Typography>
            </Box>
          )}
        </Box>

        <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5, fontSize: '1rem' }} noWrap>{property.propertyName}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>{property.propertyType}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
          {property.availableRooms > 0 ? `${property.availableRooms} room${property.availableRooms > 1 ? 's' : ''} available` : 'No rooms available'}
        </Typography>

        <Box>
          {property.rentPerMonth && property.rentPerMonth > 0 ? (
            <>
              <Typography component="span" variant="h6" sx={{ fontWeight: 700, color: '#e53e3e' }}>
                ₹{property.rentPerMonth.toLocaleString('en-IN')}
              </Typography>
              <Typography component="span" variant="body2" sx={{ color: '#e53e3e', ml: 0.5 }}>/month</Typography>
            </>
          ) : null}
          {property.rentPerDay && property.rentPerDay > 0 ? (
            <Typography variant="body2" sx={{ color: '#e53e3e', fontWeight: 600 }}>
              ₹{property.rentPerDay.toLocaleString('en-IN')}/day
            </Typography>
          ) : null}
        </Box>
      </CardContent>

      <CardActions sx={{ p: 2, pt: 0, display: 'flex', justifyContent: 'space-between' }}>
        <Button size="small" onClick={handleViewDetails} sx={{ color: 'text.primary', '&:hover': { color: '#e53e3e' } }}>
          View Details
        </Button>
        <Button size="small" variant="contained" onClick={handleBookNow} disabled={isSoldOut} sx={{ bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' } }}>
          Book Now
        </Button>
      </CardActions>
    </Card>
  );
};

export default PropertyCard;
