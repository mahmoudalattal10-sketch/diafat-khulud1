import { MapPin, ShoppingBag, Utensils, Plane, TrainFront } from 'lucide-react';

export default function HotelLandmarks() {
    // Dummy Data for visual
    const landmarks = [
        { name: 'المسجد الحرام', distance: '500 متر', time: '5 دقائق مشي', icon: MapPin, type: 'religious' },
        { name: 'أبراج البيت', distance: '600 متر', time: '7 دقائق مشي', icon: ShoppingBag, type: 'shopping' },
        { name: 'مطار الملك عبد العزيز', distance: '75 كم', time: '60 دقيقة سيارة', icon: Plane, type: 'transport' },
        { name: 'محطة قطار الحرمين', distance: '4 كم', time: '10 دقائق سيارة', icon: TrainFront, type: 'transport' },
        { name: 'مطعم البيك', distance: '200 متر', time: '2 دقيقة مشي', icon: Utensils, type: 'food' },
    ];

    return (
        <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <MapPin className="text-primary-600" />
                <span>ماذا يوجد بالجوار؟</span>
            </h2>

            <div className="space-y-6 relative">
                {/* Visual Timeline Line */}
                <div className="absolute top-2 bottom-2 right-[19px] w-0.5 bg-gray-100 hidden md:block"></div>

                {landmarks.map((place, index) => (
                    <div key={index} className="flex items-center gap-4 relative z-10 group">
                        {/* Icon Circle */}
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 shadow-sm border transition-colors ${place.type === 'religious' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                place.type === 'shopping' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                    'bg-gray-50 text-gray-500 border-gray-100 group-hover:bg-white group-hover:border-primary-200 group-hover:text-primary-600'
                            }`}>
                            <place.icon size={18} />
                        </div>

                        {/* Content */}
                        <div className="flex-1 flex justify-between items-center bg-gray-50 p-3 rounded-2xl group-hover:bg-white group-hover:shadow-md transition-all border border-transparent group-hover:border-gray-100">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm md:text-base">{place.name}</h3>
                                <p className="text-xs text-gray-400">{place.type === 'religious' ? 'معلم ديني' : place.type === 'shopping' ? 'تسوق' : 'نقل'}</p>
                            </div>
                            <div className="text-left">
                                <span className="block font-bold text-primary-600 text-sm">{place.time}</span>
                                <span className="block text-xs text-gray-400">{place.distance}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
