import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Property, Booking, Filters } from '../types';

interface StayEaseStore {
  currentUser: User | null;
  isAuthenticated: boolean;
  users: User[];
  properties: Property[];
  bookings: Booking[];
  filters: Filters;
  
  login: (email: string, password: string) => boolean;
  signup: (userData: Omit<User, 'userId' | 'createdAt' | 'updatedAt'>) => boolean;
  logout: () => void;
  updateProfile: (userId: string, updates: Partial<User>) => void;
  
  addProperty: (property: Omit<Property, 'propertyId' | 'createdAt' | 'updatedAt' | 'availableRooms'>) => void;
  updateProperty: (propertyId: string, updates: Partial<Property>) => void;
  deleteProperty: (propertyId: string) => void;
  
  createBooking: (propertyId: string, tenantId: string, ownerId: string, rentAmount: number) => void;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  
  setFilters: (filters: Filters) => void;
}

export const useStore = create<StayEaseStore>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,
      users: [],
      properties: [],
      bookings: [],
      filters: {},
      
      login: (email: string, password: string) => {
        const user = get().users.find(u => u.email === email && u.password === password);
        if (user) {
          set({ currentUser: user, isAuthenticated: true });
          return true;
        }
        return false;
      },
      
      signup: (userData) => {
        const existingUser = get().users.find(u => u.email === userData.email);
        if (existingUser) return false;
        
        const newUser: User = {
          ...userData,
          userId: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({
          users: [...state.users, newUser],
          currentUser: newUser,
          isAuthenticated: true,
        }));
        return true;
      },
      
      logout: () => {
        set({ currentUser: null, isAuthenticated: false });
      },
      
      updateProfile: (userId: string, updates: Partial<User>) => {
        set(state => ({
          users: state.users.map(u =>
            u.userId === userId ? { ...u, ...updates, updatedAt: new Date().toISOString() } : u
          ),
          currentUser: state.currentUser?.userId === userId 
            ? { ...state.currentUser, ...updates, updatedAt: new Date().toISOString() } 
            : state.currentUser,
        }));
      },
      
      addProperty: (propertyData) => {
        const newProperty: Property = {
          ...propertyData,
          propertyId: Date.now().toString(),
          availableRooms: propertyData.totalRooms,
          rating: 0,
          reviewCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({ properties: [...state.properties, newProperty] }));
      },
      
      updateProperty: (propertyId: string, updates: Partial<Property>) => {
        set(state => ({
          properties: state.properties.map(p =>
            p.propertyId === propertyId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p
          ),
        }));
      },
      
      deleteProperty: (propertyId: string) => {
        set(state => ({
          properties: state.properties.filter(p => p.propertyId !== propertyId),
        }));
      },
      
      createBooking: (propertyId: string, tenantId: string, ownerId: string, rentAmount: number) => {
        const newBooking: Booking = {
          bookingId: Date.now().toString(),
          propertyId,
          tenantId,
          ownerId,
          status: 'PENDING',
          requestDate: new Date().toISOString(),
          rentAmount,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        set(state => ({ bookings: [...state.bookings, newBooking] }));
      },
      
      updateBookingStatus: (bookingId: string, status: Booking['status']) => {
        set(state => {
          const booking = state.bookings.find(b => b.bookingId === bookingId);
          
          const updatedBookings = state.bookings.map(b =>
            b.bookingId === bookingId
              ? {
                  ...b,
                  status,
                  approvalDate: status === 'APPROVED' ? new Date().toISOString() : b.approvalDate,
                  updatedAt: new Date().toISOString(),
                }
              : b
          );
          
          let updatedProperties = state.properties;
          if (booking && status === 'APPROVED') {
            updatedProperties = state.properties.map(p =>
              p.propertyId === booking.propertyId
                ? { ...p, availableRooms: Math.max(0, p.availableRooms - 1) }
                : p
            );
          }
          
          return { bookings: updatedBookings, properties: updatedProperties };
        });
      },
      
      setFilters: (filters: Filters) => {
        set({ filters });
      },
    }),
    {
      name: 'stayease-storage',
    }
  )
);
