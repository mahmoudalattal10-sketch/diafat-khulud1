'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Settings,
    User,
    Bell,
    Shield,
    Globe,
    Palette,
    Mail,
    Database,
    ChevronLeft,
    Save,
    RotateCcw,
    Check,
    Loader2,
    Plus,
    Trash2,
    Eye,
    EyeOff,
    X
} from 'lucide-react';

type SettingsTab = 'general' | 'admins' | 'notifications' | 'appearance' | 'email' | 'database';

interface Admin {
    id: string;
    name: string;
    email: string;
    role: 'super_admin' | 'admin' | 'editor';
}

interface SettingsData {
    companyName: string;
    systemEmail: string;
    maintenanceMode: boolean;
    instantBooking: boolean;
    emailNotifications: boolean;
    smsNotifications: boolean;
    pushNotifications: boolean;
    bookingAlerts: boolean;
    marketingEmails: boolean;
    primaryColor: string;
    darkMode: boolean;
    rtlLayout: boolean;
    smtpHost: string;
    smtpPort: string;
    smtpUser: string;
    smtpPassword: string;
}

const defaultSettings: SettingsData = {
    companyName: 'ضيافة خلود',
    systemEmail: 'admin@khulud.com',
    maintenanceMode: false,
    instantBooking: true,
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    bookingAlerts: true,
    marketingEmails: false,
    primaryColor: '#D4AF37',
    darkMode: false,
    rtlLayout: true,
    smtpHost: 'smtp.khulud.com',
    smtpPort: '587',
    smtpUser: 'noreply@khulud.com',
    smtpPassword: '',
};

