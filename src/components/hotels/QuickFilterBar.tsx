'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal, MapPin, Banknote, ChevronDown, X, RotateCcw } from 'lucide-react';

interface QuickFilterBarProps {
    priceRange: [number, number];
    onPriceChange: (range: [number, number]) => void;
    maxDistance: number | null; // in minutes
    onDistanceChange: (minutes: number | null) => void;
    destination: string | null; // 'مكة' or 'المدينة'
    totalResults: number;
    onReset: () => void;
}

const distanceOptions = [
    { value: null, label: 'أي مسافة' },
    { value: 5, label: '5 دقائق أو أقل' },
    { value: 10, label: '10 دقائق أو أقل' },
    { value: 15, label: '15 دقيقة أو أقل' },
    { value: 20, label: '20 دقيقة أو أقل' },
];

const pricePresets = [
    { min: 0, max: 500, label: 'اقتصادي' },
    { min: 500, max: 1000, label: 'متوسط' },
    { min: 1000, max: 2000, label: 'فاخر' },
    { min: 2000, max: 5000, label: 'رفاهية' },
];

export default function QuickFilterBar({
    priceRange,
    onPriceChange,
    maxDistance,
    onDistanceChange,
    destination,
    totalResults,
    onReset
}: QuickFilterBarProps) {
    const [isPriceOpen, setIsPriceOpen] = useState(false);
    const [isDistanceOpen, setIsDistanceOpen] = useState(false);
    const [tempPrice, setTempPrice] = useState<[number, number]>(priceRange);

    const mosqueLabel = destination?.includes('مدينة') || destination?.includes('المدينة')
        ? 'المسجد النبوي 🕌'
        : 'المسجد الحرام 🕋';

    const hasActiveFilters = priceRange[0] > 0 || priceRange[1] < 5000 || maxDistance !== null;

    const handlePriceApply = () => {
        onPriceChange(tempPrice);
        setIsPriceOpen(false);
    };

    return (
        <div className="mb-8">
            <div className="flex flex-wrap items-center gap-3">

                {/* Filter Icon & Label */}
                <div className="flex items-center gap-2 text-gray-400 pl-4 border-l border-gray-200/50">
                    <SlidersHorizontal size={18} />
                    <span className="text-sm font-bold">تصفية</span>
                </div>

                {/* Price Filter Button */}
                <div className="relative">
                    <button
                        onClick={() => { setIsPriceOpen(!isPriceOpen); setIsDistanceOpen(false); }}
                        className={`group flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${priceRange[0] > 0 || priceRange[1] < 5000
                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20 ring-2 ring-primary-500 ring-offset-2'
                                : 'bg-white text-gray-700 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.06)] border border-gray-100'
                            }`}
                    >
                        <Banknote size={16} />
                        <span>
                            {priceRange[0] > 0 || priceRange[1] < 5000
                                ? `${priceRange[0]} - ${priceRange[1]} ر.س`
                                : 'السعر'}
                        </span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isPriceOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                    </button>

                    {/* Price Dropdown */}
                    <AnimatePresence>
                        {isPriceOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="absolute top-full right-0 mt-3 w-80 bg-white rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] border border-gray-100 p-5 z-50 overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-black text-gray-900 flex items-center gap-2">
                                        <Banknote size={18} className="text-primary-500" />
                                        نطاق السعر
                                    </h4>
                                    <button onClick={() => setIsPriceOpen(false)} className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors">
                                        <X size={16} />
                                    </button>
                                </div>

                                {/* Price Presets */}
                                <div className="grid grid-cols-2 gap-2.5 mb-8">
                                    {pricePresets.map((preset) => (
                                        <button
                                            key={preset.label}
                                            onClick={() => setTempPrice([preset.min, preset.max])}
                                            className={`px-4 py-3 rounded-2xl text-sm font-bold transition-all ${tempPrice[0] === preset.min && tempPrice[1] === preset.max
                                                    ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/20 scale-[1.02]'
                                                    : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-900'
                                                }`}
                                        >
                                            {preset.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Price Range Display */}
                                <div className="flex items-center justify-between mb-6 bg-gray-50 rounded-2xl p-4 border border-gray-100">
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">من</p>
                                        <p className="font-black text-xl text-gray-900">{tempPrice[0]}</p>
                                    </div>
                                    <div className="text-gray-300 font-light text-2xl">—</div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">إلى</p>
                                        <p className="font-black text-xl text-gray-900">{tempPrice[1]}</p>
                                    </div>
                                    <span className="text-xs font-bold bg-white px-2 py-1 rounded-lg border border-gray-100 shadow-sm">ر.س</span>
                                </div>

                                {/* Slider */}
                                <div className="mb-6 px-1">
                                    <input
                                        type="range"
                                        min={0}
                                        max={5000}
                                        step={100}
                                        value={tempPrice[1]}
                                        onChange={(e) => setTempPrice([tempPrice[0], parseInt(e.target.value)])}
                                        className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary-500 hover:accent-primary-600 transition-all"
                                    />
                                </div>

                                {/* Apply Button */}
                                <button
                                    onClick={handlePriceApply}
                                    className="w-full py-3.5 bg-gray-900 text-white rounded-2xl font-black text-sm hover:bg-black hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl shadow-gray-900/10"
                                >
                                    عرض النتائج
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Distance Filter Button */}
                <div className="relative">
                    <button
                        onClick={() => { setIsDistanceOpen(!isDistanceOpen); setIsPriceOpen(false); }}
                        className={`group flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 ${maxDistance !== null
                                ? 'bg-secondary-500 text-white shadow-lg shadow-secondary-500/20 ring-2 ring-secondary-500 ring-offset-2'
                                : 'bg-white text-gray-700 shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_25px_rgb(0,0,0,0.06)] border border-gray-100'
                            }`}
                    >
                        <MapPin size={16} />
                        <span>
                            {maxDistance !== null
                                ? `${maxDistance} دقيقة من ${mosqueLabel}`
                                : `المسافة من ${mosqueLabel}`}
                        </span>
                        <ChevronDown size={14} className={`transition-transform duration-300 ${isDistanceOpen ? 'rotate-180' : 'group-hover:translate-y-0.5'}`} />
                    </button>

                    {/* Distance Dropdown */}
                    <AnimatePresence>
                        {isDistanceOpen && (
                            <motion.div
                                initial={{ opacity: 0, y: 15, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 15, scale: 0.95 }}
                                className="absolute top-full right-0 mt-3 w-72 bg-white rounded-[2rem] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.1)] border border-gray-100 p-4 z-50 overflow-hidden"
                            >
                                <div className="flex items-center justify-between mb-4 px-2">
                                    <div>
                                        <h4 className="font-black text-gray-900 text-sm">المسافة مشياً</h4>
                                        <p className="text-xs text-gray-400 font-medium mt-0.5">اختر أقصى وقت للمشي</p>
                                    </div>
                                    <span className="text-xs bg-secondary-50 text-secondary-700 px-2.5 py-1.5 rounded-xl font-bold border border-secondary-100">
                                        {mosqueLabel}
                                    </span>
                                </div>

                                <div className="space-y-1.5">
                                    {distanceOptions.map((option) => (
                                        <button
                                            key={option.label}
                                            onClick={() => {
                                                onDistanceChange(option.value);
                                                setIsDistanceOpen(false);
                                            }}
                                            className={`w-full text-right px-4 py-3.5 rounded-2xl text-sm font-bold transition-all flex items-center justify-between ${maxDistance === option.value
                                                    ? 'bg-secondary-500 text-white shadow-md shadow-secondary-500/20'
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }`}
                                        >
                                            <span>{option.label}</span>
                                            {option.value && (
                                                <span className={`text-xs px-2 py-0.5 rounded-md ${maxDistance === option.value ? 'bg-white/20' : 'bg-gray-100 text-gray-500'}`}>
                                                    🏃 {option.value} د
                                                </span>
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Spacer */}
                <div className="flex-1" />

                {/* Results Count */}
                <div className="text-sm text-gray-400 font-medium px-4 py-2 bg-white/50 backdrop-blur-sm rounded-full border border-gray-100/50">
                    تم العثور على <span className="font-black text-gray-900">{totalResults}</span> فندق
                </div>

                {/* Reset Button */}
                <AnimatePresence>
                    {hasActiveFilters && (
                        <motion.button
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            onClick={onReset}
                            className="flex items-center gap-2 px-4 py-2.5 bg-red-50 text-red-600 rounded-full font-bold text-xs hover:bg-red-100 transition-colors border border-red-100 shadow-sm"
                        >
                            <RotateCcw size={14} />
                            <span>مسح الفلاتر</span>
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
