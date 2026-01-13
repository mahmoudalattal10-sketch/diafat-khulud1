'use client';

import Image from 'next/image';
import { Star, MapPin, Wifi, Coffee, ArrowRight, Heart } from 'lucide-react';
import { Hotel } from '@/data/hotels';
import { motion } from 'framer-motion';

interface HotelCardVerticalProps {
    hotel: Hotel;
    isHovered: boolean;
    onHover: (id: number | null) => void;
}

export default function HotelCardVertical({ hotel, isHovered, onHover }: HotelCardVerticalProps) {
    return (
        <div
            className={`group bg-white rounded-[2rem] overflow-hidden border transition-all duration-300 relative ${isHovered ? 'shadow-2xl ring-2 ring-primary-500 border-transparent transform -translate-y-2' : 'shadow-sm border-gray-100 hover:shadow-lg'}`}
            onMouseEnter={() => onHover(hotel.id)}
            onMouseLeave={() => onHover(null)}
        >
            {/* Image Section */}
            <div className="relative h-72 w-full overflow-hidden">
                <Image
                    src={hotel.images[0] || '/images/hotels/1.jpg'} // Fallback
                    alt={hotel.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                />

                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />

                {/* Top Badges */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                    <div className="flex gap-2">
                        {hotel.rating >= 4.5 && (
                            <span className="bg-white/95 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-emerald-600 shadow-sm">
                                مميز
                            </span>
                        )}
                        {hotel.distance.includes('متر') && (
                            <span className="bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-normal">
                                قريب من الحرم
                            </span>
                        )}
                    </div>
                    <button className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-colors">
                        <Heart size={16} />
                    </button>
                </div>

                {/* Rating Badge (Bottom Left of Image) */}
                <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                    <Star size={14} className="text-primary-500 fill-current" />
                    <span className="font-bold text-sm text-gray-900">{hotel.rating}</span>
                </div>
            </div>

            {/* Content Section */}
            <div className="p-5">
                <div className="mb-2">
                    <h3 className="text-xl font-black text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-1 mb-1">
                        {hotel.name}
                    </h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <MapPin size={12} className="text-primary-500" />
                        <span className="truncate">{hotel.location}</span>
                        {hotel.timeInMinutes && (
                            <span className="bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded text-[10px] font-bold mr-1">
                                🚶 {hotel.timeInMinutes} د
                            </span>
                        )}
                    </div>
                </div>

                {/* Amenities Snippet */}
                <div className="flex gap-2 mb-4 overflow-hidden">
                    {hotel.features.slice(0, 3).map((feature, idx) => (
                        <span key={idx} className="text-[10px] bg-gray-50 text-gray-500 px-2 py-1 rounded-md whitespace-nowrap">
                            {feature}
                        </span>
                    ))}
                    {hotel.features.length > 3 && (
                        <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded-md">
                            +{hotel.features.length - 3}
                        </span>
                    )}
                </div>

                <div className="border-t border-gray-50 pt-4 flex items-end justify-between">
                    <div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-black text-gray-900">{hotel.price}</span>
                            <span className="text-xs font-bold text-gray-900">ر.س</span>
                            <span className="text-[10px] text-gray-400">/ ليلة</span>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">شامل الضرائب والرسوم</p>
                    </div>

                    <div className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center group-hover:bg-primary-600 group-hover:scale-110 transition-all shadow-lg">
                        <ArrowRight size={18} className="group-hover:-translate-x-0.5 transition-transform" />
                    </div>
                </div>
            </div>
        </div>
    );
}
