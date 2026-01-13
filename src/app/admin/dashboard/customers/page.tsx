'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Search,
    Filter,
    UserPlus,
    MoreVertical,
    Mail,
    Phone,
    Calendar,
    BadgeCheck,
    MessageSquare,
    Ban,
    X,
    User,
    Edit3,
    Trash2,
    Eye,
    Send,
    Loader2
} from 'lucide-react';
import { useCustomersStore, Customer } from '@/store/customersStore';

export default function CustomersManagement() {
    // Use global store
    const { customers, addCustomer, updateCustomer, toggleCustomerStatus, deleteCustomer, getCustomer } = useCustomersStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showMessageModal, setShowMessageModal] = useState<string | null>(null);
    const [activeMenu, setActiveMenu] = useState<string | null>(null);
    const [newCustomer, setNewCustomer] = useState({ name: '', email: '', phone: '' });
    const [messageText, setMessageText] = useState('');
    const [isSending, setIsSending] = useState(false);

    const filteredCustomers = useMemo(() => {
        return customers.filter(customer => {
            const matchesSearch =
                customer.name.includes(searchQuery) ||
                customer.email.includes(searchQuery) ||
                customer.phone.includes(searchQuery) ||
                customer.id.includes(searchQuery);

            const matchesStatus = filterStatus === 'all' ||
                (filterStatus === 'active' && customer.status === 'نشط') ||
                (filterStatus === 'blocked' && customer.status === 'محظور');

            return matchesSearch && matchesStatus;
        });
    }, [customers, searchQuery, filterStatus]);

    const handleAddCustomer = () => {
        if (!newCustomer.name || !newCustomer.email || !newCustomer.phone) {
            alert('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        addCustomer({
            name: newCustomer.name,
            email: newCustomer.email,
            phone: newCustomer.phone,
            status: 'نشط',
        });

        setNewCustomer({ name: '', email: '', phone: '' });
        setShowAddModal(false);
        alert(`تم إضافة العميل "${newCustomer.name}" بنجاح!`);
    };

    const handleSendMessage = async () => {
        if (!messageText.trim()) {
            alert('يرجى كتابة رسالة');
            return;
        }

        setIsSending(true);
        await new Promise(resolve => setTimeout(resolve, 1500));
        setIsSending(false);

        const customer = getCustomer(showMessageModal || '');
        alert(`تم إرسال الرسالة إلى "${customer?.name}" بنجاح!`);
        setMessageText('');
        setShowMessageModal(null);
    };

    const handleCustomerAction = (action: string, customerId: string) => {
        const customer = getCustomer(customerId);

        switch (action) {
            case 'view':
                alert(`عرض ملف العميل: ${customer?.name}\n\nالبريد: ${customer?.email}\nالجوال: ${customer?.phone}\nالحجوزات: ${customer?.totalBookings}\nالمصروفات: ${customer?.totalSpent.toLocaleString()} ر.س`);
                break;
            case 'edit':
                alert(`تعديل بيانات العميل: ${customer?.name}`);
                break;
            case 'block':
                toggleCustomerStatus(customerId);
                break;
            case 'delete':
                if (confirm(`هل أنت متأكد من حذف العميل "${customer?.name}"؟`)) {
                    deleteCustomer(customerId);
                }
                break;
        }
        setActiveMenu(null);
    };

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">قاعدة العملاء</h1>
                    <p className="text-gray-500 font-bold">إدارة بيانات المسافرين وحساباتهم وتقديم الدعم المباشر.</p>
                </div>
                <button
                    onClick={() => setShowAddModal(true)}
                    className="h-14 px-8 bg-black text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                >
                    <UserPlus size={18} />
                    <span>إضافة عميل جديد</span>
                </button>
            </div>

            {/* Search & Filter Bar */}
            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex flex-col md:flex-row gap-4">
                <div className="relative flex-1 group">
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                        <Search size={20} />
                    </div>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث باسم العميل، الإيميل، أو رقم الجوال..."
                        className="w-full h-14 pr-12 pl-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-medium transition-all"
                    />
                </div>
                <button
                    onClick={() => setShowFilterModal(true)}
                    className={`h-14 px-6 rounded-xl border border-transparent hover:bg-gray-100 transition-colors font-bold flex items-center gap-2 ${filterStatus !== 'all' ? 'bg-primary-500 text-black' : 'bg-gray-50 text-gray-600'}`}
                >
                    <Filter size={18} />
                    <span>تصفية العملاء</span>
                    {filterStatus !== 'all' && <span className="w-2 h-2 rounded-full bg-black"></span>}
                </button>
            </div>

            {/* Results Count */}
            <div className="text-sm font-bold text-gray-400">
                عرض {filteredCustomers.length} عميل من أصل {customers.length}
            </div>

            {/* Customer Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCustomers.map((customer, i) => (
                    <motion.div
                        key={customer.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.05 }}
                        className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-xl transition-all group relative"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-primary-50 rounded-[1.5rem] flex items-center justify-center text-primary-600 font-black text-xl group-hover:scale-110 transition-transform">
                                {customer.name.charAt(0)}
                            </div>
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${customer.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                                {customer.status}
                            </div>
                        </div>
                        <h3 className="text-xl font-black text-gray-900 mb-1">{customer.name}</h3>
                        <div className="text-sm font-bold text-gray-400 mb-6 font-mono">{customer.id}</div>

                        <div className="space-y-3 mb-8">
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                <Mail size={16} className="text-gray-300" />
                                {customer.email}
                            </div>
                            <div className="flex items-center gap-3 text-sm font-bold text-gray-500">
                                <Phone size={16} className="text-gray-300" />
                                {customer.phone}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-50">
                            <div>
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">حجوزات</div>
                                <div className="text-lg font-black text-gray-900">{customer.totalBookings}</div>
                            </div>
                            <div>
                                <div className="text-[10px] font-black text-gray-300 uppercase tracking-widest mb-1">المصروفات</div>
                                <div className="text-lg font-black text-emerald-600">{customer.totalSpent.toLocaleString()} ر.س</div>
                            </div>
                        </div>

                        <div className="flex gap-2 mt-8">
                            <button
                                onClick={() => setShowMessageModal(customer.id)}
                                className="flex-1 h-12 bg-gray-50 hover:bg-black hover:text-white rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2"
                            >
                                <MessageSquare size={14} />
                                <span>مراسلة</span>
                            </button>
                            <div className="relative">
                                <button
                                    onClick={() => setActiveMenu(activeMenu === customer.id ? null : customer.id)}
                                    className="w-12 h-12 bg-gray-50 hover:bg-primary-500 hover:text-black rounded-xl text-gray-400 flex items-center justify-center transition-all"
                                >
                                    <MoreVertical size={18} />
                                </button>

                                {/* Dropdown Menu */}
                                <AnimatePresence>
                                    {activeMenu === customer.id && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.9, y: 10 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 10 }}
                                            className="absolute left-0 bottom-full mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 min-w-[180px]"
                                        >
                                            <button
                                                onClick={() => handleCustomerAction('view', customer.id)}
                                                className="w-full px-4 py-3 text-right text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                            >
                                                <Eye size={16} className="text-gray-400" />
                                                عرض الملف
                                            </button>
                                            <button
                                                onClick={() => handleCustomerAction('edit', customer.id)}
                                                className="w-full px-4 py-3 text-right text-sm font-bold text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                            >
                                                <Edit3 size={16} className="text-gray-400" />
                                                تعديل البيانات
                                            </button>
                                            <button
                                                onClick={() => handleCustomerAction('block', customer.id)}
                                                className={`w-full px-4 py-3 text-right text-sm font-bold hover:bg-gray-50 flex items-center gap-3 transition-colors ${customer.status === 'نشط' ? 'text-amber-600' : 'text-emerald-600'}`}
                                            >
                                                <Ban size={16} />
                                                {customer.status === 'نشط' ? 'حظر العميل' : 'إلغاء الحظر'}
                                            </button>
                                            <button
                                                onClick={() => handleCustomerAction('delete', customer.id)}
                                                className="w-full px-4 py-3 text-right text-sm font-bold text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                                            >
                                                <Trash2 size={16} />
                                                حذف العميل
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {filteredCustomers.length === 0 && (
                <div className="text-center py-20">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Search size={32} className="text-gray-300" />
                    </div>
                    <h3 className="text-xl font-black text-gray-900 mb-2">لا توجد نتائج</h3>
                    <p className="text-gray-500 font-bold">جرب البحث بكلمات مختلفة أو قم بتغيير الفلتر</p>
                </div>
            )}

            {/* Add Customer Modal */}
            <AnimatePresence>
                {showAddModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowAddModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] p-8 w-full max-w-md shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-black text-gray-900">إضافة عميل جديد</h3>
                                <button onClick={() => setShowAddModal(false)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">الاسم الكامل *</label>
                                    <input
                                        type="text"
                                        value={newCustomer.name}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                                        placeholder="أدخل اسم العميل"
                                        className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">البريد الإلكتروني *</label>
                                    <input
                                        type="email"
                                        value={newCustomer.email}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                                        placeholder="example@email.com"
                                        className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-bold"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">رقم الجوال *</label>
                                    <input
                                        type="tel"
                                        value={newCustomer.phone}
                                        onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                                        placeholder="05XXXXXXXX"
                                        className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-bold"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setShowAddModal(false)}
                                    className="flex-1 h-14 bg-gray-100 text-gray-600 rounded-xl font-black hover:bg-gray-200 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleAddCustomer}
                                    className="flex-1 h-14 bg-black text-white rounded-xl font-black hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={18} />
                                    إضافة العميل
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                                <h3 className="text-xl font-black text-gray-900">تصفية العملاء</h3>
                                <button onClick={() => setShowFilterModal(false)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-3">الحالة</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            { value: 'all', label: 'الكل' },
                                            { value: 'active', label: 'نشط' },
                                            { value: 'blocked', label: 'محظور' }
                                        ].map(status => (
                                            <button
                                                key={status.value}
                                                onClick={() => setFilterStatus(status.value)}
                                                className={`py-3 rounded-xl font-bold text-sm transition-all ${filterStatus === status.value ? 'bg-black text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                {status.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => {
                                        setFilterStatus('all');
                                        setShowFilterModal(false);
                                    }}
                                    className="flex-1 h-14 bg-gray-100 text-gray-600 rounded-xl font-black hover:bg-gray-200 transition-colors"
                                >
                                    إعادة تعيين
                                </button>
                                <button
                                    onClick={() => setShowFilterModal(false)}
                                    className="flex-1 h-14 bg-black text-white rounded-xl font-black hover:bg-gray-800 transition-colors"
                                >
                                    تطبيق
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Message Modal */}
            <AnimatePresence>
                {showMessageModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowMessageModal(null)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-[2rem] p-8 w-full max-w-lg shadow-2xl"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div>
                                    <h3 className="text-xl font-black text-gray-900">إرسال رسالة</h3>
                                    <p className="text-sm text-gray-400 font-bold mt-1">
                                        إلى: {customers.find(c => c.id === showMessageModal)?.name}
                                    </p>
                                </div>
                                <button onClick={() => setShowMessageModal(null)} className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-sm font-black text-gray-400 uppercase tracking-widest mb-2">نص الرسالة</label>
                                    <textarea
                                        value={messageText}
                                        onChange={(e) => setMessageText(e.target.value)}
                                        placeholder="اكتب رسالتك هنا..."
                                        rows={5}
                                        className="w-full p-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-bold resize-none"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 mt-8">
                                <button
                                    onClick={() => setShowMessageModal(null)}
                                    className="flex-1 h-14 bg-gray-100 text-gray-600 rounded-xl font-black hover:bg-gray-200 transition-colors"
                                >
                                    إلغاء
                                </button>
                                <button
                                    onClick={handleSendMessage}
                                    disabled={isSending}
                                    className="flex-1 h-14 bg-primary-500 text-black rounded-xl font-black hover:bg-primary-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSending ? (
                                        <>
                                            <Loader2 size={18} className="animate-spin" />
                                            جاري الإرسال...
                                        </>
                                    ) : (
                                        <>
                                            <Send size={18} />
                                            إرسال
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
