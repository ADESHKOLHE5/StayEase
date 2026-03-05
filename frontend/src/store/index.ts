import { create } from 'zustand';
import { User, Property, Booking, Filters } from '../types';

interface StayEaseStore {
  // Auth state
  user: User | null;
  isAuthenticated: boolean;
  
  // Properties
  properties: Property[];
  selectedProperty: Property | null;
  wishlist: number[];
  
  // Bookings
  bookings: Booking[];
  
  // Filters
  filters: Filters;
  searchQuery: string;
  
  // UI State
  isOwnerView: boolean;
  
  // Actions
  login: (user: User) => void;
  logout: () => void;
  switchView: () => void;
  setProperties: (properties: Property[]) => void;
  setSelectedProperty: (property: Property | null) => void;
  addToWishlist: (propertyId: number) => void;
  removeFromWishlist: (propertyId: number) => void;
  setBookings: (bookings: Booking[]) => void;
  updateBooking: (bookingId: number, status: Booking['status']) => void;
  setFilters: (filters: Filters) => void;
  setSearchQuery: (query: string) => void;
  addProperty: (property: Property) => void;
  updateProperty: (propertyId: number, updates: Partial<Property>) => void;
}

// Mock data
const mockProperties: Property[] = [
  {
    propertyId: 1,
    ownerId: 1,
    propertyName: 'Sunny Side Student PG',
    propertyType: 'PG',
    location: 'Andheri West, Mumbai',
    address: '123, Sample Street',
    city: 'Mumbai',
    state: 'Maharashtra',
    totalRooms: 10,
    availableRooms: 3,
    rentPerMonth: 8500,
    facilities: ['WiFi', 'Meals', 'Laundry', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1555854877-bab0e564b8d5?w=800'],
    description: 'Comfortable PG accommodation for students with all modern amenities.',
    aiSummary: 'Budget-friendly PG, ideal for students.',
    rating: 4.5,
    reviewCount: 23,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15'
  },
  {
    propertyId: 2,
    ownerId: 1,
    propertyName: 'Greenwood Hostel',
    propertyType: 'Hostel',
    location: 'Koramangala, Bangalore',
    address: '45, MG Road',
    city: 'Bangalore',
    state: 'Karnataka',
    totalRooms: 20,
    availableRooms: 8,
    rentPerMonth: 6000,
    facilities: ['WiFi', 'Common Kitchen', 'Study Room', 'Security'],
    images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800'],
    description: 'Modern hostel facility with great community vibes.',
    aiSummary: '8 rooms available, great community.',
    rating: 4.2,
    reviewCount: 15,
    createdAt: '2024-02-10',
    updatedAt: '2024-02-10'
  },
  {
    propertyId: 3,
    ownerId: 2,
    propertyName: 'Modern 1BHK Apartment',
    propertyType: 'Apartment',
    location: 'Hitech City, Hyderabad',
    address: '78, Cyber Towers',
    city: 'Hyderabad',
    state: 'Telangana',
    totalRooms: 1,
    availableRooms: 1,
    rentPerMonth: 15000,
    facilities: ['Fully Furnished', 'AC', 'Parking', 'Gym', 'Security'],
    images: ['https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800'],
    description: 'Fully furnished modern apartment perfect for working professionals.',
    aiSummary: 'Modern 1BHK, near metro, affordable.',
    rating: 4.8,
    reviewCount: 31,
    createdAt: '2024-03-01',
    updatedAt: '2024-03-01'
  },
  {
    propertyId: 4,
    ownerId: 2,
    propertyName: 'Cozy Studio Near Campus',
    propertyType: 'Apartment',
    location: 'North Campus, Delhi',
    address: '12, University Road',
    city: 'Delhi',
    state: 'Delhi',
    totalRooms: 1,
    availableRooms: 0,
    rentPerMonth: 12000,
    facilities: ['Semi-Furnished', 'WiFi', 'Power Backup'],
    images: ['https://images.unsplash.com/photo-1536376072261-38c75010e6c9?w=800'],
    description: 'Perfect studio apartment for students near campus.',
    aiSummary: 'Cozy studio near campus.',
    rating: 4.0,
    reviewCount: 8,
    createdAt: '2024-02-20',
    updatedAt: '2024-02-20'
  }
];

const mockBookings: Booking[] = [
  {
    bookingId: 1,
    propertyId: 1,
    tenantId: 3,
    ownerId: 1,
    roomId: 1,
    status: 'PENDING',
    requestDate: '2024-10-25',
    rentAmount: 8500,
    createdAt: '2024-10-25',
    updatedAt: '2024-10-25',
    tenant: {
      userId: 3,
      email: 'rahul.sharma@email.com',
      name: 'Rahul Sharma',
      phone: '9876543210',
      role: 'TENANT',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-10'
    }
  },
  {
    bookingId: 2,
    propertyId: 2,
    tenantId: 4,
    ownerId: 1,
    roomId: 5,
    status: 'APPROVED',
    requestDate: '2024-10-20',
    approvalDate: '2024-10-21',
    rentAmount: 6000,
    createdAt: '2024-10-20',
    updatedAt: '2024-10-21',
    tenant: {
      userId: 4,
      email: 'priya.patel@email.com',
      name: 'Priya Patel',
      phone: '9876543211',
      role: 'TENANT',
      createdAt: '2024-01-15',
      updatedAt: '2024-01-15'
    }
  }
];

export const useStore = create<StayEaseStore>((set) => ({
  // Initial state
  user: null,
  isAuthenticated: false,
  properties: mockProperties,
  selectedProperty: null,
  wishlist: [],
  bookings: mockBookings,
  filters: {},
  searchQuery: '',
  isOwnerView: false,
  
  // Actions
  login: (user) => set({ user, isAuthenticated: true, isOwnerView: user.role === 'OWNER' }),
  
  logout: () => set({ user: null, isAuthenticated: false, isOwnerView: false }),
  
  switchView: () => set((state) => ({ isOwnerView: !state.isOwnerView })),
  
  setProperties: (properties) => set({ properties }),
  
  setSelectedProperty: (property) => set({ selectedProperty: property }),
  
  addToWishlist: (propertyId) => set((state) => ({
    wishlist: [...state.wishlist, propertyId]
  })),
  
  removeFromWishlist: (propertyId) => set((state) => ({
    wishlist: state.wishlist.filter(id => id !== propertyId)
  })),
  
  setBookings: (bookings) => set({ bookings }),
  
  updateBooking: (bookingId, status) => set((state) => ({
    bookings: state.bookings.map(booking =>
      booking.bookingId === bookingId
        ? { ...booking, status, approvalDate: status === 'APPROVED' ? new Date().toISOString() : booking.approvalDate }
        : booking
    )
  })),
  
  setFilters: (filters) => set({ filters }),
  
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addProperty: (property) => set((state) => ({
    properties: [...state.properties, property]
  })),
  
  updateProperty: (propertyId, updates) => set((state) => ({
    properties: state.properties.map(prop =>
      prop.propertyId === propertyId ? { ...prop, ...updates } : prop
    )
  }))
}));
