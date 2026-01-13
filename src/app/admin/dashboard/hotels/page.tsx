'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useHotelsStore } from '@/store/hotelsStore';
import {
    Plus,
    Search,
    Filter,
    Star,
    MapPin,
    Edit3,
    Trash2,
    MoreVertical,
    X,
    Loader2,
    Check,
    Image as ImageIcon,
    AlertTriangle,
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
    Bed,
    Info,
    Layout,
    List,
    Camera,
    Map as MapIcon,
    ChevronDown,
    Building2,
    Type
} from 'lucide-react';

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
    { id: 'Accessibility', icon: Accessibility, label: 'مرافق لذوي الاحتياجات' },
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

const INITIAL_HOTELS = [
    {
        id: 1,
        name: 'فندق العنوان جبل عمر',
        location: 'مكة المكرمة - جبل عمر',
        price: 750,
        rating: 5,
        rooms_count: 240,
        status: 'نشط',
        image: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070',
        description: 'يُقدم فندق العنوان جبل عمر مكة تجربة استثنائية من الفخامة والروحانية بحكم موقعه الاستراتيجي المطل على الكعبة المشرفة.',
        amenities: ['Wifi', 'Coffee', 'Gym', 'Waves', 'Car'],
        nearby: [
            { label: 'المسجد الحرام', dist: '5 دقائق مشي', type: 'MapPin' },
            { label: 'أبراج البيت', dist: '7 دقائق مشي', type: 'Briefcase' }
        ],
        rooms: [
            { id: 101, type: 'double', beds: '2 سرير فردي', view: 'إطلالة مدينة', price: 750, features: ['فطور', 'واي فاي'] },
            { id: 102, type: 'suite', beds: '1 سرير كينج', view: 'إطلالة كعبة', price: 1250, features: ['فطور', 'واي فاي', 'إطلالة'] }
        ],
        gallery: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2070',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070'
        ]
    },
    // ... other hotels will be simplified for demo
    { id: 2, name: 'بولمان زمزم مكة', location: 'مكة المكرمة - وقف الملك عبد العزيز', price: 420, rating: 5, rooms_count: 120, status: 'نشط', image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070' },
    { id: 3, name: 'أنوار المدينة موفنبيك', location: 'المدينة المنورة - المركزية الشمالية', price: 380, rating: 4, rooms_count: 85, status: 'غير نشط', image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=2070' },
];

export default function HotelsManagement() {
    // Use global store for hotels
    const { hotels: storeHotels, addHotel, updateHotel, deleteHotel, fetchHotels } = useHotelsStore();

    // Fetch on mount
    React.useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    // Map store hotels to the format expected by this page
    const hotels = useMemo(() => storeHotels.map(h => ({
        id: h.id,
        name: h.name,
        location: h.location,
        price: h.price,
        rating: Math.round(h.rating),
        rooms_count: h.rooms?.length || 0,
        status: 'نشط' as const,
        image: h.images?.[0] || '',
        description: h.description,
        amenities: h.amenities?.map(a => a.icon) || [],
        nearby: h.nearby || [],
        rooms: h.rooms || [],
        gallery: h.images || []
    })), [storeHotels]);

    const [searchQuery, setSearchQuery] = useState('');
    const [cityFilter, setCityFilter] = useState('كل المدن');
    const [sortBy, setSortBy] = useState('الأحدث');

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('basic');
    const [currentHotel, setCurrentHotel] = useState<any>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [deleteId, setDeleteId] = useState<number | null>(null);

    // Filtering & Sorting Logic
    const filteredHotels = useMemo(() => {
        let result = [...hotels].filter(hotel => {
            const matchesQuery = hotel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                hotel.location.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCity = cityFilter === 'كل المدن' || hotel.location.includes(cityFilter);
            return matchesQuery && matchesCity;
        });

        if (sortBy === 'أقل سعر') result.sort((a, b) => a.price - b.price);
        else if (sortBy === 'أعلى سعر') result.sort((a, b) => b.price - a.price);
        else result.sort((a, b) => b.id - a.id);

        return result;
    }, [hotels, searchQuery, cityFilter, sortBy]);

    const handleOpenModal = (hotel: any = null) => {
        setCurrentHotel(hotel || {
            name: '', location: 'مكة المكرمة', price: 0, rating: 5, rooms_count: 0, status: 'نشط',
            image: '', description: '', amenities: [], nearby: [], rooms: [], gallery: []
        });
        setActiveTab('basic');
        setIsModalOpen(true);
    };

    const handleSave = () => {
        setIsSaving(true);
        setTimeout(() => {
            if (currentHotel.id) {
                // Update existing hotel in global store
                updateHotel(currentHotel.id, {
                    name: currentHotel.name,
                    location: currentHotel.location,
                    price: currentHotel.price,
                    description: currentHotel.description,
                    images: currentHotel.gallery,
                    rooms: currentHotel.rooms,
                    nearby: currentHotel.nearby,
                });
            } else {
                // Add new hotel to global store
                addHotel({
                    name: currentHotel.name,
                    location: currentHotel.location,
                    distance: '0 متر',
                    coordinates: [21.4225, 39.8262] as [number, number],
                    rating: currentHotel.rating,
                    reviews: 0,
                    price: currentHotel.price,
                    description: currentHotel.description || '',
                    images: currentHotel.gallery || [],
                    features: [],
                    amenities: [],
                    rooms: currentHotel.rooms || [],
                    nearby: currentHotel.nearby || [],
                });
            }
            setIsSaving(false);
            setIsModalOpen(false);
        }, 1000);
    };

    const handleDelete = (id: number) => {
        deleteHotel(id);
        setDeleteId(null);
    };

    const toggleAmenity = (id: string) => {
        const current = currentHotel.amenities || [];
        if (current.includes(id)) {
            setCurrentHotel({ ...currentHotel, amenities: current.filter((item: string) => item !== id) });
        } else {
            setCurrentHotel({ ...currentHotel, amenities: [...current, id] });
        }
    };

    const addNearby = () => {
        setCurrentHotel({ ...currentHotel, nearby: [...(currentHotel.nearby || []), { label: '', dist: '', type: 'MapPin' }] });
    };

    const updateNearby = (index: number, field: string, value: string) => {
        const newList = [...(currentHotel.nearby || [])];
        newList[index] = { ...newList[index], [field]: value };
        setCurrentHotel({ ...currentHotel, nearby: newList });
    };

    const removeNearby = (index: number) => {
        setCurrentHotel({ ...currentHotel, nearby: currentHotel.nearby.filter((_: any, i: number) => i !== index) });
    };

    const addRoom = () => {
        setCurrentHotel({ ...currentHotel, rooms: [...(currentHotel.rooms || []), { type: 'double', beds: '', view: '', price: 0, features: [] }] });
    };

    const updateRoom = (index: number, field: string, value: any) => {
        const newList = [...(currentHotel.rooms || [])];
        newList[index] = { ...newList[index], [field]: value };
        setCurrentHotel({ ...currentHotel, rooms: newList });
    };

    const removeRoom = (index: number) => {
        setCurrentHotel({ ...currentHotel, rooms: currentHotel.rooms.filter((_: any, i: number) => i !== index) });
    };

    const addGalleryImage = () => {
        setCurrentHotel({ ...currentHotel, gallery: [...(currentHotel.gallery || []), ''] });
    };

    const updateGalleryImage = (index: number, value: string) => {
        const newList = [...(currentHotel.gallery || [])];
        newList[index] = value;
        setCurrentHotel({ ...currentHotel, gallery: newList });
    };

    const removeGalleryImage = (index: number) => {
        setCurrentHotel({ ...currentHotel, gallery: currentHotel.gallery.filter((_: any, i: number) => i !== index) });
    };

    return (
        <div className="space-y-8 pb-10">
            {/* Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 mb-2">إدارة الفنادق والبرامج</h1>
                    <p className="text-gray-500 font-bold">بناء الوجهة، إدارة التفاصيل، والتحكم في الأسعار.</p>
                </div>
                <Link
                    href="/admin/dashboard/hotels/new"
                    className="h-14 px-8 bg-black text-white rounded-2xl font-black text-sm flex items-center gap-2 hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                >
                    <Plus size={18} />
                    <span>إضافة فندق جديد</span>
                </Link>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="relative flex-1 group w-full">
                    <Search size={20} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors" />
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="ابحث عن فنادق، مدن، أو تصنيفات..."
                        className="w-full h-14 pr-12 pl-6 bg-white rounded-2xl border border-gray-100 focus:border-primary-500/30 outline-none font-medium transition-all shadow-sm"
                    />
                </div>
                <div className="flex gap-4 w-full md:w-auto">
                    <select value={cityFilter} onChange={(e) => setCityFilter(e.target.value)} className="w-40 h-14 px-6 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-50 shadow-sm">
                        <option value="كل المدن">كل المدن</option>
                        <option value="مكة المكرمة">مكة المكرمة</option>
                        <option value="المدينة المنورة">المدينة المنورة</option>
                    </select>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-48 h-14 px-6 bg-white border border-gray-100 rounded-2xl font-bold text-gray-600 outline-none cursor-pointer hover:bg-gray-50 shadow-sm">
                        <option value="الأحدث">ترتيب: الأحدث</option>
                        <option value="أقل سعر">ترتيب: أقل سعر</option>
                        <option value="أعلى سعر">ترتيب: أعلى سعر</option>
                    </select>
                </div>
            </div>

            {/* Hotels Grid */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {filteredHotels.map((hotel) => (
                    <motion.div key={hotel.id} layout className="bg-white rounded-3xl lg:rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden flex flex-col sm:flex-row group hover:shadow-2xl transition-all duration-500">
                        <div className="sm:w-1/3 h-48 sm:h-auto relative overflow-hidden shrink-0">
                            <img src={hotel.image || '/images/hotels.png'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={hotel.name} />
                            <div className="absolute top-4 left-4"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${hotel.status === 'نشط' ? 'bg-emerald-500 text-white' : 'bg-gray-400 text-white'}`}>{hotel.status}</span></div>
                        </div>
                        <div className="flex-1 p-5 lg:p-8 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-1">{[...Array(5)].map((_, idx) => <Star key={idx} size={12} className={idx < hotel.rating ? "text-primary-500 fill-primary-500" : "text-gray-200"} />)}</div>
                                    <span className="text-[10px] font-black text-gray-400">ID: {hotel.id}</span>
                                </div>
                                <h3 className="text-xl font-black text-gray-900 mb-2 truncate">{hotel.name}</h3>
                                <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400 mb-6"><MapPin size={14} />{hotel.location}</div>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    <div className="p-4 bg-gray-50 rounded-2xl"><div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">يبدأ من</div><div className="text-lg font-black text-emerald-600">{hotel.price} $</div></div>
                                    <div className="p-4 bg-gray-50 rounded-2xl"><div className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">متاح حالياً</div><div className="text-lg font-black text-gray-900">{hotel.rooms_count || 0} غرفة</div></div>
                                </div>
                            </div>
                            <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                                <Link href={`/admin/dashboard/hotels/${hotel.id}`} className="h-10 px-4 bg-black text-white rounded-xl text-xs font-black hover:bg-gray-800 transition-colors flex items-center gap-2">
                                    <Edit3 size={14} /><span>تعديل التفاصيل</span>
                                </Link>
                                <button onClick={() => setDeleteId(hotel.id)} className="w-10 h-10 flex items-center justify-center bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-xl transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Advanced Multi-Tab Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsModalOpen(false)} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="relative w-full max-w-5xl bg-white rounded-[3rem] shadow-2xl overflow-hidden flex flex-col h-[90vh]">
                            {/* Modal Header */}
                            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-gray-900 text-white rounded-2xl flex items-center justify-center">
                                        <Building2 size={24} />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900">{currentHotel?.id ? 'تعديل الفندق' : 'إضافة فندق جديد'}</h2>
                                        <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">إدارة متكاملة للعرض العام</p>
                                    </div>
                                </div>
                                <button onClick={() => setIsModalOpen(false)} className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"><X size={24} /></button>
                            </div>

                            {/* Tabs Navigation */}
                            <div className="flex px-4 lg:px-10 gap-6 lg:gap-8 bg-gray-50/50 border-b border-gray-100 shrink-0 overflow-x-auto custom-scrollbar no-scrollbar">
                                {[
                                    { id: 'basic', label: 'الأساسية', icon: Layout },
                                    { id: 'details', label: 'المرافق', icon: Info },
                                    { id: 'rooms', label: 'الغرف', icon: Bed },
                                    { id: 'media', label: 'الصور', icon: Camera }
                                ].map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`flex items-center gap-2 py-4 lg:py-6 font-black text-xs lg:text-sm transition-all relative shrink-0 ${activeTab === tab.id ? 'text-primary-600' : 'text-gray-400 hover:text-gray-600'}`}
                                    >
                                        <tab.icon size={18} />
                                        <span>{tab.label}</span>
                                        {activeTab === tab.id && <motion.div layoutId="activeTabUnderline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary-500 rounded-full" />}
                                    </button>
                                ))}
                            </div>

                            {/* Modal Content - Scrollable area */}
                            <div className="flex-1 overflow-y-auto p-10 custom-scrollbar">
                                {activeTab === 'basic' && (
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2"><label className="text-sm font-black text-gray-600 mr-2">اسم الفندق</label><input type="text" value={currentHotel?.name} onChange={(e) => setCurrentHotel({ ...currentHotel, name: e.target.value })} className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold" /></div>
                                            <div className="space-y-2"><label className="text-sm font-black text-gray-600 mr-2">الموقع</label><input type="text" value={currentHotel?.location} onChange={(e) => setCurrentHotel({ ...currentHotel, location: e.target.value })} className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold" /></div>
                                            <div className="space-y-2"><label className="text-sm font-black text-gray-600 mr-2">سعر البداية</label><input type="text" inputMode="numeric" value={currentHotel?.price ?? ''} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d*\.?\d*$/.test(val)) setCurrentHotel({ ...currentHotel, price: val === '' ? '' : val }); }} onBlur={(e) => setCurrentHotel({ ...currentHotel, price: parseFloat(e.target.value) || 0 })} className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold" /></div>
                                            <div className="space-y-2"><label className="text-sm font-black text-gray-600 mr-2">الحالة</label><select value={currentHotel?.status} onChange={(e) => setCurrentHotel({ ...currentHotel, status: e.target.value })} className="w-full h-14 px-6 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold"><option value="نشط">نشط</option><option value="غير نشط">غير نشط</option></select></div>
                                        </div>
                                        <div className="space-y-2"><label className="text-sm font-black text-gray-600 mr-2">عن الفندق (الوصف العام)</label><textarea value={currentHotel?.description} onChange={(e) => setCurrentHotel({ ...currentHotel, description: e.target.value })} className="w-full h-40 p-6 bg-gray-50 rounded-3xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold resize-none" /></div>
                                    </div>
                                )}

                                {activeTab === 'details' && (
                                    <div className="space-y-12">
                                        <div>
                                            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2"><Check className="text-emerald-500" size={20} /> المرافق المتاحة</h3>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                {AMENITY_ICONS.map(item => (
                                                    <button key={item.id} onClick={() => toggleAmenity(item.id)} className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${currentHotel.amenities.includes(item.id) ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-white border-gray-100 text-gray-400 hover:border-gray-300'}`}>
                                                        <item.icon size={20} /><span className="text-xs font-black">{item.label}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <div className="flex items-center justify-between mb-6">
                                                <h3 className="text-lg font-black text-gray-900 flex items-center gap-2"><MapPin className="text-primary-500" size={20} /> معالم قريبة (ماذا يوجد بالجوار)</h3>
                                                <button onClick={addNearby} className="text-sm font-black text-primary-600 flex items-center gap-1 hover:underline"><Plus size={16} /> إضافة معلم</button>
                                            </div>
                                            <div className="space-y-4">
                                                {currentHotel.nearby?.map((item: any, idx: number) => (
                                                    <div key={idx} className="flex gap-4 items-center bg-gray-50 p-4 rounded-2xl group">
                                                        <select value={item.type} onChange={(e) => updateNearby(idx, 'type', e.target.value)} className="w-16 h-12 bg-white rounded-xl border border-gray-100 text-center text-gray-500">
                                                            {NEARBY_ICONS.map(icon => <option key={icon.id} value={icon.id}>{icon.label}</option>)}
                                                        </select>
                                                        <input type="text" value={item.label} placeholder="اسم المعلم" onChange={(e) => updateNearby(idx, 'label', e.target.value)} className="flex-1 h-12 px-4 bg-white rounded-xl border border-gray-100 font-bold text-sm" />
                                                        <input type="text" value={item.dist} placeholder="المسافة/الوقت" onChange={(e) => updateNearby(idx, 'dist', e.target.value)} className="w-40 h-12 px-4 bg-white rounded-xl border border-gray-100 font-bold text-sm" />
                                                        <button onClick={() => removeNearby(idx)} className="w-12 h-12 text-red-500 hover:bg-red-50 rounded-xl flex items-center justify-center transition-all"><Trash2 size={18} /></button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'rooms' && (
                                    <div className="space-y-6">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-black text-gray-900">أنواع الغرف المتوفرة</h3>
                                            <button onClick={addRoom} className="px-6 h-12 bg-black text-white rounded-xl font-black text-xs flex items-center gap-2 hover:bg-gray-800 transition-all"><Plus size={16} /> إضافة نوع غرفة</button>
                                        </div>
                                        <div className="grid grid-cols-1 gap-6">
                                            {currentHotel.rooms?.map((room: any, idx: number) => (
                                                <div key={idx} className="bg-gray-50 rounded- [2.5rem] p-8 border border-transparent hover:border-primary-500/20 transition-all">
                                                    <div className="flex justify-between items-start mb-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary-500 shadow-sm"><Bed size={20} /></div>
                                                            <h4 className="font-black text-gray-900">تكوين الغرفة #{idx + 1}</h4>
                                                        </div>
                                                        <button onClick={() => removeRoom(idx)} className="text-red-500 hover:text-red-700 font-bold text-xs flex items-center gap-1"><Trash2 size={14} /> حذف</button>
                                                    </div>
                                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">نوع الغرفة</label><select value={room.type} onChange={(e) => updateRoom(idx, 'type', e.target.value)} className="w-full h-12 px-4 bg-white rounded-xl border border-gray-100 font-bold text-sm"><option value="single">فردية</option><option value="double">زوجية</option><option value="triple">ثلاثية</option><option value="quad">رباعية</option><option value="suite">جناح</option></select></div>
                                                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">توزيع الأسرة</label><input type="text" value={room.beds} onChange={(e) => updateRoom(idx, 'beds', e.target.value)} className="w-full h-12 px-4 bg-white rounded-xl border border-gray-100 font-bold text-sm" /></div>
                                                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">الإطلالة</label><input type="text" value={room.view} onChange={(e) => updateRoom(idx, 'view', e.target.value)} className="w-full h-12 px-4 bg-white rounded-xl border border-gray-100 font-bold text-sm" /></div>
                                                        <div className="space-y-2"><label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mr-2">السعر / الليلة</label><input type="text" inputMode="numeric" value={room.price ?? ''} onChange={(e) => { const val = e.target.value; if (val === '' || /^\d*\.?\d*$/.test(val)) updateRoom(idx, 'price', val === '' ? '' : val); }} onBlur={(e) => updateRoom(idx, 'price', parseFloat(e.target.value) || 0)} className="w-full h-12 px-4 bg-white rounded-xl border border-gray-100 font-bold text-sm" /></div>
                                                    </div>
                                                    <div className="mt-6 flex flex-wrap gap-2">
                                                        {['فطور', 'واي فاي', 'إطلالة كعبة', 'شامل الضريبة'].map(tag => (
                                                            <button key={tag} onClick={() => {
                                                                const tags = room.features || [];
                                                                const newTags = tags.includes(tag) ? tags.filter((t: string) => t !== tag) : [...tags, tag];
                                                                updateRoom(idx, 'features', newTags);
                                                            }} className={`px-4 py-2 rounded-full text-[10px] font-bold transition-all border ${room.features?.includes(tag) ? 'bg-primary-500 text-black border-transparent' : 'bg-white text-gray-500 border-gray-100'}`}>{tag}</button>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'media' && (
                                    <div className="space-y-8">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-lg font-black text-gray-900">معرض الصور وواجهة الفندق</h3>
                                            <button onClick={addGalleryImage} className="text-sm font-black text-primary-600 flex items-center gap-1"><Plus size={16} /> إضافة صورة</button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-4">
                                                <div className="space-y-2"><label className="text-sm font-black text-gray-600">الصورة الرئيسية (البطاقة)</label><input type="text" value={currentHotel?.image} onChange={(e) => setCurrentHotel({ ...currentHotel, image: e.target.value })} className="w-full h-12 px-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-xs" /></div>
                                                <div className="space-y-4 pt-4 border-t border-gray-100">
                                                    <label className="text-sm font-black text-gray-600">صور المعرض الإضافية</label>
                                                    {currentHotel.gallery?.map((img: string, idx: number) => (
                                                        <div key={idx} className="flex gap-2">
                                                            <input type="text" value={img} onChange={(e) => updateGalleryImage(idx, e.target.value)} className="flex-1 h-12 px-4 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary-500 outline-none font-bold text-xs" />
                                                            <button onClick={() => removeGalleryImage(idx)} className="w-12 h-12 bg-red-50 text-red-500 rounded-xl flex items-center justify-center shrink-0"><Trash2 size={16} /></button>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 h-fit">
                                                <div className="aspect-video bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                                                    {currentHotel.image && <img src={currentHotel.image} alt="main" className="w-full h-full object-cover" />}
                                                </div>
                                                {currentHotel.gallery?.slice(0, 3).map((img: string, i: number) => (
                                                    <div key={i} className="aspect-video bg-gray-50 rounded-3xl overflow-hidden border border-gray-100">
                                                        {img && <img src={img} alt={`gall-${i}`} className="w-full h-full object-cover" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Modal Footer */}
                            <div className="p-8 bg-gray-50/50 border-t border-gray-100 flex gap-4 shrink-0">
                                <button onClick={() => setIsModalOpen(false)} className="flex-1 h-16 bg-white border border-gray-200 text-gray-600 rounded-2xl font-black hover:bg-gray-100 transition-all">إلغاء التعديلات</button>
                                <button
                                    onClick={handleSave}
                                    disabled={isSaving}
                                    className="flex-[2] h-16 bg-black text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-3"
                                >
                                    {isSaving ? <Loader2 className="animate-spin text-primary-500" size={24} /> : <Check size={24} className="text-primary-500" />}
                                    <span>{isSaving ? 'جاري الحفظ...' : 'حفظ كافة التفاصيل'}</span>
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

            {/* Simple Delete Confirmation */}
            <AnimatePresence>
                {deleteId && (
                    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
                        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-[3rem] p-10 text-center max-w-sm">
                            <AlertTriangle className="mx-auto mb-6 text-red-500" size={48} />
                            <h3 className="text-2xl font-black mb-4">تأكيد الحذف؟</h3>
                            <div className="flex gap-4">
                                <button onClick={() => setDeleteId(null)} className="flex-1 h-14 bg-gray-100 rounded-2xl font-black">إلغاء</button>
                                <button onClick={() => { if (deleteId) handleDelete(deleteId); }} className="flex-1 h-14 bg-red-600 text-white rounded-2xl font-black">حذف</button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
}
