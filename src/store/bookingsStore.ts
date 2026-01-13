'use client';

import { create } from 'zustand';

export interface Booking {
    id: string; // Display ID e.g. #BK-101
    dbId: number; // Real DB ID
    user: string;
    email: string;
    phone?: string;
    hotel: string;
    hotelId?: number;
    location: string;
    checkIn: string;
    checkOut?: string;
    nights?: number;
    roomType?: string;
    guests?: number;
    amount: number;
    amountLabel: string;
    status: 'مؤكد' | 'قيد المراجعة' | 'ملغى';
    createdAt: Date;
    notes?: string;
}

interface BookingsStore {
    bookings: Booking[];
    isLoading: boolean;
    error: string | null;

    // Async Actions
    fetchBookings: () => Promise<void>;
    addBooking: (booking: any) => Promise<boolean>;

    // Client-side getters (after fetch)
    getBooking: (id: string) => Booking | undefined;
    getBookingsByHotel: (hotelId: number) => Booking[];
    getBookingsByUser: (email: string) => Booking[];

    // Actions
    updateBooking: (id: string, updates: Partial<Booking>) => Promise<void>;
    updateBookingStatus: (id: string, status: Booking['status']) => Promise<void>;
    deleteBooking: (id: string) => Promise<void>;

    // Stats
    getTotalRevenue: () => number;
    getBookingsCount: () => { total: number; confirmed: number; pending: number; cancelled: number };

    resetToDefaults: () => void;
}

export const useBookingsStore = create<BookingsStore>((set, get) => ({
    bookings: [],
    isLoading: false,
    error: null,

    fetchBookings: async () => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/bookings');
            if (!res.ok) throw new Error('Failed to fetch bookings');
            const data = await res.json();

            // Transform API data to UI Booking interface
            const transformedBookings: Booking[] = data.map((b: any) => ({
                id: `#BK-${b.id}`,
                dbId: b.id,
                user: b.guestName || b.user?.name || 'ضيف',
                email: b.guestEmail || b.user?.email || '',
                phone: b.guestPhone || b.user?.phone || '',
                hotel: b.hotel?.name || 'فندق غير معروف',
                hotelId: b.hotelId,
                location: b.hotel?.location || '',
                checkIn: new Date(b.checkIn).toISOString().split('T')[0],
                checkOut: new Date(b.checkOut).toISOString().split('T')[0],
                nights: Math.ceil((new Date(b.checkOut).getTime() - new Date(b.checkIn).getTime()) / (1000 * 60 * 60 * 24)),
                roomType: b.room?.type || b.room?.name || 'غرفة',
                guests: 2, // Default or from DB if added
                amount: b.totalPrice,
                amountLabel: `${b.totalPrice.toLocaleString()} ر.س`,
                status: b.status === 'CONFIRMED' ? 'مؤكد' : b.status === 'CANCELLED' ? 'ملغى' : 'قيد المراجعة',
                createdAt: new Date(b.createdAt),
            }));

            // Sort by newest
            transformedBookings.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

            set({ bookings: transformedBookings, isLoading: false });
        } catch (error) {
            console.error('Fetch bookings error:', error);
            set({ error: (error as Error).message, isLoading: false });
        }
    },

    addBooking: async (bookingData) => {
        set({ isLoading: true, error: null });
        try {
            const res = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(bookingData),
            });
            if (!res.ok) throw new Error('Failed to create booking');

            // Refresh bookings to get the new one with correct ID
            await get().fetchBookings();
            return true;
        } catch (error) {
            set({ error: (error as Error).message, isLoading: false });
            return false;
        }
    },

    getBooking: (id) => get().bookings.find(b => b.id === id),

    getBookingsByHotel: (hotelId) => get().bookings.filter(b => b.hotelId === hotelId),

    getBookingsByUser: (email) => get().bookings.filter(b => b.email === email),

    updateBooking: async (id, updates) => {
        console.warn('Update booking API not implemented');
        set(state => ({
            bookings: state.bookings.map(b => b.id === id ? { ...b, ...updates } : b)
        }));
    },

    updateBookingStatus: async (id, status) => {
        console.warn('Update booking status API not implemented');
        set(state => ({
            bookings: state.bookings.map(b => b.id === id ? { ...b, status } : b)
        }));
    },

    deleteBooking: async (id) => {
        console.warn('Delete booking API not implemented');
        set(state => ({
            bookings: state.bookings.filter(b => b.id !== id)
        }));
    },

    getTotalRevenue: () => {
        return get().bookings
            .filter(b => b.status === 'مؤكد')
            .reduce((sum, b) => sum + b.amount, 0);
    },

    getBookingsCount: () => {
        const bookings = get().bookings;
        return {
            total: bookings.length,
            confirmed: bookings.filter(b => b.status === 'مؤكد').length,
            pending: bookings.filter(b => b.status === 'قيد المراجعة').length,
            cancelled: bookings.filter(b => b.status === 'ملغى').length,
        };
    },

    resetToDefaults: () => {
        set({ bookings: [] });
        get().fetchBookings();
    }
}));

export const useBooking = (id: string) => useBookingsStore(state => state.getBooking(id));
export const useAllBookings = () => useBookingsStore(state => state.bookings);
