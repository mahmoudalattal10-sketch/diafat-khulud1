'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, MapPin, Check, Minus, Crown, Wifi, Coffee, Car, Utensils, Dumbbell, Waves, Wind, Shield } from 'lucide-react';
import { useComparisonStore, CompareHotel } from '@/store/comparisonStore';
import Image from 'next/image';

const AMENITY_ICONS: Record<string, any> = {
    'wifi': Wifi,
    'واي فاي': Wifi,
    'إفطار': Coffee,
    'فطور': Coffee,
    'موقف': Car,
    'مطعم': Utensils,
    'رياضي': Dumbbell,
    'سبا': Waves,
    'مكيف': Wind,
    'أمان': Shield,
};

function getAmenityIcon(label: string) {
    for (const key in AMENITY_ICONS) {
        if (label.toLowerCase().includes(key.toLowerCase())) {
            return AMENITY_ICONS[key];
        }
    }
    return Check;
}

export default function HotelComparisonModal() {
    const { comparedHotels, isCompareModalOpen, closeCompareModal, removeFromCompare } = useComparisonStore();

    if (!isCompareModalOpen || comparedHotels.length < 2) return null;

    // Find best values
    const lowestPrice = Math.min(...comparedHotels.map(h => h.price));
    const highestRating = Math.max(...comparedHotels.map(h => h.rating));

    // Collect all unique amenities
    const allAmenities = new Set<string>();
    comparedHotels.forEach(hotel => {
        hotel.amenities?.forEach(a => allAmenities.add(a.label));
        hotel.features?.forEach(f => allAmenities.add(f));
    });

    const hotelHasAmenity = (hotel: CompareHotel, amenity: string) => {
        return hotel.amenities?.some(a => a.label === amenity) ||
            hotel.features?.includes(amenity);
    };

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/60 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                onClick={closeCompareModal}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-6 border-b border-gray-100">
                        <div>
                            <h2 className="text-2xl font-black text-gray-900">مقارنة الفنادق</h2>
                            <p className="text-sm text-gray-500 font-medium mt-1">قارن بين {comparedHotels.length} فنادق واختر الأنسب لك</p>
                        </div>
                        <button
                            onClick={closeCompareModal}
                            className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Comparison Table */}
                    <div className="flex-1 overflow-auto p-6">
                        <div className="grid gap-4" style={{ gridTemplateColumns: `200px repeat(${comparedHotels.length}, 1fr)` }}>

                            {/* Hotel Images & Names Row */}
                            <div className="font-bold text-gray-400 text-sm flex items-end pb-4">الفندق</div>
                            {comparedHotels.map((hotel) => (
                                <div key={hotel.id} className="relative bg-gray-50 rounded-2xl p-4 text-center">
                                    <button
                                        onClick={() => removeFromCompare(hotel.id)}
                                        className="absolute top-2 left-2 w-8 h-8 bg-white rounded-lg flex items-center justify-center text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors shadow-sm"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="w-24 h-24 mx-auto rounded-2xl overflow-hidden mb-3 shadow-lg">
                                        <Image
                                            src={hotel.image || '/images/placeholder-hotel.jpg'}
                                            alt={hotel.name}
                                            width={96}
                                            height={96}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <h3 className="font-black text-gray-900 text-sm">{hotel.name}</h3>
                                    <p className="text-xs text-gray-500 mt-1 flex items-center justify-center gap-1">
                                        <MapPin size={12} />
                                        {hotel.location}
                                    </p>
                                </div>
                            ))}

                            {/* Price Row */}
                            <div className="font-bold text-gray-400 text-sm flex items-center border-t border-gray-100 pt-4">السعر / ليلة</div>
                            {comparedHotels.map((hotel) => (
                                <div key={hotel.id} className={`flex items-center justify-center border-t border-gray-100 pt-4 ${hotel.price === lowestPrice ? 'text-emerald-600' : 'text-gray-900'}`}>
                                    <div className="text-center">
                                        {hotel.price === lowestPrice && (
                                            <span className="inline-block bg-emerald-100 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full mb-1">
                                                أفضل سعر
                                            </span>
                                        )}
                                        <div className="font-black text-xl">{hotel.price} <span className="text-sm font-bold">ر.س</span></div>
                                    </div>
                                </div>
                            ))}

                            {/* Rating Row */}
                            <div className="font-bold text-gray-400 text-sm flex items-center border-t border-gray-100 pt-4">التقييم</div>
                            {comparedHotels.map((hotel) => (
                                <div key={hotel.id} className={`flex items-center justify-center border-t border-gray-100 pt-4 ${hotel.rating === highestRating ? 'text-primary-600' : 'text-gray-900'}`}>
                                    <div className="flex items-center gap-2">
                                        {hotel.rating === highestRating && <Crown size={16} className="text-primary-500" />}
                                        <Star size={18} className="fill-primary-500 text-primary-500" />
                                        <span className="font-black text-lg">{hotel.rating}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Distance Row */}
                            <div className="font-bold text-gray-400 text-sm flex items-center border-t border-gray-100 pt-4">المسافة للحرم</div>
                            {comparedHotels.map((hotel) => (
                                <div key={hotel.id} className="flex items-center justify-center border-t border-gray-100 pt-4 text-gray-900">
                                    <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                                        <MapPin size={16} className="text-secondary-600" />
                                        <span className="font-bold text-sm">{hotel.distance}</span>
                                    </div>
                                </div>
                            ))}

                            {/* Amenities Section */}
                            <div className="font-bold text-gray-400 text-sm flex items-center border-t border-gray-100 pt-4 col-span-full">
                                <span className="bg-gray-100 px-3 py-1 rounded-lg">المميزات والخدمات</span>
                            </div>

                            {Array.from(allAmenities).slice(0, 10).map((amenity) => {
                                const Icon = getAmenityIcon(amenity);
                                return (
                                    <>
                                        <div key={`label-${amenity}`} className="font-medium text-gray-600 text-sm flex items-center gap-2 py-2">
                                            <Icon size={14} className="text-gray-400" />
                                            {amenity}
                                        </div>
                                        {comparedHotels.map((hotel) => (
                                            <div key={`${hotel.id}-${amenity}`} className="flex items-center justify-center py-2">
                                                {hotelHasAmenity(hotel, amenity) ? (
                                                    <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                                                        <Check size={16} className="text-emerald-600" />
                                                    </div>
                                                ) : (
                                                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                                        <Minus size={16} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </>
                                );
                            })}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-gray-100 bg-gray-50">
                        <div className="flex items-center justify-center gap-4">
                            {comparedHotels.map((hotel) => (
                                <a
                                    key={hotel.id}
                                    href={`/hotels/${hotel.id}`}
                                    className="flex-1 max-w-xs h-14 bg-primary-500 text-black rounded-xl font-black text-sm hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 flex items-center justify-center gap-2"
                                >
                                    احجز {hotel.name.split(' ').slice(0, 2).join(' ')}
                                </a>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
