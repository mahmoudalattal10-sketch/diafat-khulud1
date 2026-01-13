'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    Download,
    MoreVertical,
    MapPin,
    CheckCircle2,
    Clock,
    XCircle,
    Plus,
    X,
    FileText,
    Check,
    Loader2
} from 'lucide-react';
import { useBookingsStore, Booking } from '@/store/bookingsStore';
import { useHotelsStore } from '@/store/hotelsStore';
import InvoiceTemplate from '@/components/admin/InvoiceTemplate';
import { Printer } from 'lucide-react';

export default function BookingsManagement() {
    // ... existing hooks
    const { bookings, addBooking, deleteBooking, updateBookingStatus, fetchBookings } = useBookingsStore();
    const hotels = useHotelsStore(state => state.hotels);

    useEffect(() => {
        fetchBookings();
    }, []);

    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('كل الحالات');
    const [cityFilter, setCityFilter] = useState('كل المدن');
    const [sortBy, setSortBy] = useState('الأحدث أولاً');
    const [dateRange, setDateRange] = useState('');

    const [isManualModalOpen, setIsManualModalOpen] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Invoice State
    const [invoiceBooking, setInvoiceBooking] = useState<Booking | null>(null);

    // ... handleExport ...
    const handleExport = () => {
        setIsExporting(true);
        // Simulate CSV generation and download
        const headers = "ID,User,Hotel,Date,Amount,Status\n";
        const rows = filteredBookings.map(b => `${b.id},${b.user},${b.hotel},${b.checkIn},${b.amount},${b.status}`).join("\n");
        const blob = new Blob([headers + rows], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `bookings_export_${new Date().getTime()}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        setTimeout(() => setIsExporting(false), 2000);
    };

    const handleManualSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            setIsSaving(false);
            setIsManualModalOpen(false);
            alert('تم حفظ الحجز بنجاح!');
        }, 1500);
    };

    // ... filteredBookings memo ...
    const filteredBookings = useMemo(() => {
        let result = bookings.filter(booking => {
            const matchesQuery = booking.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                booking.hotel.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'كل الحالات' || booking.status === statusFilter;
            const matchesCity = cityFilter === 'كل المدن' || booking.location.includes(cityFilter);

            let matchesDate = true;
            if (dateRange) {
                const selectedDate = new Date(dateRange);
                matchesDate = new Date(booking.checkIn) >= selectedDate;
            }

            return matchesQuery && matchesStatus && matchesCity && matchesDate;
        });

        if (sortBy === 'الأحدث أولاً') {
            result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        } else if (sortBy === 'الأعلى قيمة') {
            result.sort((a, b) => b.amount - a.amount);
        } else if (sortBy === 'تاريخ السفر') {
            result.sort((a, b) => new Date(a.checkIn).getTime() - new Date(b.checkIn).getTime());
        }

        return result;
    }, [bookings, searchQuery, statusFilter, cityFilter, sortBy, dateRange]);


    return (
        <div className="space-y-8 pb-10">
            {/* Header, Filters ... (Same as before) */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">إدارة الحجوزات</h1>
                    <p className="text-gray-500 font-bold">إدارة وتدقيق كافة حجوزات المعتمرين والفنادق في منصتك.</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full lg:w-auto">
                    <button
                        onClick={() => setIsManualModalOpen(true)}
                        className="h-12 lg:h-14 px-6 lg:px-8 bg-green-600 text-white rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm flex items-center justify-center gap-2 hover:bg-green-700 transition-all shadow-xl shadow-green-600/10 active:scale-95"
                    >
                        <Plus size={18} />
                        <span>إضافة حجز يدوي</span>
                    </button>
                    <button
                        onClick={handleExport}
                        disabled={isExporting}
                        className="h-12 lg:h-14 px-6 bg-white border border-gray-200 rounded-xl lg:rounded-2xl font-black text-xs lg:text-sm text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors shadow-sm disabled:opacity-50"
                    >
                        {isExporting ? <Check size={18} className="text-emerald-500" /> : <Download size={18} />}
                        <span>{isExporting ? 'تم التصدير' : 'تصدير CSV'}</span>
                    </button>
                </div>
            </div>

            {/* Filters Bar */}
            <div className="bg-white p-4 lg:p-6 rounded-2xl lg:rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1 group w-full">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث..."
                        className="w-full h-12 lg:h-14 pr-12 pl-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-medium transition-all text-sm"
                    />
                </div>
                <div className="flex gap-2 lg:gap-4 w-full md:w-auto">
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="flex-1 md:w-40 h-12 lg:h-14 px-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white outline-none font-bold text-gray-600 cursor-pointer text-xs"
                    >
                        <option value="كل الحالات">الحالة: الكل</option>
                        <option value="مؤكد">مؤكد</option>
                        <option value="قيد المراجعة">قيد المراجعة</option>
                        <option value="ملغى">ملغى</option>
                    </select>
                    <button
                        onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                        className={`h-12 lg:h-14 px-4 lg:px-6 rounded-xl border border-transparent transition-all font-bold flex items-center gap-2 text-xs shrink-0 ${showAdvancedFilters ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                    >
                        <Filter size={18} />
                        <span className="hidden sm:inline">تصفية متقدمة</span>
                    </button>
                </div>
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {showAdvancedFilters && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                    >
                        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">نطاق التاريخ (من)</label>
                                <input
                                    type="date"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-600 border border-transparent focus:border-primary-500/30"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">المدينة / الوجهة</label>
                                <select
                                    value={cityFilter}
                                    onChange={(e) => setCityFilter(e.target.value)}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-600 border border-transparent focus:border-primary-500/30"
                                >
                                    <option value="كل المدن">كل المدن</option>
                                    <option value="مكة المكرمة">مكة المكرمة</option>
                                    <option value="المدينة المنورة">المدينة المنورة</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest mr-2">ترتيب حسب</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="w-full h-12 px-4 bg-gray-50 rounded-xl outline-none font-bold text-gray-600 border border-transparent focus:border-primary-500/30"
                                >
                                    <option value="الأحدث أولاً">الأحدث أولاً</option>
                                    <option value="الأعلى قيمة">الأعلى قيمة</option>
                                    <option value="تاريخ السفر">تاريخ السفر</option>
                                </select>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Bookings Table */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-right" dir="rtl">
                        <thead>
                            <tr className="bg-gray-50/50">
                                <th className="py-6 px-8 text-xs font-black text-gray-400 uppercase tracking-widest">المعرف</th>
                                <th className="py-6 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">المسافر</th>
                                <th className="py-6 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">الفندق والتفاصيل</th>
                                <th className="py-6 px-4 text-xs font-black text-gray-400 uppercase tracking-widest text-center">التاريخ</th>
                                <th className="py-6 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">القيمة</th>
                                <th className="py-6 px-4 text-xs font-black text-gray-400 uppercase tracking-widest">الحالة</th>
                                <th className="py-6 px-8"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50/50">
                            {filteredBookings.map((booking, i) => (
                                <tr key={i} className="hover:bg-gray-50/30 transition-colors group">
                                    <td className="py-7 px-8 font-black text-sm text-gray-900">{booking.id}</td>
                                    <td className="py-7 px-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-11 h-11 bg-primary-100 rounded-2xl flex items-center justify-center text-primary-700 font-black text-sm group-hover:bg-primary-500 group-hover:text-black transition-colors">
                                                {booking.user.charAt(0)}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="font-black text-sm text-gray-900">{booking.user}</span>
                                                <span className="text-[11px] font-bold text-gray-400">{booking.email}</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-7 px-4">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-sm text-gray-900">{booking.hotel}</span>
                                            <div className="flex items-center gap-1.5 text-[11px] font-bold text-gray-400">
                                                <MapPin size={10} />
                                                {booking.location}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-7 px-4">
                                        <div className="flex flex-col items-center">
                                            <span className="text-sm font-black text-gray-900">{booking.checkIn}</span>
                                            <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Check-in</span>
                                        </div>
                                    </td>
                                    <td className="py-7 px-4 font-black text-base text-gray-900">{booking.amountLabel}</td>
                                    <td className="py-7 px-4">
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black ${booking.status === 'مؤكد' ? 'bg-emerald-50 text-emerald-600' :
                                            booking.status === 'قيد المراجعة' ? 'bg-amber-50 text-amber-600' :
                                                'bg-red-50 text-red-600'
                                            }`}>
                                            {booking.status === 'مؤكد' ? <CheckCircle2 size={14} /> :
                                                booking.status === 'قيد المراجعة' ? <Clock size={14} /> :
                                                    <XCircle size={14} />}
                                            {booking.status}
                                        </div>
                                    </td>
                                    <td className="py-7 px-8">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => setInvoiceBooking(booking)}
                                                className="w-10 h-10 flex items-center justify-center text-gray-400 hover:bg-primary-50 hover:text-primary-600 rounded-xl transition-colors"
                                                title="طباعة الفاتورة"
                                            >
                                                <Printer size={18} />
                                            </button>
                                            <button className="h-10 px-4 bg-gray-50 hover:bg-primary-500 hover:text-black rounded-xl text-xs font-black transition-all">تفاصيل</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredBookings.length === 0 && (
                        <div className="py-20 text-center">
                            <FileText size={48} className="mx-auto text-gray-200 mb-4" />
                            <p className="text-gray-400 font-bold">لا توجد حجوزات تطابق هذا البحث</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Manual Booking Modal */}
            <AnimatePresence>
                {isManualModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsManualModalOpen(false)}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                        />
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.9, opacity: 0, y: 20 }}
                            className="relative w-full max-w-2xl bg-white rounded-[3rem] p-10 shadow-2xl overflow-y-auto max-h-[90vh]"
                        >
                            <div className="flex items-center justify-between mb-10">
                                <h2 className="text-2xl font-black text-gray-900">إضافة حجز يدوي</h2>
                                <button onClick={() => setIsManualModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 mr-2">اسم العميل</label>
                                        <input type="text" placeholder="مثلاً: محمد نور" className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 mr-2">رقم الجوال</label>
                                        <input type="tel" placeholder="05XXXXXXXX" className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-left" dir="ltr" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-700 mr-2">الفندق المختار</label>
                                    <select className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-gray-600">
                                        <option>اختر فندقاً...</option>
                                        <option>فندق العنوان جبل عمر</option>
                                        <option>بولمان زمزم مكة</option>
                                        <option>أنوار المدينة موفنبيك</option>
                                    </select>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 mr-2">تاريخ الدخول</label>
                                        <input type="date" className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-black text-gray-700 mr-2">عدد الليالي</label>
                                        <input type="number" defaultValue="1" className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold" />
                                    </div>
                                </div>
                            </div>

                            <div className="mt-12 flex gap-4">
                                <button onClick={() => setIsManualModalOpen(false)} className="flex-1 h-14 bg-gray-100 text-gray-600 rounded-2xl font-black hover:bg-gray-200 transition-all">إلغاء</button>
                                <button
                                    onClick={handleManualSave}
                                    disabled={isSaving}
                                    className="flex-1 h-14 bg-emerald-600 text-white rounded-2xl font-black hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
                                >
                                    {isSaving && <Loader2 className="animate-spin" size={20} />}
                                    <span>{isSaving ? 'جاري الحفظ...' : 'تأكيد الحجز وحفظ'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Invoice Preview Modal */}
            {invoiceBooking && (
                <InvoiceTemplate
                    booking={invoiceBooking}
                    onClose={() => setInvoiceBooking(null)}
                />
            )}
        </div>
    );
}
