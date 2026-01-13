'use client';

import Link from 'next/link';
import Header from '@/components/Header';
import HotelSearchCompact from '@/components/hotels/HotelSearchCompact';
import HotelCardHorizontal from '@/components/hotels/HotelCardHorizontal';
import QuickFilterBar from '@/components/hotels/QuickFilterBar';
import { SlidersHorizontal, ArrowUpDown, Loader2, X } from 'lucide-react';
import dynamicImport from 'next/dynamic';
import { useState, useMemo, useEffect, Suspense } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import HotelCardSkeleton from '@/components/hotels/HotelCardSkeleton';
import { useSearchParams, useRouter } from 'next/navigation';



// Dynamically Import Map
const HotelMap = dynamicImport(() => import('@/components/hotels/HotelMap'), {
    ssr: false,
    loading: () => (
        <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 animate-pulse">
            <p className="font-bold">جاري تحميل الخريطة...</p>
        </div>
    )
});

import { useHotelsStore } from '@/store/hotelsStore';
import HotelFilterModal, { FilterState } from '@/components/hotels/HotelFilterModal';
import CompareFloatingBar from '@/components/hotels/CompareFloatingBar';
import HotelComparisonModal from '@/components/hotels/HotelComparisonModal';

function HotelsContent() {
    const searchParams = useSearchParams();
    // Parse initial state from URL
    const locationParam = searchParams.get('destination') || searchParams.get('location');

    // Parse Dates
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const initialDates = {
        start: checkInParam ? new Date(checkInParam) : null,
        end: checkOutParam ? new Date(checkOutParam) : null
    };

    // Parse Guests
    const adultsParam = parseInt(searchParams.get('adults') || '2');
    const childrenParam = parseInt(searchParams.get('children') || '0');
    const roomsParam = parseInt(searchParams.get('rooms') || '1');
    const initialGuests = {
        adults: adultsParam,
        children: childrenParam,
        rooms: roomsParam
    };

    const { hotels, fetchHotels, isLoading } = useHotelsStore();

    useEffect(() => {
        let query = '';
        if (locationParam) query += `destination=${locationParam}&`;
        if (checkInParam) query += `checkIn=${checkInParam}&`;
        if (checkOutParam) query += `checkOut=${checkOutParam}&`;
        // Guests in fetch URL? The fetchHotels function handles building the URL based on args or logic
        // But the store's fetchHotels takes a query string.
        if (adultsParam) query += `adults=${adultsParam}&`;
        if (childrenParam) query += `children=${childrenParam}&`;
        if (roomsParam) query += `rooms=${roomsParam}&`;

        fetchHotels(query);
    }, [locationParam, checkInParam, checkOutParam, adultsParam, childrenParam, roomsParam, fetchHotels]);
    // State Management
    const [hoveredHotelId, setHoveredHotelId] = useState<number | null>(null);
    const [selectedSort, setSelectedSort] = useState('price-low');
    const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [isMobileMapOpen, setIsMobileMapOpen] = useState(false);
    const [isMapModalOpen, setIsMapModalOpen] = useState(false);

    // Filters & Search
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [filters, setFilters] = useState<FilterState>({
        priceRange: [0, 5000],
        stars: [],
        amenities: [],
        meals: [],
        views: [],
        roomTypes: [],
        distance: null,
        searchQuery: ''
    });
    const [maxDistanceFilter, setMaxDistanceFilter] = useState<number | null>(null);
    const [isSearching, setIsSearching] = useState(false);

    const router = useRouter();

    // Simulated Search Handler
    const handleSearch = (searchData: any) => {
        setIsSearching(true);
        // Construct query parameters
        const params = new URLSearchParams(searchParams.toString());

        if (searchData.location && searchData.location !== 'جميع الفنادق') {
            params.set('destination', searchData.location);
        } else {
            params.delete('destination');
        }

        if (searchData.dates?.start) {
            params.set('checkIn', searchData.dates.start.toISOString());
        } else {
            params.delete('checkIn');
        }

        if (searchData.dates?.end) {
            params.set('checkOut', searchData.dates.end.toISOString());
        } else {
            params.delete('checkOut');
        }

        // Add Guest Params
        if (searchData.guests) {
            params.set('adults', searchData.guests.adults.toString());
            params.set('children', searchData.guests.children.toString());
            params.set('rooms', searchData.guests.rooms.toString());
        }

        // Add other filters to URL if needed, or stick to local state for now
        // router.push(`/hotels?${params.toString()}`); -> This triggers useEffect -> fetchHotels

        router.push(`/hotels?${params.toString()}`);
        setIsSearching(false);
    };

    // Filtering Logic
    const filteredHotels = useMemo(() => {
        let result = [...hotels];

        // 0. Filter by Search Query (Hotel Name)
        if (filters.searchQuery && filters.searchQuery.trim() !== '') {
            const query = filters.searchQuery.trim().toLowerCase();
            result = result.filter(h =>
                h.name.toLowerCase().includes(query) ||
                h.location?.toLowerCase().includes(query)
            );
        }

        // 1. Filter by Price
        result = result.filter(h => h.price >= filters.priceRange[0] && h.price <= filters.priceRange[1]);

        // 2. Filter by Stars
        if (filters.stars.length > 0) {
            result = result.filter(h => {
                const stars = h.rating >= 4.5 ? 5 : h.rating >= 4.0 ? 4 : 3;
                return filters.stars.includes(stars);
            });
        }

        // 3. Filter by Amenities
        if (filters.amenities.length > 0) {
            result = result.filter(h =>
                filters.amenities.every(a => h.features.includes(a)) ||
                filters.amenities.every(a => h.amenities?.some(ha => ha.label === a))
            );
        }

        // 4. Filter by Meals
        if (filters.meals && filters.meals.length > 0) {
            result = result.filter(h => {
                // Map logical features to check
                const hasBreakfast = h.features.includes('إفطار') || h.features.includes('فطور') || h.features.includes('وجبات');

                // Simple keyword matching for demo purposes
                return filters.meals.some(f => {
                    if (f.includes('فطور') && hasBreakfast) return true;
                    if (f === 'غرفة بدون وجبة' && !hasBreakfast) return true;
                    // Relaxed check: if hotel has features matching the filter text
                    return h.features.some(feat => feat.includes(f));
                });
            });
        }

        // 5. Filter by Views
        if (filters.views && filters.views.length > 0) {
            result = result.filter(h => {
                const hotelViews = h.features.join(' ') + (h.rooms?.map(r => r.view).join(' ') || '');
                return filters.views.some(v => {
                    if (v.includes('الكعبة') && hotelViews.includes('الكعبة')) return true;
                    if (v.includes('الحرم') && hotelViews.includes('الحرم')) return true;
                    if (v.includes('المدينة') && (hotelViews.includes('المدينة') || !hotelViews.includes('الحرم'))) return true;
                    return false;
                });
            });
        }

        // 6. Filter by Room Types
        if (filters.roomTypes && filters.roomTypes.length > 0) {
            result = result.filter(h => {
                if (!h.rooms || h.rooms.length === 0) return false;
                return filters.roomTypes.some(selectedType => {
                    if (selectedType === 'غرفة مفردة') return h.rooms.some(r => r.beds.includes('فردي') || r.type === 'double'); // Approximate
                    if (selectedType === 'غرفة لشخصين') return h.rooms.some(r => r.type === 'double');
                    if (selectedType === 'غرفة لثلاث أشخاص') return h.rooms.some(r => r.type === 'triple');
                    if (selectedType === 'غرفة لأربع أشخاص') return h.rooms.some(r => r.type === 'quad');
                    if (selectedType.includes('جناح')) return h.rooms.some(r => r.type === 'suite');
                    return false;
                });
            });
        }

        // 7. Filter by Guests (Standard Capacity)
        if (adultsParam > 0) {
            result = result.filter(h => {
                if (!h.rooms || h.rooms.length === 0) return false;
                return h.rooms.some(room => {
                    const roomCapacity = typeof room.capacity === 'number' ? room.capacity : (room.capacity?.adults || 2);
                    return roomCapacity >= adultsParam;
                });
            });
        }

        // 8. Filter by Distance
        if (filters.distance) {
            result = result.filter(h => {
                const distString = h.distance; // e.g., "50 متر عن الحرم"
                let distMeters = 0;

                if (distString.includes('متر')) {
                    distMeters = parseInt(distString.split(' ')[0]);
                } else if (distString.includes('كم') || distString.includes('كيلومتر')) {
                    distMeters = parseFloat(distString.split(' ')[0]) * 1000;
                }

                if (filters.distance === 'أقل من كيلومتر واحد') return distMeters < 1000;
                if (filters.distance === 'أقل من 3 كلم') return distMeters < 3000;
                if (filters.distance === 'أقل من 5 كلم') return distMeters < 5000;
                return true;
            });
        }

        // 8. Filter by Walking Time (maxDistanceFilter in minutes)
        if (maxDistanceFilter !== null) {
            result = result.filter(h => {
                if (!h.coordinates) return true;

                // Determine which mosque based on location
                const isMadinah = h.location?.toLowerCase().includes('مدينة') ||
                    h.location?.toLowerCase().includes('المدينة');
                const mosqueCoords = isMadinah
                    ? [24.4672, 39.6112] as [number, number]  // Masjid Nabawi
                    : [21.4225, 39.8262] as [number, number]; // Al-Haram

                // Calculate walking time
                const R = 6371e3;
                const lat1 = mosqueCoords[0] * Math.PI / 180;
                const lat2 = h.coordinates[0] * Math.PI / 180;
                const deltaLat = (h.coordinates[0] - mosqueCoords[0]) * Math.PI / 180;
                const deltaLon = (h.coordinates[1] - mosqueCoords[1]) * Math.PI / 180;
                const a = Math.sin(deltaLat / 2) ** 2 +
                    Math.cos(lat1) * Math.cos(lat2) * Math.sin(deltaLon / 2) ** 2;
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c;
                const walkingTime = Math.round(distance / 80);

                return walkingTime <= maxDistanceFilter;
            });
        }

        // Sorting
        if (selectedSort === 'price-low') {
            result.sort((a, b) => a.price - b.price);
        } else if (selectedSort === 'price-high') {
            result.sort((a, b) => b.price - a.price);
        } else if (selectedSort === 'rating') {
            result.sort((a, b) => b.rating - a.rating);
        } else if (selectedSort === 'distance') {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const getDist = (s: string) => parseInt(s.split(' ')[0]); // Rough approx
            result.sort((a, b) => getDist(a.distance) - getDist(b.distance));
        }

        return result;
    }, [selectedSort, filters, hotels, locationParam, maxDistanceFilter]);

    const handleSortChange = (sort: string) => {
        setSelectedSort(sort);
    };

    return (
        <main className="min-h-screen bg-gray-50/50 flex flex-col font-cairo pt-20">
            <Header />

            {/* Search Section (Top) */}
            <div className="bg-white border-b border-gray-200 py-6 mb-8 shadow-sm relative z-30">
                <div className="container-custom">
                    <HotelSearchCompact
                        onSortChange={handleSortChange}
                        activeSort={selectedSort}
                        onSearch={handleSearch}
                        initialDestination={locationParam}
                        initialDates={initialDates}
                        initialGuests={initialGuests}
                    />
                </div>
            </div>

            <div className="px-4 lg:px-6 pb-16">
                {/* Quick Filter Bar */}
                <QuickFilterBar
                    priceRange={filters.priceRange}
                    onPriceChange={(range) => setFilters(prev => ({ ...prev, priceRange: range }))}
                    maxDistance={maxDistanceFilter}
                    onDistanceChange={setMaxDistanceFilter}
                    destination={locationParam}
                    totalResults={filteredHotels.length}
                    onReset={() => {
                        setFilters({ priceRange: [0, 5000], stars: [], amenities: [], meals: [], views: [], roomTypes: [], distance: null, searchQuery: '' });
                        setMaxDistanceFilter(null);
                    }}
                />

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 items-start">

                    {/* Main Content - Hotel List - 7 columns */}
                    <div className="col-span-12 lg:col-span-7 lg:pr-4">

                        {/* List Header */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 mb-1">
                                    {locationParam ? `فنادق ${locationParam}` : 'جميع الفنادق'}
                                </h1>
                                <p className="text-gray-500 font-medium text-sm">
                                    <span className="font-bold text-gray-900">{filteredHotels.length}</span> خيار متاح للإقامة
                                </p>
                            </div>

                            <div className="flex items-center gap-3">
                                {/* Mobile Filter Toggle */}
                                <button
                                    onClick={() => setIsFilterModalOpen(true)}
                                    className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 shadow-sm"
                                >
                                    <SlidersHorizontal size={16} />
                                    <span>تصفية</span>
                                </button>

                                {/* Sort Dropdown */}
                                <div className="relative group z-30">
                                    <button
                                        onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
                                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-xl font-bold text-sm text-gray-700 hover:border-gray-300 transition-all shadow-sm active:scale-95"
                                    >
                                        <ArrowUpDown size={16} />
                                        <span>ترتيب حسب</span>
                                    </button>
                                    {isSortDropdownOpen && (
                                        <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-20">
                                            {[
                                                { id: 'price-low', label: 'أقل سعر' },
                                                { id: 'price-high', label: 'أعلى سعر' },
                                                { id: 'rating', label: 'الأعلى تقييماً' },
                                                { id: 'distance', label: 'الأقرب للحرم' }
                                            ].map((option) => (
                                                <button
                                                    key={option.id}
                                                    onClick={() => {
                                                        setSelectedSort(option.id);
                                                        setIsSortDropdownOpen(false);
                                                    }}
                                                    className={`w-full text-right px-4 py-3 text-sm font-bold hover:bg-gray-50 transition-colors ${selectedSort === option.id ? 'text-primary-600 bg-primary-50' : 'text-gray-600'}`}
                                                >
                                                    {option.label}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Hotel List */}
                        <div className="space-y-4">
                            {isSearching ? (
                                [1, 2, 3, 4].map((_, i) => <HotelCardSkeleton key={i} />)
                            ) : filteredHotels.length > 0 ? (
                                <AnimatePresence mode='wait'>
                                    {filteredHotels.map((hotel, index) => (
                                        <motion.div
                                            key={hotel.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.05 }}
                                        >
                                            <Link href={`/hotels/${hotel.id}`} className="block">
                                                <HotelCardHorizontal
                                                    hotel={hotel}
                                                    isHovered={hoveredHotelId === hotel.id}
                                                    onHover={setHoveredHotelId}
                                                />
                                            </Link>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            ) : (
                                <div className="py-20 text-center bg-white rounded-3xl border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <SlidersHorizontal size={32} className="text-gray-300" />
                                    </div>
                                    <h3 className="font-bold text-gray-900 text-lg">لا توجد فنادق تطابق بحثك</h3>
                                    <button onClick={() => setFilters({ priceRange: [0, 5000], stars: [], amenities: [], meals: [], views: [], roomTypes: [], distance: null, searchQuery: '' })} className="text-primary-600 font-bold text-sm mt-2 hover:underline">
                                        إعادة تعيين الفلاتر
                                    </button>
                                </div>
                            )}
                        </div>

                    </div>

                    {/* Interactive Map - 5 columns - Sticky */}
                    <div className="hidden lg:block lg:col-span-5 h-full">
                        <div className="sticky top-24 h-[calc(100vh-120px)] rounded-3xl overflow-hidden shadow-xl border border-gray-100">
                            {/* Map Header */}
                            <div className="absolute top-0 right-0 left-0 z-[400] bg-white/95 backdrop-blur-sm px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-secondary-100 rounded-xl flex items-center justify-center">
                                        <span className="text-lg">🗺️</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-black text-gray-900">خريطة الفنادق</p>
                                        <p className="text-xs text-gray-500">{filteredHotels.length} فندق على الخريطة</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsMapModalOpen(true)}
                                    className="px-3 py-1.5 bg-gray-100 rounded-lg text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors"
                                >
                                    ملء الشاشة
                                </button>
                            </div>

                            {/* Map */}
                            <div className="w-full h-full pt-14">
                                <HotelMap
                                    hotels={filteredHotels}
                                    hoveredHotelId={hoveredHotelId}
                                    onMarkerClick={(id) => {
                                        setHoveredHotelId(id);
                                        // Scroll to hotel card
                                        const element = document.querySelector(`[data-hotel-id="${id}"]`);
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                        }
                                    }}
                                />
                            </div>

                            {/* Hovered Hotel Preview */}
                            <AnimatePresence>
                                {hoveredHotelId && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 20 }}
                                        className="absolute bottom-4 right-4 left-4 z-[400] bg-white rounded-2xl shadow-2xl border border-gray-100 p-4"
                                    >
                                        {(() => {
                                            const hotel = filteredHotels.find(h => h.id === hoveredHotelId);
                                            if (!hotel) return null;
                                            return (
                                                <Link href={`/hotels/${hotel.id}`} className="flex items-center gap-4">
                                                    <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                                                        <img src={hotel.images[0]} alt={hotel.name} className="w-full h-full object-cover" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="font-black text-gray-900 text-sm truncate">{hotel.name}</h4>
                                                        <p className="text-xs text-gray-500 mb-1">
                                                            {hotel.distance} عن الحرم
                                                            {hotel.timeInMinutes && (
                                                                <span className="text-emerald-600 font-bold mr-2">
                                                                    🚶 {hotel.timeInMinutes} دقيقة
                                                                </span>
                                                            )}
                                                        </p>
                                                        <div className="flex items-center justify-between">
                                                            <div className="flex items-center gap-1 text-primary-600">
                                                                <span className="font-black text-lg">{hotel.price}</span>
                                                                <span className="text-xs">ر.س</span>
                                                            </div>
                                                            <div className="flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg">
                                                                <span className="text-xs">⭐</span>
                                                                <span className="font-bold text-xs text-primary-700">{hotel.rating}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Link>
                                            );
                                        })()}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Screen Map Modal */}
            <AnimatePresence>
                {isMapModalOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="fixed inset-0 z-[100] bg-white"
                    >
                        <div className="absolute top-0 left-0 w-full h-20 bg-white/90 backdrop-blur-md z-[101] flex items-center justify-between px-6 shadow-sm border-b border-gray-200">
                            <div className="flex items-center gap-4">
                                <h2 className="text-xl font-black text-gray-900">الخريطة</h2>
                                <span className="text-sm font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{filteredHotels.length} فندق</span>
                            </div>
                            <button
                                onClick={() => setIsMapModalOpen(false)}
                                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors"
                            >
                                <X size={24} />
                            </button>
                        </div>
                        <div className="w-full h-full pt-20">
                            <HotelMap
                                hotels={filteredHotels}
                                hoveredHotelId={hoveredHotelId}
                                onMarkerClick={(id) => {
                                    // Optional: Scroll to hotel in a list sidebar within map view if implemented
                                    console.log('Clicked hotel on map:', id);
                                }}
                            />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile Filter Modal */}
            <HotelFilterModal
                isOpen={isFilterModalOpen}
                onClose={() => setIsFilterModalOpen(false)}
                currentFilters={filters}
                onApply={setFilters}
            />

            {/* Comparison System */}
            <CompareFloatingBar />
            <HotelComparisonModal />
        </main>
    );
}

export default function HotelsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-primary-600" size={32} />
            </div>
        }>
            <HotelsContent />
        </Suspense>
    );
}
