import { Star, MapPin } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

// Dummy data reusing existing images
const SIMILAR_HOTELS = [
    { id: 2, name: 'سويس أوتيل المقام', rating: 4.8, price: 850, image: '/images/hotels/swissotel.jpg', distance: '100 متر من الحرم' },
    { id: 3, name: 'هيلتون مكة للمؤتمرات', rating: 4.7, price: 920, image: '/images/hotels/hilton.jpg', distance: '400 متر من الحرم' },
    { id: 5, name: 'فندق شيراتون مكة', rating: 4.5, price: 650, image: '/images/hotels/sheraton.jpg', distance: '1.2 كم من الحرم' },
];

export default function SimilarHotels() {
    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-black text-gray-900">قد يعجبك أيضاً</h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {SIMILAR_HOTELS.map((hotel) => (
                    <Link href={`/hotels/${hotel.id}`} key={hotel.id} className="group bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden">
                            <Image
                                src={hotel.image}
                                alt={hotel.name}
                                fill
                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold flex items-center gap-1 shadow-sm">
                                <Star size={12} className="text-primary-500 fill-current" />
                                <span>{hotel.rating}</span>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <h3 className="font-bold text-gray-900 mb-2 truncate group-hover:text-primary-600 transition-colors">{hotel.name}</h3>
                            <div className="flex items-center gap-1 text-gray-500 text-xs mb-4">
                                <MapPin size={12} />
                                <span>{hotel.distance}</span>
                            </div>
                            <div className="flex items-end justify-between border-t border-gray-100 pt-3">
                                <div>
                                    <span className="text-xs text-gray-400 block">يبدأ من</span>
                                    <span className="font-black text-lg text-emerald-900">{hotel.price} ر.س</span>
                                </div>
                                <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">عرض التفاصيل</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
