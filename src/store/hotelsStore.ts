'use client';

import { create } from 'zustand';
import { Hotel, Room } from '@/data/hotels';

interface HotelsStore {
    hotels: Hotel[];
    isLoading: boolean;
    error: string | null;

    // Async Actions
    fetchHotels: (query?: string) => Promise<void>;
    getHotel: (id: string | number) => Hotel | undefined;

    // API Actions
    addHotel: (hotel: Omit<Hotel, 'id'>) => Promise<Hotel | null>;
    updateHotel: (id: number, updates: Partial<Hotel>) => Promise<void>;
    deleteHotel: (id: number) => Promise<void>;
    addRoom: () => void;
    updateRoom: () => void;
    deleteRoom: () => void;

    // Reset
    resetToDefaults: () => void;
}

export const useHotelsStore = create<HotelsStore>((set, get) => ({
    hotels: [], // Start empty
    isLoading: false,
    error: null,

    fetchHotels: async (query?: string) => {
        set({ isLoading: true, error: null });
        try {
            const url = query ? `/api/hotels?${query}` : '/api/hotels';
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error('Failed to fetch hotels');
            const data = await res.json();
            // Ensure data is array
            const hotelsArray = Array.isArray(data) ? data : [];
            set({ hotels: hotelsArray, isLoading: false });
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false, hotels: [] });
        }
    },

    getHotel: (id) => {
        const numId = typeof id === 'string' ? parseInt(id) : id;
        return get().hotels.find(h => h.id === numId);
    },

    addHotel: async (hotelData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/hotels', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(hotelData),
            });
            if (!res.ok) throw new Error('Failed to create hotel');
            const newHotel = await res.json();
            set(state => ({
                hotels: [...state.hotels, newHotel],
                isLoading: false
            }));
            return newHotel;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return null;
        }
    },

    updateHotel: async (id, updates) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`/api/hotels/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (!res.ok) throw new Error('Failed to update hotel');
            const updated = await res.json();
            set(state => ({
                hotels: state.hotels.map(h => h.id === id ? updated : h),
                isLoading: false
            }));
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    deleteHotel: async (id) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch(`/api/hotels/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) throw new Error('Failed to delete hotel');
            set(state => ({
                hotels: state.hotels.filter(h => h.id !== id),
                isLoading: false
            }));
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    // Legacy Room Actions - Temporarily stubbed or optimistic
    addRoom: () => { console.warn('addRoom not fully implemented with API'); },
    updateRoom: () => { console.warn('updateRoom not fully implemented with API'); },
    deleteRoom: () => { console.warn('deleteRoom not fully implemented with API'); },

    resetToDefaults: () => {
        // No-op or re-fetch
        get().fetchHotels();
    }
}));

// Hooks
export const useHotel = (id: string | number) => {
    return useHotelsStore(state => state.getHotel(id));
};

export const useHotels = () => {
    return useHotelsStore(state => state.hotels);
};
