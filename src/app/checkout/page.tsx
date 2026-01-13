'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    Calendar,
    User,
    ChevronRight,
    ChevronLeft,
    Star,
    Clock,
    ShieldCheck,
    CreditCard,
    ArrowRight,
    MapPin,
    Building2,
    CheckCircle2,
    Users
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CheckoutStepper from '@/components/checkout/CheckoutStepper';

function CheckoutContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const [step, setStep] = useState(1);

    // State for fetched data
    const [hotel, setHotel] = useState<any>({
        name: searchParams.get('hotelName') || '',
        images: [searchParams.get('hotelImage') || '']
    });
    const [room, setRoom] = useState<any>(null);
    const [price, setPrice] = useState(parseInt(searchParams.get('price') || '0'));
    const [isLoading, setIsLoading] = useState(true);

    // User Input State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
    });

    useEffect(() => {
        const fetchDetails = async () => {
            const hotelId = searchParams.get('hotelId');
            const roomId = searchParams.get('roomId');
            const urlPrice = searchParams.get('price');

            if (urlPrice) setPrice(parseInt(urlPrice));

            // If we have roomId but no hotelId, try to find the hotel from the store or all hotels
            if (roomId && !hotelId) {
                try {
                    const hotelsRes = await fetch('/api/hotels');
                    if (hotelsRes.ok) {
                        const hotels = await hotelsRes.json();
                        const foundHotel = hotels.find((h: any) => h.rooms.some((r: any) => r.id === roomId));
                        if (foundHotel) {
                            setHotel(foundHotel);
                            const foundRoom = foundHotel.rooms.find((r: any) => r.id === roomId);
                            if (foundRoom) setRoom(foundRoom);
                        }
                    }
                } catch (e) {
                    console.error('Failed to recover hotel from roomId:', e);
                }
            }

            if (hotelId) {
                try {
                    const res = await fetch(`/api/hotels/${hotelId}`);
                    if (res.ok) {
                        const hotelData = await res.json();
                        setHotel(hotelData);
                        if (roomId) {
                            const foundRoom = hotelData.rooms?.find((r: any) => r.id === roomId);
                            if (foundRoom) {
                                setRoom(foundRoom);
                                if (!urlPrice) setPrice(foundRoom.price);
                            }
                        }
                    }
                } catch (e) {
                    console.error('Failed to fetch checkout details:', e);
                }
            }
            setIsLoading(false);
        };
        fetchDetails();
    }, [searchParams]);

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
        else handlePayment();
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handlePayment = async () => {
        if (!hotel || !room) return;
        setIsLoading(true);

        try {
            // 1. Create Booking
            const bookingRes = await fetch('/api/bookings', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    hotelId: hotel.id,
                    roomId: room.id,
                    checkIn: '2026-01-10', // Mock dates for now as per UI
                    checkOut: '2026-01-15',
                    guestName: formData.name,
                    guestEmail: formData.email,
                    guestPhone: formData.phone
                })
            });

            if (!bookingRes.ok) {
                const err = await bookingRes.json();
                alert(err.error || 'Booking Failed');
                setIsLoading(false);
                return;
            }

            const booking = await bookingRes.json();

            // 2. Initiate Payment
            const payRes = await fetch('/api/payment/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ bookingId: booking.id })
            });

            if (!payRes.ok) {
                alert('Payment Initiation Failed');
                setIsLoading(false);
                return;
            }

            const paymentData = await payRes.json();
            if (paymentData.redirect_url) {
                window.location.href = paymentData.redirect_url;
            }

        } catch (error) {
            console.error(error);
            alert('An unexpected error occurred');
            setIsLoading(false);
        }
    };

    // ... Render (Keep UI essentially the same but bind inputs and display real data) ...
    // Since re-writing the whole large JSX is expensive/risky, I will only update the logic part 
    // and assume the UI binds to these variables. 
    // Wait, the previous tool call asked for "Rewrite CheckoutContent". 
    // I should provide the full component if I am replacing logic that permeates the UI (like value={formData.name}).

    // I will return the Full Component content.
    return (
        <div className="min-h-screen bg-[#FAFAFA] py-12 md:py-16 px-4 md:px-8 font-sans" dir="rtl">
            <CheckoutStepper currentStep={step} />

            <div className="max-w-[1240px] mx-auto flex flex-col lg:flex-row gap-10">
                {/* Main Interaction Area */}
                <div className="flex-1 order-2 lg:order-1">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-6"
                            >
                                <div className="mb-10">
                                    <h1 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">ملخص الحجز</h1>
                                    <p className="text-gray-500 font-medium">تأكد من دقة المعلومات لحجز ممتع وبدون عوائق</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center text-primary-600">
                                                    <Building2 size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-primary-500 uppercase tracking-widest block mb-0.5">الغرفة المختارة</span>
                                                    <h3 className="text-xl font-black text-gray-900 line-clamp-1">{room?.name || 'غرفة ديلوكس'}</h3>
                                                </div>
                                            </div>
                                            <div className="space-y-4">
                                                <div className="flex justify-between items-center text-sm">
                                                    <span className="text-gray-400 font-bold">نوع السرير</span>
                                                    <span className="text-gray-900 font-black">{room?.type || 'سرير كينج'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                                            <div className="flex items-center gap-4 mb-6">
                                                <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                                                    <ShieldCheck size={24} />
                                                </div>
                                                <div>
                                                    <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest block mb-0.5">الأمان والثقة</span>
                                                    <h3 className="text-xl font-black text-gray-900">سياسة إلغاء مرنة</h3>
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-500 font-medium leading-relaxed italic">
                                                "يمكنك إلغاء الحجز مجاناً قبل الموعد بـ 48 ساعة."
                                            </p>
                                        </div>
                                    </div>

                                    {/* Stay Timeline (Mocked Dates for Prototype) */}
                                    <div className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] flex flex-col justify-between group">
                                        <div>
                                            <div className="flex items-center gap-4 mb-10">
                                                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400">
                                                    <Calendar size={24} />
                                                </div>
                                                <h3 className="text-xl font-black text-gray-900">تواريخ الإقامة</h3>
                                            </div>
                                            <div className="space-y-10 relative pr-6">
                                                <div className="absolute top-2 right-1.5 bottom-2 w-0.5 bg-gray-100" />
                                                <div className="relative">
                                                    <div className="absolute -right-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-primary-500 shadow-sm" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">تسجيل الوصول</span>
                                                    <div className="flex items-end gap-3">
                                                        <span className="text-2xl font-black text-gray-900">10 يناير 2026</span>
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <div className="absolute -right-6 top-1.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-gray-300 shadow-sm" />
                                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">تسجيل المغادرة</span>
                                                    <div className="flex items-end gap-3">
                                                        <span className="text-2xl font-black text-gray-900">15 يناير 2026</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100"
                            >
                                <div className="mb-12">
                                    <h2 className="text-3xl font-black text-gray-900 mb-4 tracking-tight">بيانات المسافر الرئيسي</h2>
                                    <p className="text-gray-500 font-medium italic">سوف نستخدم هذه البيانات للتواصل معك وإرسال تأكيد الحجز</p>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <InputWrapper label="الاسم بالكامل" icon={<User size={18} />}>
                                        <input
                                            type="text"
                                            value={formData.name}
                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full h-16 px-6 bg-gray-50/80 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all outline-none font-black text-gray-900"
                                        />
                                    </InputWrapper>
                                    <InputWrapper label="البريد الإلكتروني" icon={<CreditCard size={18} />}>
                                        <input
                                            type="email"
                                            value={formData.email}
                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full h-16 px-6 bg-gray-50/80 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all outline-none font-bold text-gray-900 text-left" dir="ltr"
                                        />
                                    </InputWrapper>
                                    <InputWrapper label="رقم الجوال" icon={<Users size={18} />}>
                                        <input
                                            type="tel"
                                            value={formData.phone}
                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full h-16 px-6 bg-gray-50/80 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary-500 transition-all outline-none font-black text-gray-900 text-left" dir="ltr"
                                        />
                                    </InputWrapper>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white rounded-[3rem] p-10 md:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100 text-center"
                            >
                                <div className="w-24 h-24 bg-primary-100 rounded-[2rem] rotate-12 flex items-center justify-center mx-auto mb-10 text-primary-600 shadow-xl shadow-primary-500/20">
                                    <div className="-rotate-12">
                                        <CreditCard size={44} strokeWidth={2.5} />
                                    </div>
                                </div>
                                <h2 className="text-3xl font-black text-gray-900 mb-3 tracking-tight">جاهز للانطلاق؟</h2>
                                <p className="text-gray-500 mb-12 font-medium max-w-sm mx-auto">سيتم التسديد عبر بوابة دفع آمنة.</p>
                                <div className="max-w-md mx-auto p-8 rounded-[2.5rem] bg-gradient-to-br from-gray-50 to-white border-2 border-dashed border-primary-200 flex items-center justify-center">
                                    <span className="text-2xl font-black text-primary-600">PayTabs</span>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Right Side Card */}
                <div className="w-full lg:w-[420px] shrink-0 order-1 lg:order-2">
                    <div className="bg-white rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-50 sticky top-8 group">
                        <div className="relative h-[280px] w-full overflow-hidden bg-gray-100">
                            {hotel?.images?.[0] ? (
                                <Image
                                    src={hotel.images[0]}
                                    alt={hotel?.name || ''}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-1000"
                                    priority
                                />
                            ) : (
                                <div className="absolute inset-0 bg-primary-900/10" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                            <div className="absolute bottom-6 right-6">
                                <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">{hotel?.name}</h2>
                            </div>
                        </div>
                        <div className="p-10 space-y-10">
                            <div className="flex justify-between items-end pb-10 border-b border-gray-50 border-dashed">
                                <div>
                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] block mb-2">المبلغ الإجمالي</span>
                                    <div className="flex items-baseline gap-2">
                                        <span className="text-5xl font-black text-primary-600">{price}</span>
                                        <span className="text-xl font-bold text-primary-700/60 uppercase tracking-tighter">SAR</span>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-4">
                                <button
                                    onClick={handleNext}
                                    disabled={isLoading && step === 3}
                                    className="w-full h-[72px] bg-primary-600 hover:bg-primary-700 text-white font-black rounded-3xl shadow-2xl shadow-primary-600/30 transition-all flex items-center justify-center gap-4 group active:scale-[0.98] disabled:opacity-70"
                                >
                                    {isLoading && step === 3 ? (
                                        <div className="w-8 h-8 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            <span className="text-lg">{step === 3 ? 'إتمام الحجز والدفع' : 'المتابعة للخطوة التالية'}</span>
                                            <ArrowRight size={24} className="group-hover:-translate-x-2 transition-transform" />
                                        </>
                                    )}
                                </button>
                                {step > 1 && (
                                    <button
                                        onClick={handleBack}
                                        className="w-full h-[60px] bg-white text-gray-400 font-bold hover:text-gray-900 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <ChevronLeft size={20} />
                                        <span>الرجوع للخطوة السابقة</span>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function CheckoutPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-8 h-8 border-4 border-primary-600 border-t-transparent rounded-full animate-spin" />
            </div>
        }>
            <CheckoutContent />
        </Suspense>
    );
}

function InputWrapper({ label, icon, children }: any) {
    return (
        <div className="space-y-3">
            <div className="flex items-center gap-2 mr-1">
                <span className="text-primary-600">{icon}</span>
                <label className="text-sm font-black text-gray-700">{label}</label>
            </div>
            {children}
        </div>
    )
}
