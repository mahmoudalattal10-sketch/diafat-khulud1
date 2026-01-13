
export interface Room {
    id: string;
    name: string;
    type: 'quad' | 'triple' | 'double' | 'suite';
    price: number;
    capacity: { adults: number; children: number };
    beds: string;
    size: string;
    view: string;
    features: string[];
    images: string[];
    availableFrom?: Date | string;
    availableTo?: Date | string;
    maxExtraBeds?: number;
    extraBedPrice?: number;
    occupancyPrices?: { [key: number]: number };
}

export interface Hotel {
    id: number;
    name: string;
    location: string;
    distance: string;
    coordinates: [number, number];
    rating: number;
    reviews: number;
    price: number;
    description: string;
    images: string[];
    badge?: string;
    features: string[];
    isFeatured?: boolean;
    availableFrom?: Date | string;
    availableTo?: Date | string;
    amenities: { icon: string; label: string }[];
    rooms: Room[];
    timeInMinutes?: number;
    nearby?: { label: string; dist: string; type: string }[];
}

export const STANDARD_AMENITIES = [
    { icon: 'Wifi', label: 'واي فاي مجاني' },
    { icon: 'Utensils', label: 'مطعم خاص' },
    { icon: 'Gym', label: 'نادي رياضي' },
    { icon: 'Wind', label: 'مكيف هواء' },
    { icon: 'Party', label: 'قاعة احتفالات' },
    { icon: 'Shirt', label: 'خدمة غسيل الملابس' },
    { icon: 'Waves', label: 'حمام بخار' },
    { icon: 'Accessibility', label: 'المساعدة' },
    { icon: 'CreditCard', label: 'البطاقات الائتمانية' },
    { icon: 'Bus', label: 'خدمة المواصلات' },
    { icon: 'Coffee', label: 'مقهى' },
    { icon: 'Baby', label: 'أنشطة للأطفال' },
    { icon: 'Car', label: 'موقف سيارات' },
    { icon: 'ArrowUpFromLine', label: 'المصاعد' },
    { icon: 'Plane', label: 'استقبال من وإلى المطار' },
    { icon: 'Briefcase', label: 'مركز رجال الأعمال' },
    { icon: 'Pool', label: 'حمام سباحة' }
];

