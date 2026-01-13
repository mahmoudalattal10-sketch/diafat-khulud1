'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Search, Sparkles, Star, Shield, Clock, Check, ChevronDown, Building } from 'lucide-react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import dynamic from 'next/dynamic';

const DateRangePicker = dynamic(() => import('./DateRangePicker'), { ssr: false });
const GuestSelector = dynamic(() => import('./GuestSelector'), { ssr: false });

import { HOTELS_DATA } from '@/data/hotels';

const floatingCards = [
    { icon: Star, text: '+10K', subtext: 'معتمر', color: 'from-amber-400 to-orange-500' },
    { icon: Shield, text: '100%', subtext: 'ضمان', color: 'from-emerald-400 to-teal-500' },
    { icon: Clock, text: '24/7', subtext: 'دعم', color: 'from-blue-400 to-indigo-500' },
];

// Animation variants
const popupVariants = {
    hidden: {
        opacity: 0,
        y: -10,
        scale: 0.95,
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "tween",
            ease: "easeOut",
            duration: 0.2
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        scale: 0.95,
        transition: {
            duration: 0.15,
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: {
            delay: i * 0.05,
            type: "spring",
            stiffness: 300,
            damping: 24,
        }
    })
};

export default function HeroSection() {
    const [destination, setDestination] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [guestData, setGuestData] = useState({
        adults: 1,
        children: 0,
        childAges: [] as number[],
        rooms: 1,
    });
    const [openDropdown, setOpenDropdown] = useState<string | null>(null);

    // Filter Logic
    const cities = ['مكة المكرمة', 'المدينة المنورة'];

    // Helper for fuzzy search
    const matchesSearch = (text: string, query: string) => {
        const normalize = (str: string) => str
            .toLowerCase()
            .replace(/[\u064B-\u065F]/g, '') // Remove Tashkeel
            .replace(/[أإآا]/g, 'ا') // Normalize Alef
            .replace(/ة/g, 'ه') // Normalize Teh Marbuta
            .replace(/ى/g, 'ي'); // Normalize Ya

        return normalize(text).includes(normalize(query));
    };

    // Filtered lists
    const filteredCities = searchQuery
        ? cities.filter(c => matchesSearch(c, searchQuery))
        : cities;

    const filteredHotels = searchQuery
        ? HOTELS_DATA.filter(h => matchesSearch(h.name, searchQuery) || matchesSearch(h.location, searchQuery))
        : [];



    const toggleDropdown = (name: string) => {
        setOpenDropdown(openDropdown === name ? null : name);
    };

    const closeAllDropdowns = () => {
        setOpenDropdown(null);
    };

    const router = useRouter();

    const handleDateChange = (start: Date | null, end: Date | null) => {
        setStartDate(start);
        setEndDate(end);
    };

    const handleSearch = () => {
        const params = new URLSearchParams();

        if (destination) {
            params.set('destination', destination);
        }

        if (startDate) {
            params.set('checkIn', startDate.toISOString());
        }

        if (endDate) {
            params.set('checkOut', endDate.toISOString());
        }

        if (guestData.adults > 0) {
            params.set('adults', guestData.adults.toString());
            params.set('children', guestData.children.toString());
            params.set('rooms', guestData.rooms.toString());
        }

        router.push(`/hotels?${params.toString()}`);
    };

    return (
        <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white pt-28">

            {/* Modern Geometric Background */}
            <div className="absolute inset-0 overflow-hidden">
                {/* Gradient Orbs */}
                {/* Gradient Orbs - Optimized with CSS Animation */}
                <div
                    className="absolute top-0 right-0 w-[800px] h-[800px] rounded-full animate-float"
                    style={{
                        background: 'radial-gradient(circle, rgba(27, 94, 58, 0.08) 0%, transparent 70%)',
                    }}
                />
                <div
                    className="absolute bottom-0 left-0 w-[600px] h-[600px] rounded-full animate-float-reverse"
                    style={{
                        background: 'radial-gradient(circle, rgba(201, 162, 39, 0.08) 0%, transparent 70%)',
                    }}
                />

                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage: `
              linear-gradient(rgba(27, 94, 58, 0.5) 1px, transparent 1px),
              linear-gradient(90deg, rgba(27, 94, 58, 0.5) 1px, transparent 1px)
            `,
                        backgroundSize: '60px 60px',
                    }}
                />
            </div>

            {/* Click outside to close dropdowns */}
            {openDropdown && (
                <div
                    className="fixed inset-0 z-20"
                    onClick={closeAllDropdowns}
                />
            )}

            {/* Main Content */}
            <div className="relative z-30 container-custom">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">

                    {/* Right Side - Text Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="text-center lg:text-right order-2 lg:order-1"
                    >
                        {/* Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-4 py-2 rounded-full mb-6 border border-primary-100"
                        >
                            <Sparkles size={16} className="text-primary-500" />
                            <span className="text-sm font-semibold">موسم العمرة 2026</span>
                        </motion.div>

                        {/* Main Heading */}
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight"
                        >
                            رحلتك المباركة
                            <br />
                            <span className="relative">
                                <span className="bg-gradient-to-l from-primary-500 to-primary-700 bg-clip-text text-transparent">
                                    تبدأ من هنا
                                </span>
                                <motion.svg
                                    className="absolute -bottom-2 right-0 w-full"
                                    viewBox="0 0 200 12"
                                    initial={{ pathLength: 0 }}
                                    animate={{ pathLength: 1 }}
                                    transition={{ delay: 0.8, duration: 0.8 }}
                                >
                                    <motion.path
                                        d="M2 8 Q50 2 100 8 T198 8"
                                        stroke="url(#gradient)"
                                        strokeWidth="4"
                                        fill="none"
                                        strokeLinecap="round"
                                    />
                                    <defs>
                                        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                            <stop offset="0%" stopColor="#C9A227" />
                                            <stop offset="100%" stopColor="#1B5E3A" />
                                        </linearGradient>
                                    </defs>
                                </motion.svg>
                            </span>
                        </motion.h1>

                        {/* Subtitle */}
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 lg:mr-0"
                        >
                            نقدم لكم أفضل باقات الحج والعمرة بأسعار تنافسية وخدمات متميزة تشمل الإقامة الفاخرة والمواصلات والإرشاد الديني
                        </motion.p>

                        {/* Floating Stats Cards */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 }}
                            className="flex flex-wrap justify-center lg:justify-start gap-4"
                        >
                            {floatingCards.map((card, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: 0.8 + index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                    className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-lg shadow-gray-200/50 border border-gray-100"
                                >
                                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${card.color} flex items-center justify-center text-white shadow-lg`}>
                                        <card.icon size={22} />
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-gray-900">{card.text}</div>
                                        <div className="text-xs text-gray-500">{card.subtext}</div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Left Side - Search Card */}
                    <motion.div
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        className="order-1 lg:order-2 overflow-visible"
                    >
                        {/* Modern Search Card */}
                        <div className="relative">
                            {/* Glow Effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-primary-500/20 via-primary-400/20 to-primary-500/20 rounded-3xl blur-xl opacity-70" />

                            <div className="relative bg-white rounded-3xl shadow-2xl shadow-gray-200/50 p-8 border border-gray-100">
                                {/* Card Header */}
                                <div className="flex items-center justify-between mb-8">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                                            <Search size={22} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">ابحث عن رحلتك</h3>
                                            <p className="text-sm text-gray-500">اختر وجهتك وموعد سفرك</p>
                                        </div>
                                    </div>
                                    <div className="hidden sm:flex items-center gap-1 bg-primary-50 text-primary-600 px-3 py-1.5 rounded-full text-xs font-semibold">
                                        <Sparkles size={12} />
                                        <span>عروض حصرية</span>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-5 overflow-visible">

                                    {/* Destination - Custom Dropdown */}
                                    <div className="relative z-40">
                                        <label className="flex items-center gap-2 text-sm font-semibold text-gray-700 mb-2">
                                            <MapPin size={16} className="text-primary-500" />
                                            <span>الوجهة</span>
                                        </label>
                                        <motion.button
                                            type="button"
                                            onClick={() => toggleDropdown('destination')}
                                            className={`w-full flex items-center justify-between px-5 py-4 rounded-2xl border-2 transition-all duration-300 ${openDropdown === 'destination'
                                                ? 'border-primary-500 bg-primary-50/50 ring-4 ring-primary-100'
                                                : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                                                }`}
                                            whileTap={{ scale: 0.995 }}
                                        >
                                            <span className={destination ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                                                {destination || 'اختر وجهتك المباركة'}
                                            </span>
                                            <motion.div
                                                animate={{ rotate: openDropdown === 'destination' ? 180 : 0 }}
                                                transition={{ duration: 0.3 }}
                                            >
                                                <ChevronDown size={20} className="text-gray-400" />
                                            </motion.div>
                                        </motion.button>

                                        {/* Destination Dropdown Popup */}
                                        <AnimatePresence>
                                            {openDropdown === 'destination' && (
                                                <motion.div
                                                    variants={popupVariants}
                                                    initial="hidden"
                                                    animate="visible"
                                                    exit="exit"
                                                    className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl shadow-gray-200/60 border border-gray-100 overflow-hidden z-50 p-3"
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    <div className="space-y-1">
                                                        <div className="px-3 py-1 text-[10px] font-black text-gray-400 uppercase tracking-widest">الوجهات</div>
                                                        {cities.map((city) => (
                                                            <motion.button
                                                                key={city}
                                                                variants={itemVariants}
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    setDestination(city);
                                                                    setOpenDropdown(null);
                                                                }}
                                                                className={`w-full text-right px-3 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-between ${destination === city
                                                                    ? 'bg-primary-50 border border-primary-500'
                                                                    : 'hover:bg-gray-50 border border-transparent'
                                                                    }`}
                                                            >
                                                                <span className="flex items-center gap-3">
                                                                    <span className="text-2xl">
                                                                        {city === 'مكة المكرمة' && '🕋'}
                                                                        {city === 'المدينة المنورة' && '🕌'}
                                                                    </span>
                                                                    {city}
                                                                </span>
                                                                {destination === city && (
                                                                    <motion.div
                                                                        initial={{ scale: 0 }}
                                                                        animate={{ scale: 1 }}
                                                                        className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center"
                                                                    >
                                                                        <Check size={14} className="text-white" />
                                                                    </motion.div>
                                                                )}
                                                            </motion.button>
                                                        ))}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    {/* Date Range Picker */}
                                    <DateRangePicker
                                        startDate={startDate}
                                        endDate={endDate}
                                        onDateChange={handleDateChange}
                                        isOpen={openDropdown === 'dates'}
                                        onToggle={() => toggleDropdown('dates')}
                                        onClose={() => setOpenDropdown(null)}
                                    />

                                    {/* Guest Selector */}
                                    <GuestSelector
                                        guestData={guestData}
                                        onGuestChange={setGuestData}
                                        isOpen={openDropdown === 'guests'}
                                        onToggle={() => toggleDropdown('guests')}
                                        onClose={() => setOpenDropdown(null)}
                                    />

                                    {/* Search Button */}
                                    <div onClick={handleSearch} className="block cursor-pointer">
                                        <motion.div
                                            whileHover={{ scale: 1.01, y: -2 }}
                                            whileTap={{ scale: 0.99 }}
                                            className="relative w-full overflow-hidden group bg-gradient-to-l from-primary-500 to-primary-600 text-white px-8 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-primary-500/25 transition-all duration-300"
                                        >
                                            {/* Animated Background */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />

                                            <span className="relative flex items-center justify-center gap-3">
                                                <Search size={22} />
                                                <span>ابحث عن الباقات المتاحة</span>
                                            </span>
                                        </motion.div>
                                    </div>
                                </div>

                                {/* Trust Badges */}
                                <div className="flex items-center justify-center gap-4 mt-6 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Shield size={16} className="text-primary-500" />
                                        <span>حجز آمن</span>
                                    </div>
                                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                        <Building size={16} className="text-primary-500" />
                                        <span>تأكيد فوري</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Bottom Decorative Wave */}
            <div className="absolute bottom-0 left-0 right-0">
                <svg
                    viewBox="0 0 1440 100"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-auto"
                    preserveAspectRatio="none"
                >
                    <path
                        d="M0 50L60 45C120 40 240 30 360 25C480 20 600 20 720 25C840 30 960 40 1080 45C1200 50 1320 50 1380 50L1440 50V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
                        fill="#f9fafb"
                    />
                </svg>
            </div>
        </section>
    );
}
