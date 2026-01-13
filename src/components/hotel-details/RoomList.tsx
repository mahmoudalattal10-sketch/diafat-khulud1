import { Room } from '@/data/hotels';
import { BedDouble, Users, Maximize, Check, Plus, Star } from 'lucide-react';
import Image from 'next/image';

interface RoomListProps {
    rooms: Room[];
    selectedRoomId?: string | number;
    onSelectRoom?: (room: Room) => void;
}

export default function RoomList({ rooms, selectedRoomId, onSelectRoom }: RoomListProps) {
    if (!rooms || rooms.length === 0) {
        return (
            <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Star className="text-gray-300" size={24} />
                </div>
                <p className="text-gray-900 font-bold mb-1">لا تتوفر غرف مطابقة</p>
                <p className="text-gray-500 text-sm">جرب تغيير معايير البحث أو التواريخ</p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="w-2 h-6 bg-primary-500 rounded-full inline-block"></span>
                    خيارات الغرف
                </h2>
                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-3 py-1 rounded-full">
                    {rooms.length} خيارات متاحة
                </span>
            </div>

            <div className="grid gap-4">
                {rooms.map((room) => {
                    const isSelected = selectedRoomId === room.id;
                    const capacity = typeof room.capacity === 'number' ? room.capacity : (room.capacity?.adults || 2);

                    return (
                        <div
                            key={room.id}
                            className={`group bg-white rounded-2xl border transition-all duration-300 overflow-hidden relative flex flex-col md:flex-row ${isSelected
                                ? 'border-primary-500 shadow-lg ring-1 ring-primary-500 z-10'
                                : 'border-gray-100 hover:border-primary-200 hover:shadow-md'
                                }`}
                        >
                            {/* Selection Indicator Line */}
                            {isSelected && (
                                <div className="absolute top-0 bottom-0 right-0 w-1.5 bg-primary-500 z-20"></div>
                            )}

                            {/* Image Section */}
                            <div className="w-full md:w-64 h-48 md:h-auto relative shrink-0 bg-gray-100">
                                <Image
                                    src={(room.images && JSON.parse(JSON.stringify(room.images))[0]) || (Array.isArray(room.images) ? room.images[0] : '/images/hotels.png')}
                                    alt={room.name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            </div>

                            {/* Content Section */}
                            <div className="flex-1 p-5 flex flex-col md:flex-row gap-6">

                                {/* Info Column */}
                                <div className="flex-1 flex flex-col justify-center gap-3">
                                    <div>
                                        <div className="flex justify-between items-start">
                                            <h3 className={`text-lg font-bold transition-colors ${isSelected ? 'text-primary-700' : 'text-gray-900'}`}>
                                                {room.name}
                                            </h3>
                                        </div>

                                        {/* Specs - Clean Row */}
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500 font-medium mt-1.5">
                                            <div className="flex items-center gap-1.5">
                                                <Users size={14} className="text-primary-500" />
                                                <span>{capacity} ضيوف</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                            <div className="flex items-center gap-1.5">
                                                <Maximize size={14} className="text-secondary-500" />
                                                <span>{room.size} م²</span>
                                            </div>
                                            <div className="w-1 h-1 rounded-full bg-gray-300"></div>
                                            <div className="flex items-center gap-1.5">
                                                <BedDouble size={14} className="text-gray-400" />
                                                <span className="truncate max-w-[150px]">{room.beds}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Features / Amenities */}
                                    <div className="flex flex-wrap gap-2">
                                        {(typeof room.features === 'string' ? JSON.parse(room.features) : room.features).slice(0, 4).map((feat: string, i: number) => (
                                            <span
                                                key={i}
                                                className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-500 bg-gray-50/50 border border-gray-100 px-2 py-1 rounded-md"
                                            >
                                                <Check size={10} className="text-green-500" />
                                                {feat}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Action / Price Column */}
                                <div className="w-full md:w-48 shrink-0 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-end border-t md:border-t-0 md:border-r border-gray-50 pt-4 md:pt-0 md:pr-6 gap-3">
                                    <div className="text-left md:text-right">
                                        <div className="flex items-baseline gap-1 md:justify-end">
                                            <span className="text-2xl font-black text-gray-900">{room.price}</span>
                                            <span className="text-xs text-primary-600 font-bold">ر.س</span>
                                        </div>
                                        <div className="text-[10px] text-gray-400 font-medium">شامل الضرائب والرسوم</div>
                                    </div>

                                    <button
                                        onClick={() => onSelectRoom?.(room)}
                                        className={`
                                            relative overflow-hidden group/btn px-6 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 flex items-center gap-2
                                            ${isSelected
                                                ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30 w-full justify-center'
                                                : 'bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white w-full justify-center'
                                            }
                                        `}
                                    >
                                        {isSelected ? (
                                            <>
                                                <Check size={16} className="animate-in zoom-in duration-300" />
                                                <span>تم الاختيار</span>
                                            </>
                                        ) : (
                                            <>
                                                <span>إختر الغرفة</span>
                                                <Plus size={16} className="group-hover/btn:rotate-90 transition-transform duration-300" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