export const HOTELS_DATA: Hotel[] = [
    // --- MAKKAH HOTELS ---
    {
        id: 1,
        name: 'سويس أوتيل المقام',
        location: 'مكة المكرمة، مجمع أبراج البيت',
        distance: '0 متر عن الحرم',
        coordinates: [21.4180, 39.8240],
        rating: 4.8,
        reviews: 5800,
        price: 650,
        isFeatured: true,
        badge: 'إطلالة الكعبة',
        description: 'جزء من مجمع أبراج البيت الرائع، يواجه الكعبة المشرفة ويوفر وصولاً مباشراً إلى المسجد الحرام من شارع إبراهيم الخليل ومدخل النفق. يتميز بغرف عصرية وإطلالات مهيبة.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['وصول مباشر', 'تسوق', 'إطلالة كعبة'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 2,
        name: 'المروة روتانا (ريحان)',
        location: 'مكة المكرمة، أبراج البيت',
        distance: '0 متر عن الحرم',
        coordinates: [21.4190, 39.8250],
        rating: 4.7,
        reviews: 4200,
        price: 700,
        isFeatured: true,
        badge: 'خيار فاخر',
        description: 'يقع في مجمع أبراج الساعة، ويوفر إطلالات على المسجد الحرام والكعبة. يوفر وصولاً مباشراً إلى الحرم ومركز تسوق مكون من 5 طوابق. ديكور عصري وألوان دافئة.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['إطلالة مباشرة', 'مول تجاري', 'مطاعم فاخرة'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 3,
        name: 'فندق شيراتون مكة جبل الكعبة',
        location: 'مكة المكرمة، جبل الكعبة',
        distance: '570 متر عن الحرم',
        coordinates: [21.4230, 39.8210],
        rating: 4.5,
        reviews: 1800,
        price: 450,
        description: 'يوفر سهولة الوصول إلى المسجد الحرام عبر جسر مشاة مكيف. يتميز بغرف واسعة وأجنحة وشقق بزخارف إسلامية، ويقدم خيارات متنوعة من المطاعم العالمية.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['جسر مشاة', 'شقق فندقية', 'عائلي'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 4,
        name: 'فندق العنوان جبل عمر',
        location: 'مكة المكرمة، جبل عمر',
        distance: '500 متر عن الحرم',
        coordinates: [21.4165, 39.8200],
        rating: 4.9,
        reviews: 950,
        price: 900,
        isFeatured: true,
        badge: 'الأحدث والأرقى',
        description: 'موطن "سكاي مصلى"، أعلى مصلى في جسر معلق في العالم. يقدم فخامة روحية وتطوراً عصرياً مع إطلالات بانورامية خلابة على الحرم المكي والكعبة.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['سكاي مصلى', 'بانوراما', 'فخامة'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 5,
        name: 'فوكو مكة',
        location: 'مكة المكرمة، المسفلة',
        distance: '1.3 كم عن الحرم',
        coordinates: [21.4120, 39.8260],
        rating: 4.4,
        reviews: 2100,
        price: 350,
        badge: 'قيمة ممتازة',
        description: 'فندق عصري يوفر خدمة نقل مجانية للحرم على مدار الساعة. يتميز بتصميم أنيق ومطاعم متعددة، وهو خيار مثالي لمن يبحث عن الجودة بسعر منافس.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['نقل مجاني', 'اقتصادي', 'عصري'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 6,
        name: 'فندق أنجم مكة',
        location: 'مكة المكرمة، جبل الكعبة',
        distance: '300 متر عن الحرم',
        coordinates: [21.4240, 39.8220],
        rating: 4.6,
        reviews: 3500,
        price: 500,
        description: 'يوفر إقامة عصرية مع إطلالات على الحرم، ويبعد مسافة قصيرة مشياً عن بوابة الملك فهد. يتميز بمدخل خاص ونفق يسهل الوصول للحرم.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['نفق خاص', 'إطلالة حرم', 'واسع'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 7,
        name: 'نوفوتيل مكة ذاخر سيتي',
        location: 'مكة المكرمة، حي الأندلس',
        distance: '3 كم عن الحرم',
        coordinates: [21.4350, 39.8350],
        rating: 4.3,
        reviews: 800,
        price: 280,
        description: 'يقع في حي ذاخر الجديد، يوفر خدمة نقل ترددي للحرم. فندق حديث بغرف مريحة وأسعار اقتصادية، مناسب للمجموعات والعائلات.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['نقل ترددي', 'حديث', 'سعر توفيري'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 8,
        name: 'فوربوينتس شيراتون النسيم',
        location: 'مكة المكرمة، حي النسيم',
        distance: '7 كم عن الحرم',
        coordinates: [21.3900, 39.8700],
        rating: 4.2,
        reviews: 1500,
        price: 220,
        badge: 'اقتصادي جداً',
        description: 'خيار اقتصادي ممتاز في حي النسيم الهادئ، بجوار جامع الراجحي. يوفر خدمة نقل مجانية للحرم ومرافق متكاملة.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['بجوار الراجحي', 'نقل مجاني', 'هادئ'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 9,
        name: 'ميلينيوم مكة النسيم',
        location: 'مكة المكرمة، حي النسيم',
        distance: '7 كم عن الحرم',
        coordinates: [21.3910, 39.8710],
        rating: 4.3,
        reviews: 1200,
        price: 240,
        description: 'يقع ضمن مجمع الراجحي، ويوفر خدمة نقل مريحة للحرم. فندق كبير ومناسب للحجاج والمعتمرين الباحثين عن الراحة بعيداً عن الزحام.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['مجمع الراجحي', 'نقل مريح', 'بوفيه'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 10,
        name: 'ريتاج الريان مكة',
        location: 'مكة المكرمة، الششة',
        distance: '2.5 كم عن الحرم',
        coordinates: [21.4300, 39.8500],
        rating: 4.0,
        reviews: 900,
        price: 200,
        description: 'خيار عملي واقتصادي قرب المشاعر المقدسة. يوفر غرفاً نظيفة وخدمة جيدة، ويبعد مسافة قصيرة بالسيارة عن الحرم.',
        images: ['/images/makkah.png', '/images/hotels.png'],
        features: ['قريب للمشاعر', 'اقتصادي', 'نظيف'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },

    // --- MADINAH HOTELS ---
    {
        id: 11,
        name: 'دار الإيمان إنتركونتيننتال',
        location: 'المدينة المنورة، المنطقة المركزية',
        distance: '0 متر عن الحرم',
        coordinates: [24.4690, 39.6100],
        rating: 4.9,
        reviews: 3500,
        price: 850,
        isFeatured: true,
        badge: 'قمة الفخامة',
        description: 'موقع مثالي في ساحة المسجد النبوي. غرف فاخرة مع إطلالات مباشرة، وخدمة عالمية، ومطاعم تقدم أشهى المأكولات.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['إطلالة مباشرة', 'ساحة الحرم', 'فاخر'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 12,
        name: 'سوفيتيل شهد المدينة',
        location: 'المدينة المنورة، المركزية',
        distance: '50 متر عن الحرم',
        coordinates: [24.4685, 39.6110],
        rating: 4.8,
        reviews: 2100,
        price: 750,
        isFeatured: true,
        badge: 'الأكثر رواجاً',
        description: 'يجمع بين الرفاهية الفرنسية والضيافة العربية. يبعد دقيقة مشياً عن الحرم (مدخل النساء). غرف أنيقة وحديثة.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['مدخل النساء', 'ستايل فرنسي', 'متميز'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 13,
        name: 'أنوار المدينة موفنبيك',
        location: 'المدينة المنورة، المركزية',
        distance: '100 متر عن الحرم',
        coordinates: [24.4682, 39.6116],
        rating: 4.5,
        reviews: 4200,
        price: 450,
        description: 'أكبر فندق في المدينة، يوفر مرافق واسعة للعائلات، مع مركز تجاري خاص وسوبر ماركت. خطوات بسيطة للوصول للحرم.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['وسيع', 'مول تجاري', 'مناسب للعائلات'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 14,
        name: 'فندق هيلتون المدينة',
        location: 'المدينة المنورة، المنطقة المركزية',
        distance: '80 متر عن الحرم',
        coordinates: [24.4680, 39.6125],
        rating: 4.7,
        reviews: 2800,
        price: 650,
        isFeatured: true,
        description: 'موقع استثنائي في قلب المنطقة المركزية. غرف أنيقة بطراز كلاسيكي وخدمة هيلتون المعروفة.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['خدمة هيلتون', 'مركزي', 'راقي'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 15,
        name: 'مناخة روتانا المدينة',
        location: 'المدينة المنورة، جنوب غرب المركزي',
        distance: '700 متر عن الحرم',
        coordinates: [24.4650, 39.6050],
        rating: 8.7,
        reviews: 5100,
        price: 400,
        badge: 'خيار ذكي',
        description: 'فندق حديث وعصري يبعد 14 دقيقة مشياً عن الحرم. يوفر 4 مطاعم وتراس مطل على الحرم، وخيار ممتاز للقيمة مقابل المال.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['جديد', 'عصري', 'إطلالة تراس'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 16,
        name: 'فندق مادن (MADEN)',
        location: 'المدينة المنورة، الشمالية',
        distance: '100 متر عن الحرم',
        coordinates: [24.4710, 39.6130],
        rating: 4.8,
        reviews: 1200,
        price: 900,
        isFeatured: true,
        badge: 'فخامة مطلقة',
        description: 'أحد أرقى الفنادق الجديدة، يقدم مستوى عالٍ من الفخامة العصرية. غرف واسعة جداً وإطلالات بانورامية خلابة على المسجد النبوي.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['واسع جداً', 'حديث وفخم', 'بانوراما'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 17,
        name: 'دار الهجرة إنتركونتيننتال',
        location: 'المدينة المنورة، المركزية',
        distance: '300 متر عن الحرم',
        coordinates: [24.4700, 39.6080],
        rating: 4.4,
        reviews: 1500,
        price: 500,
        description: 'تجربة كلاسيكية فاخرة بأسعار معقولة. يشتهر بمطعمه الذي يقدم أشهى المأكولات الآسيوية والعالمية.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['مأكولات آسيوية', 'كلاسيكي', 'خدمة ممتازة'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 18,
        name: 'كراون بلازا المدينة',
        location: 'المدينة المنورة، الجنوب',
        distance: '150 متر عن الحرم',
        coordinates: [24.4650, 39.6140],
        rating: 4.6,
        reviews: 1800,
        price: 550,
        description: 'يطل على الروضة الشريفة ويوفر أجواء روحانية. خدمة نقل ممتازة ومرافق مريحة للزوار.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['إطلالة روضة', 'مريح', 'خدمة نقل'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 19,
        name: 'ميلينيوم العقيق',
        location: 'المدينة المنورة، الغربية',
        distance: '200 متر عن الحرم',
        coordinates: [24.4670, 39.6080],
        rating: 4.5,
        reviews: 2200,
        price: 480,
        description: 'تصميم حديث وخدمات متكاملة، يقع بالقرب من بوابة السلام ومول مزايا، مما يجعله خياراً ممتازاً للتسوق والعبادة.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['قرب بوابة السلام', 'تسوق', 'حديث'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 20,
        name: 'إيلاف طيبة',
        location: 'المدينة المنورة، المركزية',
        distance: '100 متر عن الحرم',
        coordinates: [24.4688, 39.6111],
        rating: 4.3,
        reviews: 3100,
        price: 380,
        badge: 'اقتصادي',
        description: 'يشتهر بإفطاره الرائع وموقعه المميز القريب جداً من الحرم. خيار اقتصادي ومريح للعائلات.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['إفطار رائع', 'موقع ممتاز', 'توفيري'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    },
    {
        id: 21,
        name: 'فندق إعمار رويال',
        location: 'المدينة المنورة، الشمالية',
        distance: '150 متر عن الحرم',
        coordinates: [24.4705, 39.6125],
        rating: 4.5,
        reviews: 1900,
        price: 420,
        description: 'يقدم إقامة راقية مع خدمة ودودة وغرف نظيفة، قريب جداً من محطة النقل والمطار.',
        images: ['/images/madinah.png', '/images/hotels.png'],
        features: ['خدمة ودودة', 'موقع حيوي', 'نظيف'],
        amenities: STANDARD_AMENITIES,
        rooms: []
    }
];

export function getHotelById(id: number | string): Hotel | undefined {
    return HOTELS_DATA.find(h => h.id === Number(id));
}
