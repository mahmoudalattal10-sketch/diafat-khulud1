'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowRight,
    Save,
    X,
    Plus,
    Trash2,
    Image as ImageIcon,
    Star,
    MapPin,
    Wifi,
    Coffee,
    Wind,
    Utensils,
    Bus,
    Waves,
    Dumbbell,
    Shirt,
    PartyPopper,
    Accessibility,
    CreditCard,
    Baby,
    Plane,
    Car,
    Briefcase,
    ShieldCheck,
    Check,
    Loader2,
    Eye,
    Bed,
    Building2,
    ChevronDown,
    Map as MapIcon2,
    AlertCircle,
    Info,
    Layout,
    Sparkles,
    Zap,
    Crown,
    Activity,
    Settings,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelsStore } from '@/store/hotelsStore';
import ImageUpload from '@/components/ui/ImageUpload';

// Icon Map for Amenities & Nearby
const AMENITY_ICONS = [
    { id: 'Wifi', icon: Wifi, label: 'واي فاي' },
    { id: 'Coffee', icon: Coffee, label: 'مقهى' },
    { id: 'Wind', icon: Wind, label: 'تكييف' },
    { id: 'Utensils', icon: Utensils, label: 'مطعم' },
    { id: 'Bus', icon: Bus, label: 'مواصلات' },
    { id: 'Waves', icon: Waves, label: 'مسبح' },
    { id: 'Gym', icon: Dumbbell, label: 'نادي رياضي' },
    { id: 'Shirt', icon: Shirt, label: 'غسيل ملابس' },
    { id: 'Party', icon: PartyPopper, label: 'قاعة احتفالات' },
    { id: 'Accessibility', icon: Accessibility, label: 'ذوي الاحتياجات' },
    { id: 'CreditCard', icon: CreditCard, label: 'دفع إلكتروني' },
    { id: 'Baby', icon: Baby, label: 'أطفال' },
    { id: 'Plane', icon: Plane, label: 'مطار' },
    { id: 'Car', icon: Car, label: 'مواقف' },
    { id: 'Briefcase', icon: Briefcase, label: 'رجال أعمال' },
];

const NEARBY_ICONS = [
    { id: 'MapPin', icon: MapPin, label: 'معلم ديني' },
    { id: 'Utensils', icon: Utensils, label: 'مطعم' },
    { id: 'Briefcase', icon: Briefcase, label: 'تسوق' },
    { id: 'Bus', icon: Bus, label: 'نقل' },
    { id: 'Plane', icon: Plane, label: 'مطار' },
];

type EditorTab = 'overview' | 'rooms' | 'gallery' | 'settings';

