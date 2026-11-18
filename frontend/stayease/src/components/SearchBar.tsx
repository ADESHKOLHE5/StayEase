import React, { useState, useEffect } from 'react';
import {
  Box, Paper, TextField, Button, InputAdornment,
  MenuItem, Select, FormControl,
} from '@mui/material';
import {
  Search as SearchIcon, LocationOn,
} from '@mui/icons-material';

// ── types ─────────────────────────────────────────────────────────────────────
export interface AccommodationSearchParams {
  query: string;
  city: string;
}

interface SearchBarProps {
  onSearch: (params: AccommodationSearchParams) => void;
  initialCity?: string;
  initialQuery?: string;
}

// ── constants ─────────────────────────────────────────────────────────────────
const CITIES = [
  { label: 'All Cities', value: '' },
  { label: 'Bangalore', value: 'Bangalore' },
  { label: 'Mumbai', value: 'Mumbai' },
  { label: 'Delhi', value: 'Delhi' },
  { label: 'Pune', value: 'Pune' },
  { label: 'Hyderabad', value: 'Hyderabad' },
  { label: 'Chennai', value: 'Chennai' },
];

// ── component ─────────────────────────────────────────────────────────────────
const SearchBar: React.FC<SearchBarProps> = ({ onSearch, initialCity = '', initialQuery = '' }) => {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedCity, setSelectedCity] = useState(initialCity);

  // Sync city dropdown when parent resets initialCity (e.g. "Clear All Filters")
  useEffect(() => {
    setSelectedCity(initialCity);
  }, [initialCity]);

  // Sync query when parent resets initialQuery
  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  const fire = (overrides: Partial<AccommodationSearchParams> = {}) => {
    onSearch({ query: searchQuery, city: selectedCity, ...overrides });
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const q = e.target.value;
    setSearchQuery(q);
    fire({ query: q });
  };

  const handleCityChange = (value: string) => {
    setSelectedCity(value);
    fire({ city: value });
  };

  return (
    <Box>
      <Paper
        elevation={0}
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          borderRadius: '16px',
          border: '1.5px solid #e5e7eb',
          overflow: 'hidden',
          bgcolor: 'white',
          boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
          flexWrap: { xs: 'wrap', md: 'nowrap' },
        }}
      >
        {/* City dropdown */}
        <Box sx={{
          display: 'flex', alignItems: 'center', px: 2.5,
          borderRight: { md: '1.5px solid #e5e7eb' },
          borderBottom: { xs: '1.5px solid #e5e7eb', md: 'none' },
          minWidth: { xs: '100%', md: 220 },
          bgcolor: 'white',
        }}>
          <LocationOn sx={{ fontSize: 20, color: '#e53e3e', mr: 1, flexShrink: 0 }} />
          <FormControl variant="standard" fullWidth>
            <Select
              value={selectedCity}
              onChange={(e) => handleCityChange(e.target.value)}
              displayEmpty
              disableUnderline
              sx={{
                fontSize: '0.9rem',
                color: selectedCity ? '#111827' : '#9ca3af',
                py: 2,
                '& .MuiSelect-select': { py: 0 },
              }}
            >
              {CITIES.map((c) => (
                <MenuItem key={c.value} value={c.value} sx={{ fontSize: '0.875rem' }}>
                  {c.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        {/* Live text search */}
        <TextField
          fullWidth
          variant="standard"
          placeholder="Search by property name, address, or area..."
          value={searchQuery}
          onChange={handleQueryChange}
          InputProps={{
            disableUnderline: true,
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ fontSize: 20, color: '#9ca3af', ml: 1 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            px: 1.5,
            borderRight: { md: '1.5px solid #e5e7eb' },
            borderBottom: { xs: '1.5px solid #e5e7eb', md: 'none' },
            '& input': { fontSize: '0.9rem', py: 2, color: '#111827' },
          }}
        />

        {/* Search button */}
        <Button
          variant="contained"
          onClick={() => fire()}
          sx={{
            bgcolor: '#e53e3e', borderRadius: 0,
            px: { xs: 3, md: 5 }, py: 2,
            fontWeight: 700, fontSize: '0.9rem',
            boxShadow: 'none', minWidth: { xs: '100%', md: 120 },
            '&:hover': { bgcolor: '#c53030', boxShadow: 'none' },
          }}
        >
          Search
        </Button>
      </Paper>
    </Box>
  );
};

export default SearchBar;