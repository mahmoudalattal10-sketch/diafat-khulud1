'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Heart, Wifi, Coffee, Sparkles, ArrowLeft, Scale, Check } from 'lucide-react';
import { Hotel } from '@/data/hotels';
import { useComparisonStore } from '@/store/comparisonStore';

interface HotelCardHorizontalProps {
    hotel: Hotel;
    isHovered: boolean;
    onHover: (id: number | null) => void;
}

export default function HotelCardHorizontal({ hotel, isHovered, onHover }: HotelCardHorizontalProps) {
    const { addToCompare, removeFromCompare, isComparing, comparedHotels, maxCompare } = useComparisonStore();
    const isInCompare = isComparing(hotel.id);

    const handleCompareToggle = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isInCompare) {
            removeFromCompare(hotel.id);
        } else {
            addToCompare({
                id: hotel.id,
                name: hotel.name,
                location: hotel.location,
                price: hotel.price,
                rating: hotel.rating,
                distance: hotel.distance,
                image: hotel.images[0],
                amenities: hotel.amenities || [],
                features: hotel.features || [],
            });
        }
    };

    return (
        <div
            className={`group bg-white rounded-[2.5rem] p-3 flex flex-col md:flex-row gap-6 transition-all duration-300 border border-gray-100 ${isHovered ? 'shadow-2xl shadow-gray-200 translate-y-[-4px]' : 'shadow-sm hover:shadow-md'}`}
            onMouseEnter={() => onHover(hotel.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Image Section (Right Side in RTL) */}
            <div className="w-full md:w-[48%] h-64 md:h-[19rem] relative shrink-0 rounded-[2rem] overflow-hidden">
                <Image
                    src={hotel.images[0]}
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                />

                {/* Rating Badge (Top Left of Image) */}
                <div className="absolute top-4 left-4 bg-primary-100/90 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="text-sm font-black text-primary-700">{hotel.rating}</span>
                    <Star size={14} className="text-primary-700 fill-primary-700" />
                </div>

                {/* Heart Button (Top Right of Image) */}
                <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center text-white transition-all">
                    <Heart size={20} />
                </button>

                {/* Compare Button (Below Heart) */}
                <button
                    onClick={handleCompareToggle}
                    disabled={!isInCompare && comparedHotels.length >= maxCompare}
                    className={`absolute top-16 right-4 w-10 h-10 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${isInCompare
                        ? 'bg-emerald-500 text-white'
                        : comparedHotels.length >= maxCompare
                            ? 'bg-gray-400/50 text-gray-300 cursor-not-allowed'
                            : 'bg-black/20 hover:bg-primary-500 text-white'
                        }`}
                    title={isInCompare ? 'إزالة من المقارنة' : 'أضف للمقارنة'}
                >
                    {isInCompare ? <Check size={18} /> : <Scale size={18} />}
                </button>

                {/* Distance Badge (Bottom Right of Image) */}
                <div className="absolute bottom-4 right-4 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-full flex flex-col items-center gap-0.5">
                    <div className="flex items-center gap-1.5">
                        <MapPin size={14} className="text-emerald-400" />
                        <span className="text-xs font-medium text-white">{hotel.distance} عن الحرم</span>
                    </div>
                    {hotel.timeInMinutes && (
                        <div className="flex items-center gap-1.5 opacity-90">
                            <span className="text-[10px] text-emerald-300">🚶 {hotel.timeInMinutes} دقيقة سيراً</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Content Section (Left Side in RTL) */}
            <div className="flex-1 py-4 pl-4 flex flex-col justify-center">

                {/* Header Tags */}
                <div className="flex items-center gap-3 mb-3">
                    {hotel.isFeatured && (
                        <span className="px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold flex items-center gap-1">
                            <Sparkles size={12} />
                            <span>موصى به</span>
                        </span>
                    )}
                    {hotel.badge && (
                        <span className="px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-xs font-bold flex items-center gap-1">
                            <Sparkles size={12} />
                            <span>{hotel.badge}</span>
                        </span>
                    )}
                    <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-500 text-xs font-bold">
                        {Math.floor(hotel.rating)} نجوم
                    </span>
                    {isInCompare && (
                        <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-bold flex items-center gap-1">
                            <Scale size={12} />
                            <span>في المقارنة</span>
                        </span>
                    )}
                </div>

                {/* Title & Desc */}
                <div className="mb-6">
                    <h3 className="text-2xl md:text-3xl font-black text-gray-900 group-hover:text-primary-600 transition-colors mb-3 leading-tight">
                        {hotel.name}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">
                        استمتع بإقامة فاخرة بالقرب من الحرم المكي مع إطلالات مباشرة وخدمة غرف على مدار الساعة.
                    </p>
                </div>

                {/* Amenities */}
                <div className="flex flex-wrap gap-2 mb-auto">
                    {hotel.features.slice(0, 3).map((feature, i) => (
                        <div key={i} className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-full text-xs text-gray-600 font-bold hover:bg-gray-50 hover:border-gray-200 transition-colors">
                            {feature === 'واي فاي' && <Wifi size={14} className="text-emerald-500" />}
                            {feature === 'إفطار' && <Coffee size={14} className="text-orange-500" />}
                            <span>{feature}</span>
                        </div>
                    ))}
                </div>

                {/* Footer: Price & Action */}
                <div className="border-t border-gray-50 pt-5 mt-4 flex items-end justify-between">

                    <div>
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm text-gray-400 line-through decoration-red-300">{hotel.price + 150} ر.س</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-black text-gray-900">{hotel.price}</span>
                            <span className="text-xs font-bold text-secondary-600">ر.س</span>
                            <span className="text-[10px] font-bold text-gray-400">/ ليلة</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">شامل الضرائب والرسوم</p>
                    </div>

                    <Link
                        href={`/hotels/${hotel.id}`}
                        className="bg-[#0f172a] text-white px-8 py-3.5 rounded-2xl font-bold text-sm shadow-xl hover:bg-primary-600 hover:shadow-primary-600/20 transition-all flex items-center gap-3"
                    >
                        <span>احجز الآن</span>
                        <ArrowLeft size={18} />
                    </Link>
                </div>
            </div>
        </div>
    );
}