export default function NewHotelPage() {
    const router = useRouter();
    const { addHotel } = useHotelsStore();
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [activeTab, setActiveTab] = useState<EditorTab>('overview');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(true);

    // Initialize empty hotel
    const [hotel, setHotel] = useState<any>({
        name: '',
        location: 'مكة المكرمة',
        distance: '',
        rating: 5,
        price: 0,
        description: '',
        amenities: [],
        nearby: [{ label: '', dist: '', type: 'MapPin' }],
        rooms: [],
        gallery: [''],
        status: 'نشط',
    });

    const handleSave = async () => {
        if (!hotel.name.trim()) {
            alert('يرجى إدخال اسم الفندق');
            return;
        }
        if (!hotel.price || hotel.price <= 0) {
            alert('يرجى إدخال سعر الفندق');
            return;
        }

        setIsSaving(true);
        setSaveStatus('idle');

        try {
            const newHotel = await addHotel({
                name: hotel.name,
                location: hotel.location,
                distance: hotel.distance || '0 متر',
                coordinates: [21.4225, 39.8262] as [number, number],
                rating: hotel.rating,
                reviews: 0,
                price: hotel.price,
                description: hotel.description,
                images: hotel.gallery.filter((img: string) => img.trim() !== ''),
                features: hotel.amenities.map((a: any) => a.label).slice(0, 3),
                amenities: hotel.amenities,
                rooms: hotel.rooms,
                nearby: hotel.nearby.filter((n: any) => n.label.trim() !== ''),
                isFeatured: hotel.isFeatured,
            });

            if (!newHotel) {
                throw new Error('Failed to create hotel');
            }

            await new Promise(resolve => setTimeout(resolve, 500));
            setIsSaving(false);
            setSaveStatus('success');
            setHasUnsavedChanges(false);

            // Redirect to the new hotel's edit page
            setTimeout(() => {
                router.push(`/admin/dashboard/hotels/${newHotel.id}`);
            }, 1000);
        } catch (error) {
            setIsSaving(false);
            setSaveStatus('error');
        }
    };

    const updateField = (field: string, value: any) => {
        setHotel((prev: any) => ({ ...prev, [field]: value }));
        setHasUnsavedChanges(true);
    };

    const toggleAmenity = (id: string, label: string) => {
        const current = hotel.amenities || [];
        const index = current.findIndex((a: any) => a.icon === id || a.label === label);
        if (index > -1) {
            const newList = [...current];
            newList.splice(index, 1);
            updateField('amenities', newList);
        } else {
            updateField('amenities', [...current, { label, icon: id }]);
        }
    };

    const isAmenityActive = (id: string) => hotel?.amenities?.some((a: any) => a.icon === id);

    const addNearby = () => updateField('nearby', [...(hotel.nearby || []), { label: '', dist: '', type: 'MapPin' }]);
    const updateNearby = (index: number, field: string, value: string) => {
        const newList = [...(hotel.nearby || [])];
        newList[index] = { ...newList[index], [field]: value };
        updateField('nearby', newList);
    };
    const removeNearby = (index: number) => updateField('nearby', hotel.nearby.filter((_: any, i: number) => i !== index));

    const addRoom = () => updateField('rooms', [...(hotel.rooms || []), {
        id: Date.now(),
        name: 'غرفة جديدة',
        type: 'double',
        beds: '1 سرير كينج',
        view: '',
        price: hotel.price || 500,
        capacity: 2,
        availableCount: 10,
        size: 30,
        status: 'active',
        cancellationPolicy: 'free',
        breakfast: 'included',
        features: [],
        images: ['']
    }]);
    const updateRoom = (index: number, field: string, value: any) => {
        const newList = [...(hotel.rooms || [])];
        newList[index] = { ...newList[index], [field]: value };
        updateField('rooms', newList);
    };
    const removeRoom = (index: number) => updateField('rooms', hotel.rooms.filter((_: any, i: number) => i !== index));

    const addGalleryImage = () => updateField('gallery', [...(hotel.gallery || []), '']);
    const updateGalleryImage = (index: number, value: string) => {
        const newList = [...(hotel.gallery || [])];
        newList[index] = value;
        updateField('gallery', newList);
    };
    const removeGalleryImage = (index: number) => updateField('gallery', hotel.gallery.filter((_: any, i: number) => i !== index));

    const tabs = [
        { id: 'overview', label: 'نظرة عامة', icon: Layout },
        { id: 'rooms', label: 'الغرف والأسعار', icon: Bed },
        { id: 'gallery', label: 'معرض الصور', icon: ImageIcon },
        { id: 'settings', label: 'إعدادات متقدمة', icon: Settings }
    ];

    return (
        <div className="min-h-screen pb-32">
            {/* Premium Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
                <div className="px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/admin/dashboard/hotels"
                                className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
                            >
                                <ArrowRight size={22} />
                            </Link>
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                    <Building2 size={28} className="text-white" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-3">
                                        <h1 className="text-xl font-black text-gray-900">{hotel.name || 'فندق جديد'}</h1>
                                        <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600">
                                            جديد
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-400 font-bold flex items-center gap-2">
                                        <MapPin size={14} />
                                        {hotel.location}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <AnimatePresence>
                                {saveStatus === 'success' && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-bold"
                                    >
                                        <Check size={16} />
                                        <span>تم الحفظ</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <button
                                onClick={handleSave}
                                disabled={isSaving}
                                className={`h-12 px-6 rounded-xl font-black text-sm flex items-center gap-2 transition-all shadow-lg ${hasUnsavedChanges
                                    ? 'bg-primary-500 text-black hover:bg-primary-600 shadow-primary-500/20'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-black/10'
                                    } disabled:opacity-50`}
                            >
                                {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                <span>{isSaving ? 'جاري الحفظ...' : 'حفظ الفندق'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-2 mt-6 -mb-4">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as EditorTab)}
                                className={`relative px-6 py-4 rounded-t-2xl font-bold text-sm flex items-center gap-2 transition-all ${activeTab === tab.id
                                    ? 'bg-gray-50 text-gray-900'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <tab.icon size={18} />
                                {tab.label}
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-primary-500 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="px-8 pt-8">
                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid lg:grid-cols-3 gap-8"
                        >
                            {/* Main Content */}
                            <div className="lg:col-span-2 space-y-8">
                                {/* Basic Info Card */}
                                <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 bg-primary-50 rounded-xl flex items-center justify-center">
                                            <Info size={20} className="text-primary-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">المعلومات الأساسية</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">اسم الفندق</label>
                                                <input
                                                    type="text"
                                                    value={hotel.name}
                                                    onChange={(e) => updateField('name', e.target.value)}
                                                    placeholder="مثال: فندق أبراج مكة"
                                                    className="w-full h-14 px-5 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-gray-900 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">الموقع</label>
                                                <select
                                                    value={hotel.location}
                                                    onChange={(e) => updateField('location', e.target.value)}
                                                    className="w-full h-14 px-5 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-gray-900 transition-all"
                                                >
                                                    <option value="مكة المكرمة">مكة المكرمة</option>
                                                    <option value="المدينة المنورة">المدينة المنورة</option>
                                                    <option value="جدة">جدة</option>
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">التقييم</label>
                                                <div className="flex items-center gap-2 h-14 px-5 bg-gray-50 rounded-xl">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <button key={star} onClick={() => updateField('rating', star)}>
                                                            <Star
                                                                size={24}
                                                                className={star <= hotel.rating ? 'text-primary-500 fill-primary-500' : 'text-gray-300'}
                                                            />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">المسافة عن الحرم</label>
                                                <input
                                                    type="text"
                                                    value={hotel.distance || ''}
                                                    onChange={(e) => updateField('distance', e.target.value)}
                                                    placeholder="مثال: 50 متر"
                                                    className="w-full h-14 px-5 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-gray-900 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">حالة العرض</label>
                                                <button
                                                    onClick={() => updateField('status', hotel.status === 'نشط' ? 'غير نشط' : 'نشط')}
                                                    className={`w-full h-14 px-5 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${hotel.status === 'نشط'
                                                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                                                        : 'bg-gray-200 text-gray-600'
                                                        }`}
                                                >
                                                    {hotel.status === 'نشط' ? <Check size={18} /> : <X size={18} />}
                                                    {hotel.status}
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">وصف الفندق</label>
                                            <textarea
                                                value={hotel.description}
                                                onChange={(e) => updateField('description', e.target.value)}
                                                placeholder="أدخل وصفاً تفصيلياً للفندق..."
                                                rows={4}
                                                className="w-full p-5 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 outline-none font-medium text-gray-600 leading-relaxed resize-none transition-all"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Amenities Card */}
                                <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center">
                                            <Check size={20} className="text-emerald-600" />
                                        </div>
                                        <h2 className="text-lg font-black text-gray-900">المرافق والخدمات</h2>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                                        {AMENITY_ICONS.map(item => {
                                            const active = isAmenityActive(item.id);
                                            return (
                                                <button
                                                    key={item.id}
                                                    onClick={() => toggleAmenity(item.id, item.label)}
                                                    className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${active
                                                        ? 'bg-primary-50 border-primary-200 text-primary-700'
                                                        : 'bg-gray-50 border-transparent text-gray-400 hover:border-gray-200'
                                                        }`}
                                                >
                                                    <item.icon size={24} />
                                                    <span className="font-black text-[10px] uppercase tracking-wide">{item.label}</span>
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* Nearby Places Card */}
                                <div className="bg-white rounded-[2rem] border border-gray-100 p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                <MapIcon2 size={20} className="text-blue-600" />
                                            </div>
                                            <h2 className="text-lg font-black text-gray-900">المعالم القريبة</h2>
                                        </div>
                                        <button
                                            onClick={addNearby}
                                            className="h-10 px-4 bg-gray-900 text-white rounded-xl font-bold text-xs flex items-center gap-2 hover:bg-gray-800 transition-all"
                                        >
                                            <Plus size={16} />
                                            إضافة
                                        </button>
                                    </div>

                                    <div className="space-y-4">
                                        {hotel.nearby?.map((item: any, idx: number) => (
                                            <motion.div
                                                key={idx}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl group hover:bg-gray-100 transition-all"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
                                                    {(() => {
                                                        const IconComponent = NEARBY_ICONS.find(ni => ni.id === item.type)?.icon || MapPin;
                                                        return <IconComponent size={22} />;
                                                    })()}
                                                </div>
                                                <div className="flex-1 grid grid-cols-3 gap-3">
                                                    <select
                                                        value={item.type}
                                                        onChange={(e) => updateNearby(idx, 'type', e.target.value)}
                                                        className="h-11 bg-white rounded-xl border border-gray-100 px-3 font-bold text-xs"
                                                    >
                                                        {NEARBY_ICONS.map(i => <option key={i.id} value={i.id}>{i.label}</option>)}
                                                    </select>
                                                    <input
                                                        type="text"
                                                        value={item.label}
                                                        placeholder="اسم المعلم"
                                                        onChange={(e) => updateNearby(idx, 'label', e.target.value)}
                                                        className="h-11 bg-white rounded-xl border border-gray-100 px-4 font-bold text-xs"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={item.dist}
                                                        placeholder="المسافة"
                                                        onChange={(e) => updateNearby(idx, 'dist', e.target.value)}
                                                        className="h-11 bg-white rounded-xl border border-gray-100 px-4 font-bold text-xs"
                                                    />
                                                </div>
                                                <button
                                                    onClick={() => removeNearby(idx)}
                                                    className="opacity-0 group-hover:opacity-100 w-10 h-10 bg-red-50 text-red-500 rounded-xl flex items-center justify-center transition-all hover:bg-red-500 hover:text-white"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </motion.div>
                                        ))}

                                        {hotel.nearby?.length === 0 && (
                                            <div className="text-center py-12 text-gray-400">
                                                <MapPin size={40} className="mx-auto mb-4 opacity-30" />
                                                <p className="font-bold">لا توجد معالم مضافة</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Premium Widget */}
                                <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-[2rem] p-8 text-white shadow-2xl shadow-black/20 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-40 h-40 bg-primary-500/20 rounded-full blur-3xl" />
                                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl" />

                                    <div className="relative">
                                        <div className="flex items-center justify-between mb-8">
                                            <h3 className="text-lg font-black flex items-center gap-2">
                                                <Crown size={20} className="text-primary-500" />
                                                ملخص العرض
                                            </h3>
                                            <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black">NEW</span>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between py-4 border-b border-white/10">
                                                <span className="text-gray-400 font-bold text-sm">السعر الأساسي</span>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <input
                                                            type="number"
                                                            value={hotel.price}
                                                            onChange={(e) => updateField('price', Number(e.target.value))}
                                                            placeholder="0"
                                                            className="w-24 bg-white/10 rounded-lg px-3 py-2 text-primary-400 font-black text-right outline-none focus:bg-white/20 transition-all"
                                                        />
                                                        <span className="text-xs text-white/40">ر.س</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-4 border-b border-white/10">
                                                <span className="text-gray-400 font-bold text-sm">عدد الغرف</span>
                                                <input
                                                    type="number"
                                                    value={hotel.rooms?.length || 0}
                                                    readOnly
                                                    className="w-20 bg-white/10 rounded-lg px-3 py-2 text-white font-black text-right outline-none"
                                                />
                                            </div>

                                            <div className="flex items-center justify-between py-4">
                                                <span className="text-gray-400 font-bold text-sm">التقييم</span>
                                                <div className="flex gap-1">
                                                    {[1, 2, 3, 4, 5].map(star => (
                                                        <Star
                                                            key={star}
                                                            size={16}
                                                            className={star <= hotel.rating ? 'text-primary-500 fill-primary-500' : 'text-white/20'}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSave}
                                            disabled={isSaving}
                                            className="w-full h-14 mt-6 bg-white text-gray-900 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-all disabled:opacity-50"
                                        >
                                            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                            حفظ الفندق
                                        </button>
                                    </div>
                                </div>

                                {/* Activity Card */}
                                <div className="bg-white rounded-[2rem] border border-gray-100 p-6 shadow-sm">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                            <Activity size={20} className="text-purple-600" />
                                        </div>
                                        <h3 className="text-sm font-black text-gray-900">النشاط الأخير</h3>
                                    </div>
                                    <div className="space-y-4">
                                        {[
                                            { action: 'حجز جديد', time: 'سيظهر هنا بعد النشر', color: 'bg-gray-400' },
                                            { action: 'تقييم 5 نجوم', time: 'سيظهر هنا بعد النشر', color: 'bg-gray-400' },
                                            { action: 'استفسار', time: 'سيظهر هنا بعد النشر', color: 'bg-gray-400' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3 opacity-50">
                                                <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                                <div className="flex-1">
                                                    <div className="text-sm font-bold text-gray-900">{item.action}</div>
                                                    <div className="text-xs text-gray-400">{item.time}</div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Tips Card */}
                                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[2rem] border border-blue-200/50 p-6">
                                    <div className="flex gap-4">
                                        <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center shrink-0">
                                            <Sparkles size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-blue-900 text-sm mb-2">تلميح احترافي</h4>
                                            <p className="text-xs text-blue-700 leading-relaxed font-medium">
                                                أضف صور عالية الجودة وأكثر من 5 مرافق لزيادة معدل الحجوزات بنسبة 40%
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {/* Rooms Tab */}
                    {activeTab === 'rooms' && (
                        <motion.div
                            key="rooms"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-8"
                        >
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-black text-gray-900">إدارة الغرف والأجنحة</h2>
                                    <p className="text-gray-400 font-bold">أضف وعدّل خيارات الإقامة المتاحة للضيوف</p>
                                </div>
                                <button
                                    onClick={addRoom}
                                    className="h-14 px-8 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                                >
                                    <Plus size={20} />
                                    إضافة غرفة جديدة
                                </button>
                            </div>

                            {hotel.rooms?.length === 0 ? (
                                <div className="bg-white rounded-[2.5rem] border border-gray-100 p-16 text-center shadow-sm">
                                    <Bed size={64} className="mx-auto text-gray-200 mb-6" />
                                    <h3 className="text-xl font-black text-gray-900 mb-2">لا توجد غرف حتى الآن</h3>
                                    <p className="text-gray-400 font-bold mb-6">ابدأ بإضافة غرفة جديدة للفندق</p>
                                    <button
                                        onClick={addRoom}
                                        className="h-12 px-6 bg-gray-900 text-white rounded-xl font-bold text-sm inline-flex items-center gap-2"
                                    >
                                        <Plus size={18} />
                                        إضافة غرفة
                                    </button>
                                </div>
                            ) : (
                                <div className="grid gap-6">
                                    {hotel.rooms?.map((room: any, idx: number) => (
                                        <motion.div
                                            key={room.id || idx}
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden"
                                        >
                                            {/* Room Header */}
                                            <div className="p-8 bg-gradient-to-l from-gray-50 to-white border-b border-gray-100">
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl flex items-center justify-center shadow-xl">
                                                            <Bed size={40} />
                                                        </div>
                                                        <div>
                                                            <input
                                                                type="text"
                                                                value={room.name || 'غرفة بدون اسم'}
                                                                onChange={(e) => updateRoom(idx, 'name', e.target.value)}
                                                                className="text-2xl font-black text-gray-900 bg-transparent border-none outline-none focus:text-primary-600 w-full"
                                                                placeholder="اسم الغرفة..."
                                                            />
                                                            <div className="flex items-center gap-4 mt-2">
                                                                <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${room.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                                    }`}>
                                                                    {room.status === 'active' ? 'نشطة' : 'غير نشطة'}
                                                                </span>
                                                                <span className="text-sm font-bold text-gray-400">
                                                                    متوفر: <span className="text-gray-900 font-black">{room.availableCount || 0}</span> غرفة
                                                                </span>
                                                                <span className="text-xl font-black text-emerald-600">{room.price} ر.س / ليلة</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <button
                                                            onClick={() => updateRoom(idx, 'status', room.status === 'active' ? 'inactive' : 'active')}
                                                            className={`w-14 h-8 rounded-full relative transition-colors ${room.status === 'active' ? 'bg-emerald-500' : 'bg-gray-300'}`}
                                                        >
                                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${room.status === 'active' ? 'right-1' : 'left-1'}`} />
                                                        </button>
                                                        <button
                                                            onClick={() => removeRoom(idx)}
                                                            className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center hover:bg-red-500 hover:text-white transition-all"
                                                        >
                                                            <Trash2 size={20} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* Room Details */}
                                            <div className="p-8 space-y-8">
                                                {/* Row 1: Basic Info */}
                                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-5">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">نوع الغرفة</label>
                                                        <select
                                                            value={room.type}
                                                            onChange={(e) => updateRoom(idx, 'type', e.target.value)}
                                                            className="w-full h-14 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-sm outline-none transition-all"
                                                        >
                                                            <option value="single">فردية</option>
                                                            <option value="double">زوجية</option>
                                                            <option value="triple">ثلاثية</option>
                                                            <option value="quad">رباعية</option>
                                                            <option value="suite">جناح فاخر</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">السعة القصوى</label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={room.capacity || 2}
                                                                onChange={(e) => updateRoom(idx, 'capacity', Number(e.target.value))}
                                                                className="w-full h-14 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-sm outline-none transition-all"
                                                            />
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-gray-400">شخص</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">✨ الكمية المتاحة</label>
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            value={room.availableCount || 0}
                                                            onChange={(e) => updateRoom(idx, 'availableCount', Number(e.target.value))}
                                                            className="w-full h-14 px-4 bg-emerald-50 text-emerald-700 rounded-xl border-2 border-emerald-100 focus:bg-white focus:border-emerald-500 font-black text-lg outline-none transition-all text-center"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">📐 المساحة (م²)</label>
                                                        <input
                                                            type="number"
                                                            value={room.size || 25}
                                                            onChange={(e) => updateRoom(idx, 'size', Number(e.target.value))}
                                                            className="w-full h-14 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-sm outline-none transition-all"
                                                        />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-primary-600 uppercase tracking-widest">💰 السعر / ليلة</label>
                                                        <div className="relative">
                                                            <input
                                                                type="number"
                                                                value={room.price}
                                                                onChange={(e) => updateRoom(idx, 'price', Number(e.target.value))}
                                                                className="w-full h-14 px-4 bg-primary-50 text-primary-700 rounded-xl border-2 border-primary-100 focus:bg-white focus:border-primary-500 font-black text-lg outline-none transition-all"
                                                            />
                                                            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-primary-500 font-bold">ر.س</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">👁️ الإطلالة</label>
                                                        <select
                                                            value={room.view || ''}
                                                            onChange={(e) => updateRoom(idx, 'view', e.target.value)}
                                                            className="w-full h-14 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-sm outline-none transition-all"
                                                        >
                                                            <option value="">اختر الإطلالة...</option>
                                                            <option value="إطلالة على المدينة">إطلالة على المدينة</option>
                                                            <option value="إطلالة على الكعبة">إطلالة على الكعبة</option>
                                                            <option value="إطلالة على المسجد النبوي">إطلالة على المسجد النبوي</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Row 2: Bed Config, Cancellation, Breakfast */}
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">🛏️ تفاصيل الأسرّة</label>
                                                        <select
                                                            value={room.beds || '1 سرير كينج'}
                                                            onChange={(e) => updateRoom(idx, 'beds', e.target.value)}
                                                            className="w-full h-14 px-4 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 font-bold text-sm outline-none transition-all"
                                                        >
                                                            <option value="1 سرير كينج">1 سرير كينج</option>
                                                            <option value="2 سرير مفرد">2 سرير مفرد</option>
                                                            <option value="1 سرير كوين">1 سرير كوين</option>
                                                            <option value="3 سرير مفرد">3 سرير مفرد</option>
                                                            <option value="1 سرير كينج + كنبة">1 سرير كينج + كنبة</option>
                                                            <option value="2 سرير كينج">2 سرير كينج</option>
                                                            <option value="4 سرير مفرد">4 سرير مفرد</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">📋 سياسة الإلغاء</label>
                                                        <select
                                                            value={room.cancellationPolicy || 'free'}
                                                            onChange={(e) => updateRoom(idx, 'cancellationPolicy', e.target.value)}
                                                            className={`w-full h-14 px-4 rounded-xl border-2 font-bold text-sm outline-none transition-all ${room.cancellationPolicy === 'free' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                                                room.cancellationPolicy === 'partial' ? 'bg-yellow-50 border-yellow-100 text-yellow-700' :
                                                                    'bg-red-50 border-red-100 text-red-700'
                                                                }`}
                                                        >
                                                            <option value="free">إلغاء مجاني</option>
                                                            <option value="partial">إلغاء جزئي (50%)</option>
                                                            <option value="nonRefundable">غير قابل للإلغاء</option>
                                                        </select>
                                                    </div>
                                                    <div className="space-y-2">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">🍳 الفطور</label>
                                                        <select
                                                            value={room.breakfast || 'included'}
                                                            onChange={(e) => updateRoom(idx, 'breakfast', e.target.value)}
                                                            className={`w-full h-14 px-4 rounded-xl border-2 font-bold text-sm outline-none transition-all ${room.breakfast === 'included' ? 'bg-emerald-50 border-emerald-100 text-emerald-700' :
                                                                room.breakfast === 'extra' ? 'bg-blue-50 border-blue-100 text-blue-700' :
                                                                    'bg-gray-50 border-transparent text-gray-600'
                                                                }`}
                                                        >
                                                            <option value="included">شامل الفطور</option>
                                                            <option value="extra">بتكلفة إضافية</option>
                                                            <option value="notIncluded">غير شامل</option>
                                                        </select>
                                                    </div>
                                                </div>

                                                {/* Row 3: Features Tags */}
                                                <div className="space-y-3">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">مميزات إضافية</label>
                                                    <div className="flex flex-wrap gap-2">
                                                        {['واي فاي مجاني', 'إطلالة مباشرة', 'شامل الضريبة', 'ميني بار', 'خزنة', 'بالكونة', 'جاكوزي', 'مكيف', 'تلفزيون', 'ماكينة قهوة'].map(tag => (
                                                            <button
                                                                key={tag}
                                                                onClick={() => {
                                                                    const tags = room.features || [];
                                                                    const newTags = tags.includes(tag) ? tags.filter((t: string) => t !== tag) : [...tags, tag];
                                                                    updateRoom(idx, 'features', newTags);
                                                                }}
                                                                className={`px-4 py-2.5 rounded-xl text-xs font-black transition-all ${room.features?.includes(tag)
                                                                    ? 'bg-gray-900 text-white shadow-lg'
                                                                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                                                                    }`}
                                                            >
                                                                {tag}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Row 4: Room Images Gallery */}
                                                <div className="space-y-4 pt-6 border-t border-gray-100">
                                                    <div className="flex items-center justify-between">
                                                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                                                            📷 صور الغرفة ({room.images?.length || 0} صورة)
                                                        </label>
                                                    </div>
                                                    <ImageUpload
                                                        value={room.images?.filter((img: string) => img !== '') || []}
                                                        onChange={(urls) => updateRoom(idx, 'images', urls)}
                                                        maxFiles={5}
                                                    />
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                            <button
                                onClick={addRoom}
                                className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-black flex items-center justify-center gap-2 hover:bg-gray-50 hover:border-gray-400 transition-all"
                            >
                                <Plus size={20} />
                                إضافة غرفة جديدة
                            </button>
                        </motion.div>
                    )}

                    {/* Gallery Tab */}
                    {
                        activeTab === 'gallery' && (
                            <motion.div
                                key="gallery"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                            >
                                <div className="flex items-center justify-between mb-8">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">معرض الصور</h2>
                                        <p className="text-gray-400 font-bold">أضف صور الفندق</p>
                                    </div>
                                    <button
                                        onClick={addGalleryImage}
                                        className="h-12 px-6 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-bold text-sm flex items-center gap-2 transition-all"
                                    >
                                        <Plus size={18} />
                                        إضافة صورة
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                                    {hotel.gallery?.map((img: string, idx: number) => (
                                        <div key={idx} className="relative group aspect-[4/3] bg-gray-100 rounded-2xl overflow-hidden">
                                            {img ? (
                                                <img src={img} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <ImageIcon size={40} className="text-gray-300" />
                                                </div>
                                            )}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                                                <input
                                                    type="text"
                                                    value={img}
                                                    onChange={(e) => updateGalleryImage(idx, e.target.value)}
                                                    placeholder="رابط الصورة..."
                                                    className="w-full h-10 px-3 bg-white rounded-lg text-xs font-bold outline-none"
                                                />
                                                <button
                                                    onClick={() => removeGalleryImage(idx)}
                                                    className="w-10 h-10 bg-red-500 hover:bg-red-600 text-white rounded-lg flex items-center justify-center transition-all"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                            {idx === 0 && (
                                                <div className="absolute top-3 right-3 px-2 py-1 bg-primary-500 text-black text-[10px] font-black rounded-lg">
                                                    رئيسية
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )
                    }

                    {/* Settings Tab */}
                    {
                        activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-3xl mx-auto"
                            >
                                {/* Header */}
                                <div className="text-center mb-10">
                                    <h2 className="text-2xl font-black text-gray-900">إعدادات متقدمة</h2>
                                    <p className="text-gray-400 font-bold">تحكم كامل في خيارات العرض والظهور</p>
                                </div>

                                {/* Settings Cards */}
                                <div className="space-y-4">
                                    {/* Show in Search Results */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900">إظهار في نتائج البحث</h3>
                                            <p className="text-sm text-gray-400 font-medium">السماح للفندق بالظهور في صفحة البحث</p>
                                        </div>
                                        <button
                                            onClick={() => updateField('showInSearch', !hotel.showInSearch)}
                                            className={`w-14 h-8 rounded-full relative transition-colors ${hotel.showInSearch !== false ? 'bg-primary-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${hotel.showInSearch !== false ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {/* Instant Booking */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900">تفعيل الحجز الفوري</h3>
                                            <p className="text-sm text-gray-400 font-medium">تأكيد الحجوزات تلقائياً دون مراجعة</p>
                                        </div>
                                        <button
                                            onClick={() => updateField('instantBooking', !hotel.instantBooking)}
                                            className={`w-14 h-8 rounded-full relative transition-colors ${hotel.instantBooking ? 'bg-primary-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${hotel.instantBooking ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {/* Featured */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900">عرض كعرض مميز</h3>
                                            <p className="text-sm text-gray-400 font-medium">إظهار الفندق في قسم العروض المميزة</p>
                                        </div>
                                        <button
                                            onClick={() => updateField('isFeatured', !hotel.isFeatured)}
                                            className={`w-14 h-8 rounded-full relative transition-colors ${hotel.isFeatured ? 'bg-primary-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${hotel.isFeatured ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {/* Booking Notifications */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900">إشعارات الحجوزات</h3>
                                            <p className="text-sm text-gray-400 font-medium">استلام تنبيهات عند كل حجز جديد</p>
                                        </div>
                                        <button
                                            onClick={() => updateField('bookingNotifications', hotel.bookingNotifications === false ? true : !hotel.bookingNotifications)}
                                            className={`w-14 h-8 rounded-full relative transition-colors ${hotel.bookingNotifications !== false ? 'bg-primary-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${hotel.bookingNotifications !== false ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                {/* Danger Zone */}
                                <div className="mt-10 bg-gradient-to-r from-red-50 to-red-100/50 rounded-2xl border border-red-200 p-8">
                                    <div className="text-center">
                                        <h3 className="font-black text-red-600 text-lg mb-2">منطقة الخطر</h3>
                                        <p className="text-sm text-red-500 font-medium mb-6">حذف الفندق نهائياً من النظام. لا يمكن التراجع عن هذا الإجراء.</p>
                                        <button
                                            onClick={() => {
                                                if (confirm('هل أنت متأكد من حذف هذا الفندق نهائياً؟')) {
                                                    router.push('/admin/dashboard/hotels');
                                                }
                                            }}
                                            className="h-12 px-8 bg-red-500 hover:bg-red-600 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-red-500/20"
                                        >
                                            حذف الفندق نهائياً
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )
                    }
                </AnimatePresence>
            </div>
        </div>
    );
}
