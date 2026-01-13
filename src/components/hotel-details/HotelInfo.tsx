import { Star, MapPin, ShieldCheck, Wifi, Coffee, Eye, Utensils, Bus, Wind, Dumbbell, Waves, Shirt, PartyPopper, Accessibility, CreditCard, Baby, Plane, ArrowUpFromLine, Car, Waves as Pool, Briefcase } from 'lucide-react';
import { Hotel } from '@/data/hotels';

// Map icon strings to simple components for now
const IconMap: any = {
    Wifi: Wifi,
    Coffee: Coffee,
    Eye: Eye,
    Utensils: Utensils,
    Bus: Bus,
    Wind: Wind,
    Gym: Dumbbell,
    Waves: Waves,
    Shirt: Shirt,
    Party: PartyPopper,
    Accessibility: Accessibility,
    CreditCard: CreditCard,
    Baby: Baby,
    Plane: Plane,
    ArrowUpFromLine: ArrowUpFromLine,
    Car: Car,
    Pool: Pool,
    Briefcase: Briefcase
};

interface HotelInfoProps {
    hotel: Hotel;
}

export default function HotelInfo({ hotel }: HotelInfoProps) {
    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 space-y-8 shadow-sm border border-gray-100">
            {/* Header */}
            <div>
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <div className="flex text-primary-500">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={16} fill={i < Math.floor(hotel.rating) ? "currentColor" : "none"} className={i < Math.floor(hotel.rating) ? "" : "text-gray-300"} />
                                ))}
                            </div>
                            <span className="text-sm font-bold text-gray-900 bg-gray-100 px-2 py-0.5 rounded text-xs">{hotel.rating} ممتاز</span>
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-900 mb-2 leading-tight">{hotel.name}</h1>
                        <div className="flex items-center gap-2 text-gray-500">
                            <MapPin size={18} className="text-primary-500" />
                            <span className="underline decoration-dashed underline-offset-4 cursor-pointer hover:text-primary-600 transition-colors">{hotel.location}</span>
                            <span className="w-1 h-1 bg-gray-300 rounded-full" />
                            <span className="text-emerald-600 font-bold text-sm bg-emerald-50 px-2 py-0.5 rounded-full">{hotel.distance}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Verification Badge */}
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                    <ShieldCheck size={20} className="text-blue-600" />
                </div>
                <div>
                    <h3 className="font-bold text-blue-900 mb-1">موثق من قبل وزارة الحج والعمرة</h3>
                    <p className="text-sm text-blue-700/80">هذا الفندق مرخص ومعتمد لاستقبال الحجاج والمعتمرين ويطبق كافة معايير الجودة.</p>
                </div>
            </div>

            {/* Description */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">عن الفندق</h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                    {hotel.description || "استمتع بإقامة روحانية لا تُنسى في هذا الفندق المتميز بإطلالاته الخلابة على المسجد الحرام. يوفر الفندق غرفاً وأجنحة واسعة مجهزة بأرقى وسائل الراحة، بالإضافة إلى مجموعة متنوعة من المطاعم التي تقدم أشهى المأكولات العالمية والمحلية."}
                </p>
            </div>

            {/* Amenities */}
            <div>
                <h2 className="text-xl font-bold text-gray-900 mb-4">أبرز المرافق</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-y-6 gap-x-4">
                    {hotel.amenities && hotel.amenities.length > 0 ? (
                        hotel.amenities.map((amenity, idx) => {
                            const Icon = IconMap[amenity.icon] || Star;
                            return (
                                <div key={idx} className="flex items-center gap-3 text-gray-700 hover:text-primary-600 transition-colors group">
                                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-50 group-hover:text-primary-600 transition-colors">
                                        <Icon size={20} />
                                    </div>
                                    <span className="font-medium text-sm">{amenity.label}</span>
                                </div>
                            );
                        })
                    ) : (
                        // Fallback defaults if no amenities list
                        ['واي فاي مجاني', 'مطعم', 'مكتب استقبال 24 ساعة', 'تكييف', 'مصعد', 'صندوق أمانات'].map((item, i) => (
                            <div key={i} className="flex items-center gap-3 text-gray-700">
                                <Star size={20} className="text-gray-400" />
                                <span className="font-medium">{item}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
