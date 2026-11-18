import React from 'react';
import {
  Box, Typography, Select, MenuItem, FormControl,
  Slider, Chip, Paper, Button,
} from '@mui/material';
import type { Filters } from '../Pages/types';
import TuneIcon from '@mui/icons-material/Tune';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

interface FilterSidebarProps {
  filters: Filters;
  onFilterChange: (filters: Filters) => void;
  onReset: () => void;
  resultCount: number;
}

const PROPERTY_TYPES = ['PG', 'Hostel', 'Apartment', 'Villa'];
const FACILITIES = ['WiFi', 'AC', 'Parking', 'Security', 'Laundry', 'Food', 'Power Backup', 'Gym'];
const CITIES = ['', 'Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];

const MIN_RENT = 0;
const MAX_RENT = 50_000;
const RENT_STEP = 1_000;

const FilterSidebar: React.FC<FilterSidebarProps> = ({ filters, onFilterChange, onReset, resultCount }) => {
  const selectedFacilities = filters.facilities ?? [];
  const rentRange: [number, number] = [
    filters.minRent ?? MIN_RENT,
    filters.maxRent ?? MAX_RENT,
  ];

  const handlePropertyTypeChange = (value: string) => {
    onFilterChange({ ...filters, propertyType: value });
  };

  const handleCityChange = (value: string) => {
    onFilterChange({ ...filters, city: value });
  };

  const handleFacilityToggle = (facility: string) => {
    const next = selectedFacilities.includes(facility)
      ? selectedFacilities.filter((f) => f !== facility)
      : [...selectedFacilities, facility];
    onFilterChange({ ...filters, facilities: next });
  };

  const handleRentRangeChange = (_: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    onFilterChange({ ...filters, minRent: min, maxRent: max });
  };

  const handleSortChange = (value: string) => {
    onFilterChange({ ...filters, sortBy: value as Filters['sortBy'] });
  };

  const hasActiveFilters = !!(
    filters.propertyType || filters.city ||
    (filters.minRent && filters.minRent > MIN_RENT) ||
    (filters.maxRent && filters.maxRent < MAX_RENT) ||
    (filters.facilities && filters.facilities.length > 0) ||
    filters.sortBy
  );

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        position: 'sticky',
        top: 80,
        borderRadius: '16px',
        border: '1.5px solid #f0f0f0',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TuneIcon sx={{ color: '#e53e3e', fontSize: 22 }} />
          <Typography variant="h6" sx={{ fontWeight: 800, color: '#111827' }}>
            Filters
          </Typography>
        </Box>
        {hasActiveFilters && (
          <Button
            size="small"
            startIcon={<RestartAltIcon sx={{ fontSize: 16 }} />}
            onClick={onReset}
            sx={{
              color: '#e53e3e', fontWeight: 600, fontSize: '0.75rem',
              textTransform: 'none', borderRadius: '8px',
              '&:hover': { bgcolor: '#fff5f5' },
            }}
          >
            Reset
          </Button>
        )}
      </Box>

      {/* Results count */}
      <Chip
        label={`${resultCount} ${resultCount === 1 ? 'property' : 'properties'} found`}
        size="small"
        sx={{
          bgcolor: '#f0fdf4', color: '#16a34a', fontWeight: 600,
          fontSize: '0.75rem', mb: 3, borderRadius: '8px',
        }}
      />

      {/* ── Property Type ── */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="overline" sx={labelSx}>
          Property Type
        </Typography>
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <Select
            value={filters.propertyType || ''}
            onChange={(e) => handlePropertyTypeChange(e.target.value)}
            displayEmpty
            sx={selectSx}
          >
            <MenuItem value="">All Types</MenuItem>
            {PROPERTY_TYPES.map((t) => (
              <MenuItem key={t} value={t}>{t}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ── City ── */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="overline" sx={labelSx}>
          City
        </Typography>
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <Select
            value={filters.city || ''}
            onChange={(e) => handleCityChange(e.target.value)}
            displayEmpty
            sx={selectSx}
          >
            <MenuItem value="">All Cities</MenuItem>
            {CITIES.filter(Boolean).map((c) => (
              <MenuItem key={c} value={c}>{c}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* ── Sort By ── */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="overline" sx={labelSx}>
          Sort By
        </Typography>
        <FormControl fullWidth size="small" sx={{ mt: 1 }}>
          <Select
            value={filters.sortBy || ''}
            onChange={(e) => handleSortChange(e.target.value)}
            displayEmpty
            sx={selectSx}
          >
            <MenuItem value="">Default</MenuItem>
            <MenuItem value="price-low">Price: Low → High</MenuItem>
            <MenuItem value="price-high">Price: High → Low</MenuItem>
            <MenuItem value="newest">Newest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* ── Facilities ── */}
      <Box sx={{ mb: 3.5 }}>
        <Typography variant="overline" sx={labelSx}>
          Facilities
        </Typography>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
          {FACILITIES.map((facility) => {
            const active = selectedFacilities.includes(facility);
            return (
              <Chip
                key={facility}
                label={facility}
                onClick={() => handleFacilityToggle(facility)}
                sx={{
                  bgcolor: active ? '#fff5f5' : '#f9fafb',
                  color: active ? '#e53e3e' : '#4b5563',
                  border: '1px solid',
                  borderColor: active ? '#fecaca' : '#e5e7eb',
                  fontWeight: active ? 600 : 500,
                  fontSize: '0.78rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: active ? '#fee2e2' : '#f3f4f6',
                  },
                }}
              />
            );
          })}
        </Box>
      </Box>

      {/* ── Rent Range ── */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="overline" sx={labelSx}>
          Rent Range (Monthly)
        </Typography>
        <Box sx={{ px: 1, mt: 1 }}>
          <Slider
            value={rentRange}
            onChange={handleRentRangeChange}
            valueLabelDisplay="auto"
            min={MIN_RENT}
            max={MAX_RENT}
            step={RENT_STEP}
            valueLabelFormat={(v) => `₹${v.toLocaleString('en-IN')}`}
            sx={sliderSx}
          />
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
          <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600 }}>
            ₹{rentRange[0].toLocaleString('en-IN')}
          </Typography>
          <Typography variant="body2" sx={{ color: '#4b5563', fontWeight: 600 }}>
            ₹{rentRange[1].toLocaleString('en-IN')}
          </Typography>
        </Box>
      </Box>
    </Paper>
  );
};

// ── shared styles ─────────────────────────────────────────────────────────────
const labelSx = {
  fontWeight: 700,
  mb: 1.5,
  color: '#e53e3e',
  letterSpacing: 1,
};

const selectSx = {
  borderRadius: '10px',
  bgcolor: '#fafafa',
  '& .MuiOutlinedInput-notchedOutline': { borderColor: '#e5e7eb' },
  '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#cbd5e1' },
  '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#e53e3e' },
};

const sliderSx = {
  color: '#e53e3e',
  height: 6,
  '& .MuiSlider-thumb': {
    height: 20,
    width: 20,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    '&:hover, &.Mui-focusVisible': {
      boxShadow: '0 0 0 8px rgba(229, 62, 62, 0.16)',
    },
  },
  '& .MuiSlider-track': { border: 'none' },
};

export default FilterSidebar;