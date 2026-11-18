import { useState, useMemo } from 'react';
import {
  Box, Container, Typography, Grid, Paper, Button, Skeleton,
} from '@mui/material';
import SearchNotFoundIcon from '@mui/icons-material/SearchOff';
import ExploreIcon from '@mui/icons-material/Explore';

import useFetch from '../hooks/useFetch';
import SearchBar from '../components/SearchBar';
import FilterSidebar from '../components/FilterSideBar';
import PropertyCard from '../components/PropertyCard';
import PageLoader from '../components/PageLoader';
import type { Filters } from './types';


const DEFAULT_FILTERS: Filters = {
  propertyType: '',
  city: '',
  minRent: 0,
  maxRent: 50_000,
  facilities: [],
  sortBy: undefined,
};

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

// Skeleton card while loading
const PropertyCardSkeleton = () => (
  <Box sx={{ borderRadius: '12px', overflow: 'hidden', border: '1px solid #f0f0f0', bgcolor: 'white' }}>
    <Skeleton variant="rectangular" height={180} animation="wave" />
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="70%" height={22} animation="wave" sx={{ mb: 0.5 }} />
      <Skeleton variant="text" width="50%" height={16} animation="wave" sx={{ mb: 1 }} />
      <Skeleton variant="text" width="40%" height={20} animation="wave" />
    </Box>
  </Box>
);

const Accommodations = () => {
  const { data: properties, loading } = useFetch('/properties/browseAll');

  const [searchQuery, setSearchQuery] = useState('');
  const [searchCity, setSearchCity] = useState('');
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  // search bar callback 
  const handleSearch = ({ query, city }: { query: string; city: string }) => {
    setSearchQuery(query);
    setSearchCity(city);
  };


  const effectiveCity = searchCity || filters.city || '';

  // filer + sort
  const filteredProperties = useMemo(() => {
    if (!properties || !Array.isArray(properties)) return [];

    let result = (properties as Property[]).filter((p) => {
      // text search (name, address, city, state, description)
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const searchable = `${p.propertyName} ${p.address} ${p.city} ${p.state} ${p.description}`.toLowerCase();
        if (!searchable.includes(q)) return false;
      }

      // City filter
      if (effectiveCity && p.city?.toLowerCase() !== effectiveCity.toLowerCase()) {
        return false;
      }

      // property type filter
      if (filters.propertyType && p.propertyType !== filters.propertyType) {
        return false;
      }

      // rent range filter
      const min = filters.minRent ?? 0;
      const max = filters.maxRent ?? 50_000;
      if (p.rentPerMonth < min || p.rentPerMonth > max) {
        return false;
      }

      // facilities filter
      if (filters.facilities && filters.facilities.length > 0) {
        const propFacilities = (p.facilities || []).map((f) => f.toLowerCase());
        const allMatch = filters.facilities.every((f) =>
          propFacilities.some((pf) => pf.includes(f.toLowerCase()))
        );
        if (!allMatch) return false;
      }

      return true;
    });

    // sorting
    if (filters.sortBy === 'price-low') {
      result.sort((a, b) => a.rentPerMonth - b.rentPerMonth);
    } else if (filters.sortBy === 'price-high') {
      result.sort((a, b) => b.rentPerMonth - a.rentPerMonth);
    }

    return result;
  }, [properties, searchQuery, effectiveCity, filters]);

  // sync filter city when search bar city changes or when filters are reset
  const handleFilterChange = (newFilters: Filters) => {
    setFilters(newFilters);
    // if the user sets a city in the sidebar also update search city
    if (newFilters.city !== filters.city) {
      setSearchCity(newFilters.city || '');
    }
  };

  const handleReset = () => {
    setFilters(DEFAULT_FILTERS);
    setSearchQuery('');
    setSearchCity('');
  };


  return (
    <Box sx={{ bgcolor: '#fafafa', minHeight: '80vh' }}>
      {/* hero */}
      <Box sx={{
        bgcolor: 'white',
        borderBottom: '1px solid #f0f0f0',
        py: { xs: 3, md: 4 },
      }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
            <ExploreIcon sx={{ color: '#e53e3e', fontSize: 28 }} />
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#111827' }}>
                Find Your Perfect Stay
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Browse {(properties || []).length} verified accommodations across India
              </Typography>
            </Box>
          </Box>

          <SearchBar onSearch={handleSearch} initialCity={searchCity} initialQuery={searchQuery} />
        </Container>
      </Box>

      {/*Main Content */}
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={3}>

          {/* filter sidebar — always visible */}
          <Grid size={{ xs: 12, md: 3 }}>
            <FilterSidebar
              filters={{ ...filters, city: effectiveCity }}
              onFilterChange={handleFilterChange}
              onReset={handleReset}
              resultCount={filteredProperties.length}
            />
          </Grid>

          {/*property grid */}
          <Grid size={{ xs: 12, md: 9 }}>

            {/* Loading state: message + skeleton cards */}
            {loading && (
              <>
                {/* Prominent loader message */}
                <PageLoader
                  message="Searching for accommodations…"
                  subMessage="Fetching verified listings across India for you"
                />
                {/* Skeleton placeholder cards below */}
                <Grid container spacing={3} sx={{ mt: 1 }}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={i}>
                      <PropertyCardSkeleton />
                    </Grid>
                  ))}
                </Grid>
              </>
            )}



            {/* Loaded content */}
            {!loading && (
              <>
                {/* active filter summary */}
                {(searchQuery || effectiveCity || filters.propertyType) && (
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" color="text.secondary" fontWeight={600}>
                      {filteredProperties.length} result{filteredProperties.length !== 1 ? 's' : ''}
                    </Typography>
                    {searchQuery && (
                      <Typography variant="body2" color="text.secondary">
                        for "{searchQuery}"
                      </Typography>
                    )}
                    {effectiveCity && (
                      <Typography variant="body2" color="text.secondary">
                        in {effectiveCity}
                      </Typography>
                    )}
                    {filters.propertyType && (
                      <Typography variant="body2" color="text.secondary">
                        · {filters.propertyType}
                      </Typography>
                    )}
                  </Box>
                )}

                {/* property cards grid */}
                {filteredProperties.length > 0 ? (
                  <Grid container spacing={3}>
                    {filteredProperties.map((property: Property) => (
                      <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={property.propertyId}>
                        <PropertyCard property={property} />
                      </Grid>
                    ))}
                  </Grid>
                ) : (
                  /* empty state */
                  <Paper elevation={0} sx={{
                    p: 8, textAlign: 'center', borderRadius: 4,
                    border: '1.5px dashed #e0e0e0', bgcolor: 'white',
                  }}>
                    <SearchNotFoundIcon sx={{ fontSize: 56, color: '#d1d5db', mb: 2 }} />
                    <Typography variant="h6" fontWeight={700} color="text.secondary">
                      No properties match your filters
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 3 }}>
                      Try adjusting your search or filters to find what you're looking for.
                    </Typography>
                    <Button
                      variant="contained"
                      onClick={handleReset}
                      sx={{
                        bgcolor: '#e53e3e', fontWeight: 600, borderRadius: '10px',
                        px: 4, boxShadow: 'none',
                        '&:hover': { bgcolor: '#c53030', boxShadow: 'none' },
                      }}
                    >
                      Clear All Filters
                    </Button>
                  </Paper>
                )}
              </>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Accommodations;