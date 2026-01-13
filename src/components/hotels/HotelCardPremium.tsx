'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Heart, ArrowRight, Wifi, Coffee, Sparkles } from 'lucide-react';
import { Hotel } from '@/data/hotels';
import { motion } from 'framer-motion';

interface HotelCardPremiumProps {
    hotel: Hotel;
    isHovered: boolean;
    onHover: (id: number | null) => void;
}

export default function HotelCardPremium({ hotel, isHovered, onHover }: HotelCardPremiumProps) {
    return (
        <div
            className={`group relative bg-white rounded-[2.5rem] p-3 transition-all duration-300 ${isHovered ? 'shadow-2xl shadow-primary-900/10 scale-[1.01]' : 'shadow-sm hover:shadow-lg'}`}
            onMouseEnter={() => onHover(hotel.id)}
            onMouseLeave={() => onHover(null)}
        >
            <div className="flex flex-col md:flex-row gap-6 h-full">

                {/* 1. Image Section (Creative Shape) */}
                <div className="w-full md:w-[45%] h-64 md:h-auto relative shrink-0">
                    <div className="absolute inset-0 rounded-[2rem] overflow-hidden">
                        <Image
                            src={hotel.images[0]}
                            alt={hotel.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60" />
                    </div>

                    {/* Floating Rating Badge */}
                    <div className="absolute top-4 left-4 bg-white/30 backdrop-blur-xl border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-lg">
                        <Star size={14} className="text-primary-400 fill-primary-400" />
                        <span className="font-bold text-sm text-white">{hotel.rating}</span>
                    </div>

                    {/* Heart Button */}
                    <button className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white hover:bg-white hover:text-red-500 transition-all active:scale-90">
                        <Heart size={18} />
                    </button>

                    {/* Distance Badge (Bottom) */}
                    <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl flex flex-col items-center gap-0.5 border border-white/10">
                        <div className="flex items-center gap-1.5">
                            <MapPin size={14} className="text-emerald-400" />
                            <span className="text-xs font-medium text-white">{hotel.distance}</span>
                        </div>
                        {hotel.timeInMinutes && (
                            <span className="text-[10px] text-emerald-300 font-bold">🚶 {hotel.timeInMinutes} دقيقة سيراً</span>
                        )}
                    </div>
                </div>

                {/* 2. Content Section */}
                <div className="flex-1 flex flex-col justify-center py-2 pr-2 md:pr-0 pl-2">

                    {/* Header */}
                    <div className="mb-4">
                        <div className="flex items-center gap-2 mb-2">
                            {hotel.isFeatured && (
                                <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-600 text-[10px] font-bold flex items-center gap-1">
                                    <Sparkles size={10} />
                                    <span>موصى به</span>
                                </span>
                            )}
                            {hotel.badge && (
                                <span className="px-2.5 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-bold flex items-center gap-1">
                                    <Sparkles size={10} />
                                    <span>{hotel.badge}</span>
                                </span>
                            )}
                            <span className="px-2.5 py-1 rounded-lg bg-gray-50 text-gray-500 text-[10px] font-bold">{hotel.rating} نجوم</span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 group-hover:text-primary-600 transition-colors mb-2 leading-tight">
                            {hotel.name}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed pl-4">
                            استمتع بإقامة فاخرة بالقرب من الحرم المكي مع إطلالات مباشرة وخدمة غرف على مدار الساعة.
                        </p>
                    </div>

                    {/* Amenities */}
                    <div className="flex flex-wrap gap-2 mb-6">
                        {hotel.features.slice(0, 4).map((feature, i) => (
                            <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-100 rounded-full text-xs text-gray-600 shadow-sm">
                                {feature === 'واي فاي' && <Wifi size={12} className="text-primary-500" />}
                                {feature === 'إفطار' && <Coffee size={12} className="text-primary-500" />}
                                <span className="font-bold">{feature}</span>
                            </div>
                        ))}
                    </div>

                    {/* Footer / Price Action */}
                    <div className="mt-auto flex items-end justify-between border-t border-gray-50 pt-4 border-dashed">
                        <div>
                            <span className="text-xs text-gray-400 line-through decoration-red-300 block mb-0.5">{hotel.price + 150} ر.س</span>
                            <div className="flex items-center gap-1">
                                <span className="text-3xl font-black text-gray-900">{hotel.price}</span>
                                <span className="text-sm font-bold text-primary-600">ر.س</span>
                            </div>
                            <span className="text-[10px] text-gray-400 font-medium">شامل الضرائب والرسوم</span>
                        </div>

                        <Link
                            href={`/hotels/${hotel.id}`}
                            className="h-12 px-6 bg-gray-900 text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl shadow-gray-900/20 group-hover:bg-primary-600 group-hover:shadow-primary-600/30 transition-all hover:scale-105 active:scale-95"
                        >
                            <span>احجز الآن</span>
                            <ArrowRight size={16} className="rtl:rotate-180" />
                        </Link>
                    </div>

                </div>
            </div>
        </div>
    );
}
