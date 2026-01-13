import { useState } from 'react';
import { Search, Wifi, Coffee, Car, Utensils, Wind, Dumbbell, ShieldCheck, Waves, Check, ChevronDown, ChevronUp, Map, Briefcase, Users, BedDouble } from 'lucide-react';
import { FilterState } from './HotelFilterModal';
import dynamic from 'next/dynamic';
import { HOTELS_DATA } from '@/data/hotels';

const HotelMap = dynamic(() => import('./HotelMap'), {
    ssr: false,
    loading: () => <div className="w-full h-full bg-gray-100 animate-pulse" />
});

interface HotelFilterSidebarProps {
    currentFilters: FilterState;
    onApply: (filters: FilterState) => void;
    onOpenMap: () => void;
}

const MEALS_CONFIG = [
    { label: 'غرفة بدون وجبة', icon: BedDouble },
    { label: 'فطور صباح', icon: Coffee },
    { label: 'وجبتين', icon: Utensils },
    { label: 'ثلاث وجبات', icon: Utensils },
    { label: 'فل بورد إندونيسي', icon: Utensils },
    { label: 'عشاء', icon: Utensils },
];

const VIEWS_CONFIG = ['مطلّة على المدينة', 'مطلّة جزئيا على الكعبة', 'مطلّة جزئيا على الحرم'];

const ROOM_TYPES_CONFIG = ['غرفة مفردة', 'غرفة لشخصين', 'غرفة لثلاث أشخاص', 'غرفة لأربع أشخاص', 'جناح صغير شخص واحد'];

const DISTANCE_CONFIG = ['أقل من كيلومتر واحد', 'أقل من 3 كلم', 'أقل من 5 كلم'];

const AMENITIES_FULL_LIST = [
    'المصاعد', 'البطاقات الإتمانية', 'قاعة إحتفالات', 'مكيف هواء', 'الإنترنت',
    'موقف سيارات', 'أنشطة للأطفال', 'المساعدة', 'حمام بخار', 'نادي رياضة',
    'حمام سباحة', 'مقهى', 'مطعم', 'خدمة غسيل الملابس', 'مطعم خاص',
    'مركز رجال الأعمال', 'استقبال من وإلى المطار', 'خدمة المواصلات'
];

