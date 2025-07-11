import { create } from 'zustand';
import type { AmenityDto } from '../types/amenity.types';

interface AmenitiesState {
  amenities: AmenityDto[];
  loading: boolean;
  error?: string;
  setAmenities: (data: AmenityDto[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error?: string) => void;
}

export const useAmenitiesStore = create<AmenitiesState>((set) => ({
  amenities: [],
  loading: false,
  error: undefined,
  setAmenities: (data) => set({ amenities: data }),
  setLoading: (loading) => set({ loading }),
  setError: (error) => set({ error }),
}));
