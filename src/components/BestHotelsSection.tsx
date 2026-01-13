'use client';

import { useEffect } from 'react';

import { motion } from 'framer-motion';
import { Star, MapPin, ArrowRight, BedDouble, Wifi, Coffee } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

import { useHotelsStore } from '@/store/hotelsStore';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15
        }
    }
};

const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    }
};

export default function BestHotelsSection() {
    const { hotels, fetchHotels, error } = useHotelsStore();

    useEffect(() => {
        if (hotels.length === 0) fetchHotels();
    }, []);

    // Debugging
    console.log('BestHotelsSection - Hotels:', hotels.length, 'Error:', error);
    const featuredHotels = hotels.filter(h => h.isFeatured).slice(0, 4);

    // Fallback if no featured hotels (show top rated)
    const displayHotels = featuredHotels.length > 0
        ? featuredHotels
        : hotels.sort((a, b) => b.rating - a.rating).slice(0, 4);

    return (
        <section className="py-20 bg-gray-50 overflow-hidden relative">
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-100/30 rounded-full blur-[120px] pointer-events-none" />

            <div className="container-custom relative z-10">
                {/* Header */}
                <div className="flex items-end justify-between mb-12 px-4">
                    <div>
                        <motion.h2
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="text-3xl md:text-5xl font-black text-gray-900 mb-2 tracking-tight"
                        >
                            فنادق <span className="text-transparent bg-clip-text bg-gradient-to-br from-secondary-600 to-primary-500">مختارة</span>
                        </motion.h2>
                        <p className="text-gray-400 font-medium">تجربة إقامة استثنائية بأسعار لا تقبل المنافسة</p>
                    </div>
                    <Link
                        href="/hotels"
                        className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 font-bold hover:border-primary-400 hover:shadow-lg hover:shadow-primary-500/10 transition-all duration-300"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2"
                        >
                            <span>تصفح كل العروض</span>
                            <ArrowRight size={18} />
                        </motion.div>
                    </Link>
                </div>

                {/* Cards Horizontal Scroll */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="flex md:grid md:grid-cols-4 gap-6 overflow-x-auto md:overflow-visible snap-x snap-mandatory pb-12 md:pb-0 px-4 md:px-0 -mx-4 md:mx-0 hide-scrollbar"
                >
                    {displayHotels.map((hotel) => (
                        <motion.div
                            key={hotel.id}
                            variants={cardVariants}
                            className="flex-none w-[80vw] sm:w-[50vw] md:w-auto snap-center"
                        >
                            <Link href={`/hotels/${hotel.id}`} className="block group relative h-[480px] rounded-[2.5rem] overflow-hidden cursor-pointer">
                                {/* Image Layer */}
                                <div className="absolute inset-0 bg-gray-900">
                                    <Image
                                        src={hotel.images[0] || '/images/hotels.png'}
                                        alt={hotel.name}
                                        fill
                                        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110 opacity-90 group-hover:opacity-100"
                                    />
                                    {/* Subtle Gradient Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                                </div>

                                {/* Top Tags */}
                                <div className="absolute top-6 left-6 right-6 flex items-start justify-between z-20">
                                    {hotel.badge ? (
                                        <div className="bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full text-xs font-bold text-gray-900 shadow-sm">
                                            {hotel.badge}
                                        </div>
                                    ) : <div />}

                                    <div className="bg-black/20 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-full flex items-center gap-1 text-white text-xs font-bold">
                                        <Star size={12} className="fill-yellow-400 text-yellow-400" />
                                        <span>{hotel.rating}</span>
                                    </div>
                                </div>

                                {/* Floating Glass Island (Compact) */}
                                <div className="absolute bottom-3 left-3 right-3 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out">
                                    <div className="relative bg-black/40 backdrop-blur-xl border border-white/10 p-4 rounded-[1.5rem] overflow-hidden shadow-2xl">

                                        {/* Shimmer Effect */}
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col gap-3">
                                            {/* Top Row: Name & Price */}
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="text-lg font-bold text-white leading-tight">
                                                        {hotel.name}
                                                    </h3>
                                                    <div className="flex items-center gap-1 text-gray-300 text-[10px] mt-1">
                                                        <MapPin size={10} />
                                                        <span className="line-clamp-1">{hotel.location}</span>
                                                    </div>
                                                </div>
                                                <div className="text-left bg-white/10 px-2 py-1 rounded-lg backdrop-blur-sm">
                                                    <div className="flex items-baseline gap-1 dir-ltr">
                                                        <span className="text-sm font-bold text-primary-400">{hotel.price}</span>
                                                        <span className="text-[10px] text-gray-300">SAR</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Divider */}
                                            <div className="h-px w-full bg-white/10" />

                                            {/* Bottom Row: Amenities & Action */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-2">
                                                    <div className="flex items-center gap-1 text-gray-300 bg-black/20 px-1.5 py-1 rounded-md">
                                                        <MapPin size={10} />
                                                        <span className="text-[9px]">{hotel.distance}</span>
                                                    </div>
                                                    {hotel.features.slice(0, 2).map((feature: string, idx: number) => (
                                                        <div key={idx} className="hidden sm:flex items-center gap-1 text-gray-300 bg-black/20 px-1.5 py-1 rounded-md">
                                                            <div className="w-1 h-1 bg-primary-400 rounded-full" />
                                                            <span className="text-[9px]">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="w-8 h-8 rounded-full bg-white text-gray-900 flex items-center justify-center group-hover:bg-primary-400 transition-colors shadow-lg">
                                                    <ArrowRight size={16} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Mobile View All Button */}
                <div className="md:hidden text-center mt-4">
                    <Link
                        href="/hotels"
                        className="px-6 py-3 bg-white border border-gray-200 rounded-full text-gray-900 font-bold shadow-sm inline-block"
                    >
                        تصفح كل العروض
                    </Link>
                </div>
            </div>
        </section>
    );
}
