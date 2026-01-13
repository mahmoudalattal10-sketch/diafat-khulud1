'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Scale, Trash2 } from 'lucide-react';
import { useComparisonStore } from '@/store/comparisonStore';
import Image from 'next/image';

export default function CompareFloatingBar() {
    const { comparedHotels, removeFromCompare, clearCompare, openCompareModal } = useComparisonStore();

    if (comparedHotels.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50"
            >
                <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-4 flex items-center gap-4">
                    {/* Selected Hotels */}
                    <div className="flex items-center gap-2">
                        {comparedHotels.map((hotel) => (
                            <motion.div
                                key={hotel.id}
                                initial={{ scale: 0, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0, opacity: 0 }}
                                className="relative group"
                            >
                                <div className="w-14 h-14 rounded-xl overflow-hidden border-2 border-primary-200 shadow-md">
                                    <Image
                                        src={hotel.image || '/images/placeholder-hotel.jpg'}
                                        alt={hotel.name}
                                        width={56}
                                        height={56}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <button
                                    onClick={() => removeFromCompare(hotel.id)}
                                    className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                                >
                                    <X size={12} />
                                </button>
                                <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-bold text-gray-500 whitespace-nowrap max-w-[60px] truncate">
                                    {hotel.name.split(' ').slice(0, 2).join(' ')}
                                </div>
                            </motion.div>
                        ))}

                        {/* Empty Slots */}
                        {Array.from({ length: 3 - comparedHotels.length }).map((_, i) => (
                            <div
                                key={`empty-${i}`}
                                className="w-14 h-14 rounded-xl border-2 border-dashed border-gray-200 flex items-center justify-center text-gray-300"
                            >
                                <Scale size={20} />
                            </div>
                        ))}
                    </div>

                    <div className="w-px h-12 bg-gray-100" />

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button
                            onClick={openCompareModal}
                            disabled={comparedHotels.length < 2}
                            className="h-12 px-6 bg-primary-500 text-black rounded-xl font-black text-sm hover:bg-primary-600 transition-all shadow-lg shadow-primary-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <Scale size={16} />
                            مقارنة ({comparedHotels.length})
                        </button>
                        <button
                            onClick={clearCompare}
                            className="w-12 h-12 bg-gray-100 text-gray-500 rounded-xl hover:bg-red-50 hover:text-red-500 transition-colors flex items-center justify-center"
                        >
                            <Trash2 size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
