import { create } from 'zustand';

export interface CompareHotel {
    id: number | string;
    name: string;
    location: string;
    price: number;
    rating: number;
    distance: string;
    image: string;
    amenities: Array<{ icon: string; label: string }>;
    features: string[];
    rooms?: any[];
}

interface ComparisonStore {
    comparedHotels: CompareHotel[];
    maxCompare: number;
    addToCompare: (hotel: CompareHotel) => boolean;
    removeFromCompare: (id: number | string) => void;
    clearCompare: () => void;
    isComparing: (id: number | string) => boolean;
    isCompareModalOpen: boolean;
    openCompareModal: () => void;
    closeCompareModal: () => void;
}

export const useComparisonStore = create<ComparisonStore>((set, get) => ({
    comparedHotels: [],
    maxCompare: 3,
    isCompareModalOpen: false,

    addToCompare: (hotel) => {
        const { comparedHotels, maxCompare } = get();

        // Check if already comparing
        if (comparedHotels.some(h => h.id === hotel.id)) {
            return false;
        }

        // Check max limit
        if (comparedHotels.length >= maxCompare) {
            return false;
        }

        set({ comparedHotels: [...comparedHotels, hotel] });
        return true;
    },

    removeFromCompare: (id) => {
        set(state => ({
            comparedHotels: state.comparedHotels.filter(h => h.id !== id)
        }));
    },

    clearCompare: () => {
        set({ comparedHotels: [], isCompareModalOpen: false });
    },

    isComparing: (id) => {
        return get().comparedHotels.some(h => h.id === id);
    },

    openCompareModal: () => set({ isCompareModalOpen: true }),
    closeCompareModal: () => set({ isCompareModalOpen: false }),
}));
