'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Navigation, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface StreetViewModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelName: string;
    latitude: number;
    longitude: number;
}

export default function StreetViewModal({ isOpen, onClose, hotelName, latitude, longitude }: StreetViewModalProps) {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);

    // Google Street View Embed URL
    const streetViewUrl = `https://www.google.com/maps/embed?pb=!4v${Date.now()}!6m8!1m7!1s!2m2!1d${latitude}!2d${longitude}!3f0!4f0!5f0.7820865974627469`;

    // Direct Google Maps Street View URL (for external link)
    const googleMapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}&layer=c&cbll=${latitude},${longitude}`;

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    transition={{ type: 'spring', damping: 25 }}
                    onClick={(e) => e.stopPropagation()}
                    className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl overflow-hidden"
                    dir="rtl"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-secondary-100 rounded-2xl flex items-center justify-center">
                                <Navigation size={24} className="text-secondary-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-black text-gray-900">Street View</h2>
                                <p className="text-sm text-gray-500 font-medium flex items-center gap-1 mt-0.5">
                                    <MapPin size={14} />
                                    {hotelName}
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <a
                                href={googleMapsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-xl font-bold text-sm hover:bg-gray-200 transition-colors"
                            >
                                <ExternalLink size={16} />
                                فتح في خرائط جوجل
                            </a>
                            <button
                                onClick={onClose}
                                className="w-11 h-11 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500 hover:bg-gray-200 transition-colors"
                            >
                                <X size={22} />
                            </button>
                        </div>
                    </div>

                    {/* Street View Iframe */}
                    <div className="relative w-full h-[500px] bg-gray-100">
                        {isLoading && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 z-10">
                                <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 animate-pulse">
                                    <Navigation size={32} className="text-secondary-500" />
                                </div>
                                <p className="text-gray-500 font-bold">جاري تحميل Street View...</p>
                            </div>
                        )}

                        {hasError ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-50">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                    <MapPin size={40} className="text-gray-300" />
                                </div>
                                <h3 className="text-lg font-bold text-gray-700 mb-2">Street View غير متاح</h3>
                                <p className="text-sm text-gray-500 text-center max-w-xs">
                                    للأسف، لا تتوفر صور Street View لهذا الموقع حالياً
                                </p>
                                <a
                                    href={googleMapsUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-4 px-6 py-3 bg-secondary-500 text-white rounded-xl font-bold text-sm hover:bg-secondary-600 transition-colors flex items-center gap-2"
                                >
                                    <MapPin size={16} />
                                    عرض على الخريطة
                                </a>
                            </div>
                        ) : (
                            <iframe
                                src={streetViewUrl}
                                className="w-full h-full border-0"
                                allowFullScreen
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                onLoad={() => setIsLoading(false)}
                                onError={() => {
                                    setIsLoading(false);
                                    setHasError(true);
                                }}
                            />
                        )}
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-gray-50 border-t border-gray-100">
                        <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500">
                                الإحداثيات: {latitude.toFixed(6)}, {longitude.toFixed(6)}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-gray-400">
                                <span>Powered by</span>
                                <span className="font-bold text-gray-600">Google Maps</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
