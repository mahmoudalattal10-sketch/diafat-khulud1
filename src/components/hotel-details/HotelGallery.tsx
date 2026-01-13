'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronRight, ChevronLeft, Grid } from 'lucide-react';

interface HotelGalleryProps {
    images: string[];
}

export default function HotelGallery({ images }: HotelGalleryProps) {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    return (
        <section className="relative rounded-3xl overflow-hidden mb-8 h-[300px] md:h-[400px] lg:h-[500px]">
            {/* Grid Layout */}
            <div className="grid grid-cols-4 grid-rows-2 gap-2 h-full">
                {/* Main Image (Large, Left) */}
                <div
                    onClick={() => setSelectedImage(0)}
                    className="col-span-4 md:col-span-2 row-span-2 relative cursor-pointer group overflow-hidden"
                >
                    <Image
                        src={images[0]}
                        alt="Main view"
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                </div>

                {/* Secondary Images (Right Side) */}
                {images.slice(1, 5).map((img, idx) => (
                    <div
                        key={idx}
                        onClick={() => setSelectedImage(idx + 1)}
                        className={`hidden md:block relative cursor-pointer group overflow-hidden ${idx === 3 ? 'col-span-1' : 'col-span-1'}`}
                    >
                        <Image
                            src={img}
                            alt={`Gallery view ${idx + 2}`}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />

                        {/* "View All" Overlay on last image */}
                        {idx === 3 && (
                            <div className="absolute inset-0 bg-black/40 hover:bg-black/30 flex flex-col items-center justify-center text-white transition-colors border-2 border-transparent hover:border-white/50 m-2 rounded-xl">
                                <Grid size={24} className="mb-1" />
                                <span className="font-bold text-sm">عرض الكل</span>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Mobile Badge */}
            <div className="absolute bottom-4 left-4 md:hidden bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-2">
                <Grid size={14} />
                <span>{images.length} صور</span>
            </div>

            {/* Lightbox / Fullscreen Viewer */}
            <AnimatePresence>
                {selectedImage !== null && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        {/* Close Button */}
                        <button
                            className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors p-2"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X size={32} />
                        </button>

                        {/* Navigation Buttons */}
                        <button
                            className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage((prev) => prev !== null && prev > 0 ? prev - 1 : images.length - 1);
                            }}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button
                            className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-md transition-all"
                            onClick={(e) => {
                                e.stopPropagation();
                                setSelectedImage((prev) => prev !== null && prev < images.length - 1 ? prev + 1 : 0);
                            }}
                        >
                            <ChevronRight size={24} />
                        </button>

                        {/* Main Image */}
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            key={selectedImage}
                            className="relative w-full max-w-5xl h-[60vh] md:h-[80vh] rounded-2xl overflow-hidden shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <Image
                                src={images[selectedImage]}
                                alt="Fullscreen view"
                                fill
                                className="object-contain"
                            />
                        </motion.div>

                        {/* Counter */}
                        <div className="absolute bottom-6 text-white/70 font-mono text-sm">
                            {selectedImage + 1} / {images.length}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </section>
    );
}
