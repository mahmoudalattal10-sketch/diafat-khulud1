'use client';

import { useState } from 'react';
import { Search, Tag, X } from 'lucide-react';
import DateRangePicker from '../DateRangePicker';
import GuestSelector from '../GuestSelector';

interface HotelAvailabilityBarProps {
    onSearch?: (criteria: any) => void;
    initialData?: {
        adults: number;
        children: number;
        childAges: number[];
        rooms: number;
    };
    initialDates?: {
        start: Date | null;
        end: Date | null;
    };
}

export default function HotelAvailabilityBar({ onSearch, initialData, initialDates }: HotelAvailabilityBarProps) {
    // Date State
    const [startDate, setStartDate] = useState<Date | null>(initialDates?.start || new Date(2026, 0, 15));
    const [endDate, setEndDate] = useState<Date | null>(initialDates?.end || new Date(2026, 0, 22));
    const [isDateOpen, setIsDateOpen] = useState(false);

    // Guest State
    const [guestData, setGuestData] = useState(initialData || {
        adults: 2,
        children: 1,
        childAges: [5],
        rooms: 1
    });
    const [isGuestOpen, setIsGuestOpen] = useState(false);

    // Promo Code State
    const [promoCode, setPromoCode] = useState('');

    const formatDateRange = (start: Date | null, end: Date | null) => {
        if (!start || !end) return 'اختر التواريخ';
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
        onSearch?.({ startDate, endDate, guestData, promoCode });
    };

    return (
        <div className="w-full py-4 mb-4 relative z-30">
            <div className="bg-white border border-gray-200 rounded-3xl md:rounded-full p-4 md:p-1.5 flex flex-col md:flex-row items-stretch md:items-center divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-gray-100 md:divide-gray-200 shadow-lg active:shadow-xl relative z-50 max-w-5xl mx-auto gap-4 md:gap-0 transition-all duration-300">
                {/* Dates */}
                <div className="flex-1 relative w-full md:w-auto">
                    <DateRangePicker
                        startDate={startDate}
                        endDate={endDate}
                        onDateChange={(start, end) => {
                            setStartDate(start);
                            setEndDate(end);
                        }}
                        isOpen={isDateOpen}
                        onToggle={() => {
                            setIsDateOpen(!isDateOpen);
                            setIsGuestOpen(false);
                        }}
                        onClose={() => setIsDateOpen(false)}
                        customTrigger={({ onClick }) => (
                            <div
                                onClick={onClick}
                                className="h-full w-full px-4 md:px-6 py-3 md:py-2 hover:bg-gray-50 rounded-xl md:rounded-r-full md:rounded-l-none cursor-pointer transition-colors group flex flex-col justify-center text-right md:border-l border-gray-100"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-primary-600 transition-colors">الوصول - المغادرة</label>
                                </div>
                                <div className="text-sm font-bold text-gray-900 truncate">
                                    {startDate && endDate ? formatDateRange(startDate, endDate) : 'اختر التواريخ'}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {startDate && endDate ? `${getNightsCount(startDate, endDate)} ليالي` : '-'}
                                </div>
                            </div>
                        )}
                    />
                </div>

                {/* Guests */}
                <div className="flex-1 relative w-full md:w-auto">
                    <GuestSelector
                        guestData={guestData}
                        onGuestChange={setGuestData}
                        isOpen={isGuestOpen}
                        onToggle={() => {
                            setIsGuestOpen(!isGuestOpen);
                            setIsDateOpen(false);
                        }}
                        onClose={() => setIsGuestOpen(false)}
                        customTrigger={({ onClick }) => (
                            <div
                                onClick={onClick}
                                className="h-full w-full px-4 md:px-6 py-3 md:py-2 hover:bg-gray-50 rounded-xl cursor-pointer transition-colors group flex flex-col justify-center text-right md:border-l border-gray-100"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-primary-600 transition-colors">الضيوف</label>
                                </div>
                                <div className="text-sm font-bold text-gray-900 truncate">
                                    {`${guestData.adults} بالغين، ${guestData.children} أطفال`}
                                </div>
                                <div className="text-xs text-gray-400">
                                    {`${guestData.rooms} غرفة`}
                                </div>
                            </div>
                        )}
                    />
                </div>

                {/* Promo Code */}
                <div className="flex-1 relative w-full md:w-auto px-4 md:px-6 py-3 md:py-2 hover:bg-gray-50 rounded-xl md:rounded-l-full transition-colors group flex flex-col justify-center text-right">
                    <div className="flex items-center gap-2 mb-1">
                        <Tag size={12} className="text-gray-400 group-hover:text-primary-600" />
                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider group-hover:text-primary-600 transition-colors">كود الخصم</label>
                    </div>
                    <input
                        type="text"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        placeholder="أدخل الكود"
                        className="w-full bg-transparent border-none p-0 text-sm font-bold text-gray-900 focus:ring-0 placeholder:text-gray-300 text-right"
                    />
                </div>

                {/* Search Button */}
                <div className="w-full md:w-auto p-0 md:p-1 md:pl-1">
                    <button
                        onClick={handleSearch}
                        className="w-full md:w-auto px-8 h-12 md:h-full min-h-[48px] bg-primary-600 hover:bg-primary-700 text-white rounded-xl md:rounded-full flex items-center justify-center shadow-lg hover:shadow-primary-600/30 transition-all active:scale-95 gap-2"
                    >
                        <Search size={22} />
                        <span className="font-bold text-lg md:hidden">تحقق من التوفر</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
