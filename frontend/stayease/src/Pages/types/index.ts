export interface Filters {
  propertyType?: string;
  city?: string;            // CHANGED: City filter instead of gender/furnishing
  minRent?: number;
  maxRent?: number;
  facilities?: string[];    // NEW: Filter by facilities
  sortBy?: 'price-low' | 'price-high' | 'rating' | 'newest';
}