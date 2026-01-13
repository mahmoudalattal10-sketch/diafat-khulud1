'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
    Layout,
    MapPin,
    Star,
    Wifi,
    Check,
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
    X,
    Upload,
    Trash2,
    Plus,
    Save,
    Bed,
    Building2,
    Calendar,
    Users,
    DollarSign,
    Image as ImageIcon,
    Settings,
    ArrowRight,
    Loader2,
    Eye,
    TrendingUp,
    Activity,
    Sparkles,
    Info,
    Crown,
    ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelsStore } from '@/store/hotelsStore';
import { toast } from 'react-hot-toast';
import ModernDatePicker from '@/components/ui/ModernDatePicker';
import ModernSelect from '@/components/ui/ModernSelect';
import NumericInput from '@/components/ui/NumericInput';

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

export default function HotelEditorPage() {
    const params = useParams();
    const router = useRouter();
    const { getHotel, updateHotel, fetchHotels } = useHotelsStore();
    const [hotel, setHotel] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [activeTab, setActiveTab] = useState<EditorTab>('overview');
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            let data = getHotel(params.id as string);
            if (!data) {
                await fetchHotels();
                data = getHotel(params.id as string);
            }
            if (data) {
                // ... Existing data mapping logic ...
                setHotel({
                    ...data,
                    description: data.description || "استمتع بإقامة روحانية لا تُنسى في هذا الفندق المتميز بإطلالاته الخلابة على المسجد الحرام.",
                    amenities: data.amenities || [],
                    nearby: data.nearby || [
                        { label: 'المسجد الحرام', dist: '5 دقائق مشي', type: 'MapPin' },
                    ],
                    gallery: data.images || [],
                    isFeatured: data.isFeatured ?? false,
                    badge: data.badge || '',
                    status: 'نشط',
                    availableFrom: data.availableFrom ? new Date(data.availableFrom).toISOString().split('T')[0] : '',
                    availableTo: data.availableTo ? new Date(data.availableTo).toISOString().split('T')[0] : '',
                    views: Math.floor(Math.random() * 5000) + 1000,
                    bookings: Math.floor(Math.random() * 200) + 50,
                    revenue: Math.floor(Math.random() * 100000) + 20000,
                });
            }
        };
        loadData();
    }, [params.id, getHotel, fetchHotels]);

    const handleSave = async () => {
        setIsSaving(true);
        setSaveStatus('idle');

        try {
            // Save to API via store
            if (hotel) {
                console.log('Sending update to API with rooms:', hotel.rooms);
                // Sanitize prices to ensure numbers
                const sanitizedRooms = hotel.rooms?.map((r: any) => ({
                    ...r,
                    price: parseFloat(r.price) || 0,
                    capacity: r.capacity || 2
                })) || [];

                console.log('Sanitized Rooms:', sanitizedRooms);

                await updateHotel(hotel.id, {
                    name: hotel.name,
                    location: hotel.location,
                    distance: hotel.distance,
                    rating: hotel.rating,
                    price: hotel.price,
                    description: hotel.description,
                    images: hotel.gallery,
                    amenities: hotel.amenities,
                    rooms: sanitizedRooms,
                    nearby: hotel.nearby,
                    badge: hotel.badge,
                    isFeatured: hotel.isFeatured,
                    availableFrom: hotel.availableFrom,
                    availableTo: hotel.availableTo,
                    coordinates: [hotel.latitude, hotel.longitude],
                });
            }

            setIsSaving(false);
            setSaveStatus('success');
            setHasUnsavedChanges(false);
            setTimeout(() => setSaveStatus('idle'), 3000);
        } catch (error) {
            console.error('Save failed:', error);
            setIsSaving(false);
            setSaveStatus('error');
            setTimeout(() => setSaveStatus('idle'), 3000);
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
        price: 0,
        capacity: 2,
        availableCount: 1,
        availableFrom: '',
        availableTo: '',
        size: 25,
        status: 'active',
        cancellationPolicy: 'free',
        breakfast: 'included',
        features: [],
        images: ['']
    }]);
    const updateRoom = (index: number, field: string, value: any) => {
        const newList = [...(hotel.rooms || [])];
        let updatedRoom = { ...newList[index], [field]: value };

        // Smart Defaults: Auto-set capacity and beds based on type
        if (field === 'type') {
            switch (value) {
                case 'single':
                    updatedRoom.capacity = 1;
                    updatedRoom.beds = '1 سرير مفرد';
                    break;
                case 'double':
                    updatedRoom.capacity = 2;
                    updatedRoom.beds = '1 سرير كينج';
                    break;
                case 'triple':
                    updatedRoom.capacity = 3;
                    updatedRoom.beds = '3 سرير مفرد';
                    break;
                case 'quad':
                    updatedRoom.capacity = 4;
                    updatedRoom.beds = '4 سرير مفرد';
                    break;
                case 'suite':
                    updatedRoom.capacity = 4;
                    updatedRoom.beds = '2 سرير كينج';
                    break;
            }
        }

        newList[index] = updatedRoom;
        updateField('rooms', newList);
    };
    const removeRoom = (index: number) => updateField('rooms', hotel.rooms.filter((_: any, i: number) => i !== index));

    const addRoomImage = (roomIdx: number) => {
        const room = hotel.rooms[roomIdx];
        const images = [...(room.images || []), ''];
        updateRoom(roomIdx, 'images', images);
    };
    const updateRoomImage = (roomIdx: number, imgIdx: number, value: string) => {
        const room = hotel.rooms[roomIdx];
        const images = [...(room.images || [])];
        images[imgIdx] = value;
        updateRoom(roomIdx, 'images', images);
    };
    const removeRoomImage = (roomIdx: number, imgIdx: number) => {
        const room = hotel.rooms[roomIdx];
        const images = room.images.filter((_: any, i: number) => i !== imgIdx);
        updateRoom(roomIdx, 'images', images);
    };

    const addGalleryImage = () => updateField('gallery', [...(hotel.gallery || []), '']);
    const updateGalleryImage = (index: number, value: string) => {
        const newList = [...(hotel.gallery || [])];
        newList[index] = value;
        updateField('gallery', newList);
    };
    const removeGalleryImage = (index: number) => updateField('gallery', hotel.gallery.filter((_: any, i: number) => i !== index));

    if (!hotel) return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] gap-6">
            <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-primary-400 to-primary-600 rounded-3xl animate-pulse" />
                <Loader2 className="absolute inset-0 m-auto animate-spin text-white" size={32} />
            </div>
            <p className="font-black text-gray-400 text-lg">جاري تحميل بيانات الفندق...</p>
        </div>
    );

    const tabs = [
        { id: 'overview', label: 'نظرة عامة', icon: Layout },
        { id: 'rooms', label: 'الغرف والأسعار', icon: Bed },
        { id: 'gallery', label: 'معرض الصور', icon: ImageIcon },
        { id: 'settings', label: 'إعدادات متقدمة', icon: Settings },
    ];

    const stats = [
        { label: 'المشاهدات', value: hotel.views?.toLocaleString(), icon: Eye, color: 'text-blue-500', bg: 'bg-blue-50' },
        { label: 'الحجوزات', value: hotel.bookings, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { label: 'الإيرادات', value: `$${hotel.revenue?.toLocaleString()}`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <div className="min-h-screen pb-32">
            {/* Premium Header */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 -mx-4 -mt-4 md:-mx-8 md:-mt-8 mb-6 md:mb-8">
                <div className="px-4 py-3 md:px-8 md:py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <Link
                                href="/admin/dashboard/hotels"
                                className="w-12 h-12 bg-gray-50 hover:bg-gray-100 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
                            >
                                <ArrowRight size={22} />
                            </Link>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-primary-400 to-primary-600 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/20">
                                    <Building2 className="text-white w-5 h-5 md:w-7 md:h-7" />
                                </div>
                                <div>
                                    <div className="flex items-center gap-2 md:gap-3">
                                        <h1 className="text-lg md:text-xl font-black text-gray-900">{hotel.name}</h1>
                                        <span className={`px-2 md:px-3 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-black uppercase tracking-widest ${hotel.status === 'نشط' ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-500'}`}>
                                            {hotel.status}
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
                            {/* Quick Stats */}
                            <div className="hidden xl:flex items-center gap-4 pl-6 border-l border-gray-100">
                                {stats.map((stat, i) => (
                                    <div key={i} className="flex items-center gap-3">
                                        <div className={`w-10 h-10 ${stat.bg} rounded-xl flex items-center justify-center`}>
                                            <stat.icon size={18} className={stat.color} />
                                        </div>
                                        <div>
                                            <div className="text-xs font-bold text-gray-400">{stat.label}</div>
                                            <div className="text-sm font-black text-gray-900">{stat.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Actions */}
                            <button
                                onClick={() => window.open(`/hotels/${hotel.id}`, '_blank')}
                                className="h-12 px-5 bg-gray-50 hover:bg-gray-100 rounded-xl font-bold text-sm text-gray-600 flex items-center gap-2 transition-all"
                            >
                                <Eye size={18} />
                                <span className="hidden md:inline">معاينة</span>
                            </button>

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
                                className={`h-10 md:h-12 px-4 md:px-6 rounded-xl font-black text-xs md:text-sm flex items-center gap-2 transition-all shadow-lg ${hasUnsavedChanges
                                    ? 'bg-primary-500 text-black hover:bg-primary-600 shadow-primary-500/20'
                                    : 'bg-gray-900 text-white hover:bg-gray-800 shadow-black/10'
                                    } disabled:opacity-50 whitespace-nowrap`}
                            >
                                {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} className="md:w-[18px] md:h-[18px]" />}
                                <span>{isSaving ? 'جاري الحفظ...' : hasUnsavedChanges ? 'حفظ التغييرات' : 'محفوظ'}</span>
                            </button>
                        </div>
                    </div>

                    {/* Tabs Navigation */}
                    <div className="flex gap-1 md:gap-2 mt-4 md:mt-6 -mb-4 overflow-x-auto pb-1 md:pb-0 scrollbar-hide">
                        {tabs.map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as EditorTab)}
                                className={`relative px-4 py-3 md:px-6 md:py-4 rounded-t-2xl font-bold text-xs md:text-sm flex items-center gap-2 transition-all whitespace-nowrap shrink-0 ${activeTab === tab.id
                                    ? 'bg-gray-50 text-gray-900'
                                    : 'text-gray-400 hover:text-gray-600'
                                    }`}
                            >
                                <tab.icon size={16} className="md:w-[18px] md:h-[18px]" />
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
            <div className="">
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
                                                    className="w-full h-14 px-5 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-gray-900 transition-all"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">الموقع</label>
                                                <input
                                                    type="text"
                                                    value={hotel.location}
                                                    onChange={(e) => updateField('location', e.target.value)}
                                                    className="w-full h-14 px-5 bg-gray-50 rounded-xl border-2 border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-gray-900 transition-all"
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

                                            <div className="space-y-2 col-span-3 md:col-span-3">
                                                <label className="text-xs font-black text-gray-400 uppercase tracking-widest">فترة الإتاحة (من - إلى)</label>
                                                <div className="flex flex-col md:flex-row gap-4">
                                                    <div className="flex-1">
                                                        <ModernDatePicker
                                                            value={hotel.availableFrom ? new Date(hotel.availableFrom) : null}
                                                            onChange={(date) => updateField('availableFrom', date ? date.toISOString() : null)}
                                                            label="تاريخ البدء"
                                                            placeholder="من تاريخ"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <ModernDatePicker
                                                            value={hotel.availableTo ? new Date(hotel.availableTo) : null}
                                                            onChange={(date) => updateField('availableTo', date ? date.toISOString() : null)}
                                                            label="تاريخ الانتهاء"
                                                            placeholder="إلى تاريخ"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-black text-gray-400 uppercase tracking-widest">وصف الفندق</label>
                                            <textarea
                                                value={hotel.description}
                                                onChange={(e) => updateField('description', e.target.value)}
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
                                                <MapPin size={20} className="text-blue-600" />
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
                                                className="flex flex-col md:flex-row gap-4 items-center bg-gray-50 p-4 rounded-2xl group hover:bg-gray-100 transition-all"
                                            >
                                                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm">
                                                    {(() => {
                                                        const IconComponent = NEARBY_ICONS.find(ni => ni.id === item.type)?.icon || MapPin;
                                                        return <IconComponent size={22} />;
                                                    })()}
                                                </div>
                                                <div className="flex-1 w-full grid grid-cols-1 md:grid-cols-3 gap-3">
                                                    <ModernSelect
                                                        value={item.type}
                                                        onChange={(val) => updateNearby(idx, 'type', val)}
                                                        options={[
                                                            { value: 'masjid', label: 'مسجد' },
                                                            { value: 'mall', label: 'مول تجاري' },
                                                            { value: 'restaurant', label: 'مطعم' },
                                                            { value: 'cafe', label: 'كافيه' },
                                                            { value: 'park', label: 'منتزه' },
                                                            { value: 'hospital', label: 'مستشفى' },
                                                            { value: 'airport', label: 'مطار' },
                                                            { value: 'landmark', label: 'معلم سياحي' },
                                                        ]}
                                                        placeholder="نوع المكان"
                                                    />
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
                                            <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-[10px] font-black">LIVE</span>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center justify-between py-4 border-b border-white/10">
                                                <span className="text-gray-400 font-bold text-sm">السعر الأساسي</span>
                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <NumericInput
                                                            value={hotel.price}
                                                            onChange={(val) => updateField('price', val)}
                                                            className="w-24 bg-white/10 rounded-lg px-3 py-2 text-primary-400 font-black text-right outline-none focus:bg-white/20 transition-all border-none"
                                                        />
                                                        <span className="text-xs text-white/40">ر.س</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between py-4 border-b border-white/10">
                                                <span className="text-gray-400 font-bold text-sm">عدد الغرف</span>
                                                <input
                                                    type="text"
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
                                            onClick={() => window.open(`/hotels/${hotel.id}`, '_blank')}
                                            className="w-full h-14 mt-6 bg-white text-gray-900 rounded-2xl font-black flex items-center justify-center gap-2 hover:bg-gray-100 transition-all"
                                        >
                                            <ExternalLink size={18} />
                                            معاينة صفحة الفندق
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
                                            { action: 'حجز جديد', time: 'منذ 2 ساعة', color: 'bg-emerald-500' },
                                            { action: 'تقييم 5 نجوم', time: 'منذ 5 ساعات', color: 'bg-primary-500' },
                                            { action: 'استفسار', time: 'أمس', color: 'bg-blue-500' },
                                        ].map((item, i) => (
                                            <div key={i} className="flex items-center gap-3">
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

                            <div className="grid gap-6">
                                {hotel.rooms?.map((room: any, idx: number) => (
                                    <motion.div
                                        key={room.id || idx}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-2xl transition-all overflow-hidden"
                                    >
                                        {/* Room Header */}
                                        <div className="p-5 md:p-8 bg-gradient-to-l from-gray-50 to-white border-b border-gray-100">
                                            <div className="flex flex-col md:flex-row items-start justify-between gap-6">
                                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 w-full">
                                                    <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-3xl flex items-center justify-center shadow-xl shrink-0">
                                                        <Bed size={40} />
                                                    </div>
                                                    <div>
                                                        <input
                                                            type="text"
                                                            value={room.name || 'غرفة بدون اسم'}
                                                            onChange={(e) => updateRoom(idx, 'name', e.target.value)}
                                                            className="text-xl md:text-2xl font-black text-gray-900 bg-transparent border-none outline-none focus:text-primary-600 w-full text-center sm:text-right"
                                                            placeholder="اسم الغرفة..."
                                                        />
                                                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 md:gap-4 mt-2">
                                                            <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${room.status === 'active' ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'
                                                                }`}>
                                                                {room.status === 'active' ? 'نشطة' : 'غير نشطة'}
                                                            </span>
                                                            <span className="text-sm font-bold text-gray-400">
                                                                متوفر: <span className="text-gray-900 font-black">{room.availableCount || 0}</span> غرفة
                                                            </span>
                                                            {(room.availableFrom || room.availableTo) && (
                                                                <span className="text-[10px] px-2 py-1 bg-blue-50 text-blue-600 rounded-lg font-bold">
                                                                    {room.availableFrom ? new Date(room.availableFrom).toLocaleDateString('ar-EG') : 'الآن'} - {room.availableTo ? new Date(room.availableTo).toLocaleDateString('ar-EG') : 'مفتوح'}
                                                                </span>
                                                            )}
                                                            <span className="text-lg md:text-xl font-black text-emerald-600">{room.price} ر.س / ليلة</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex w-full md:w-auto justify-end items-center gap-3 mt-4 md:mt-0 border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
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
                                        <div className="p-5 md:p-8 space-y-8">
                                            {/* Row 1: Basic Info */}
                                            {/* Row 1: Basic Info & Smart Groupings */}
                                            <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                                                {/* Type (Span 3) */}
                                                <div className="md:col-span-3 space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">نوع الغرفة</label>
                                                    <ModernSelect
                                                        value={['single', 'double', 'triple', 'quad', 'suite'].includes(room.type) ? room.type : 'custom'}
                                                        onChange={(val) => updateRoom(idx, 'type', val)}
                                                        options={[
                                                            { value: 'single', label: 'فردية (شخص واحد)' },
                                                            { value: 'double', label: 'زوجية (شخصين)' },
                                                            { value: 'triple', label: 'ثلاثية (3 أشخاص)' },
                                                            { value: 'quad', label: 'رباعية (4 أشخاص)' },
                                                            { value: 'suite', label: 'جناح فاخر' },
                                                            { value: 'custom', label: '✏️ تعديل مخصص...' },
                                                        ]}
                                                    />
                                                    {!['single', 'double', 'triple', 'quad', 'suite'].includes(room.type) && (
                                                        <input
                                                            type="text"
                                                            value={room.type === 'custom' ? '' : room.type}
                                                            onChange={(e) => updateRoom(idx, 'type', e.target.value)}
                                                            placeholder="اكتب اسم النوع..."
                                                            className="w-full h-12 px-4 bg-primary-50 rounded-xl border-2 border-primary-200 focus:bg-white focus:border-primary-500 font-bold text-sm outline-none transition-all mt-2"
                                                        />
                                                    )}
                                                </div>

                                                {/* Capacity & Size Group (Span 3) */}
                                                <div className="md:col-span-3 grid grid-cols-2 gap-2 bg-gray-50/50 p-2 rounded-xl border border-gray-100">
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase">السعة</label>
                                                        <div className="relative">
                                                            <NumericInput
                                                                value={typeof room.capacity === 'number' ? room.capacity : (room.capacity?.adults || 2)}
                                                                onChange={(val) => {
                                                                    // Update as object to match interface
                                                                    updateRoom(idx, 'capacity', { adults: val, children: 0 });
                                                                }}
                                                                className="w-full h-10 px-3 bg-white rounded-lg border border-gray-200 focus:border-primary-500 font-bold text-sm outline-none"
                                                            />
                                                            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[10px] text-gray-400">شخص</span>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <label className="text-[9px] font-black text-gray-400 uppercase">المساحة</label>
                                                        <NumericInput
                                                            value={room.size || 25}
                                                            onChange={(val) => updateRoom(idx, 'size', val)}
                                                            className="w-full h-10 px-3 bg-white rounded-lg border border-gray-200 focus:border-primary-500 font-bold text-sm outline-none"
                                                        />
                                                    </div>
                                                </div>



                                                {/* Price & Qty (Span 3) */}
                                                <div className="md:col-span-3 space-y-2">
                                                    <label className="text-[10px] font-black text-primary-600 uppercase tracking-widest">السعر الأساسي / ليلة</label>
                                                    <div className="flex gap-2">
                                                        <div className="relative flex-1">
                                                            <NumericInput
                                                                value={room.price ?? 0}
                                                                onChange={(val) => updateRoom(idx, 'price', val)}
                                                                className="w-full h-12 px-4 bg-primary-50 text-primary-700 rounded-xl border border-primary-100 focus:bg-white focus:border-primary-500 font-black text-lg outline-none"
                                                            />
                                                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-primary-500 font-bold">ر.س</span>
                                                        </div>
                                                        <div className="w-20">
                                                            <NumericInput
                                                                min={0}
                                                                value={room.availableCount || 0}
                                                                onChange={(val) => updateRoom(idx, 'availableCount', val)}
                                                                className="w-full h-12 px-2 bg-emerald-50 text-emerald-700 rounded-xl border border-emerald-100 focus:bg-white focus:border-emerald-500 font-black text-lg outline-none text-center"
                                                                title="الكمية المتاحة"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* View (Span 4) */}
                                                <div className="md:col-span-4 space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">👁️ الإطلالة</label>
                                                    <ModernSelect
                                                        value={room.view || ''}
                                                        onChange={(val) => updateRoom(idx, 'view', val)}
                                                        options={[
                                                            { value: '', label: 'اختر الإطلالة...' },
                                                            { value: 'إطلالة على المدينة', label: 'إطلالة على المدينة' },
                                                            { value: 'إطلالة على الكعبة', label: 'إطلالة على الكعبة' },
                                                            { value: 'إطلالة على المسجد النبوي', label: 'إطلالة على المسجد النبوي' },
                                                        ]}
                                                    />
                                                </div>

                                                {/* Availability Dates (Collapsible / Advanced) */}
                                                <div className="md:col-span-8 flex items-end">
                                                    <details className="w-full group">
                                                        <summary className="list-none flex items-center gap-2 cursor-pointer text-xs font-bold text-gray-400 hover:text-primary-600 transition-colors">
                                                            <span className="w-6 h-6 rounded-full bg-gray-100 flex items-center justify-center group-open:rotate-90 transition-transform">➤</span>
                                                            تخصيص تواريخ التوفر لهذه الغرفة فقط (اختياري)
                                                        </summary>
                                                        <div className="mt-3 p-4 bg-gray-50 rounded-xl border border-gray-100 grid grid-cols-2 gap-4">
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-400">من تاريخ</label>
                                                                <ModernDatePicker
                                                                    value={room.availableFrom ? new Date(room.availableFrom) : null}
                                                                    onChange={(date) => updateRoom(idx, 'availableFrom', date ? date.toISOString() : null)}
                                                                    placeholder="متاح دائماً"
                                                                />
                                                            </div>
                                                            <div className="space-y-1">
                                                                <label className="text-[10px] font-bold text-gray-400">إلى تاريخ</label>
                                                                <ModernDatePicker
                                                                    value={room.availableTo ? new Date(room.availableTo) : null}
                                                                    onChange={(date) => updateRoom(idx, 'availableTo', date ? date.toISOString() : null)}
                                                                    placeholder="مفتوح دائماً"
                                                                />
                                                            </div>
                                                        </div>
                                                    </details>
                                                </div>
                                            </div>

                                            {/* Row 2: Bed Config, Cancellation, Breakfast */}
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">🛏️ تفاصيل الأسرّة</label>
                                                    <ModernSelect
                                                        value={['1 سرير كينج', '2 سرير مفرد', '1 سرير كوين', '3 سرير مفرد', '1 سرير كينج + كنبة', '2 سرير كينج', '4 سرير مفرد'].includes(room.beds) ? room.beds : 'custom'}
                                                        onChange={(val) => updateRoom(idx, 'beds', val)}
                                                        options={[
                                                            { value: '1 سرير كينج', label: '1 سرير كينج' },
                                                            { value: '2 سرير مفرد', label: '2 سرير مفرد' },
                                                            { value: '1 سرير كوين', label: '1 سرير كوين' },
                                                            { value: '3 سرير مفرد', label: '3 سرير مفرد' },
                                                            { value: '1 سرير كينج + كنبة', label: '1 سرير كينج + كنبة' },
                                                            { value: '2 سرير كينج', label: '2 سرير كينج' },
                                                            { value: '4 سرير مفرد', label: '4 سرير مفرد' },
                                                            { value: 'custom', label: '✏️ تعديل مخصص...' },
                                                        ]}
                                                    />
                                                    {!['1 سرير كينج', '2 سرير مفرد', '1 سرير كوين', '3 سرير مفرد', '1 سرير كينج + كنبة', '2 سرير كينج', '4 سرير مفرد'].includes(room.beds) && (
                                                        <input
                                                            type="text"
                                                            value={room.beds === 'custom' ? '' : room.beds}
                                                            onChange={(e) => updateRoom(idx, 'beds', e.target.value)}
                                                            placeholder="اكتب تفاصيل الأسرّة..."
                                                            className="w-full h-12 px-4 bg-primary-50 rounded-xl border-2 border-primary-200 focus:bg-white focus:border-primary-500 font-bold text-sm outline-none transition-all mt-2"
                                                        />
                                                    )}
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">📋 سياسة الإلغاء</label>
                                                    <ModernSelect
                                                        value={room.cancellationPolicy || 'free'}
                                                        onChange={(val) => updateRoom(idx, 'cancellationPolicy', val)}
                                                        options={[
                                                            { value: 'free', label: 'إلغاء مجاني' },
                                                            { value: 'partial', label: 'إلغاء جزئي (50%)' },
                                                            { value: 'nonRefundable', label: 'غير قابل للإلغاء' },
                                                        ]}
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">🍽️ الوجبات</label>
                                                    <ModernSelect
                                                        value={room.breakfast || 'included'}
                                                        onChange={(val) => updateRoom(idx, 'breakfast', val)}
                                                        options={[
                                                            { value: 'included', label: 'شامل الفطور' },
                                                            { value: 'breakfastDinner', label: 'فطور وعشاء' },
                                                            { value: 'allInclusive', label: 'إقامة كاملة (3 وجبات)' },
                                                            { value: 'extra', label: 'بتكلفة إضافية' },
                                                            { value: 'notIncluded', label: 'بدون وجبات' },
                                                        ]}
                                                    />
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
                                                    <button
                                                        onClick={() => addRoomImage(idx)}
                                                        className="h-10 px-4 bg-gray-100 hover:bg-gray-200 rounded-xl font-bold text-xs text-gray-600 flex items-center gap-2 transition-all"
                                                    >
                                                        <Plus size={14} />
                                                        إضافة صورة
                                                    </button>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                                    {room.images?.map((img: string, imgIdx: number) => (
                                                        <div key={imgIdx} className="relative group">
                                                            <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 border-2 border-dashed border-gray-200">
                                                                {img ? (
                                                                    <img src={img} alt={`room-${idx}-img-${imgIdx}`} className="w-full h-full object-cover" />
                                                                ) : (
                                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                                        <ImageIcon size={24} />
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all rounded-xl flex flex-col items-center justify-center gap-2 p-2">
                                                                <input
                                                                    type="text"
                                                                    value={img}
                                                                    onChange={(e) => updateRoomImage(idx, imgIdx, e.target.value)}
                                                                    placeholder="رابط الصورة..."
                                                                    className="w-full h-8 px-2 bg-white/90 rounded-lg text-[10px] font-bold outline-none"
                                                                />
                                                                <button
                                                                    onClick={() => removeRoomImage(idx, imgIdx)}
                                                                    className="w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600"
                                                                >
                                                                    <Trash2 size={12} />
                                                                </button>
                                                            </div>
                                                            {imgIdx === 0 && img && (
                                                                <span className="absolute top-2 right-2 px-2 py-1 bg-primary-500 text-black rounded-md text-[8px] font-black">
                                                                    رئيسية
                                                                </span>
                                                            )}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {hotel.rooms?.length === 0 && (
                                    <div className="text-center py-20 bg-gray-50 rounded-[2rem]">
                                        <Bed size={60} className="mx-auto mb-6 text-gray-200" />
                                        <h3 className="text-xl font-black text-gray-400 mb-2">لا توجد غرف مضافة</h3>
                                        <p className="text-gray-400 font-bold mb-6">ابدأ بإضافة أول غرفة لهذا الفندق</p>
                                        <button
                                            onClick={addRoom}
                                            className="h-14 px-8 bg-gray-900 text-white rounded-2xl font-black inline-flex items-center gap-2"
                                        >
                                            <Plus size={20} />
                                            إضافة غرفة
                                        </button>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )
                    }

                    {/* Gallery Tab */}
                    {
                        activeTab === 'gallery' && (
                            <motion.div
                                key="gallery"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-8"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">معرض الصور</h2>
                                        <p className="text-gray-400 font-bold">أضف صور عالية الجودة لجذب المزيد من الحجوزات</p>
                                    </div>
                                    <button
                                        onClick={addGalleryImage}
                                        className="h-14 px-8 bg-gray-900 text-white rounded-2xl font-black flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                                    >
                                        <Upload size={20} />
                                        إضافة صورة
                                    </button>
                                </div>

                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                    {hotel.gallery?.map((img: string, idx: number) => (
                                        <motion.div
                                            key={idx}
                                            initial={{ opacity: 0, scale: 0.9 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            className={`relative rounded-2xl overflow-hidden group ${idx === 0 ? 'col-span-2 row-span-2' : ''}`}
                                        >
                                            <div className={`aspect-video bg-gray-100 ${idx === 0 ? 'aspect-square' : ''}`}>
                                                {img ? (
                                                    <img src={img} alt={`gallery-${idx}`} className="w-full h-full object-cover" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                        <ImageIcon size={40} />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                                <input
                                                    type="text"
                                                    value={img}
                                                    onChange={(e) => updateGalleryImage(idx, e.target.value)}
                                                    placeholder="رابط الصورة..."
                                                    className="w-full h-10 px-4 bg-white/90 backdrop-blur rounded-lg text-xs font-bold outline-none"
                                                />
                                                <div className="flex gap-2 mt-2">
                                                    {idx === 0 && (
                                                        <span className="px-3 py-1 bg-primary-500 text-black rounded-full text-[10px] font-black">
                                                            الصورة الرئيسية
                                                        </span>
                                                    )}
                                                    <button
                                                        onClick={() => removeGalleryImage(idx)}
                                                        className="ml-auto w-8 h-8 bg-red-500 text-white rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}

                                    {hotel.gallery?.length === 0 && (
                                        <div className="col-span-full text-center py-20 bg-gray-50 rounded-[2rem]">
                                            <ImageIcon size={60} className="mx-auto mb-6 text-gray-200" />
                                            <h3 className="text-xl font-black text-gray-400 mb-2">لا توجد صور</h3>
                                            <p className="text-gray-400 font-bold mb-6">أضف صور جذابة للفندق</p>
                                        </div>
                                    )}
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
                                className="max-w-3xl mx-auto space-y-8"
                            >
                                <div className="text-center mb-12">
                                    <h2 className="text-2xl font-black text-gray-900">إعدادات متقدمة</h2>
                                    <p className="text-gray-400 font-bold">تحكم كامل في خيارات العرض والظهور</p>
                                </div>

                                <div className="space-y-4">
                                    {/* Show in Search Results */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900">إظهار في نتائج البحث</h3>
                                            <p className="text-sm text-gray-400 font-medium">السماح للفندق بالظهور في صفحة البحث</p>
                                        </div>
                                        <button
                                            onClick={() => updateField('status', hotel.status === 'نشط' ? 'غير نشط' : 'نشط')}
                                            className={`w-14 h-8 rounded-full relative transition-colors ${hotel.status === 'نشط' ? 'bg-primary-500' : 'bg-gray-300'}`}
                                        >
                                            <div className={`absolute top-1 w-6 h-6 bg-white rounded-full shadow transition-all ${hotel.status === 'نشط' ? 'right-1' : 'left-1'}`} />
                                        </button>
                                    </div>

                                    {/* Instant Booking */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900">تفعيل الحجز الفوري</h3>
                                            <p className="text-sm text-gray-400 font-medium">تأكيد الحجوزات تلقائياً دون مراجعة</p>
                                        </div>
                                        <button
                                            // onClick={() => updateField('instantBooking', !hotel.instantBooking)}
                                            className="w-14 h-8 rounded-full relative transition-colors bg-primary-500 cursor-not-allowed opacity-80"
                                            title="هذه الميزة مفعلة افتراضياً"
                                        >
                                            <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow transition-all" />
                                        </button>
                                    </div>

                                    {/* Badge Label */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900">شارة تسويقية (Badge)</h3>
                                            <p className="text-sm text-gray-400 font-medium">نص يظهر كعلامة مميزة على كارت الفندق (مثال: خصم حصري، الأكثر مبيعاً)</p>
                                        </div>
                                        <div className="w-1/3">
                                            <input
                                                type="text"
                                                value={hotel.badge || ''}
                                                onChange={(e) => updateField('badge', e.target.value)}
                                                placeholder="اكتب الشارة هنا..."
                                                className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-gray-200 focus:bg-white focus:border-primary-500 font-bold text-sm outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Featured */}
                                    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm flex items-center justify-between border-primary-100 bg-primary-50/30">
                                        <div className="flex-1">
                                            <h3 className="font-black text-gray-900 flex items-center gap-2">
                                                <Crown size={16} className="text-primary-500" />
                                                عرض كعرض مميز
                                            </h3>
                                            <p className="text-sm text-gray-400 font-medium">إظهار الفندق في قسم العروض المميزة في الصفحة الرئيسية</p>
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
                                            className="w-14 h-8 rounded-full relative transition-colors bg-primary-500 cursor-not-allowed opacity-80"
                                            title="هذه الميزة مفعلة افتراضياً"
                                        >
                                            <div className="absolute top-1 right-1 w-6 h-6 bg-white rounded-full shadow transition-all" />
                                        </button>
                                    </div>
                                </div>

                                <div className="bg-red-50 rounded-2xl border border-red-100 p-6 mt-12">
                                    <h3 className="font-black text-red-900 mb-2">منطقة الخطر</h3>
                                    <p className="text-sm text-red-700 font-bold mb-4">حذف الفندق نهائياً من النظام. لا يمكن التراجع عن هذا الإجراء.</p>
                                    <button className="h-12 px-6 bg-red-600 text-white rounded-xl font-black text-sm hover:bg-red-700 transition-colors">
                                        حذف الفندق نهائياً
                                    </button>
                                </div>
                            </motion.div>
                        )
                    }
                </AnimatePresence >
            </div >
        </div >
    );
}