function FilterSection({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="border-b border-gray-100 py-6 last:border-0">
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center justify-between w-full mb-4 group">
                <h3 className="text-sm font-bold text-gray-900 group-hover:text-primary-600 transition-colors">{title}</h3>
                {isOpen ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {isOpen && <div className="space-y-3">{children}</div>}
        </div>
    );
}

export default function HotelFilterSidebar({ currentFilters, onApply, onOpenMap }: HotelFilterSidebarProps) {
    const [filters, setFilters] = useState<FilterState>(currentFilters);
    const [showAllAmenities, setShowAllAmenities] = useState(false);

    const updateFilter = (key: keyof FilterState, value: any) => {
        const newFilters = { ...filters, [key]: value };
        setFilters(newFilters);
        onApply(newFilters);
    };

    const toggleArrayItem = (key: 'meals' | 'views' | 'roomTypes' | 'amenities' | 'stars', item: any) => {
        const currentList = filters[key] as any[];
        const newList = currentList.includes(item)
            ? currentList.filter(i => i !== item)
            : [...currentList, item];
        updateFilter(key, newList);
    };

    // Helper for Amenities Display
    const displayedAmenities = showAllAmenities ? AMENITIES_FULL_LIST : AMENITIES_FULL_LIST.slice(0, 5);

    return (
        <div className="bg-white rounded-3xl shadow-lg border border-gray-100 p-6 sticky top-24 h-fit overflow-y-auto max-h-[calc(100vh-120px)] custom-scrollbar">
            {/* Map Preview Widget */}
            <div className="mb-6">
                <button
                    onClick={onOpenMap}
                    className="w-full h-40 rounded-3xl border-2 border-secondary-50 relative overflow-hidden group hover:border-secondary-300 transition-all shadow-sm hover:shadow-md"
                >
                    <div className="absolute inset-0 z-0">
                        <HotelMap
                            hotels={HOTELS_DATA}
                            hoveredHotelId={null}
                            onMarkerClick={() => { }}
                            isWidget={true}
                        />
                    </div>

                    {/* Overlay Gradient & Text */}
                    <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/20 to-transparent flex items-end justify-center pb-4 z-10 group-hover:bg-white/40 transition-colors">
                        <div className="bg-white/90 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-secondary-50 flex items-center gap-2 text-secondary-700 font-black group-hover:scale-105 transition-transform">
                            <Map size={18} />
                            <span>عرض على الخريطة</span>
                        </div>
                    </div>
                </button>
            </div>

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-black text-gray-900">تصفية النتائج</h3>
                <button
                    onClick={() => {
                        const reset = {
                            priceRange: [0, 5000], stars: [], amenities: [],
                            meals: [], views: [], roomTypes: [], distance: null,
                            searchQuery: ''
                        } as FilterState;
                        setFilters(reset);
                        onApply(reset);
                    }}
                    className="text-xs font-bold text-gray-500 hover:text-primary-600 transition-colors"
                >
                    إعادة تعيين
                </button>
            </div>

            {/* Search */}
            <div className="mb-4">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="اسم الفندق..."
                        value={filters.searchQuery || ''}
                        onChange={(e) => updateFilter('searchQuery', e.target.value)}
                        className="w-full pl-4 pr-10 py-2.5 bg-gray-50 rounded-xl text-sm font-bold text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary-100/50 transition-all border border-transparent focus:border-primary-200"
                    />
                    <Search size={16} className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400" />
                </div>
            </div>

            {/* Price Range */}
            <FilterSection title="السعر لليلة">
                <div className="px-1">
                    <div className="flex justify-between text-xs font-bold text-gray-900 mb-3">
                        <span>{filters.priceRange[0]} ر.س</span>
                        <span>{filters.priceRange[1]} ر.س</span>
                    </div>
                    <input
                        type="range"
                        min="0" max="5000" step="100"
                        value={filters.priceRange[1]}
                        onChange={(e) => {
                            const val = Number(e.target.value);
                            const newFilters = { ...filters, priceRange: [0, val] } as FilterState;
                            setFilters(newFilters);
                            onApply(newFilters);
                        }}
                        className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                    />
                </div>
            </FilterSection>

            {/* Meals */}
            <FilterSection title="الوجبات">
                {MEALS_CONFIG.map((meal) => (
                    <label key={meal.label} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm text-gray-600 font-medium group-hover:text-primary-600 transition-colors">{meal.label}</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${filters.meals?.includes(meal.label) ? 'bg-primary-500 border-primary-500' : 'border-gray-200 bg-white'}`}>
                            {filters.meals?.includes(meal.label) && <Check size={12} className="text-white" strokeWidth={4} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={filters.meals?.includes(meal.label) || false} onChange={() => toggleArrayItem('meals', meal.label)} />
                    </label>
                ))}
            </FilterSection>

            {/* Views */}
            <FilterSection title="الإطلالات">
                {VIEWS_CONFIG.map((view) => (
                    <label key={view} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm text-gray-600 font-medium group-hover:text-primary-600 transition-colors">{view}</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${filters.views?.includes(view) ? 'bg-primary-500 border-primary-500' : 'border-gray-200 bg-white'}`}>
                            {filters.views?.includes(view) && <Check size={12} className="text-white" strokeWidth={4} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={filters.views?.includes(view) || false} onChange={() => toggleArrayItem('views', view)} />
                    </label>
                ))}
            </FilterSection>

            {/* Room Types */}
            <FilterSection title="أنواع الغرف">
                {ROOM_TYPES_CONFIG.map((type) => (
                    <label key={type} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm text-gray-600 font-medium group-hover:text-primary-600 transition-colors">{type}</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${filters.roomTypes?.includes(type) ? 'bg-primary-500 border-primary-500' : 'border-gray-200 bg-white'}`}>
                            {filters.roomTypes?.includes(type) && <Check size={12} className="text-white" strokeWidth={4} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={filters.roomTypes?.includes(type) || false} onChange={() => toggleArrayItem('roomTypes', type)} />
                    </label>
                ))}
            </FilterSection>

            {/* Amenities (Show More) */}
            <FilterSection title="المرافق">
                {displayedAmenities.map((amenity) => (
                    <label key={amenity} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm text-gray-600 font-medium group-hover:text-primary-600 transition-colors">{amenity}</span>
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${filters.amenities.includes(amenity) ? 'bg-primary-500 border-primary-500' : 'border-gray-200 bg-white'}`}>
                            {filters.amenities.includes(amenity) && <Check size={12} className="text-white" strokeWidth={4} />}
                        </div>
                        <input type="checkbox" className="hidden" checked={filters.amenities.includes(amenity)} onChange={() => toggleArrayItem('amenities', amenity)} />
                    </label>
                ))}

                {AMENITIES_FULL_LIST.length > 5 && (
                    <button
                        onClick={() => setShowAllAmenities(!showAllAmenities)}
                        className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center gap-1 mt-2"
                    >
                        {showAllAmenities ? 'عرض أقل' : 'عرض المزيد'}
                    </button>
                )}
            </FilterSection>

            {/* Distance */}
            <FilterSection title="المسافة من الحرم">
                <label className="flex items-center justify-between group cursor-pointer">
                    <span className="text-sm text-gray-600 font-medium group-hover:text-primary-600 transition-colors">الكل</span>
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${filters.distance === null ? 'border-primary-500' : 'border-gray-200 bg-white'}`}>
                        {filters.distance === null && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                    </div>
                    <input type="radio" className="hidden" checked={filters.distance === null} onChange={() => updateFilter('distance', null)} />
                </label>

                {DISTANCE_CONFIG.map((dist) => (
                    <label key={dist} className="flex items-center justify-between group cursor-pointer">
                        <span className="text-sm text-gray-600 font-medium group-hover:text-primary-600 transition-colors">{dist}</span>
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${filters.distance === dist ? 'border-primary-500' : 'border-gray-200 bg-white'}`}>
                            {filters.distance === dist && <div className="w-2.5 h-2.5 rounded-full bg-primary-500" />}
                        </div>
                        <input type="radio" className="hidden" checked={filters.distance === dist} onChange={() => updateFilter('distance', dist)} />
                    </label>
                ))}
            </FilterSection>

            {/* Star Rating */}
            <div className="pt-6 border-t border-gray-100">
                <label className="text-sm font-bold text-gray-700 mb-3 block">عدد النجوم</label>
                <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((star) => (
                        <button
                            key={star}
                            onClick={() => toggleArrayItem('stars', star)}
                            className="flex items-center justify-between w-full group"
                        >
                            <div className="flex items-center gap-2">
                                <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${filters.stars.includes(star) ? 'bg-primary-500 border-primary-500 text-white' : 'border-gray-200 bg-white group-hover:border-primary-300'}`}>
                                    {filters.stars.includes(star) && <Check size={12} strokeWidth={4} />}
                                </div>
                                <div className="flex text-primary-400">
                                    {[...Array(star)].map((_, i) => (
                                        <span key={i}>★</span>
                                    ))}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

        </div>
    );
}
