'use client';

import { useState } from 'react';
import { Room } from '@/data/hotels';
import { Calendar as CalendarIcon, ArrowRight, User, Tag, Info } from 'lucide-react';

interface BookingWidgetProps {
    hotelId: number;
    hotelName: string;
    hotelImage: string;
    price: number;
    rating: number;
    selectedRoom: Room | null;
}

export default function BookingWidget({ hotelId, hotelName, hotelImage, price, rating, selectedRoom }: BookingWidgetProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleBooking = async () => {
        if (!selectedRoom) return;
        setIsLoading(true);
        // Simulate a small delay for premium feel
        setTimeout(() => {
            window.location.href = `/checkout?hotelId=${hotelId}&price=${price * 5}&rating=${rating}&roomId=${selectedRoom.id}&hotelName=${encodeURIComponent(hotelName)}&hotelImage=${encodeURIComponent(hotelImage)}`;
            setIsLoading(false);
        }, 800);
    };

    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl border border-gray-100/50 sticky top-32">
            <div className="flex items-end justify-between mb-8">
                <div>
                    <span className="text-gray-400 text-xs font-bold block mb-1">يبدأ من</span>
                    <div className="flex items-baseline gap-1">
                        <span className={`text-4xl font-black transition-all ${price > 0 ? 'text-gray-900' : 'text-gray-300'}`}>
                            {price}
                        </span>
                        <span className="text-sm font-bold text-gray-900">ر.س</span>
                        <span className="text-gray-400 text-xs font-medium">/ ليلة</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-1 justify-end">
                        <span className="text-amber-400">★</span>
                        <span className="text-lg font-black text-gray-900">{rating}</span>
                    </div>
                    <span className="text-[10px] font-bold text-primary-600 uppercase tracking-wider">تقييمات ممتازة</span>
                </div>
            </div>

            {/* Selection Info */}
            <div className="bg-gray-50/50 border border-gray-200/60 rounded-2xl overflow-hidden mb-8">
                <div className="grid grid-cols-2 divide-x divide-x-reverse divide-gray-200/60 border-b border-gray-200/60">
                    <div className="p-4 hover:bg-white cursor-pointer transition-all text-right group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 group-hover:text-primary-600">الوصول</label>
                        <span className="text-sm font-bold text-gray-900">15 يناير</span>
                    </div>
                    <div className="p-4 hover:bg-white cursor-pointer transition-all text-right group">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 group-hover:text-primary-600">المغادرة</label>
                        <span className="text-sm font-bold text-gray-900">20 يناير</span>
                    </div>
                </div>
                <div className="p-4 hover:bg-white cursor-pointer transition-all text-right group">
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-1 group-hover:text-primary-600">الضيوف</label>
                    <span className="text-sm font-bold text-gray-900">2 بالغين، 0 أطفال</span>
                </div>
            </div>

            {/* Selected Room Status */}
            {!selectedRoom ? (
                <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-5 mb-8 flex flex-col items-center text-center gap-3">
                    <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center text-amber-600">
                        <Info size={20} />
                    </div>
                    <div>
                        <p className="text-amber-900 font-bold text-sm">بانتظار اختيار الغرفة</p>
                        <p className="text-amber-600 text-xs mt-1">يرجى اختيار نوع الغرفة المفضلة من الأسفل لحساب السعر النهائي</p>
                    </div>
                </div>
            ) : (
                <div className="bg-primary-50/50 border border-primary-200/50 rounded-2xl p-4 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center text-black">
                                <User size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-primary-700 font-bold uppercase tracking-tighter">الغرفة المختارة</p>
                                <p className="text-sm font-black text-gray-900">{selectedRoom.name}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Breakdown */}
            <div className="space-y-4 mb-8 px-1">
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium underline decoration-gray-200 decoration-2 underline-offset-4 cursor-help">
                        {price} ر.س × 5 ليالي
                    </span>
                    <span className="text-gray-900 font-bold">{price * 5} ر.س</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-gray-500 font-medium underline decoration-gray-200 decoration-2 underline-offset-4 cursor-help">رسوم الخدمة</span>
                    <span className="text-gray-900 font-bold">0 ر.س</span>
                </div>
                <div className="pt-4 border-t border-gray-100 flex justify-between items-center group">
                    <span className="text-gray-900 font-black text-xl">الإجمالي</span>
                    <div className="text-right">
                        <span className="text-gray-900 font-black text-2xl">{price * 5} ر.س</span>
                        <p className="text-[10px] text-gray-400 font-bold -mt-1 uppercase tracking-tighter">شامل كافة الضرائب</p>
                    </div>
                </div>
            </div>

            {/* Price Transparency Badge */}
            <div className="bg-gray-900 rounded-2xl p-4 mb-8 flex items-center gap-4 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary-500/10 rounded-full -translate-y-12 translate-x-12 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg shadow-primary-500/20 shrink-0 relative z-10">
                    <Tag size={18} className="text-black" />
                </div>
                <span className="text-xs font-black text-white leading-relaxed relative z-10">الأسعار المعروضة نهائية وتشمل كافة الرسوم والضرائب الحكومية</span>
            </div>

            {/* CTA */}
            <button
                onClick={handleBooking}
                disabled={isLoading || !selectedRoom}
                className={`w-full relative overflow-hidden h-16 rounded-2xl font-black text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-3 ${isLoading || !selectedRoom ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-primary-600 text-white shadow-xl shadow-primary-600/25 hover:bg-primary-700 hover:-translate-y-1'}`}
            >
                {isLoading ? (
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        <span>احجز الآن</span>
                        <ArrowRight size={22} className={`transition-transform duration-500 ${selectedRoom ? 'group-hover:-translate-x-1' : ''}`} />
                    </>
                )}
            </button>
            <p className="text-center text-[10px] font-bold text-gray-400 mt-5 uppercase tracking-widest">سيتم توجيهك لبوابة الدفع الآمنة</p>
        </div>
    );
}