export default function AdminSettings() {
    const [activeTab, setActiveTab] = useState<SettingsTab>('general');
    const [isSaving, setIsSaving] = useState(false);
    const [hasChanges, setHasChanges] = useState(false);
    const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Settings State
    const [settings, setSettings] = useState<SettingsData>(defaultSettings);

    // Admin Users
    const [admins, setAdmins] = useState<Admin[]>([
        { id: '1', name: 'محمد نور', email: 'mohammed@khulud.com', role: 'super_admin' },
        { id: '2', name: 'سارة أحمد', email: 'sara@khulud.com', role: 'admin' },
        { id: '3', name: 'أحمد علي', email: 'ahmed@khulud.com', role: 'editor' },
    ]);

    // Load settings from localStorage on mount
    useEffect(() => {
        try {
            const saved = localStorage.getItem('adminSettings');
            if (saved) {
                setSettings({ ...defaultSettings, ...JSON.parse(saved) });
            }
        } catch (e) {
            console.error('Failed to load settings:', e);
        }
        setIsLoaded(true);
    }, []);

    const tabs = [
        { id: 'general', name: 'عام', icon: Settings },
        { id: 'admins', name: 'المسؤولين والصلاحيات', icon: Shield },
        { id: 'notifications', name: 'إعدادات الإشعارات', icon: Bell },
        { id: 'appearance', name: 'المظهر واللمسة الفنية', icon: Palette },
        { id: 'email', name: 'إعدادات البريد', icon: Mail },
        { id: 'database', name: 'قاعدة البيانات', icon: Database },
    ];

    const handleSave = async () => {
        setIsSaving(true);
        try {
            // Save to localStorage
            localStorage.setItem('adminSettings', JSON.stringify(settings));
            await new Promise(resolve => setTimeout(resolve, 800));
            setIsSaving(false);
            setHasChanges(false);
            setSaveMessage({ type: 'success', text: 'تم حفظ الإعدادات بنجاح!' });
            setTimeout(() => setSaveMessage(null), 3000);
        } catch (error) {
            setIsSaving(false);
            setSaveMessage({ type: 'error', text: 'حدث خطأ أثناء الحفظ' });
            setTimeout(() => setSaveMessage(null), 3000);
        }
    };

    const handleReset = () => {
        if (confirm('هل أنت متأكد من إلغاء جميع التعديلات؟')) {
            setSettings(defaultSettings);
            setHasChanges(false);
        }
    };

    const updateSetting = <K extends keyof SettingsData>(key: K, value: SettingsData[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
        setHasChanges(true);
    };

    const markChanged = () => setHasChanges(true);

    const ToggleSwitch = ({ enabled, onChange, label, description }: { enabled: boolean, onChange: (val: boolean) => void, label: string, description?: string }) => (
        <div className={`flex items-center justify-between p-6 rounded-2xl border transition-all ${enabled ? 'bg-emerald-50 border-emerald-100' : 'bg-gray-50 border-transparent'}`}>
            <div>
                <div className={`font-black mb-1 ${enabled ? 'text-emerald-900' : 'text-gray-900'}`}>{label}</div>
                {description && (
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${enabled ? 'text-emerald-600' : 'text-gray-400'}`}>{description}</div>
                )}
            </div>
            <button
                onClick={() => { onChange(!enabled); markChanged(); }}
                className={`w-14 h-8 rounded-full relative cursor-pointer transition-colors ${enabled ? 'bg-emerald-500' : 'bg-gray-300'}`}
            >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all shadow-sm ${enabled ? 'right-1' : 'left-1'}`} />
            </button>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div className="space-y-10">
                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-6">المعلومات الأساسية</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-2">اسم الشركة</label>
                                    <input
                                        type="text"
                                        value={settings.companyName}
                                        onChange={(e) => updateSetting('companyName', e.target.value)}
                                        className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-bold"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-black text-gray-400 uppercase tracking-widest mr-2">البريد النظامي</label>
                                    <input
                                        type="email"
                                        value={settings.systemEmail}
                                        onChange={(e) => updateSetting('systemEmail', e.target.value)}
                                        className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-bold"
                                    />
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-xl font-black text-gray-900 mb-6">إعدادات الموقع</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <ToggleSwitch
                                    enabled={settings.maintenanceMode}
                                    onChange={(val) => updateSetting('maintenanceMode', val)}
                                    label="وضع الصيانة"
                                    description="إغلاق الموقع للزوار"
                                />
                                <ToggleSwitch
                                    enabled={settings.instantBooking}
                                    onChange={(val) => updateSetting('instantBooking', val)}
                                    label="الحجز المباشر"
                                    description="تفعيل التأكيد الفوري"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 'admins':
                return (
                    <div className="space-y-8">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-black text-gray-900">فريق الإدارة</h3>
                            <button
                                onClick={() => alert('سيتم فتح نموذج إضافة مسؤول جديد')}
                                className="h-12 px-6 bg-black text-white rounded-xl font-black text-sm flex items-center gap-2 hover:bg-gray-800 transition-colors"
                            >
                                <Plus size={16} />
                                إضافة مسؤول
                            </button>
                        </div>

                        <div className="space-y-4">
                            {admins.map(admin => (
                                <div key={admin.id} className="bg-gray-50 p-6 rounded-2xl flex items-center justify-between hover:bg-gray-100 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 font-black">
                                            {admin.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-gray-900">{admin.name}</div>
                                            <div className="text-sm text-gray-400">{admin.email}</div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${admin.role === 'super_admin' ? 'bg-purple-50 text-purple-600' :
                                            admin.role === 'admin' ? 'bg-blue-50 text-blue-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                            {admin.role === 'super_admin' ? 'مدير عام' : admin.role === 'admin' ? 'مسؤول' : 'محرر'}
                                        </span>
                                        <button
                                            onClick={() => {
                                                if (admin.role !== 'super_admin' && confirm(`هل تريد حذف ${admin.name}؟`)) {
                                                    setAdmins(admins.filter(a => a.id !== admin.id));
                                                }
                                            }}
                                            disabled={admin.role === 'super_admin'}
                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${admin.role === 'super_admin' ? 'text-gray-200 cursor-not-allowed' : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                                                }`}
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 'notifications':
                return (
                    <div className="space-y-8">
                        <h3 className="text-xl font-black text-gray-900">تفضيلات الإشعارات</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <ToggleSwitch enabled={settings.emailNotifications} onChange={(val) => updateSetting('emailNotifications', val)} label="إشعارات البريد" description="استلام التنبيهات عبر الإيميل" />
                            <ToggleSwitch enabled={settings.smsNotifications} onChange={(val) => updateSetting('smsNotifications', val)} label="رسائل SMS" description="استلام تنبيهات الجوال" />
                            <ToggleSwitch enabled={settings.pushNotifications} onChange={(val) => updateSetting('pushNotifications', val)} label="إشعارات المتصفح" description="تنبيهات فورية" />
                            <ToggleSwitch enabled={settings.bookingAlerts} onChange={(val) => updateSetting('bookingAlerts', val)} label="تنبيهات الحجوزات" description="إعلام بكل حجز جديد" />
                            <ToggleSwitch enabled={settings.marketingEmails} onChange={(val) => updateSetting('marketingEmails', val)} label="رسائل تسويقية" description="عروض وتحديثات" />
                        </div>
                    </div>
                );

            case 'appearance':
                return (
                    <div className="space-y-8">
                        <h3 className="text-xl font-black text-gray-900">إعدادات المظهر</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">اللون الرئيسي</label>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        value={settings.primaryColor}
                                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                                        className="w-14 h-14 rounded-xl border-0 cursor-pointer"
                                    />
                                    <input
                                        type="text"
                                        value={settings.primaryColor}
                                        onChange={(e) => updateSetting('primaryColor', e.target.value)}
                                        className="flex-1 h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-mono font-bold uppercase"
                                    />
                                </div>
                            </div>
                            <ToggleSwitch enabled={settings.darkMode} onChange={(val) => updateSetting('darkMode', val)} label="الوضع الداكن" description="تفعيل المظهر الليلي" />
                            <ToggleSwitch enabled={settings.rtlLayout} onChange={(val) => updateSetting('rtlLayout', val)} label="اتجاه يمين لليسار" description="RTL Layout" />
                        </div>
                    </div>
                );

            case 'email':
                return (
                    <div className="space-y-8">
                        <h3 className="text-xl font-black text-gray-900">إعدادات خادم البريد</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">SMTP Host</label>
                                <input type="text" defaultValue="smtp.khulud.com" className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-mono font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">SMTP Port</label>
                                <input type="text" defaultValue="587" className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-mono font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">اسم المستخدم</label>
                                <input type="text" defaultValue="noreply@khulud.com" className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-mono font-bold" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-black text-gray-400 uppercase tracking-widest">كلمة المرور</label>
                                <input type="password" defaultValue="••••••••" className="w-full h-14 px-6 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500/30 outline-none font-mono font-bold" />
                            </div>
                        </div>
                        <button className="h-12 px-6 bg-gray-100 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-200 transition-colors">
                            إرسال بريد تجريبي
                        </button>
                    </div>
                );

            case 'database':
                return (
                    <div className="space-y-8">
                        <h3 className="text-xl font-black text-gray-900">قاعدة البيانات</h3>
                        <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
                                <span className="font-black text-emerald-800">قاعدة البيانات تعمل بشكل طبيعي</span>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="bg-white/50 p-4 rounded-xl">
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">الحجم</div>
                                    <div className="font-black text-emerald-900">2.4 GB</div>
                                </div>
                                <div className="bg-white/50 p-4 rounded-xl">
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">الجداول</div>
                                    <div className="font-black text-emerald-900">24</div>
                                </div>
                                <div className="bg-white/50 p-4 rounded-xl">
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">آخر نسخة</div>
                                    <div className="font-black text-emerald-900">منذ 2 ساعة</div>
                                </div>
                                <div className="bg-white/50 p-4 rounded-xl">
                                    <div className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">الإصدار</div>
                                    <div className="font-black text-emerald-900">PostgreSQL 15</div>
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-4">
                            <button className="h-12 px-6 bg-black text-white rounded-xl font-black text-sm hover:bg-gray-800 transition-colors">
                                إنشاء نسخة احتياطية
                            </button>
                            <button className="h-12 px-6 bg-gray-100 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-200 transition-colors">
                                استعادة نسخة سابقة
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="space-y-10 pb-10 text-right" dir="rtl">
            <div>
                <h1 className="text-3xl font-black text-gray-900 mb-2">إعدادات النظام</h1>
                <p className="text-gray-500 font-bold">تخصيص لوحة التحكم، إدارة صلاحيات الموظفين، وضبط إعدادات الإشعارات.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Internal Nav */}
                <div className="lg:col-span-1 space-y-2">
                    {tabs.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as SettingsTab)}
                            className={`w-full flex items-center justify-between px-6 py-4 rounded-2xl transition-all ${activeTab === item.id ? 'bg-primary-500 text-black font-black shadow-lg shadow-primary-500/20' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                        >
                            <div className="flex items-center gap-4">
                                <item.icon size={20} />
                                <span className="font-bold">{item.name}</span>
                            </div>
                            <ChevronLeft size={16} className={activeTab === item.id ? 'opacity-100' : 'opacity-0'} />
                        </button>
                    ))}
                </div>

                {/* Settings Form */}
                <div className="lg:col-span-3 bg-white rounded-[3rem] p-10 border border-gray-100 shadow-sm">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.2 }}
                        >
                            {renderTabContent()}
                        </motion.div>
                    </AnimatePresence>

                    <div className="pt-10 mt-10 border-t border-gray-50 flex justify-end gap-4">
                        <button
                            onClick={handleReset}
                            disabled={!hasChanges}
                            className="h-14 px-8 bg-gray-100 text-gray-600 rounded-xl font-black text-sm hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            <RotateCcw size={16} />
                            إلغاء التعديلات
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className="h-14 px-10 bg-black text-white rounded-xl font-black text-sm hover:bg-gray-800 transition-all shadow-xl shadow-black/10 disabled:opacity-50 flex items-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 size={16} className="animate-spin" />
                                    جاري الحفظ...
                                </>
                            ) : (
                                <>
                                    <Save size={16} />
                                    حفظ الإعدادات
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
