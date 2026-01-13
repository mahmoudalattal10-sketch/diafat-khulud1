'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { User, Mail, Phone, Lock, Save, Loader2, Calendar, MapPin, Building2, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { signOut } from 'next-auth/react';

export default function UserProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'bookings'>('profile');

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [bookings, setBookings] = useState<any[]>([]);
    const [loadingBookings, setLoadingBookings] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
        if (session?.user) {
            setFormData(prev => ({
                ...prev,
                name: session.user.name || '',
                email: session.user.email || '',
                phone: (session.user as any).phone || ''
            }));
        }
    }, [session, status, router]);

    useEffect(() => {
        if (activeTab === 'bookings') {
            fetchBookings();
        }
    }, [activeTab]);

    const fetchBookings = async () => {
        setLoadingBookings(true);
        try {
            const res = await fetch('/api/bookings');
            if (res.ok) {
                const data = await res.json();
                setBookings(data);
            }
        } catch (error) {
            console.error('Error fetching bookings', error);
        } finally {
            setLoadingBookings(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
            alert('كلمات المرور غير متطابقة');
            setIsLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    newPassword: formData.newPassword || undefined
                })
            });

            if (res.ok) {
                alert('تم تحديث البيانات بنجاح');
                // Force session update logic usually requires reload or special handling
                window.location.reload();
            } else {
                const data = await res.json();
                alert(data.error || 'حدث خطأ أثناء التحديث');
            }
        } catch (error) {
            console.error('Update error', error);
            alert('حدث خطأ غير متوقع');
        } finally {
            setIsLoading(false);
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <main className="min-h-screen bg-gray-50 font-cairo text-right" dir="rtl">
            <Header />

            <div className="pt-32 pb-20 container-custom">
                <div className="max-w-5xl mx-auto">
                    {/* Profile Header */}
                    <div className="bg-white rounded-3xl p-8 mb-8 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-6">
                            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center text-3xl font-black text-primary-600">
                                {session?.user?.name?.[0]?.toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-black text-gray-900 mb-2">{session?.user?.name}</h1>
                                <p className="text-gray-500 font-bold">{session?.user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={() => signOut()}
                            className="flex items-center gap-2 text-red-500 font-bold hover:bg-red-50 px-6 py-3 rounded-xl transition-all"
                        >
                            <LogOut size={20} />
                            تسجيل الخروج
                        </button>
                    </div>

                    <div className="grid lg:grid-cols-12 gap-8">
                        {/* Sidebar Tabs */}
                        <div className="lg:col-span-3 space-y-2">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'profile'
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <User size={20} />
                                الملف الشخصي
                            </button>
                            <button
                                onClick={() => setActiveTab('bookings')}
                                className={`w-full flex items-center gap-3 px-6 py-4 rounded-xl font-bold transition-all ${activeTab === 'bookings'
                                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/20'
                                        : 'bg-white text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Calendar size={20} />
                                حجوزاتي
                            </button>
                        </div>

                        {/* Content Area */}
                        <div className="lg:col-span-9">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.2 }}
                            >
                                {activeTab === 'profile' ? (
                                    <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
                                        <h2 className="text-xl font-bold mb-8 text-gray-900">تعديل البيانات الشخصية</h2>
                                        <form onSubmit={handleUpdateProfile} className="space-y-6">
                                            <div className="grid md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700">الاسم الكامل</label>
                                                    <div className="relative">
                                                        <User className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="text"
                                                            value={formData.name}
                                                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                                                            className="w-full h-12 pr-12 pl-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700">البريد الإلكتروني</label>
                                                    <div className="relative">
                                                        <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="email"
                                                            value={formData.email}
                                                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                                                            className="w-full h-12 pr-12 pl-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none font-bold"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700">رقم الهاتف</label>
                                                    <div className="relative">
                                                        <Phone className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                        <input
                                                            type="tel"
                                                            value={formData.phone}
                                                            onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                                            placeholder="اختياري"
                                                            className="w-full h-12 pr-12 pl-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none font-bold"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-6 border-t border-gray-100 space-y-6">
                                                <h3 className="font-bold text-lg">تغيير كلمة المرور</h3>
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-gray-700">كلمة المرور الجديدة</label>
                                                        <div className="relative">
                                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                            <input
                                                                type="password"
                                                                value={formData.newPassword}
                                                                onChange={e => setFormData({ ...formData, newPassword: e.target.value })}
                                                                placeholder="اتركه فارغاً إذا لم ترد التغيير"
                                                                className="w-full h-12 pr-12 pl-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none font-bold"
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-sm font-bold text-gray-700">تأكيد كلمة المرور</label>
                                                        <div className="relative">
                                                            <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                                            <input
                                                                type="password"
                                                                value={formData.confirmPassword}
                                                                onChange={e => setFormData({ ...formData, confirmPassword: e.target.value })}
                                                                className="w-full h-12 pr-12 pl-4 rounded-xl border border-gray-200 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none font-bold"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-4">
                                                <button
                                                    type="submit"
                                                    disabled={isLoading}
                                                    className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-gray-800 transition-all disabled:opacity-50"
                                                >
                                                    {isLoading ? <Loader2 className="animate-spin" /> : <Save size={20} />}
                                                    حفظ التغييرات
                                                </button>
                                            </div>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <h2 className="text-xl font-bold text-gray-900 mb-4">سجل الحجوزات</h2>
                                        {loadingBookings ? (
                                            <div className="text-center py-12"><Loader2 className="animate-spin mx-auto w-10 h-10 text-primary-500" /></div>
                                        ) : bookings.length === 0 ? (
                                            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100">
                                                <Calendar className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                                <h3 className="font-bold text-xl text-gray-900 mb-2">لا توجد حجوزات سابقة</h3>
                                                <p className="text-gray-500 mb-6">لم تقم بأي حجز حتى الآن</p>
                                                <button onClick={() => router.push('/hotels')} className="bg-primary-500 text-white px-6 py-3 rounded-xl font-bold">
                                                    تصفح الفنادق
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {bookings.map((booking) => (
                                                    <div key={booking.id} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex flex-col md:flex-row gap-6">
                                                        <div className="w-full md:w-48 h-32 bg-gray-100 rounded-xl relative overflow-hidden shrink-0">
                                                            {/* Placeholder generic image or hotel image if available */}
                                                            <div className="absolute inset-0 flex items-center justify-center bg-primary-50 text-primary-200">
                                                                <Building2 size={40} />
                                                            </div>
                                                        </div>
                                                        <div className="flex-1">
                                                            <div className="flex justify-between items-start mb-2">
                                                                <h3 className="font-black text-lg text-gray-900">{booking.hotel?.name}</h3>
                                                                <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600' :
                                                                        booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-600' :
                                                                            'bg-red-100 text-red-600'
                                                                    }`}>
                                                                    {booking.status === 'CONFIRMED' ? 'مؤكد' : booking.status === 'PENDING' ? 'قيد الانتظار' : 'ملغي'}
                                                                </span>
                                                            </div>
                                                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                                                <MapPin size={14} />
                                                                {booking.hotel?.location}
                                                            </div>
                                                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-xl">
                                                                <div>
                                                                    <span className="block text-[10px] text-gray-400 font-bold uppercase">الوصول</span>
                                                                    <span className="font-bold text-sm text-gray-900">{new Date(booking.checkIn).toLocaleDateString('ar-EG')}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="block text-[10px] text-gray-400 font-bold uppercase">المغادرة</span>
                                                                    <span className="font-bold text-sm text-gray-900">{new Date(booking.checkOut).toLocaleDateString('ar-EG')}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="block text-[10px] text-gray-400 font-bold uppercase">الغرفة</span>
                                                                    <span className="font-bold text-sm text-gray-900">{booking.room?.type}</span>
                                                                </div>
                                                                <div>
                                                                    <span className="block text-[10px] text-gray-400 font-bold uppercase">الإجمالي</span>
                                                                    <span className="font-black text-lg text-primary-600">{booking.totalPrice} ر.س</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </motion.div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    );
}
