'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import DateRangePicker from '../DateRangePicker';
import GuestSelector from '../GuestSelector';

import { HOTELS_DATA } from '@/data/hotels';

interface HotelSearchCompactProps {
    onSortChange?: (sort: string) => void;
    activeSort?: string;
    onSearch?: (data: any) => void;
    initialDestination?: string | null;
    initialDates?: { start: Date | null; end: Date | null };
    initialGuests?: { adults: number; children: number; rooms: number };
}

export default function HotelSearchCompact({
    onSortChange,
    activeSort,
    onSearch,
    initialDestination,
    initialDates,
    initialGuests
}: HotelSearchCompactProps) {

    // Destination State - sync with initialDestination prop
    const [destination, setDestination] = useState(initialDestination || 'جميع الفنادق');
    const [searchQuery, setSearchQuery] = useState('');
    const [isDestinationOpen, setIsDestinationOpen] = useState(false);

    // Filter Logic
    // Dynamic Cities from Data
    const cities = Array.from(new Set(HOTELS_DATA.map(h => h.location)));

    // Helper for fuzzy search
    const matchesSearch = (text: string, query: string) => {
        const normalize = (str: string) => str
            .toLowerCase()
            .replace(/[\u064B-\u065F]/g, '') // Remove Tashkeel
            .replace(/[أإآا]/g, 'ا') // Normalize Alef
            .replace(/ة/g, 'ه') // Normalize Teh Marbuta
            .replace(/ى/g, 'ي'); // Normalize Ya

        return normalize(text).includes(normalize(query));
    };

    // Filtered lists
    const filteredCities = searchQuery
        ? cities.filter(c => matchesSearch(c, searchQuery))
        : ['جميع الفنادق', ...cities];

    const filteredHotels = searchQuery
        ? HOTELS_DATA.filter(h => matchesSearch(h.name, searchQuery) || matchesSearch(h.location, searchQuery))
        : []; // Only show hotels when searching, or maybe show "Featured" by default? Let's show filtered only for cleanliness.

    // Sync destination when initialDestination changes (URL navigation)
    useEffect(() => {
        if (initialDestination) {
            setDestination(initialDestination);
        } else {
            setDestination('جميع الفنادق');
        }
    }, [initialDestination]);

    // Date State
    const [startDate, setStartDate] = useState<Date | null>(initialDates?.start || new Date(2026, 0, 15));
    const [endDate, setEndDate] = useState<Date | null>(initialDates?.end || new Date(2026, 0, 22));
    const [isDateOpen, setIsDateOpen] = useState(false);

    // Sync dates when initialDates changes
    useEffect(() => {
        if (initialDates) {
            setStartDate(initialDates.start);
            setEndDate(initialDates.end);
        }
    }, [initialDates]);

    // Guest State
    const [guestData, setGuestData] = useState({
        adults: initialGuests?.adults || 2,
        children: initialGuests?.children || 1,
        childAges: [] as number[], // defaulting empty for now, could parse from URL if complex
        rooms: initialGuests?.rooms || 1
    });

    // Sync guests when initialGuests changes
    useEffect(() => {
        if (initialGuests) {
            setGuestData(prev => ({
                ...prev,
                adults: initialGuests.adults,
                children: initialGuests.children,
                rooms: initialGuests.rooms
            }));
        }
    }, [initialGuests]);
    const [isGuestOpen, setIsGuestOpen] = useState(false);

    // Budget State
    const [maxPrice, setMaxPrice] = useState(5000);

    const formatDateRange = (start: Date | null, end: Date | null) => {
        if (!start || !end) return 'اختر التواريخ';
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', calendar: 'gregory' };
        // Use Arabic locale manually since Intl might vary, but for now simple format:
        const months = ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو', 'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'];
        return `${start.getDate()} ${months[start.getMonth()]} - ${end.getDate()} ${months[end.getMonth()]}`;
    };

    const getNightsCount = (start: Date | null, end: Date | null) => {
        if (!start || !end) return 0;
        const diffTime = Math.abs(end.getTime() - start.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const handleSearch = () => {
        if (onSearch) {
            onSearch({
                location: destination,
                dates: { start: startDate, end: endDate },
                guests: guestData
            });
        }
    };

    return (
        <div className="w-full">
            {/* Main Container: Responsive Shape and Padding */}
            <div className={`bg-white transition-all duration-300 border border-gray-100 
                rounded-[2rem] p-5 shadow-xl               /* Mobile Styles */
                lg:rounded-full lg:p-2 lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)] lg:flex lg:items-center lg:justify-between lg:gap-2 lg:border-blue-50/50 /* Desktop Styles */
            `}>

                {/* Inputs Container */}
                <div className="flex flex-col gap-4 w-full lg:flex-row lg:items-center lg:gap-0 lg:divide-x lg:divide-x-reverse lg:divide-gray-100 lg:h-full">

                    {/* Destination (Mobile: Stacked, Desktop: Section) */}
                    <div className="relative group lg:flex-1 lg:h-full">
                        <div
                            onClick={() => { setIsDestinationOpen(!isDestinationOpen); setIsDateOpen(false); setIsGuestOpen(false); }}
                            className="w-full cursor-pointer lg:h-full lg:flex lg:flex-col lg:justify-center lg:px-6 lg:hover:bg-gray-50/80 lg:rounded-full transition-all"
                        >
                            <label className="text-xs font-bold text-gray-500 mb-1 block lg:mb-0.5 lg:text-[10px] lg:text-gray-400 lg:uppercase lg:tracking-wider">الوجهة</label>
                            <div className="flex items-center justify-between">
                                <div className="font-black text-gray-900 text-lg lg:text-base truncate">
                                    {destination}
                                </div>
                            </div>
                        </div>

                        <AnimatePresence>
                            {isDestinationOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 20, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-2 w-full lg:w-80 bg-white rounded-2xl lg:rounded-[2rem] shadow-2xl border border-gray-100 overflow-hidden z-[60] p-3"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <div className="space-y-1">
                                        <div className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">الوجهات</div>
                                        {['جميع الفنادق', 'مكة المكرمة', 'المدينة المنورة'].map((city) => (
                                            <button
                                                key={city}
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setDestination(city);
                                                    setIsDestinationOpen(false);
                                                }}
                                                className={`w-full text-right px-3 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${destination === city ? 'bg-primary-50 text-primary-700' : 'hover:bg-gray-50 text-gray-600'}`}
                                            >
                                                <span className="flex items-center gap-3">
                                                    <span className="text-xl">
                                                        {city.includes('مكة') && '🕋'}
                                                        {city.includes('المدينة') && '🕌'}
                                                        {city === 'جميع الفنادق' && '🏢'}
                                                    </span>
                                                    {city}
                                                </span>
                                                {destination === city && <Check size={16} strokeWidth={2.5} />}
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>


                    {/* Dates Section */}
                    <div className="relative group border-b border-gray-100 pb-2 lg:border-0 lg:pb-0 lg:flex-1 lg:h-full lg:px-2">
                        <DateRangePicker
                            startDate={startDate}
                            endDate={endDate}
                            onDateChange={(start, end) => { setStartDate(start); setEndDate(end); }}
                            isOpen={isDateOpen}
                            onToggle={() => { setIsDateOpen(!isDateOpen); setIsGuestOpen(false); setIsDestinationOpen(false); }}
                            onClose={() => setIsDateOpen(false)}
                            customTrigger={({ onClick }) => (
                                <div onClick={onClick} className="w-full cursor-pointer lg:h-full lg:flex lg:flex-col lg:justify-center lg:px-6 lg:hover:bg-gray-50/80 lg:rounded-full transition-all">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block lg:mb-0.5 lg:text-[10px] lg:text-gray-400 lg:uppercase lg:tracking-wider">الوصول - المغادرة</label>
                                    <div className="flex items-center justify-between lg:justify-start">
                                        <div className="font-black text-gray-900 text-lg lg:text-base dir-ltr lg:w-full lg:text-right">
                                            {startDate && endDate ? formatDateRange(startDate, endDate) : 'اختر التواريخ'}
                                        </div>
                                        {/* Mobile Only Night Count */}
                                        <div className="text-xs font-medium text-gray-400 lg:hidden">
                                            {getNightsCount(startDate, endDate)} ليالي
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    {/* Guests Section */}
                    <div className="relative group border-b border-gray-100 pb-2 lg:border-0 lg:pb-0 lg:flex-1 lg:h-full lg:px-2">
                        <GuestSelector
                            guestData={guestData}
                            onGuestChange={setGuestData}
                            isOpen={isGuestOpen}
                            onToggle={() => { setIsGuestOpen(!isGuestOpen); setIsDateOpen(false); setIsDestinationOpen(false); }}
                            onClose={() => setIsGuestOpen(false)}
                            customTrigger={({ onClick }) => (
                                <div onClick={onClick} className="w-full cursor-pointer lg:h-full lg:flex lg:flex-col lg:justify-center lg:px-6 lg:hover:bg-gray-50/80 lg:rounded-full transition-all">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block lg:mb-0.5 lg:text-[10px] lg:text-gray-400 lg:uppercase lg:tracking-wider">الضيوف</label>
                                    <div className="flex items-center justify-between lg:justify-start">
                                        <div className="font-black text-gray-900 text-lg lg:text-base">
                                            {`${guestData.adults} بالغين، ${guestData.children} أطفال`}
                                        </div>
                                        {/* Mobile Only Room Count */}
                                        <div className="text-xs font-medium text-gray-400 lg:hidden">
                                            {guestData.rooms} غرفة
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    {/* Mobile: Full Width Gold Button */}
                    <div className="pt-2 lg:hidden">
                        <button
                            onClick={handleSearch}
                            className="w-full bg-[#b99026] hover:bg-[#a67c1e] text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                        >
                            <Search size={22} strokeWidth={2.5} />
                            <span>تحقق من التوفر</span>
                        </button>
                    </div>

                </div>

                {/* Desktop: Circular Icon Button */}
                <div className="hidden lg:block pl-1.5">
                    <button
                        onClick={handleSearch}
                        className="bg-gray-900 hover:bg-black text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all duration-300 group"
                    >
                        <Search size={22} strokeWidth={2.5} className="group-hover:-rotate-90 transition-transform duration-500" />
                    </button>
                </div>

            </div>
        </div>
    );
}
