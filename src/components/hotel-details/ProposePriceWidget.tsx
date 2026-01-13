'use client';

import { useState } from 'react';
import { Sparkles, MessageCircle } from 'lucide-react';
import ProposePriceModal from './ProposePriceModal';

interface ProposePriceWidgetProps {
    hotelName?: string;
    price?: number;
    tripDetails?: {
        checkIn: Date | null;
        checkOut: Date | null;
        adults: number;
        children: number;
        roomType: string;
    };
}

export default function ProposePriceWidget({ hotelName, price, tripDetails }: ProposePriceWidgetProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg border border-gray-100 relative overflow-hidden group hover:shadow-xl transition-all duration-300">
                {/* Decoration */}
                <div className="absolute top-0 left-0 w-20 h-20 bg-gold-100 rounded-full blur-2xl -translate-x-1/2 -translate-y-1/2 opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-gold-50 flex items-center justify-center text-gold-600">
                            <Sparkles size={16} />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">اقترح سعرك</h3>
                    </div>

                    <p className="text-gray-600 text-sm leading-relaxed mb-6">
                        لم تجد السعر أو العرض الذي تبحث عنه؟ اقترح السعر الخاص بك وسنبذل قصارى جهدنا لتحقيقه.
                    </p>

                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="w-full bg-white border border-gray-200 text-gray-900 font-bold py-3 rounded-xl shadow-sm hover:border-primary-500 hover:text-primary-600 hover:bg-primary-50 transition-all flex items-center justify-center gap-2 group"
                    >
                        <MessageCircle size={18} />
                        <span className="group-hover:underline">اقترح سعرك الآن</span>
                    </button>
                </div>
            </div>

            <ProposePriceModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                currentPrice={price}
                hotelName={hotelName}
                tripDetails={tripDetails}
            />
        </>
    );
}
