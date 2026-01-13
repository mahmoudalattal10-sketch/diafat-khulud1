'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    User,
    Calendar,
    Heart,
    Settings,
    LogOut,
    MapPin,
    Clock,
    CreditCard,
    ChevronLeft,
    Star,
    Download,
    Search,
    Filter,
    Trash2,
    Eye,
    Edit,
    CheckCircle,
    XCircle,
    AlertCircle,
    Bell,
    Shield,
    Key,
    Mail,
    Phone,
    Globe,
    Wallet,
    Gift,
    Award,
    TrendingUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBookingsStore } from '@/store/bookingsStore';
import { useHotelsStore } from '@/store/hotelsStore';

type DashboardTab = 'overview' | 'bookings' | 'favorites' | 'settings';

export default function UserDashboard() {
    const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');

    const { bookings, fetchBookings } = useBookingsStore();
    const { hotels } = useHotelsStore();

    useEffect(() => {
        fetchBookings();
    }, []);

    // Mock user data
    const user = {
        name: 'أحمد محمد',
        email: 'ahmed@example.com',
        phone: '+966 50 123 4567',
        avatar: 'https://ui-avatars.com/api/?name=أحمد+محمد&background=0D9488&color=fff&size=200',
        memberSince: '2024',
        totalBookings: bookings.length,
        activeBookings: bookings.filter(b => b.status === 'مؤكد').length,
        points: 1250,
        tier: 'ذهبي'
    };

    // User's bookings
    const userBookings = bookings.slice(0, 5);
    const favorites = hotels.slice(0, 4);

    const tabs = [
        { id: 'overview', label: 'نظرة عامة', icon: TrendingUp },
        { id: 'bookings', label: 'حجوزاتي', icon: Calendar },
        { id: 'favorites', label: 'المفضلة', icon: Heart },
        { id: 'settings', label: 'الإعدادات', icon: Settings }
    ];

    const getStatusBadge = (status: string) => {
        const statusMap: any = {
            'confirmed': { label: 'مؤكد', color: 'bg-emerald-50 text-emerald-600 border-emerald-200' },
            'pending': { label: 'قيد المراجعة', color: 'bg-yellow-50 text-yellow-600 border-yellow-200' },
            'cancelled': { label: 'ملغي', color: 'bg-red-50 text-red-600 border-red-200' },
            'completed': { label: 'مكتمل', color: 'bg-blue-50 text-blue-600 border-blue-200' }
        };
        return statusMap[status] || statusMap['pending'];
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b border-gray-100 sticky top-0 z-50 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href="/" className="flex items-center gap-4 group">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className="relative"
                            >
                                <img
                                    src="/logo.png"
                                    alt="ضيافة خلود"
                                    className="h-16 w-auto object-contain"
                                />
                            </motion.div>
                        </Link>

                        {/* User Info & Actions */}
                        <div className="flex items-center gap-4">
                            <div className="hidden md:flex items-center gap-3 px-4 py-2 bg-gray-50 rounded-xl">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-primary-600 rounded-full flex items-center justify-center shadow-lg">
                                    <User size={20} className="text-white" />
                                </div>
                                <div>
                                    <div className="text-sm font-black text-gray-900">{user.name}</div>
                                    <div className="text-xs text-gray-400 font-medium">عضو {user.tier}</div>
                                </div>
                            </div>

                            <Link
                                href="/"
                                className="h-11 px-5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary-500/20"
                            >
                                <ChevronLeft size={16} />
                                <span className="hidden sm:inline">الصفحة الرئيسية</span>
                                <span className="sm:hidden">الرئيسية</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-8">
                <div className="grid lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* User Card */}
                        <div className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm mb-6">
                            <div className="text-center">
                                <div className="w-24 h-24 mx-auto mb-4 rounded-full overflow-hidden border-4 border-primary-500/20 shadow-xl">
                                    <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                                </div>
                                <h2 className="text-lg font-black text-gray-900 mb-1">{user.name}</h2>
                                <p className="text-sm text-gray-400 font-medium mb-4">{user.email}</p>

                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-500 to-primary-600 rounded-xl text-white shadow-lg">
                                    <Award size={16} />
                                    <span className="font-black text-sm">عضو {user.tier}</span>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-100">
                                    <div>
                                        <div className="text-2xl font-black text-gray-900">{user.totalBookings}</div>
                                        <div className="text-xs text-gray-400 font-bold">حجز</div>
                                    </div>
                                    <div>
                                        <div className="text-2xl font-black text-primary-500">{user.points}</div>
                                        <div className="text-xs text-gray-400 font-bold">نقطة</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                            {tabs.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as DashboardTab)}
                                    className={`w-full flex items-center gap-3 px-6 py-4 font-bold text-sm transition-all border-b border-gray-50 last:border-0 ${activeTab === tab.id
                                        ? 'bg-primary-50 text-primary-600 border-r-4 border-r-primary-500'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <tab.icon size={20} />
                                    {tab.label}
                                </button>
                            ))}
                            <button className="w-full flex items-center gap-3 px-6 py-4 font-bold text-sm text-red-600 hover:bg-red-50 transition-all">
                                <LogOut size={20} />
                                تسجيل الخروج
                            </button>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-3">
                        <AnimatePresence mode="wait">
                            {/* Overview Tab */}
                            {activeTab === 'overview' && (
                                <motion.div
                                    key="overview"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Stats Cards */}
                                    <div className="grid md:grid-cols-3 gap-6">
                                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-3xl p-6 text-white shadow-lg shadow-emerald-500/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                                    <CheckCircle size={24} />
                                                </div>
                                                <span className="text-2xl">✨</span>
                                            </div>
                                            <div className="text-3xl font-black mb-1">{user.activeBookings}</div>
                                            <div className="text-emerald-100 font-bold text-sm">حجوزات نشطة</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-lg shadow-blue-500/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                                    <Heart size={24} />
                                                </div>
                                                <span className="text-2xl">❤️</span>
                                            </div>
                                            <div className="text-3xl font-black mb-1">{favorites.length}</div>
                                            <div className="text-blue-100 font-bold text-sm">فندق مفضل</div>
                                        </div>

                                        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-3xl p-6 text-white shadow-lg shadow-amber-500/20">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                                                    <Gift size={24} />
                                                </div>
                                                <span className="text-2xl">🎁</span>
                                            </div>
                                            <div className="text-3xl font-black mb-1">{user.points}</div>
                                            <div className="text-amber-100 font-bold text-sm">نقاط المكافآت</div>
                                        </div>
                                    </div>

                                    {/* Recent Bookings */}
                                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                        <div className="flex items-center justify-between mb-6">
                                            <h2 className="text-xl font-black text-gray-900">آخر الحجوزات</h2>
                                            <button
                                                onClick={() => setActiveTab('bookings')}
                                                className="text-primary-500 font-bold text-sm hover:text-primary-600"
                                            >
                                                عرض الكل
                                            </button>
                                        </div>

                                        <div className="space-y-4">
                                            {userBookings.slice(0, 3).map((booking) => {
                                                const hotel = hotels.find(h => h.id === booking.hotelId);
                                                const status = getStatusBadge(booking.status);

                                                return (
                                                    <div key={booking.id} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary-200 hover:bg-primary-50/30 transition-all group">
                                                        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                                            <img
                                                                src={hotel?.images?.[0] || '/placeholder.jpg'}
                                                                alt={hotel?.name}
                                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                            />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="font-black text-gray-900 mb-1">{hotel?.name}</h3>
                                                            <div className="flex items-center gap-4 text-xs text-gray-400 font-medium">
                                                                <span className="flex items-center gap-1">
                                                                    <Calendar size={12} />
                                                                    {booking.checkIn} - {booking.checkOut}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    <User size={12} />
                                                                    {booking.user}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-left">
                                                            <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold border ${status.color}`}>
                                                                {status.label}
                                                            </span>
                                                            <div className="text-lg font-black text-gray-900 mt-2">{booking.amountLabel}</div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>

                                    {/* Quick Actions */}
                                    <div className="grid md:grid-cols-2 gap-6">
                                        <Link href="/hotels" className="bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl p-8 text-white shadow-lg shadow-primary-500/20 hover:shadow-xl transition-all group">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-black mb-2">احجز الآن</h3>
                                                    <p className="text-primary-100 font-medium text-sm">اكتشف أفضل العروض</p>
                                                </div>
                                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Search size={32} />
                                                </div>
                                            </div>
                                        </Link>

                                        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-8 text-white shadow-lg shadow-purple-500/20 hover:shadow-xl transition-all group cursor-pointer">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <h3 className="text-xl font-black mb-2">استبدل النقاط</h3>
                                                    <p className="text-purple-100 font-medium text-sm">احصل على خصومات حصرية</p>
                                                </div>
                                                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Gift size={32} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Bookings Tab */}
                            {activeTab === 'bookings' && (
                                <motion.div
                                    key="bookings"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h2 className="text-2xl font-black text-gray-900">حجوزاتي</h2>
                                                <p className="text-gray-400 font-medium">إدارة جميع حجوزاتك</p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <select
                                                    value={filterStatus}
                                                    onChange={(e) => setFilterStatus(e.target.value)}
                                                    className="h-10 px-4 bg-gray-50 rounded-xl border border-gray-200 font-bold text-sm outline-none"
                                                >
                                                    <option value="all">كل الحالات</option>
                                                    <option value="confirmed">مؤكد</option>
                                                    <option value="pending">قيد المراجعة</option>
                                                    <option value="cancelled">ملغي</option>
                                                    <option value="completed">مكتمل</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            {userBookings.map((booking) => {
                                                const hotel = hotels.find(h => h.id === booking.hotelId);
                                                const status = getStatusBadge(booking.status);

                                                return (
                                                    <div key={booking.id} className="border border-gray-100 rounded-2xl p-6 hover:border-primary-200 hover:bg-primary-50/20 transition-all">
                                                        <div className="flex items-start gap-6">
                                                            <div className="w-32 h-32 rounded-2xl overflow-hidden bg-gray-100 shrink-0">
                                                                <img
                                                                    src={hotel?.images?.[0] || '/placeholder.jpg'}
                                                                    alt={hotel?.name}
                                                                    className="w-full h-full object-cover"
                                                                />
                                                            </div>

                                                            <div className="flex-1">
                                                                <div className="flex items-start justify-between mb-4">
                                                                    <div>
                                                                        <h3 className="text-xl font-black text-gray-900 mb-2">{hotel?.name}</h3>
                                                                        <div className="flex items-center gap-2 text-sm text-gray-400 font-medium mb-3">
                                                                            <MapPin size={14} />
                                                                            {hotel?.location}
                                                                        </div>
                                                                    </div>
                                                                    <span className={`px-4 py-2 rounded-xl text-xs font-black border ${status.color}`}>
                                                                        {status.label}
                                                                    </span>
                                                                </div>

                                                                <div className="grid md:grid-cols-3 gap-4 mb-4">
                                                                    <div className="bg-gray-50 rounded-xl p-3">
                                                                        <div className="text-xs text-gray-400 font-bold mb-1">تاريخ الوصول</div>
                                                                        <div className="font-black text-gray-900">{booking.checkIn}</div>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-xl p-3">
                                                                        <div className="text-xs text-gray-400 font-bold mb-1">تاريخ المغادرة</div>
                                                                        <div className="font-black text-gray-900">{booking.checkOut}</div>
                                                                    </div>
                                                                    <div className="bg-gray-50 rounded-xl p-3">
                                                                        <div className="text-xs text-gray-400 font-bold mb-1">عدد الليالي</div>
                                                                        <div className="font-black text-gray-900">{booking.nights} ليلة</div>
                                                                    </div>
                                                                </div>

                                                                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                                    <div className="text-2xl font-black text-gray-900">{booking.amountLabel}</div>
                                                                    <div className="flex items-center gap-2">
                                                                        <button className="h-10 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-sm text-gray-600 transition-all">
                                                                            <Download size={16} className="inline mr-2" />
                                                                            تحميل
                                                                        </button>
                                                                        <button className="h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-sm transition-all">
                                                                            <Eye size={16} className="inline mr-2" />
                                                                            التفاصيل
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Favorites Tab */}
                            {activeTab === 'favorites' && (
                                <motion.div
                                    key="favorites"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                >
                                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                        <div className="mb-8">
                                            <h2 className="text-2xl font-black text-gray-900">فنادقي المفضلة</h2>
                                            <p className="text-gray-400 font-medium">احفظ الفنادق المفضلة لديك</p>
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-6">
                                            {favorites.map((hotel) => (
                                                <div key={hotel.id} className="group relative bg-white border border-gray-100 rounded-3xl overflow-hidden hover:border-primary-200 hover:shadow-xl transition-all">
                                                    <div className="relative h-48 overflow-hidden">
                                                        <img
                                                            src={hotel.images[0]}
                                                            alt={hotel.name}
                                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                                                        />
                                                        <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center hover:bg-white transition-all">
                                                            <Heart size={20} className="text-red-500 fill-red-500" />
                                                        </button>
                                                    </div>

                                                    <div className="p-6">
                                                        <div className="flex items-start justify-between mb-3">
                                                            <div>
                                                                <h3 className="font-black text-gray-900 mb-1">{hotel.name}</h3>
                                                                <div className="flex items-center gap-1 text-sm text-gray-400 font-medium">
                                                                    <MapPin size={14} />
                                                                    {hotel.location}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-1 bg-primary-50 px-2 py-1 rounded-lg">
                                                                <Star size={14} className="text-primary-500 fill-primary-500" />
                                                                <span className="font-black text-primary-600 text-sm">{hotel.rating}</span>
                                                            </div>
                                                        </div>

                                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                                                            <div>
                                                                <div className="text-xs text-gray-400 font-bold">يبدأ من</div>
                                                                <div className="text-xl font-black text-gray-900">{hotel.price} ر.س</div>
                                                            </div>
                                                            <Link
                                                                href={`/hotels/${hotel.id}`}
                                                                className="h-10 px-4 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-bold text-sm transition-all"
                                                            >
                                                                احجز الآن
                                                            </Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Settings Tab */}
                            {activeTab === 'settings' && (
                                <motion.div
                                    key="settings"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    className="space-y-6"
                                >
                                    {/* Profile Settings */}
                                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                        <h2 className="text-xl font-black text-gray-900 mb-6">المعلومات الشخصية</h2>

                                        <div className="space-y-4">
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">الاسم الكامل</label>
                                                    <input
                                                        type="text"
                                                        value={user.name}
                                                        className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">البريد الإلكتروني</label>
                                                    <input
                                                        type="email"
                                                        value={user.email}
                                                        className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">رقم الجوال</label>
                                                    <input
                                                        type="tel"
                                                        value={user.phone}
                                                        className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 block">اللغة</label>
                                                    <select className="w-full h-12 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-gray-900 outline-none transition-all">
                                                        <option value="ar">العربية</option>
                                                        <option value="en">English</option>
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="pt-4">
                                                <button className="h-12 px-8 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-black transition-all shadow-lg shadow-primary-500/20">
                                                    حفظ التغييرات
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Notification Settings */}
                                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                        <h2 className="text-xl font-black text-gray-900 mb-6">الإشعارات</h2>

                                        <div className="space-y-4">
                                            {[
                                                { label: 'إشعارات الحجوزات', desc: 'تنبيهات عن حالة الحجوزات' },
                                                { label: 'العروض الخاصة', desc: 'استقبال عروض وخصومات حصرية' },
                                                { label: 'رسائل البريد', desc: 'النشرة الإخبارية والتحديثات' }
                                            ].map((item, i) => (
                                                <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                                                    <div>
                                                        <div className="font-black text-gray-900">{item.label}</div>
                                                        <div className="text-sm text-gray-400 font-medium">{item.desc}</div>
                                                    </div>
                                                    <button className="w-14 h-8 rounded-full relative bg-primary-500">
                                                        <div className="absolute top-1 w-6 h-6 bg-white rounded-full shadow right-1" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Security */}
                                    <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
                                        <h2 className="text-xl font-black text-gray-900 mb-6">الأمان</h2>

                                        <div className="space-y-3">
                                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                                                <div className="flex items-center gap-3">
                                                    <Key size={20} className="text-gray-400" />
                                                    <span className="font-bold text-gray-900">تغيير كلمة المرور</span>
                                                </div>
                                                <ChevronLeft size={20} className="text-gray-400" />
                                            </button>
                                            <button className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-2xl transition-all">
                                                <div className="flex items-center gap-3">
                                                    <Shield size={20} className="text-gray-400" />
                                                    <span className="font-bold text-gray-900">التحقق بخطوتين</span>
                                                </div>
                                                <ChevronLeft size={20} className="text-gray-400" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}
