'use client';

import { useState, useMemo, useEffect } from 'react';
import { Room, Hotel } from '@/data/hotels';
import { calculateSmartPrice } from '@/lib/pricing';
import { useHotelsStore } from '@/store/hotelsStore';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import HotelGallery from '@/components/hotel-details/HotelGallery';
import HotelInfo from '@/components/hotel-details/HotelInfo';
import RoomList from '@/components/hotel-details/RoomList';
import BookingWidget from '@/components/hotel-details/BookingWidget';
import ProposePriceWidget from '@/components/hotel-details/ProposePriceWidget';
import HotelAvailabilityBar from '@/components/hotel-details/HotelAvailabilityBar';
import HotelLandmarks from '@/components/hotel-details/HotelLandmarks';
import HotelReviews from '@/components/hotel-details/HotelReviews';
import HotelPolicies from '@/components/hotel-details/HotelPolicies';
import SimilarHotels from '@/components/hotel-details/SimilarHotels';
import { notFound, useRouter, useSearchParams } from 'next/navigation';
import { X, Sparkles, Navigation, Loader2 } from 'lucide-react';

export default function HotelDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    // Parse Search Params
    const checkInParam = searchParams.get('checkIn');
    const checkOutParam = searchParams.get('checkOut');
    const adultsParam = parseInt(searchParams.get('adults') || '2');
    const childrenParam = parseInt(searchParams.get('children') || '0');
    const roomsParam = parseInt(searchParams.get('rooms') || '1');

    const initialDates = {
        start: checkInParam ? new Date(checkInParam) : null,
        end: checkOutParam ? new Date(checkOutParam) : null
    };

    const initialGuestData = {
        adults: adultsParam,
        children: childrenParam,
        childAges: [5], // Default for now
        rooms: roomsParam
    };

    // Initialize searchCriteria for immediate filtering if params exist
    const hasSearchParams = checkInParam || searchParams.get('adults');
    const initialSearchCriteria = hasSearchParams ? {
        startDate: initialDates.start,
        endDate: initialDates.end,
        guestData: initialGuestData
    } : null;

    const getHotel = useHotelsStore(state => state.getHotel);
    const storeHotel = getHotel(params.id);
    const [hotel, setHotel] = useState<Hotel | null>(storeHotel || null);
    const [isLoading, setIsLoading] = useState(!storeHotel);
    const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
    const [searchCriteria, setSearchCriteria] = useState<any>(initialSearchCriteria);

    // Fetch hotel from API to ensure fresh data
    useEffect(() => {
        const fetchHotel = async () => {
            // Only show loader if we don't have store data yet
            if (!storeHotel) setIsLoading(true);

            try {
                const res = await fetch(`/api/hotels/${params.id}?t=${Date.now()}`, { cache: 'no-store' });
                if (!res.ok) {
                    if (!storeHotel) router.push('/hotels');
                    return;
                }
                const data = await res.json();
                setHotel(data);
            } catch (error) {
                console.error('Failed to fetch hotel:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchHotel();
    }, [params.id]);

    // Validate selectedRoom against fresh data
    useEffect(() => {
        if (hotel && selectedRoom) {
            const exists = hotel.rooms.some(r => r.id === selectedRoom.id);
            if (!exists) {
                console.log('Clearing stale selectedRoom', selectedRoom.id);
                setSelectedRoom(null);
            }
        }
    }, [hotel, selectedRoom]);

    // All hooks must be called before any conditional returns
    const filteredRooms = useMemo(() => {
        if (!hotel || !searchCriteria) return hotel?.rooms || [];

        // Filter by capacity (Including Extra Beds)
        return hotel.rooms.filter(room => {
            // Robust check for capacity (can be number or object)
            let baseCapacity = 2;
            if (typeof room.capacity === 'number') {
                baseCapacity = room.capacity;
            } else if (room.capacity?.adults) {
                baseCapacity = room.capacity.adults;
            }

            return baseCapacity >= searchCriteria.guestData.adults;
        });
    }, [hotel?.rooms, searchCriteria, hotel]);

    // Always get the freshest data for the selected room from the hotel object
    const derivedRoom = useMemo(() => {
        if (!hotel || !selectedRoom) return selectedRoom;
        return hotel.rooms.find(r => r.id === selectedRoom.id) || selectedRoom;
    }, [hotel, selectedRoom]);

    const hotelPrice = useMemo(() => {
        if (!derivedRoom) return 0;
        // ...
        const adults = searchCriteria?.guestData?.adults || 2;
        const children = searchCriteria?.guestData?.children || 0;

        let baseCapacity = 2;
        if (typeof derivedRoom.capacity === 'number') {
            baseCapacity = derivedRoom.capacity;
        } else if (derivedRoom.capacity?.adults) {
            baseCapacity = derivedRoom.capacity.adults;
        }

        const { totalPrice } = calculateSmartPrice({
            basePrice: derivedRoom.price,
            baseCapacity: baseCapacity,
            adults: adults,
            children: children,
            allowSingleDiscount: true
        });

        return totalPrice;
    }, [derivedRoom, searchCriteria]);

    // Show loading state
    if (isLoading) {
        return (
            <main className="min-h-screen bg-gray-50 font-cairo flex items-center justify-center">
                <div className="text-center">
                    <Loader2 className="animate-spin text-primary-500 mx-auto mb-4" size={48} />
                    <p className="text-gray-600 font-bold">جاري تحميل بيانات الفندق...</p>
                </div>
            </main>
        );
    }

    if (!hotel) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-gray-50 font-cairo text-right" dir="rtl">
            <Header />

            <div className="pt-28 pb-32 container-custom">
                {/* Breadcrumb (Optional) */}
                <div className="text-sm text-gray-500 mb-6 flex items-center gap-2">
                    <span>الرئيسية</span>
                    <span>/</span>
                    <span>فنادق مكة</span>
                    <span>/</span>
                    <span className="text-gray-900 font-bold">{hotel.name}</span>
                </div>

                <div className="flex flex-col gap-6 mb-8">
                    {/* Availability Bar - Top on Mobile, Bottom on Desktop */}
                    <div className="order-1 md:order-2">
                        <HotelAvailabilityBar
                            onSearch={(criteria) => setSearchCriteria(criteria)}
                            initialDates={initialDates}
                            initialData={initialGuestData}
                        />
                    </div>

                    {/* 1. Gallery Section - Bottom on Mobile, Top on Desktop */}
                    <div className="order-2 md:order-1">
                        <HotelGallery images={hotel.images} />
                    </div>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 relative mb-16">

                    {/* Right Column: Info & Rooms */}
                    <div className="lg:col-span-8 space-y-8">
                        <HotelInfo hotel={hotel} />

                        {/* Rooms Section - Immediately after amenities */}
                        <div id="rooms-section" className="scroll-mt-32">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-2xl font-bold text-gray-900">خيارات الغرف المتاحة</h2>
                                {searchCriteria && (
                                    <button
                                        onClick={() => setSearchCriteria(null)}
                                        className="flex items-center gap-2 text-xs font-black text-red-500 hover:text-red-600 transition-colors bg-red-50 px-4 py-2 rounded-full border border-red-100"
                                    >
                                        <X size={14} />
                                        إلغاء التصفية
                                    </button>
                                )}
                            </div>

                            {searchCriteria && (
                                <div className="mb-6 bg-primary-50/50 border border-primary-100 p-4 rounded-2xl flex items-center gap-3">
                                    <Sparkles className="text-primary-600" size={18} />
                                    <p className="text-sm font-bold text-gray-700">
                                        يتم عرض الغرف التي تتسع لـ <span className="text-primary-600">{searchCriteria.guestData.adults} بالغين</span> وأكثر
                                    </p>
                                </div>
                            )}

                            <RoomList
                                rooms={filteredRooms}
                                selectedRoomId={selectedRoom?.id}
                                onSelectRoom={(room) => setSelectedRoom(room)}
                            />
                        </div>

                        <HotelLandmarks />
                        <HotelReviews hotelId={hotel.id} />
                        <HotelPolicies />
                    </div>

                    {/* Left Column: Sticky Sidebar */}
                    <div className="hidden lg:block lg:col-span-4 h-full">
                        {/* Map Widget (Static - Scrolls away) */}
                        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                            <div className="h-48 relative">
                                {hotel.coordinates && hotel.coordinates[0] && hotel.coordinates[1] ? (
                                    <iframe
                                        src={`https://www.google.com/maps?q=${hotel.coordinates[0]},${hotel.coordinates[1]}&z=16&output=embed`}
                                        className="w-full h-full border-0"
                                        loading="lazy"
                                        referrerPolicy="no-referrer-when-downgrade"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                                        <Navigation className="text-gray-300" size={40} />
                                    </div>
                                )}
                            </div>
                            <div className="p-4 flex items-center justify-between border-t border-gray-50">
                                <div className="flex items-center gap-2 text-sm font-bold text-gray-600">
                                    <Navigation size={16} className="text-secondary-600" />
                                    <span>{hotel.distance} عن الحرم</span>
                                </div>
                                <a
                                    href={`https://www.google.com/maps?q=${hotel.coordinates?.[0] || 21.4225},${hotel.coordinates?.[1] || 39.8262}&layer=c&cbll=${hotel.coordinates?.[0] || 21.4225},${hotel.coordinates?.[1] || 39.8262}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-4 py-2 bg-secondary-50 text-secondary-700 rounded-xl font-bold text-xs hover:bg-secondary-100 transition-colors"
                                >
                                    <span>🔭</span>
                                    Street View
                                </a>
                            </div>
                        </div>

                        {/* Sticky Booking Widgets */}
                        <div className="sticky top-32 space-y-6">
                            <BookingWidget
                                hotelId={hotel.id}
                                hotelName={hotel.name}
                                hotelImage={hotel.images[0]}
                                price={hotelPrice}
                                rating={hotel.rating}
                                selectedRoom={derivedRoom}
                            />
                            <ProposePriceWidget
                                hotelName={hotel.name}
                                price={hotel.price}
                                tripDetails={{
                                    checkIn: searchCriteria?.startDate || new Date(2026, 0, 15),
                                    checkOut: searchCriteria?.endDate || new Date(2026, 0, 20),
                                    adults: searchCriteria?.guestData.adults || 2,
                                    children: searchCriteria?.guestData.children || 0,
                                    roomType: selectedRoom?.name || hotel.rooms[0]?.name || 'غرفة قياسية'
                                }}
                            />
                        </div>
                    </div>

                </div>

                {/* Similar Hotels Section */}
                <div className="pt-8 border-t border-gray-200">
                    <SimilarHotels />
                </div>
            </div>

            {/* Premium Mobile Booking Bar (Fixed Bottom) */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[92%] max-w-lg z-50">
                <div className="bg-gray-900/95 backdrop-blur-2xl border border-white/10 text-white p-5 rounded-[2.5rem] flex items-center justify-between shadow-[0_20px_50px_rgba(0,0,0,0.3)] relative overflow-hidden group border-b-primary-500/30">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-3xl -translate-y-16 translate-x-16 group-hover:bg-primary-500/20 transition-all duration-700"></div>

                    <div className="relative z-10">
                        <span className="text-[10px] text-gray-500 block font-black uppercase tracking-widest mb-1">الإجمالي الـمقدر</span>
                        <div className="flex items-baseline gap-1.5">
                            <span className={`text-2xl font-black transition-all duration-500 ${hotelPrice > 0 ? 'text-white' : 'text-gray-700'}`}>
                                {hotelPrice * (searchCriteria ? Math.max(1, Math.ceil((new Date(searchCriteria.endDate).getTime() - new Date(searchCriteria.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 5)}
                            </span>
                            <span className="text-[10px] font-black text-gray-500">ر.س</span>
                            <span className="text-[10px] font-bold text-gray-600 mr-1">
                                / {searchCriteria ? Math.max(1, Math.ceil((new Date(searchCriteria.endDate).getTime() - new Date(searchCriteria.startDate).getTime()) / (1000 * 60 * 60 * 24))) : 5} ليالي
                            </span>
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            if (!selectedRoom) {
                                document.getElementById('rooms-section')?.scrollIntoView({ behavior: 'smooth' });
                            } else {
                                window.location.href = `/checkout?hotelId=${hotel.id}&roomId=${selectedRoom.id}&price=${hotelPrice * 5}&hotelName=${encodeURIComponent(hotel.name)}&hotelImage=${encodeURIComponent(hotel.images[0])}`;
                            }
                        }}
                        className={`relative z-10 px-8 h-14 rounded-2xl font-black text-sm transition-all flex items-center gap-2 active:scale-95 ${selectedRoom ? 'bg-primary-500 text-black shadow-lg shadow-primary-500/25' : 'bg-white/5 text-white/40 hover:bg-white/10'}`}
                    >
                        {selectedRoom ? (
                            <>
                                <span>استكمال الحجز</span>
                                <Navigation size={18} className="rotate-90 group-hover:translate-x-1 transition-transform" />
                            </>
                        ) : (
                            <span>اختر الغرفة</span>
                        )}
                    </button>
                </div>
            </div>

            <Footer />
        </main >
    );
}
