import React, { useState, useMemo } from 'react';
import { Box, Container, Typography, Grid, TextField, InputAdornment, Select, MenuItem, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Slider, Paper } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import Header from '../components/Header';
import Footer from '../components/Footer';
import PropertyCard from '../components/PropertyCard';
import { useStore } from '../store';
import { Filters } from '../types';

const Accommodations: React.FC = () => {
  const { properties } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [localFilters, setLocalFilters] = useState<Filters>({});

  const handleRentRangeChange = (event: Event, newValue: number | number[]) => {
    const [min, max] = newValue as number[];
    setLocalFilters(prev => ({ ...prev, minRent: min, maxRent: max }));
  };

  const filteredProperties = useMemo(() => {
    let result = [...properties];

    if (searchQuery) {
      result = result.filter(p =>
        p.propertyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.city.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (localFilters.propertyType) {
      result = result.filter(p => p.propertyType === localFilters.propertyType);
    }

    if (localFilters.genderSpecific) {
      result = result.filter(p => p.genderSpecific === localFilters.genderSpecific || p.genderSpecific === 'Any');
    }

    if (localFilters.furnishing) {
      result = result.filter(p => p.furnishing === localFilters.furnishing);
    }

    if (localFilters.minRent !== undefined || localFilters.maxRent !== undefined) {
      result = result.filter(p => {
        const rent = p.rentPerMonth || p.rentPerDay || 0;
        if (localFilters.minRent && rent < localFilters.minRent) return false;
        if (localFilters.maxRent && rent > localFilters.maxRent) return false;
        return true;
      });
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => (a.rentPerMonth || a.rentPerDay || 0) - (b.rentPerMonth || b.rentPerDay || 0));
        break;
      case 'price-high':
        result.sort((a, b) => (b.rentPerMonth || b.rentPerDay || 0) - (a.rentPerMonth || a.rentPerDay || 0));
        break;
      case 'rating':
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return result;
  }, [properties, localFilters, sortBy, searchQuery]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Container maxWidth="xl" sx={{ flex: 1, py: 4 }}>
        <Typography variant="h4" fontWeight={700} sx={{ mb: 1 }}>Find Accommodation</Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {filteredProperties.length} properties available
        </Typography>

        <Grid container spacing={3}>
          {/* Filters - Inline on left */}
          <Grid item xs={12} md={3}>
            <Paper elevation={0} sx={{ p: 3, border: 1, borderColor: 'grey.200', position: 'sticky', top: 80 }}>
              <Typography variant="h6" fontWeight={700} sx={{ mb: 3 }}>Filters</Typography>

              <FormControl component="fieldset" sx={{ mb: 3, width: '100%' }}>
                <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>PROPERTY TYPE</FormLabel>
                <RadioGroup value={localFilters.propertyType || ''} onChange={(e) => setLocalFilters(prev => ({ ...prev, propertyType: e.target.value || undefined }))}>
                  <FormControlLabel value="" control={<Radio />} label="All Types" />
                  <FormControlLabel value="PG" control={<Radio />} label="PG" />
                  <FormControlLabel value="Hostel" control={<Radio />} label="Hostel" />
                  <FormControlLabel value="Apartment" control={<Radio />} label="Apartment" />
                </RadioGroup>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>GENDER SPECIFIC</FormLabel>
                <Select value={localFilters.genderSpecific || ''} onChange={(e) => setLocalFilters(prev => ({ ...prev, genderSpecific: e.target.value || undefined }))} displayEmpty>
                  <MenuItem value="">Any Gender</MenuItem>
                  <MenuItem value="Male">Male Only</MenuItem>
                  <MenuItem value="Female">Female Only</MenuItem>
                  <MenuItem value="Co-living">Co-living</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 3 }}>
                <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 1 }}>FURNISHING</FormLabel>
                <Select value={localFilters.furnishing || ''} onChange={(e) => setLocalFilters(prev => ({ ...prev, furnishing: e.target.value || undefined }))} displayEmpty>
                  <MenuItem value="">Any Status</MenuItem>
                  <MenuItem value="Fully Furnished">Fully Furnished</MenuItem>
                  <MenuItem value="Semi-Furnished">Semi-Furnished</MenuItem>
                  <MenuItem value="Unfurnished">Unfurnished</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <FormLabel sx={{ fontWeight: 600, color: 'text.primary', mb: 2 }}>RENT RANGE</FormLabel>
                <Slider
                  value={[localFilters.minRent || 3000, localFilters.maxRent || 30000]}
                  onChange={handleRentRangeChange}
                  valueLabelDisplay="auto"
                  min={0}
                  max={50000}
                  step={1000}
                  sx={{
                    color: '#e53e3e',
                    '& .MuiSlider-track': { height: 6 },
                    '& .MuiSlider-rail': { height: 6, opacity: 0.4, bgcolor: 'grey.300' },
                    '& .MuiSlider-thumb': { width: 20, height: 20 },
                  }}
                />
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                  <Typography variant="caption">₹{(localFilters.minRent || 3000).toLocaleString('en-IN')}</Typography>
                  <Typography variant="caption" fontWeight={600} color="primary">
                    ₹{(localFilters.minRent || 3000).toLocaleString('en-IN')} - ₹{(localFilters.maxRent || 30000).toLocaleString('en-IN')}
                  </Typography>
                  <Typography variant="caption">₹50,000+</Typography>
                </Box>
              </FormControl>
            </Paper>
          </Grid>

          {/* Main Content */}
          <Grid item xs={12} md={9}>
            <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
              <TextField
                placeholder="Where do you want to stay? (e.g. Mumbai, Bangalore)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />

              <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} sx={{ minWidth: 180 }}>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="price-low">Price: Low to High</MenuItem>
                <MenuItem value="price-high">Price: High to Low</MenuItem>
                <MenuItem value="rating">Highest Rated</MenuItem>
              </Select>
            </Box>

            {filteredProperties.length > 0 ? (
              <Grid container spacing={3}>
                {filteredProperties.map((property) => (
                  <Grid item xs={12} sm={6} lg={4} key={property.propertyId}>
                    <PropertyCard property={property} />
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <Typography variant="h6" color="text.secondary">No properties found</Typography>
                <Typography variant="body2" color="text.secondary">Try adjusting your filters</Typography>
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </Box>
  );
};

export default Accommodations;
