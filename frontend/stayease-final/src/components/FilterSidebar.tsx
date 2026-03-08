import React, { useState } from 'react';
import { Box, Typography, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Select, MenuItem, Slider, Button, Drawer } from '@mui/material';
import { FilterList as FilterIcon, Close as CloseIcon } from '@mui/icons-material';
import { useStore } from '../store';
import { Filters } from '../types';

interface FilterSidebarProps {
  open: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ open, onClose }) => {
  const { filters, setFilters } = useStore();
  const [localFilters, setLocalFilters] = useState<Filters>(filters);

  const handleFilterChange = (key: keyof Filters, value: any) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleRentRangeChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setLocalFilters(prev => ({ ...prev, minRent: min, maxRent: max }));
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

  const content = (
    <Box sx={{ width: 300, p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterIcon sx={{ color: '#e53e3e' }} />
          <Typography variant="h6" fontWeight={700}>Filters</Typography>
        </Box>
        <Button onClick={onClose} sx={{ minWidth: 'auto', p: 0.5 }}>
          <CloseIcon />
        </Button>
      </Box>

      <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
        <FormLabel component="legend" sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>PROPERTY TYPE</FormLabel>
        <RadioGroup value={localFilters.propertyType || ''} onChange={(e) => handleFilterChange('propertyType', e.target.value || undefined)}>
          <FormControlLabel value="" control={<Radio />} label="All Types" />
          <FormControlLabel value="PG" control={<Radio />} label="PG" />
          <FormControlLabel value="Hostel" control={<Radio />} label="Hostel" />
          <FormControlLabel value="Apartment" control={<Radio />} label="Apartment" />
        </RadioGroup>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>GENDER SPECIFIC</FormLabel>
        <Select value={localFilters.genderSpecific || ''} onChange={(e) => handleFilterChange('genderSpecific', e.target.value || undefined)} displayEmpty>
          <MenuItem value="">Any Gender</MenuItem>
          <MenuItem value="Male">Male Only</MenuItem>
          <MenuItem value="Female">Female Only</MenuItem>
          <MenuItem value="Co-living">Co-living</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>FURNISHING</FormLabel>
        <Select value={localFilters.furnishing || ''} onChange={(e) => handleFilterChange('furnishing', e.target.value || undefined)} displayEmpty>
          <MenuItem value="">Any Status</MenuItem>
          <MenuItem value="Fully Furnished">Fully Furnished</MenuItem>
          <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
          <MenuItem value="Unfurnished">Unfurnished</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 3 }}>
        <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>RENT RANGE</FormLabel>
        <Box sx={{ px: 1 }}>
          <Slider
            value={[localFilters.minRent || 3000, localFilters.maxRent || 30000]}
            onChange={handleRentRangeChange}
            valueLabelDisplay="auto"
            min={0}
            max={50000}
            step={1000}
            sx={{
              color: '#e53e3e',
              '& .MuiSlider-track': { height: 4 },
              '& .MuiSlider-rail': { height: 4, opacity: 0.3 },
              '& .MuiSlider-thumb': { width: 20, height: 20 },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
            <Typography variant="caption" color="text.secondary">₹{(localFilters.minRent || 3000).toLocaleString('en-IN')}</Typography>
            <Typography variant="caption" fontWeight={600} color="primary">₹{(localFilters.minRent || 3000).toLocaleString('en-IN')} - ₹{(localFilters.maxRent || 30000).toLocaleString('en-IN')}</Typography>
            <Typography variant="caption" color="text.secondary">₹50,000+</Typography>
          </Box>
        </Box>
      </FormControl>

      <Button fullWidth variant="contained" onClick={applyFilters} sx={{ mb: 1, bgcolor: '#e53e3e', '&:hover': { bgcolor: '#c53030' } }}>
        Apply Filters
      </Button>
      <Button fullWidth variant="outlined" onClick={clearFilters} sx={{ color: 'text.primary', borderColor: 'grey.300' }}>
        Clear All
      </Button>
    </Box>
  );

  return (
    <Drawer anchor="left" open={open} onClose={onClose}>
      {content}
    </Drawer>
  );
};

export default FilterSidebar;
