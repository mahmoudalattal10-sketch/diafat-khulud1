'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import {
    Users,
    CalendarCheck,
    TrendingUp,
    Palmtree,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    MoreVertical,
    CheckCircle2,
    Clock,
    AlertCircle,
    Download,
    X,
    Eye,
    Edit3,
    Trash2,
    FileText,
    Loader2
} from 'lucide-react';
import { useHotelsStore } from '@/store/hotelsStore';
import { useBookingsStore } from '@/store/bookingsStore';
import { useCustomersStore } from '@/store/customersStore';

export default function DashboardOverview() {
    // Use global stores
    const hotels = useHotelsStore(state => state.hotels);
    const { bookings, getTotalRevenue, getBookingsCount, deleteBooking, updateBookingStatus, fetchBookings } = useBookingsStore();
    const { customers, getCustomersCount } = useCustomersStore();

    useEffect(() => {
        fetchBookings();
    }, []);

    const [showFilterModal, setShowFilterModal] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [activeBookingMenu, setActiveBookingMenu] = useState<string | null>(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPeriod, setFilterPeriod] = useState('month');

    // Calculate dynamic stats
    const bookingsCount = getBookingsCount();
    const totalRevenue = getTotalRevenue();
    const customersCount = getCustomersCount();

    const stats = useMemo(() => [
        { title: 'إجمالي الحجوزات', value: bookingsCount.total.toLocaleString(), change: '+12.5%', isUp: true, icon: CalendarCheck, color: 'text-blue-600', bg: 'bg-blue-50' },
        { title: 'الإيرادات الشهرية', value: `${totalRevenue.toLocaleString()} ر.س`, change: '+8.2%', isUp: true, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { title: 'العملاء النشطين', value: customersCount.active.toString(), change: '+4.1%', isUp: true, icon: Users, color: 'text-primary-600', bg: 'bg-primary-50' },
        { title: 'الفنادق النشطة', value: hotels.length.toString(), change: '+2.3%', isUp: true, icon: Palmtree, color: 'text-purple-600', bg: 'bg-purple-50' },
    ], [bookingsCount, totalRevenue, customersCount, hotels]);

    // Get recent bookings (last 5)
    const recentBookings = useMemo(() => {
        return [...bookings]
            .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
            .slice(0, 5)
            .map(b => ({
                id: b.id,
                user: b.user,
                hotel: b.hotel,
                date: getRelativeTime(b.createdAt),
                amount: b.amountLabel,
                status: b.status
            }));
    }, [bookings]);

    function getRelativeTime(date: Date | string) {
        const now = new Date();
        const d = new Date(date);
        const diff = now.getTime() - d.getTime();
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const days = Math.floor(hours / 24);

        if (hours < 1) return 'منذ قليل';
        if (hours < 24) return `منذ ${hours} ساعة`;
        if (days === 1) return 'أمس';
        return `منذ ${days} أيام`;
    }

    const handleExportPDF = async () => {
        setIsExporting(true);
        // Simulate PDF generation
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Create a simple PDF-like text file for demo
        const reportContent = `
تقرير لوحة التحكم - ضيافة خلود
================================
التاريخ: ${new Date().toLocaleDateString('ar-SA')}

إحصائيات عامة:
- إجمالي الحجوزات: 1,284
- الإيرادات الشهرية: $452,100
- العملاء الجدد: 342
- الفنادق النشطة: 156

آخر الحجوزات:
${recentBookings.map(b => `${b.id} - ${b.user} - ${b.hotel} - ${b.amount}`).join('\n')}
        `;

        const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `dashboard-report-${Date.now()}.txt`;
        a.click();
        URL.revokeObjectURL(url);

        setIsExporting(false);
    };

    const handleBookingAction = (action: string, bookingId: string) => {
        switch (action) {
            case 'view':
                alert(`عرض تفاصيل الحجز ${bookingId}`);
                break;
            case 'edit':
                alert(`تعديل الحجز ${bookingId}`);
                break;
            case 'delete':
                if (confirm(`هل أنت متأكد من حذف الحجز ${bookingId}؟`)) {
                    alert(`تم حذف الحجز ${bookingId}`);
                }
                break;
        }
        setActiveBookingMenu(null);
    };

    return (
        <div className="space-y-10 pb-10">
            {/* Upper Section: Welcome & Actions */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">مرحباً بك، محمد نور 👋</h1>
                    <p className="text-gray-500 font-bold">هذا ما حدث في "ضيافة خلود" اليوم. استمتع بالإشراف!</p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowFilterModal(true)}
                        className="h-14 px-6 bg-white border border-gray-200 rounded-2xl font-black text-sm text-gray-600 flex items-center gap-2 hover:bg-gray-50 transition-colors shadow-sm"
                    >
                        <Filter size={18} />
                        <span>تصفية النتائج</span>
                    </button>
                    <button
                        onClick={handleExportPDF}
                        disabled={isExporting}
                        className="h-14 px-8 bg-black text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50"
                    >
                        {isExporting ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                <span>جاري التصدير...</span>
                            </>
                        ) : (
                            <>
                                <Download size={18} />
                                <span>تصدير تقرير PDF</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Filter Modal */}
            <AnimatePresence>
                {showFilterModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowFilterModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900">تصفية النتائج</h3>
                                <button onClick={() => setShowFilterModal(false)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">الحالة</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['all', 'confirmed', 'pending'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => setFilterStatus(status)}
                                                className={`py-3 rounded-xl font-bold text-sm transition-all ${filterStatus === status ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                {status === 'all' ? 'الكل' : status === 'confirmed' ? 'مؤكد' : 'معلق'}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">الفترة الزمنية</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['week', 'month', 'year'].map(period => (
                                            <button
                                                key={period}
                                                onClick={() => setFilterPeriod(period)}
                                                className={`py-3 rounded-xl font-bold text-sm transition-all ${filterPeriod === period ? 'bg-primary-500 text-black' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                {period === 'week' ? 'أسبوع' : period === 'month' ? 'شهر' : 'سنة'}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="flex-1 h-14 bg-gray-100 text-gray-600 rounded-xl font-black hover:bg-gray-200 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={() => {
                                        setShowFilterModal(false);
                                        alert(`تم تطبيق الفلتر: الحالة=${filterStatus}, الفترة=${filterPeriod}`);
                                    }}
                                    className="flex-1 h-14 bg-black text-white rounded-xl font-black hover:bg-gray-800 transition-colors"
                                >
                                    تطبيق الفلتر
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white p-6 lg:p-8 rounded-3xl lg:rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group cursor-default"
                    >
                        <div className="flex items-start justify-between mb-6 lg:mb-8">
                            <div className={`${stat.bg} ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-6`}>
                                <stat.icon size={28} />
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase px-2 py-1 rounded-lg ${stat.isUp ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.change}
                            </div>
                        </div>
                        <div className="space-y-1">
                            <div className="text-sm font-bold text-gray-400 uppercase tracking-widest">{stat.title}</div>
                            <div className="text-3xl font-black text-gray-900">{stat.value}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Content Mid Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Activity Chart Area */}
                <div className="lg:col-span-2 bg-white rounded-3xl lg:rounded-[3rem] p-6 lg:p-10 border border-gray-100 shadow-sm relative overflow-hidden group">
                    <div className="flex items-center justify-between mb-8 lg:mb-10">
                        <h3 className="text-lg lg:text-xl font-black text-gray-900 uppercase tracking-tighter">تحليلات الأداء</h3>
                        <div className="flex items-center gap-2">
                            <span className="flex items-center gap-1 text-[10px] lg:text-xs font-bold text-gray-400"><div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-primary-500" /> الحجوزات</span>
                        </div>
                    </div>

                    {/* Mock Chart Visualization */}
                    <div className="h-[200px] lg:h-[300px] w-full flex items-end justify-between px-1 lg:px-2">
                        {[40, 70, 45, 90, 65, 80, 50, 95, 75, 85, 60, 100].map((h, i) => (
                            <div key={i} className="w-[7%] flex flex-col items-center gap-2 lg:gap-4 group/bar h-full justify-end text-center">
                                <motion.div
                                    initial={{ height: 0 }}
                                    animate={{ height: `${h}%` }}
                                    className="w-full bg-gray-50 rounded-lg lg:rounded-xl relative overflow-hidden group-hover/bar:bg-primary-50 transition-colors"
                                >
                                    <motion.div
                                        initial={{ height: 0 }}
                                        animate={{ height: `${h - 15}%` }}
                                        className="absolute bottom-0 left-0 w-full bg-primary-500/10 group-hover/bar:bg-primary-500 transition-colors"
                                    />
                                </motion.div>
                                <span className="text-[8px] lg:text-[10px] font-bold text-gray-300 truncate w-full">{['S', 'M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T'][i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Status Breakdown */}
                <div className="bg-[#0F1713] rounded-3xl lg:rounded-[3rem] p-6 lg:p-10 text-white relative overflow-hidden flex flex-col justify-between">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />

                    <div>
                        <h3 className="text-lg lg:text-xl font-black mb-8 lg:mb-10 relative z-10">الحالات المعلقة</h3>
                        <div className="space-y-4 lg:space-y-6 relative z-10">
                            <div className="p-4 lg:p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between border-r-4 border-r-primary-500">
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <Clock size={20} className="text-primary-500" />
                                    <div className="text-xs lg:text-sm font-black">حجوزات تنتظر الدفع</div>
                                </div>
                                <span className="text-lg lg:text-xl font-black">12</span>
                            </div>
                            <div className="p-4 lg:p-5 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between border-r-4 border-r-yellow-500">
                                <div className="flex items-center gap-3 lg:gap-4">
                                    <AlertCircle size={20} className="text-yellow-500" />
                                    <div className="text-xs lg:text-sm font-black">طلبات إلغاء</div>
                                </div>
                                <span className="text-lg lg:text-xl font-black">4</span>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 lg:mt-12 pt-6 lg:pt-10 border-t border-white/5 relative z-10">
                        <div className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.3em] text-primary-500/50 mb-2">System Status</div>
                        <div className="text-xs lg:text-sm font-bold opacity-80 leading-relaxed">
                            النظام يعمل بأداء مثالي بنسبة استجابة 99.9%.
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Table Section */}
            <div className="bg-white rounded-3xl lg:rounded-[3rem] p-6 lg:p-10 border border-gray-100 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8 lg:mb-10">
                    <div>
                        <h3 className="text-lg lg:text-xl font-black text-gray-900 mb-1">أحدث الحجوزات</h3>
                        <p className="text-xs lg:text-sm font-bold text-gray-400">تابع آخر العمليات التي تمت عبر الموقع</p>
                    </div>
                    <Link href="/admin/dashboard/bookings" className="h-12 px-6 bg-gray-50 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-100 transition-colors flex items-center gap-2">
                        <span>عرض الجميع</span>
                        <ArrowUpRight size={16} />
                    </Link>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead>
                            <tr className="border-b border-gray-50">
                                <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest px-4">رقم الحجز</th>
                                <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest px-4">العميل</th>
                                <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest px-4">الفندق / الوجهة</th>
                                <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest px-4">التاريخ</th>
                                <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest px-4">المبلغ</th>
                                <th className="pb-6 text-xs font-black text-gray-400 uppercase tracking-widest px-4">الحالة</th>
                                <th className="pb-6 px-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {recentBookings.map((bk, i) => (
                                <tr key={i} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-6 px-4 font-black text-sm text-gray-900">{bk.id}</td>
                                    <td className="py-6 px-4">
                                        <div className="font-bold text-sm text-gray-900">{bk.user}</div>
                                    </td>
                                    <td className="py-6 px-4">
                                        <div className="font-bold text-sm text-gray-900">{bk.hotel}</div>
                                    </td>
                                    <td className="py-6 px-4 text-xs font-bold text-gray-400">{bk.date}</td>
                                    <td className="py-6 px-4 font-black text-sm text-emerald-600">{bk.amount}</td>
                                    <td className="py-6 px-4">
                                        <span className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black ${bk.status === 'مؤكد' ? 'bg-emerald-50 text-emerald-600' :
                                            bk.status === 'قيد المراجعة' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            <div className={`w-1.5 h-1.5 rounded-full ${bk.status === 'مؤكد' ? 'bg-emerald-500' :
                                                bk.status === 'قيد المراجعة' ? 'bg-amber-500' :
                                                    'bg-red-500'
                                                }`} />
                                            {bk.status}
                                        </span>
                                    </td>
                                    <td className="py-6 px-4 relative">
                                        <button
                                            onClick={() => setActiveBookingMenu(activeBookingMenu === bk.id ? null : bk.id)}
                                            className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-white rounded-xl border border-transparent hover:border-gray-100 transition-all"
                                        >
                                            <MoreVertical size={18} />
                                        </button>

                                        {/* Dropdown Menu */}
                                        <AnimatePresence>
                                            {activeBookingMenu === bk.id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.9, y: -10 }}
                                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.9, y: -10 }}
                                                    className="absolute left-0 top-full mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 min-w-[160px]"
                                                >
                                                    <button
                                                        onClick={() => handleBookingAction('view', bk.id)}
                                                        className="w-full px-4 py-3 text-right text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                    >
                                                        <Eye size={16} className="text-gray-400" />
                                                        عرض التفاصيل
                                                    </button>
                                                    <button
                                                        onClick={() => handleBookingAction('edit', bk.id)}
                                                        className="w-full px-4 py-3 text-right text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                    >
                                                        <Edit3 size={16} className="text-gray-400" />
                                                        تعديل
                                                    </button>
                                                    <button
                                                        onClick={() => handleBookingAction('delete', bk.id)}
                                                        className="w-full px-4 py-3 text-right text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                                    >
                                                        <Trash2 size={16} />
                                                        حذف
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
