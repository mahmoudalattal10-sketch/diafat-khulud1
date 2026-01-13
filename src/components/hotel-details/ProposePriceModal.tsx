'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, CheckCircle, Sparkles, MessageCircle, Calendar, Users, BedDouble } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProposePriceModalProps {
    isOpen: boolean;
    onClose: () => void;
    hotelName?: string;
    currentPrice?: number | string;
    tripDetails?: {
        checkIn: Date | null;
        checkOut: Date | null;
        adults: number;
        children: number;
        roomType: string;
    };
}

export default function ProposePriceModal({ isOpen, onClose, currentPrice, hotelName, tripDetails }: ProposePriceModalProps) {
    const [step, setStep] = useState<'form' | 'success'>('form');
    const [price, setPrice] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate API call
        setTimeout(() => {
            setStep('success');
        }, 800);
    };

    const handleClose = () => {
        setStep('form');
        setPrice('');
        setEmail('');
        setPhone('');
        onClose();
    }

    const formatDate = (date: Date | null) => {
        if (!date) return '-';
        return date.toLocaleDateString('ar-EG', { day: 'numeric', month: 'short' });
    };

    const handleWhatsApp = () => {
        const message = `مرحبا، أود الاستفسار بخصوص السعر المقترح لفندق ${hotelName || ''}.`;
        window.open(`https://wa.me/966xxxxxxxx?text=${encodeURIComponent(message)}`, '_blank');
    };

    if (!mounted || typeof document === 'undefined' || !document.body) return null;

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/70 backdrop-blur-md z-[9999] flex items-center justify-center p-4"
                >
                    {/* Modal Card */}
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0, y: 20 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.95, opacity: 0, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg relative flex flex-col max-h-[85vh] overflow-hidden"
                    >
                        {/* Decorative Header (Fixed part of card) */}
                        <div className="relative h-32 shrink-0 bg-gradient-to-br from-primary-700 to-primary-900 overflow-hidden">
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-40 h-40 bg-primary-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                            {/* Header Title */}
                            <div className="relative z-10 w-full h-full flex flex-col items-center justify-center pt-2">
                                <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 backdrop-blur-xl mb-2 text-primary-300 ring-1 ring-white/20 shadow-lg">
                                    <Sparkles size={18} />
                                </div>
                                <h2 className="text-xl font-black text-white mb-0.5">اقترح سعرك</h2>
                                <p className="text-white/70 text-xs">نحن هنا لنسمع منك</p>
                            </div>

                            {/* Close Button */}
                            <button
                                onClick={handleClose}
                                className="absolute top-4 right-4 w-9 h-9 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-colors z-20 border border-white/10"
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto px-6 py-6 custom-scrollbar">
                            {step === 'form' ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="space-y-5"
                                >
                                    {/* Summarized Info Card */}
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 relative z-10">
                                        <h3 className="text-gray-900 font-bold text-center mb-3 text-sm border-b border-gray-100 pb-2">
                                            {hotelName || 'فندق مكة المكرمة'}
                                        </h3>
                                        <div className="flex justify-between items-center text-xs text-center divide-x divide-x-reverse divide-gray-100">
                                            <div className="flex-1 px-1">
                                                <div className="text-gray-400 mb-1 flex justify-center"><Calendar size={14} /></div>
                                                <div className="font-bold text-gray-800 dir-ltr">
                                                    {tripDetails ? `${formatDate(tripDetails.checkIn)} - ${formatDate(tripDetails.checkOut)}` : '-'}
                                                </div>
                                            </div>
                                            <div className="flex-1 px-1">
                                                <div className="text-gray-400 mb-1 flex justify-center"><Users size={14} /></div>
                                                <div className="font-bold text-gray-800">
                                                    {tripDetails ? `${tripDetails.adults} كبار` : '-'}
                                                </div>
                                            </div>
                                            <div className="flex-1 px-1">
                                                <div className="text-gray-400 mb-1 flex justify-center"><BedDouble size={14} /></div>
                                                <div className="font-bold text-gray-800 line-clamp-1">{tripDetails?.roomType || 'غرفة قياسية'}</div>
                                            </div>
                                        </div>
                                        <div className="mt-3 pt-2 border-t border-gray-50 flex justify-between items-center bg-gray-50 rounded-lg px-3 py-1.5">
                                            <span className="text-xs font-bold text-gray-500">السعر الحالي:</span>
                                            <span className="text-base font-black text-primary-600 dir-ltr">{currentPrice} ر.س</span>
                                        </div>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-4">
                                        <div>
                                            <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-1">السعر المقترح</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={price}
                                                    onChange={(e) => setPrice(e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-black text-lg text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all placeholder:text-gray-300 text-center"
                                                    placeholder="000"
                                                    required
                                                />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-xs">ر.س</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-1">رقم الجوال</label>
                                                <input
                                                    type="tel"
                                                    value={phone}
                                                    onChange={(e) => setPhone(e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300"
                                                    placeholder="05xxxxxxxx"
                                                    required
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold text-gray-500 mb-1.5 mr-1">البريد (اختياري)</label>
                                                <input
                                                    type="email"
                                                    value={email}
                                                    onChange={(e) => setEmail(e.target.value)}
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:ring-2 focus:ring-primary-500 outline-none transition-all placeholder:text-gray-300"
                                                    placeholder="name@email.com"
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-2 space-y-3">
                                            <button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-primary-700 to-primary-600 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/20 hover:shadow-xl hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 group"
                                            >
                                                <span className="group-hover:scale-110 transition-transform"><Send size={18} /></span>
                                                إرسال العرض
                                            </button>

                                            <button
                                                type="button"
                                                onClick={handleWhatsApp}
                                                className="w-full bg-white border-2 border-green-500 text-green-600 font-bold py-3.5 rounded-xl hover:bg-green-50 transition-all flex items-center justify-center gap-2 group"
                                            >
                                                <span className="group-hover:scale-110 transition-transform"><MessageCircle size={20} /></span>
                                                تواصل واتساب مباشرة
                                            </button>
                                        </div>
                                    </form>
                                </motion.div>
                            ) : (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    className="text-center py-10"
                                >
                                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 shadow-sm animate-pulse">
                                        <CheckCircle size={40} />
                                    </div>
                                    <h3 className="text-2xl font-black text-gray-900 mb-2">تم استلام عرضك!</h3>
                                    <p className="text-gray-500 max-w-[250px] mx-auto leading-relaxed mb-8 text-sm font-medium">
                                        شكراً لك. سيقوم فريق المبيعات بمراجعة السعر والرد عليك خلال 24 ساعة.
                                    </p>
                                    <button
                                        onClick={handleClose}
                                        className="bg-gray-100 text-gray-900 font-bold px-8 py-3 rounded-xl hover:bg-gray-200 transition-colors w-full"
                                    >
                                        إغلاق
                                    </button>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
