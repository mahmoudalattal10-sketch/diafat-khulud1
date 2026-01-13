'use client';

import { useState } from 'react';
import { X, Check, Search, Wifi, Coffee, Car, Utensils, Wind, Dumbbell, Waves, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface HotelFilterModalProps {
    isOpen: boolean;
    onClose: () => void;
    onApply: (filters: FilterState) => void;
    currentFilters: FilterState;
}

export interface FilterState {
    priceRange: [number, number];
    stars: number[];
    amenities: string[];
    meals: string[];
    views: string[];
    roomTypes: string[];
    distance: string | null;
    searchQuery: string;
}

const AMENITIES_CONFIG = [
    { label: 'واي فاي مجاني', icon: Wifi },
    { label: 'إفطار', icon: Coffee },
    { label: 'موقف سيارات', icon: Car },
    { label: 'مطعم', icon: Utensils },
    { label: 'مكيف هواء', icon: Wind },
    { label: 'نادي رياضي', icon: Dumbbell },
    { label: 'إطلالة كعبة', icon: ShieldCheck }, // Placeholder icon
    { label: 'سبا', icon: Waves },
];

export default function HotelFilterModal({ isOpen, onClose, onApply, currentFilters }: HotelFilterModalProps) {
    const [filters, setFilters] = useState<FilterState>(currentFilters);

    const toggleStar = (star: number) => {
        setFilters(prev => ({
            ...prev,
            stars: prev.stars.includes(star)
                ? prev.stars.filter(s => s !== star)
                : [...prev.stars, star]
        }));
    };

    const toggleAmenity = (amenity: string) => {
        setFilters(prev => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter(a => a !== amenity)
                : [...prev.amenities, amenity]
        }));
    };

    const handleApply = () => {
        onApply(filters);
        onClose();
    };

    // Quick Price Helpers
    const setPricePreset = (min: number, max: number) => {
        setFilters(prev => ({ ...prev, priceRange: [min, max] }));
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-[60]"
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, y: '100%' }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-x-0 bottom-0 md:inset-0 md:m-auto w-full max-w-lg h-[85vh] md:h-fit md:max-h-[90vh] bg-white rounded-t-[2.5rem] md:rounded-3xl shadow-2xl z-[70] overflow-hidden flex flex-col border border-gray-100"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 pb-2">
                            <h2 className="text-2xl font-black text-gray-900">تصفية النتائج</h2>
                            <button
                                onClick={onClose}
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 custom-scrollbar">

                            {/* 1. Search by Name */}
                            <div className="bg-gray-50 p-2 rounded-2xl border border-gray-100">
                                <div className="relative">
                                    <input
                                        type="text"
                                        placeholder="ابحث باسم الفندق..."
                                        className="w-full pl-4 pr-12 py-3 bg-white rounded-xl text-right font-bold text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-100 transition-all shadow-sm"
                                    />
                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-primary-500">
                                        <Search size={22} />
                                    </div>
                                </div>
                            </div>

                            {/* 2. Price Range */}
                            <div className="space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-lg font-bold text-gray-900">الميزانية</h3>
                                    <span className="text-primary-600 font-bold bg-primary-50 px-3 py-1 rounded-lg text-sm">
                                        {filters.priceRange[0]} - {filters.priceRange[1]} ر.س
                                    </span>
                                </div>

                                {/* Quick Price Chips */}
                                <div className="flex gap-2 mb-4 overflow-x-auto pb-2 no-scrollbar">
                                    <button onClick={() => setPricePreset(0, 500)} className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-xs font-bold hover:border-primary-500 hover:text-primary-600 transition-colors">اقتصادي (أقل من 500)</button>
                                    <button onClick={() => setPricePreset(500, 1500)} className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-xs font-bold hover:border-primary-500 hover:text-primary-600 transition-colors">متوسط (500 - 1500)</button>
                                    <button onClick={() => setPricePreset(1500, 5000)} className="whitespace-nowrap px-4 py-2 rounded-full border border-gray-200 text-xs font-bold hover:border-primary-500 hover:text-primary-600 transition-colors">فاخر (أكثر من 1500)</button>
                                </div>

                                {/* Slider Visual */}
                                <div className="relative h-8 pt-3 pb-1 px-1">
                                    <input
                                        type="range"
                                        min="0" max="5000" step="100"
                                        value={filters.priceRange[1]}
                                        onChange={(e) => setFilters({ ...filters, priceRange: [filters.priceRange[0], Number(e.target.value)] })}
                                        className="absolute w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-600 z-10"
                                    />
                                    <div className="absolute top-3 left-0 right-0 h-2 bg-primary-100 rounded-lg pointer-events-none mb-4" style={{ width: `${(filters.priceRange[1] / 5000) * 100}%` }}></div>
                                </div>
                            </div>

                            {/* 3. Star Rating */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">تصنيف النجوم</h3>
                                <div className="flex flex-row-reverse justify-between gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            onClick={() => toggleStar(star)}
                                            className={`flex-1 h-14 rounded-2xl border-2 flex flex-col items-center justify-center transition-all duration-200 ${filters.stars.includes(star)
                                                ? 'border-primary-400 bg-primary-50 text-primary-700 shadow-lg shadow-primary-100 translation-y-[-2px]'
                                                : 'border-gray-100 bg-white text-gray-400 hover:border-gray-200'
                                                }`}
                                        >
                                            <span className="text-lg">★</span>
                                            <span className="text-xs font-bold">{star}</span>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* 4. Amenities Grid */}
                            <div>
                                <h3 className="text-lg font-bold text-gray-900 mb-4">أبرز الخدمات</h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {AMENITIES_CONFIG.map(({ label, icon: Icon }) => {
                                        const isSelected = filters.amenities.includes(label);
                                        return (
                                            <button
                                                key={label}
                                                onClick={() => toggleAmenity(label)}
                                                className={`relative p-4 rounded-2xl border-2 text-right transition-all duration-200 flex flex-col gap-3 ${isSelected
                                                    ? 'border-primary-500 bg-primary-50 text-primary-700 shadow-md shadow-primary-100'
                                                    : 'border-gray-100 bg-white text-gray-500 hover:border-gray-200'
                                                    }`}
                                            >
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isSelected ? 'bg-white' : 'bg-gray-50'}`}>
                                                    <Icon size={16} className={isSelected ? 'text-primary-600' : 'text-gray-400'} />
                                                </div>
                                                <span className="text-xs font-bold">{label}</span>
                                                {isSelected && (
                                                    <div className="absolute top-3 left-3 bg-primary-500 text-white rounded-full p-0.5">
                                                        <Check size={10} strokeWidth={4} />
                                                    </div>
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                        </div>

                        {/* Footer */}
                        <div className="p-5 border-t border-gray-100 bg-gray-50 flex items-center gap-3">
                            <button
                                onClick={() => setFilters({
                                    priceRange: [0, 5000],
                                    stars: [],
                                    amenities: [],
                                    meals: [],
                                    views: [],
                                    roomTypes: [],
                                    distance: null,
                                    searchQuery: ''
                                })}
                                className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition-colors"
                            >
                                مسح الكل
                            </button>
                            <button
                                onClick={handleApply}
                                className="flex-1 px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 transition-all active:scale-95"
                            >
                                تطبيق النتائج
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
