import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  Stack
} from "@mui/material";

import {
  LocationOn,
  Wifi,
  LocalParking,
  Security
} from "@mui/icons-material";
import axiosInstance from '../api/axiosInstance';

interface Property {
  propertyId: string;
  propertyName: string;
  propertyType: string;
  address: string;
  city: string;
  state: string;
  rentPerMonth: number;
  availableRooms: number;
  facilities: string[];
  description: string;
  imageUrl: string;
}

interface PropertyCardProps {
  property: Property;
}

// ── text truncation helper ──
const truncSx = (lines: number) => ({
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical' as const,
});

const PropertyCard: React.FC<PropertyCardProps> = ({ property }) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const isOwner = user?.role?.toUpperCase() === 'OWNER';
  const isSoldOut = property.availableRooms === 0;

  const handleViewDetails = () => navigate(`/property/${property.propertyId}`);
  const handleBookNow = () => {
    if (!user) { navigate('/login'); return; }
    navigate(`/booking/${property.propertyId}`);
  };

  // ── AI Summary ──
  const [aiSummary, setAiSummary] = useState<string | null>(null);

  useEffect(() => {
    const cacheKey = `ai_summary_${property.propertyId}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) { setAiSummary(cached); return; }

    const fetchSummary = async () => {
      try {
        const res = await axiosInstance.post('/ai/summarize', {
          propertyName: property.propertyName,
          propertyType: property.propertyType,
          city: property.city,
          address: property.address,
          rentPerMonth: property.rentPerMonth,
          availableRooms: property.availableRooms,
          facilities: property.facilities,
        });
        const text = res.data?.result;
        if (text) {
          setAiSummary(text);
          localStorage.setItem(cacheKey, text);
        }
      } catch { /* silently skip if AI is unavailable */ }
    };
    fetchSummary();
  }, [property.propertyId]);

  /* ── Availability Badge ── */
  const getAvailabilityLabel = () => {
    const count = property.availableRooms ?? 0;
    if (count === 0) return "Sold Out";
    if (property.propertyType === "PG") return count === 1 ? "Last Room!" : `${count} Rooms`;
    if (property.propertyType === "Hostel") return count === 1 ? "Last Bed!" : `${count} Beds`;
    if (property.propertyType === "Apartment") return count === 1 ? "Last Flat!" : `${count} Flats`;
    if (property.propertyType === "Villa") return count === 1 ? "Last Villa!" : `${count} Villas`;
    return `${count} Units`;
  };

  const getBadgeColor = () => {
    const count = property.availableRooms ?? 0;
    if (count === 0) return "#ef4444";
    if (count === 1) return "#f59e0b";
    return "#22c55e";
  };

  /* ── Facility Icons ── */
  const getFacilityIcon = (facility: string) => {
    const name = facility.toLowerCase();
    if (name.includes("wifi")) return <Wifi sx={{ fontSize: 14 }} />;
    if (name.includes("parking")) return <LocalParking sx={{ fontSize: 14 }} />;
    if (name.includes("security")) return <Security sx={{ fontSize: 14 }} />;
    return null;
  };

  return (
    <Card
      sx={{
        borderRadius: 3,
        border: "1px solid #e5e7eb",
        overflow: "hidden",
        transition: "0.3s",
        opacity: isSoldOut ? 0.75 : 1,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        "&:hover": {
          transform: isSoldOut ? "none" : "translateY(-4px)",
          boxShadow: isSoldOut ? "none" : "0 12px 30px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* ── Image ── */}
      <Box position="relative" sx={{ flexShrink: 0 }}>
        <CardMedia
          component="img"
          sx={{ height: 190, objectFit: 'cover' }}
          image={property.imageUrl || "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?w=400&q=80"}
          alt={property.propertyName}
        />
        <Chip
          label={getAvailabilityLabel()}
          size="small"
          sx={{
            position: "absolute", top: 10, right: 10,
            bgcolor: getBadgeColor(), color: "white", fontWeight: 700, fontSize: '0.7rem',
          }}
        />
        <Chip
          label={property.propertyType}
          size="small"
          sx={{
            position: "absolute", top: 10, left: 10,
            bgcolor: "white", fontWeight: 700, fontSize: '0.7rem',
          }}
        />
      </Box>

      {/* ── Content ── */}
      <CardContent sx={{
        flex: 1, display: 'flex', flexDirection: 'column',
        p: 2, '&:last-child': { pb: 2 },
      }}>
        {/* City / State */}
        <Stack direction="row" spacing={0.5} alignItems="center">
          <LocationOn sx={{ fontSize: 14, color: "#ef4444" }} />
          <Typography variant="caption" color="text.secondary" sx={{ ...truncSx(1), fontSize: '0.72rem' }}>
            {property.city}, {property.state}
          </Typography>
        </Stack>

        {/* Property Name — max 1 line */}
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mt: 0.5, lineHeight: 1.3, ...truncSx(1) }}>
          {property.propertyName}
        </Typography>

        {/* Address — max 1 line */}
        <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mt: 0.3 }}>
          <LocationOn sx={{ fontSize: 13, color: "#9ca3af", flexShrink: 0 }} />
          <Typography variant="body2" color="text.secondary" sx={{ ...truncSx(1), fontSize: '0.78rem' }}>
            {property.address}
          </Typography>
        </Stack>

        {/* Description — max 2 lines */}
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.8, fontSize: '0.78rem', ...truncSx(2) }}>
          {property.description}
        </Typography>

        {/* AI Summary */}
        {aiSummary && (
          <Typography
            variant="body2"
            sx={{
              mt: 0.8,
              fontSize: '0.73rem',
              color: '#b45309',
              bgcolor: '#fffbeb',
              px: 1,
              py: 0.4,
              borderRadius: '6px',
              ...truncSx(2),
            }}
          >
            ✨ {aiSummary}
          </Typography>
        )}

        {/* Facilities — max 3 chips */}
        <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mt: 1.5, gap: 0.5, minHeight: 28 }}>
          {property.facilities?.slice(0, 3).map((facility, index) => (
            <Chip
              key={index}
              icon={getFacilityIcon(facility) || undefined}
              label={facility}
              size="small"
              variant="outlined"
              sx={{ fontSize: '0.68rem', height: 24 }}
            />
          ))}
        </Stack>

        {/* Spacer to push price + buttons to bottom */}
        <Box sx={{ flex: 1 }} />

        {/* Price */}
        <Typography
          variant="subtitle1"
          sx={{ mt: 1.5, fontWeight: 700, color: "#e53935", fontSize: '1.05rem' }}
        >
          ₹{property.rentPerMonth?.toLocaleString('en-IN')}<Typography component="span" variant="body2" color="text.secondary" sx={{ fontWeight: 400 }}> /month</Typography>
        </Typography>

        {/* Buttons */}
        <Stack direction="row" spacing={1} sx={{ mt: 1.5 }}>
          <Button
            variant="outlined"
            fullWidth
            size="small"
            onClick={handleViewDetails}
            sx={{
              borderColor: '#e53e3e', color: '#e53e3e', fontWeight: 600,
              borderRadius: '10px', py: 0.8, fontSize: '0.78rem',
              '&:hover': { bgcolor: '#fff5f5', borderColor: '#c53030', color: '#c53030' },
            }}
          >
            View Details
          </Button>
          {!isOwner && (
            <Button
              variant="contained"
              fullWidth
              size="small"
              disabled={isSoldOut}
              onClick={handleBookNow}
              sx={{
                bgcolor: '#e53e3e', fontWeight: 600, borderRadius: '10px',
                py: 0.8, fontSize: '0.78rem',
                boxShadow: '0 4px 14px rgba(229,62,62,0.3)',
                '&:hover': { bgcolor: '#c53030', boxShadow: '0 6px 20px rgba(229,62,62,0.4)' },
              }}
            >
              {isSoldOut ? 'Sold Out' : 'Book Now'}
            </Button>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default PropertyCard;