import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Standard Amenities Mapping
const AMENITY_MAP: Record<string, string> = {
    'واي فاي مجاني': 'Wifi',
    'مواقف سيارات مجانية': 'ParkingCircle',
    'مواقف سيارات': 'ParkingCircle',
    'غرف عائلية': 'Users',
    'مركز لياقة بدنية': 'Dumbbell',
    'مطعم': 'Utensils',
    'غرف لغير المدخنين': 'CigaretteOff',
    'خدمة الغرف': 'ConciergeBell',
    'مكتب استقبال على مدار 24 ساعة': 'Clock',
    'مرافق ذوي الاحتياجات الخاصة': 'Accessibility',
    'آلة صنع الشاي/القهوة': 'Coffee',
    'إفطار جيد': 'Croissant',
    'إطلالة على الحرم': 'Eye',
    'إطلالة على المدينة': 'Building',
    'خدمة نقل': 'Bus',
    'سبا ومركز عافية': 'Sparkles',
    'مقهى': 'Coffee',
    'تكييف': 'Wind',
    'مرافق غسيل الملابس': 'Shirt',
    'مركز أعمال': 'Briefcase',
    'قاعات اجتماعات': 'Briefcase'
};

const HOTELS_DATA: any[] = [
    // ====== MAKKAH HOTELS ======
    {
        id: 1,
        name: 'فوربوينتس شيراتون النسيم',
        location: 'خلف مسجد الراجحي، الطريق الدائري الثالث، حي النسيم، مكة المكرمة',
        latitude: 21.396347,
        longitude: 39.871583,
        distance: '6.0 كم من الحرم',
        rating: 4.2,
        reviews: 13789,
        price: 220,
        isFeatured: false,
        badge: 'قيمة ممتازة',
        description: 'يقع فندق فور بوينتس باي شيراتون مكة المكرمة النسيم في حي النسيم الهادئ على مقربة من المسجد الحرام. يتميز الفندق بتصميمه العصري ويوفر خدمة نقل مجانية منتظمة إلى الحرم. حصل على تقييمات عالية للنظافة والراحة من الضيوف، ويعتبر خياراً ممتازاً للإقامة الاقتصادية مع الحفاظ على معايير الجودة العالمية.',
        images: [
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560448204-e897cda51f87?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['خدمة نقل مجانية', 'طراز عثماني', 'إفطار جيد'],
        amenities: ['واي فاي مجاني', 'خدمة نقل', 'مواقف سيارات مجانية', 'مطعم', 'غرف عائلية']
    },
    {
        id: 2,
        name: 'ميلينيوم مكة المكرمة النسيم',
        location: 'مجمع الراجحي، الطريق الدائري الثالث، حي النسيم، مكة المكرمة',
        latitude: 21.396568,
        longitude: 39.872473,
        distance: '6.0 كم من الحرم',
        rating: 4.1,
        reviews: 10567,
        price: 240,
        isFeatured: false,
        badge: 'مناسب للعائلات',
        description: 'يعد فندق ميلينيوم مكة المكرمة النسيم جزءاً من مجمع الراجحي المتكامل، ويوفر بيئة مريحة للحجاج والمعتمرين. يتميز الفندق بغرفه الواسعة ومرافقه الممتازة، مع خدمة نقل منتظمة كل 15-30 دقيقة إلى الحرم المكي الشريف. حصل على تقييمات عالية للنظافة والطاقم الودود.',
        images: [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['خدمة نقل منتظمة', 'مجمع متكامل', 'بوفيه متنوع'],
        amenities: ['واي فاي مجاني', 'خدمة نقل', 'مواقف سيارات مجانية', 'مطعم', 'مركز لياقة بدنية']
    },
    {
        id: 3,
        name: 'فوكو مكة المكرمة',
        location: 'شارع إبراهيم الخليل، حي المسفلة، مكة المكرمة',
        latitude: 21.411132,
        longitude: 39.825838,
        distance: '1.3 كم من الحرم',
        rating: 4.4,
        reviews: 12050,
        price: 280,
        isFeatured: true,
        badge: 'فندق حديث 2023',
        description: 'فندق فوكو مكة المكرمة هو فندق حديث افتتح عام 2023، ويضم أكثر من 4321 غرفة وجناحاً. يوفر الفندق خدمة نقل مجانية ومتكررة إلى الحرم المكي الشريف على مدار الساعة. حصل على تقييمات استثنائية للنظافة (9.3) والراحة (9.3) والمرافق (9.1)، مما يجعله خياراً رائعاً للعائلات والمجموعات.',
        images: [
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['فندق حديث جداً', 'خدمة نقل 24/7', 'مواقف مجانية'],
        amenities: ['واي فاي مجاني', 'خدمة نقل', 'مواقف سيارات مجانية', 'مطعم', 'مركز لياقة بدنية', 'غرف عائلية']
    },
    {
        id: 4,
        name: 'المروة ريحان من روتانا',
        location: 'شارع أجياد، أبراج البيت (وقف الملك عبدالعزيز)، الحرم، مكة المكرمة',
        latitude: 21.418961,
        longitude: 39.826066,
        distance: '0.0 كم من الحرم',
        rating: 4.2,
        reviews: 9383,
        price: 680,
        isFeatured: true,
        badge: 'في أبراج البيت',
        description: 'يقع فندق المروة ريحان من روتانا في الصف الأول من مجمع أبراج البيت المرموق، ويوفر إطلالات مباشرة لا مثيل لها على المسجد الحرام والكعبة المشرفة. يتميز بموقعه الاستثنائي والطاقم الودود والمتعاون، ويقدم تجربة ضيافة عربية أصيلة مع وسائل راحة حديثة.',
        images: [
            'https://images.unsplash.com/photo-1596700465243-718663844837?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1574621035072-a0e28f3237f3?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['في برج الساعة', 'إطلالة مباشرة', 'موقع استثنائي'],
        amenities: ['واي فاي مجاني', 'مطعم', 'خدمة الغرف', 'مكتب استقبال على مدار 24 ساعة']
    },
    {
        id: 5,
        name: 'فندق أنجم مكة المكرمة',
        location: 'شارع جبل الكعبة، حي جرول، مكة المكرمة',
        latitude: 21.425464,
        longitude: 39.821422,
        distance: '0.05 كم من الحرم',
        rating: 4.7,
        reviews: 15451,
        price: 520,
        isFeatured: true,
        badge: '50 خطوة من الحرم',
        description: 'يتميز فندق أنجم مكة المكرمة بموقعه الاستراتيجي الاستثنائي - على بعد 50 خطوة فقط من بوابة الملك عبدالله في الحرم. حصل على تقييم ممتاز 9.4/10 على بوكينج، مع تقييمات عالية للنظافة (9.5) والطاقم (9.5). يمزج الفندق بين الضيافة الحجازية الأصيلة والخدمات العصرية.',
        images: [
            'https://images.unsplash.com/photo-1590073242678-cfe2f7926715?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512918760532-3ed1df0736bc?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1562790351-d273a961e05b?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['موقع ممتاز جداً', 'نفق خاص', 'إفطار متنوع'],
        amenities: ['واي فاي مجاني', 'غرف عائلية', 'مرافق ذوي الاحتياجات الخاصة', 'مطعم', 'خدمة الغرف']
    },
    {
        id: 6,
        name: 'نوفوتيل مكة المكرمة ذاخر سيتي',
        location: 'حي الأندلس (مشروع ذاخر)، مكة المكرمة',
        latitude: 21.442123,
        longitude: 39.835123,
        distance: '2.7 كم من الحرم',
        rating: 4.2,
        reviews: 14156,
        price: 260,
        isFeatured: false,
        badge: 'نظافة عالية',
        description: 'فندق نوفوتيل مكة المكرمة ذاخر سيتي هو وجهة عصرية حديثة توفر الراحة والهدوء. حاصل على شهادة المفتاح الأخضر للاستدامة. حصل على تقييمات عالية جداً للنظافة (8.8) والراحة (8.9)، مع خدمة نقل للحرم كل 30 دقيقة. مثالي للباحثين عن إقامة اقتصادية بجودة عالمية.',
        images: [
            'https://images.unsplash.com/photo-1621293954908-9fd2cf78fe70?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590490359683-65813b246bfd?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['فندق مستدام', 'خدمة نقل', 'غرف واسعة'],
        amenities: ['واي فاي مجاني', 'خدمة نقل', 'مواقف سيارات مجانية', 'مطعم', 'مركز لياقة بدنية']
    },
    {
        id: 7,
        name: 'شيراتون مكة المكرمة جبل الكعبة',
        location: 'جرول، جبل الكعبة، مكة المكرمة',
        latitude: 21.430030,
        longitude: 39.822260,
        distance: '0.5 كم من الحرم',
        rating: 4.2,
        reviews: 3941,
        price: 450,
        isFeatured: false,
        badge: 'جسر خاص',
        description: 'يقع فندق شيراتون مكة المكرمة جبل الكعبة في موقع متميز ويوفر جسراً خاصاً للمشاة يوصل مباشرة إلى المسجد الحرام. حصل على تقييمات عالية للنظافة (8.8) والطاقم الاحترافي (8.9). يتميز الفندق بتصاميم داخلية أنيقة وغرف واسعة ومريحة.',
        images: [
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['جسر للحرم', 'غرف واسعة', 'طاقم محترف'],
        amenities: ['واي فاي مجاني', 'مركز لياقة بدنية', 'مطعم', 'خدمة الغرف', 'غرف عائلية']
    },
    {
        id: 8,
        name: 'فندق العنوان جبل عمر',
        location: 'طريق الأمير محمد بن سلمان، حي الشبيكة، جبل عمر، مكة المكرمة',
        latitude: 21.419512,
        longitude: 39.818987,
        distance: '0.4 كم من الحرم',
        rating: 4.5,
        reviews: 14000,
        price: 850,
        isFeatured: true,
        badge: 'فخامة راقية',
        description: 'فندق العنوان جبل عمر مكة المكرمة هو أيقونة الفخامة الحديثة، حاصل على تقييم ممتاز 9.0/10. يقع على مقربة من المسجد الحرام ويتميز بتصميمه المعماري الفريد وغرفه الواسعة والمجهزة بشكل ممتاز. يوفر مناظر خلابة للحرم ومستوى خدمة استثنائي.',
        images: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1596700465243-718663844837?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606046604972-77cc51695ce8?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['تصميم عصري', 'نظافة فائقة', 'خدمة احترافية'],
        amenities: ['واي فاي مجاني', 'سبا ومركز عافية', 'مركز لياقة بدنية', 'مطعم', 'غرف عائلية', 'خدمة الغرف']
    },
    {
        id: 9,
        name: 'سويس أوتيل المقام مكة المكرمة',
        location: 'برج F، مجمع أبراج البيت، شارع إبراهيم الخليل، مكة المكرمة',
        latitude: 21.418571,
        longitude: 39.825528,
        distance: '0.1 كم من الحرم',
        rating: 4.45,
        reviews: 24000,
        price: 750,
        isFeatured: true,
        badge: 'في برج الساعة',
        description: 'يقع فندق سويس أوتيل المقام مكة المكرمة ضمن مجمع أبراج البيت المرموق، على بعد 100-200 متر من المسجد الحرام مع مدخل خاص. حصل على تقييم رائع 8.9/10 مع تقييمات استثنائية للموقع (9.4) والنظافة (9.1) والراحة (9.2). يوفر إطلالات مباشرة على الكعبة من بعض الغرف.',
        images: [
            'https://images.unsplash.com/photo-1565058865430-81f1852d7729?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['في برج الساعة', 'مدخل خاص', 'إطلالة على الكعبة'],
        amenities: ['واي فاي مجاني', 'خدمة الغرف', 'مطعم', 'غرف عائلية', 'مكتب استقبال على مدار 24 ساعة']
    },
    {
        id: 10,
        name: 'ريتاج البيت',
        location: 'مجمع أبراج البيت، شارع أجياد، مكة المكرمة',
        latitude: 21.418721,
        longitude: 39.826388,
        distance: '0.0 كم من الحرم',
        rating: 4.2,
        reviews: 9400,
        price: 450,
        isFeatured: false,
        badge: 'مجمع أبراج البيت',
        description: 'يقع فندق ريتاج البيت في قلب مجمع أبراج البيت، ويوفر وصولاً سهلاً ومباشراً إلى المسجد الحرام. يتميز الفندق بغرفه المريحة وطاقمه المتفاني في الخدمة، مما يجعله خياراً مفضلاً للكثير من المعتمرين والحجاج الباحثين عن الراحة والقرب.',
        images: [
            'https://images.unsplash.com/photo-1522771753035-1a5b6564f36c?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560067174-c5a3a8f3d620?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1616486029423-aaa478965c96?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1594563703937-fd6963124996?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['في أبراج البيت', 'قرب فائق', 'خدمات متكاملة'],
        amenities: ['واي فاي مجاني', 'مطعم', 'خدمة الغرف', 'مكتب استقبال على مدار 24 ساعة']
    },

    // ====== MADINAH HOTELS ======
    {
        id: 11,
        name: 'مناخة روتانا المدينة',
        location: 'شارع أبو أيوب الأنصاري، المنطقة المركزية، المدينة المنورة',
        latitude: 24.466540,
        longitude: 39.608120,
        distance: '0.3 كم من الحرم',
        rating: 4.35,
        reviews: 5150,
        price: 480,
        isFeatured: false,
        badge: 'موقع ممتاز',
        description: 'يوفر فندق مناخة روتانا إقامة حديثة ومريحة في المدينة المنورة. حصل على تقييم ممتاز 8.7/10، مع تقييمات استثنائية للموقع (9.0) والنظافة (9.0). يتميز بقربه من المسجد النبوي وخدماته الراقية من سلسلة روتانا العالمية.',
        images: [
            'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['قريب من الحرم', 'نظافة عالية', 'خدمة روتانا'],
        amenities: ['واي فاي مجاني', 'مركز لياقة بدنية', 'مطعم', 'غرف عائلية', 'خدمة الغرف']
    },
    {
        id: 12,
        name: 'دار الإيمان إنتركونتيننتال',
        location: 'الصف الأول، المنطقة المركزية الشمالية، المدينة المنورة',
        latitude: 24.471444,
        longitude: 39.610972,
        distance: '0.0 كم من الحرم',
        rating: 4.4,
        reviews: 5800,
        price: 720,
        isFeatured: true,
        badge: 'في ساحة الحرم',
        description: 'يقع فندق دار الإيمان إنتركونتيننتال في موقع استثنائي في ساحة المسجد النبوي الشريف. حصل على تقييم رائع 8.8/10، مع تقييمات استثنائية للموقع (9.7) والطاقم (9.3) والنظافة (9.1). يوفر إطلالات مباشرة على القبة الخضراء ويعتبر من أرقى فنادق المدينة.',
        images: [
            'https://images.unsplash.com/photo-1548680650-61bcd4ad8b3a?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['موقع في الساحة', 'إطلالة مباشرة', 'طاقم ممتاز'],
        amenities: ['واي فاي مجاني', 'خدمة الغرف', 'مطعم', 'مكتب استقبال على مدار 24 ساعة', 'غرف عائلية']
    },
    {
        id: 13,
        name: 'سوفيتيل شهد المدينة',
        location: 'طريق الملك فهد، حي بضاعة، المنطقة المركزية الشمالية، المدينة المنورة',
        latitude: 24.470944,
        longitude: 39.610556,
        distance: '0.1 كم من الحرم',
        rating: 4.35,
        reviews: 6826,
        price: 650,
        isFeatured: true,
        badge: 'أناقة فرنسية',
        description: 'فندق سوفيتيل شهد المدينة يجمع بين الأناقة الفرنسية وكرم الضيافة العربية. حصل على تقييم رائع 8.7/10، مع تقييم استثنائي للموقع (9.5). يقع مقابل المسجد النبوي مباشرة على بعد دقيقة واحدة سيراً، ويتميز بمستوى خدمة راقي وطعام ممتاز.',
        images: [
            'https://images.unsplash.com/photo-1562916124-67253457c10c?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606046604972-77cc51695ce8?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['تصميم فاخر', 'موقع استثنائي', 'طعام راقي'],
        amenities: ['واي فاي مجاني', 'مطعم', 'مركز لياقة بدنية', 'خدمة الغرف', 'سبا ومركز عافية']
    },
    {
        id: 14,
        name: 'أنوار المدينة موفنبيك',
        location: 'المنطقة المركزية، حي بضاعة، المدينة المنورة',
        latitude: 24.470389,
        longitude: 39.609944,
        distance: '0.2 كم من الحرم',
        rating: 4.0,
        reviews: 12134,
        price: 550,
        isFeatured: false,
        badge: 'الأكبر حجماً',
        description: 'يعد فندق أنوار المدينة موفنبيك أكبر فندق في المدينة المنورة بآلاف الغرف، ويوفر مرافق شاملة تلبي احتياجات العائلات والمجموعات. يتميز بموقعه القريب جداً من الحرم وتنوع خيارات الطعام فيه. الموقع وسهولة الوصول للمسجد النبوي أبرز ما يميزه.',
        images: [
            'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['سعة كبيرة', 'موقع قريب', 'إفطار متنوع'],
        amenities: ['واي فاي مجاني', 'غرف عائلية', 'مطعم', 'مركز لياقة بدنية', 'خدمة الغرف']
    },
    {
        id: 15,
        name: 'المدينة المنورة هيلتون',
        location: 'طريق الملك فهد، المنطقة المركزية الشمالية، المدينة المنورة',
        latitude: 24.471194,
        longitude: 39.610750,
        distance: '0.3 كم من الحرم',
        rating: 4.35,
        reviews: 5230,
        price: 590,
        isFeatured: false,
        badge: 'علامة عالمية',
        description: 'يقدم فندق هيلتون المدينة المنورة معايير الضيافة العالمية في قلب المدينة المقدسة. حصل على تقييم ممتاز 8.7/10. يقع على مسافة قصيرة جداً من المسجد النبوي (2-3 دقائق سيراً)، ويتميز بغرفه الأنيقة والخدمةالممتازة والمتاجر في الطابق الأرضي.',
        images: [
            'https://images.unsplash.com/photo-1560448204-e897cda51f87?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1554646408-20d0f7f320b9?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['علامة هيلتون', 'موقع قريب', 'متاجر بالموقع'],
        amenities: ['واي فاي مجاني', 'مواقف سيارات', 'مطعم', 'مركز لياقة بدنية', 'خدمة الغرف']
    },
    {
        id: 16,
        name: 'دار الهجرة إنتركونتيننتال',
        location: 'طريق الملك فهد، المنطقة المركزية، المدينة المنورة',
        latitude: 24.471806,
        longitude: 39.611472,
        distance: '0.15 كم من الحرم',
        rating: 4.4,
        reviews: 5300,
        price: 500,
        isFeatured: false,
        badge: 'كلاسيكي عريق',
        description: 'فندق دار الهجرة إنتركونتيننتال هو أحد أعرق الفنادق في المدينة المنورة. حصل على تقييم ممتاز 8.8/10، مع تقييمات استثنائية للموقع (9.2) والطاقم (9.3). يتميز بطرازه الكلاسيكي وخدمته العريقة، على بعد 1-2 دقيقة سيراً من المسجد النبوي.',
        images: [
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1551522435-a13afa10f103?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1616486029423-aaa478965c96?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['موقع ممتاز', 'خدمة عريقة', 'طقم احترافي'],
        amenities: ['واي فاي مجاني', 'مطعم', 'مركز أعمال', 'خدمة الغرف', 'مكتب استقبال على مدار 24 ساعة']
    },
    {
        id: 17,
        name: 'فندق مادن',
        location: 'طريق الملك فهد، حي بضاعة، المنطقة المركزية الشمالية، المدينة المنورة',
        latitude: 24.471028,
        longitude: 39.610194,
        distance: '0.1 كم من الحرم',
        rating: 4.25,
        reviews: 3602,
        price: 750,
        isFeatured: true,
        badge: 'حديث وفاخر',
        description: 'يعد فندق مادن من أحدث وأرقى الفنادق في المدينة المنورة. حصل على تقييم جيد جداً 8.5/10، مع تقييمات عالية جداً للموقع (9.3-9.5). يقع في الجهة الشمالية من المسجد النبوي على بعد دقائق قليلة سيراً. يتميز بتصميمه المعماري الحديث وإفطاره المتنوع.',
        images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1606046604972-77cc51695ce8?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['فندق حديث', 'موقع قريب جداً', 'إفطار ممتاز'],
        amenities: ['واي فاي مجاني', 'سبا ومركز عافية', 'مطعم', 'خدمة الغرف', 'مركز لياقة بدنية']
    },
    {
        id: 18,
        name: 'كراون بلازا المدينة المنورة',
        location: 'طريق الملك فيصل، المنطقة المركزية الجنوبية، المدينة المنورة',
        latitude: 24.465528,
        longitude: 39.612083,
        distance: '0.2 كم من الحرم',
        rating: 4.1,
        reviews: 2867,
        price: 520,
        isFeatured: false,
        badge: 'موقع ممتاز',
        description: 'يقع فندق كراون بلازا المدينة في موقع مميز جداً على بعد 200-300 متر من المسجد النبوي (5-7 دقائق سيراً). حصل على تقييم جيد جداً 8.2/10. يتميز بطاقمه الودود والمتعاون، ونظافته العالية، وإفطاره الممتاز. مناسب لرجال الأعمال والزوار على حد سواء.',
        images: [
            'https://images.unsplash.com/photo-1560662105-57f8ad6ae2d1?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1529290130-4ca3753253ae?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1589330694653-4d5bd2398b5a?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['موقع قريب', 'طاقم ودود', 'إفطار جيد'],
        amenities: ['واي فاي مجاني', 'مركز لياقة بدنية', 'مطعم', 'قاعات اجتماعات', 'خدمة الغرف']
    },
    {
        id: 19,
        name: 'ميلينيوم العقيق',
        location: 'شارع مصعب بن عمير، حي بضاعة، المنطقة المركزية الغربية، المدينة المنورة',
        latitude: 24.470556,
        longitude: 39.608972,
        distance: '0.05 كم من الحرم',
        rating: 4.5,
        reviews: 5500,
        price: 420,
        isFeatured: true,
        badge: 'قريب جداً',
        description: 'يتميز فندق ميلينيوم العقيق بموقعه الاستثنائي القريب جداً من المسجد النبوي. حصل على تقييم ممتاز 9.0/10، مع إشادات كبيرة بموقعه القريب من مداخل السيدات. يتميز بنظافته العالية وطاقمه المهذب والمتعاون، ويقدم قيمة جيدة جداً مقابل المال.',
        images: [
            'https://images.unsplash.com/photo-1594563703937-fd6963124996?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1496417263034-38ec4f0d6b21?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1596700465243-718663844837?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['موقع استثنائي', 'قريب للسيدات', 'طاقم ممتاز'],
        amenities: ['واي فاي مجاني', 'مطعم', 'مواقف سيارات', 'خدمة الغرف', 'مكتب استقبال على مدار 24 ساعة']
    },
    {
        id: 20,
        name: 'إيلاف طيبة',
        location: 'طريق السلام، حي بضاعة، المنطقة المركزية، المدينة المنورة',
        latitude: 24.469972,
        longitude: 39.608556,
        distance: '0.05 كم من الحرم',
        rating: 4.85,
        reviews: 869,
        price: 380,
        isFeatured: true,
        badge: 'تقييم استثنائي',
        description: 'فندق إيلاف طيبة حصل على تقييم استثنائي 9.7/10 على بوكينج! يقع في الصف الأول أمام المسجد النبوي مباشرة (70-150 متر فقط). حصل على تقييمات مثالية تقريباً: الموقع (9.7)، النظافة (9.7)، الطاقم (9.7). يعتبر أفضل قيمة مقابل المال في المدينة.',
        images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1512918760532-3ed1df0736bc?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['في الصف الأول', 'تقييمات مثالية', 'قيمة ممتازة'],
        amenities: ['واي فاي مجاني', 'مطعم', 'مكتب استقبال على مدار 24 ساعة', 'خدمة الغرف', 'آلة صنع الشاي/القهوة']
    },
    {
        id: 21,
        name: 'إعمار رويال',
        location: 'طريق الملك فيصل، المنطقة المركزية الشمالية، المدينة المنورة',
        latitude: 24.472028,
        longitude: 39.610444,
        distance: '0.1 كم من الحرم',
        rating: 4.6,
        reviews: 4300,
        price: 360,
        isFeatured: false,
        badge: 'قيمة جيدة',
        description: 'فندق إعمار رويال يقع في المنطقة الشمالية المركزية على بعد 100 متر من المسجد النبوي (2-3 دقائق سيراً). حصل على تقييم رائع 8.9/10، مع تقييمات عالية للموقع (9.2) والنظافة (9.1) والطاقم (9.2). يقدم مزيجاً ممتازاً من الراحة والقيمة بسعر معقول.',
        images: [
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1554646408-20d0f7f320b9?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1560185007-cde436f6a4d0?q=80&w=1080&auto=format&fit=crop'
        ],
        features: ['موقع قريب', 'نظيف جداً', 'طاقم ودود'],
        amenities: ['واي فاي مجاني', 'مطعم', 'غرف لغير المدخنين', 'مكتب استقبال على مدار 24 ساعة']
    },
];

// Standard Rooms with generic images
const DEFAULT_ROOMS = [
    {
        name: 'غرفة ديلوكس مزدوجة',
        type: 'Deluxe Double',
        price: 100,
        capacityAdults: 2,
        capacityChildren: 1,
        beds: '1 Double Bed',
        size: '28m²',
        view: 'المدينة',
        features: ['واي فاي مجاني', 'تكييف', 'تلفزيون شاشة مسطحة', 'ميني بار'],
        images: [
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1080&auto=format&fit=crop'
        ],
        status: 'active',
        maxExtraBeds: 0,
        extraBedPrice: 0,
        availableCount: 10
    },
    {
        name: 'جناح تنفيذي',
        type: 'Executive Suite',
        price: 350,
        capacityAdults: 3,
        capacityChildren: 2,
        beds: '1 King, 1 Sofa Bed',
        size: '45m²',
        view: 'إطلالة جزئية',
        features: ['غرفة معيشة', 'إفطار مجاني', 'مكتب عمل', 'حمام فاخر'],
        images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1080&auto=format&fit=crop',
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1080&auto=format&fit=crop'
        ],
        status: 'active',
        maxExtraBeds: 1,
        extraBedPrice: 150,
        availableCount: 5
    }
];

function calculateWalkingTime(distanceStr: string): number {
    // Extract number from string like "1.3 كم من الحرم" or "0.05 كم"
    const match = distanceStr.match(/(\d+\.?\d*)/);
    if (!match) return 0;

    const km = parseFloat(match[1]);
    // Average walking speed is ~5km/h, which is ~12 mins per km
    // For very short distances like 0.05km, it's about 1 min
    return Math.max(1, Math.round(km * 12));
}

async function main() {
    console.log('Starting seed process...');

    console.log('Ensuring amenities exist...');
    const allUsedAmenities = new Set<string>();
    HOTELS_DATA.forEach(h => h.amenities.forEach((a: string) => allUsedAmenities.add(a)));

    const amenityIdMap = new Map<string, string>();

    for (const label of Array.from(allUsedAmenities)) {
        const icon = AMENITY_MAP[label] || 'Sparkles';

        let amenity = await prisma.amenity.findFirst({
            where: { label: label }
        });

        if (!amenity) {
            amenity = await prisma.amenity.create({
                data: {
                    label,
                    icon
                }
            });
            console.log(`Created amenity: ${label}`);
        }

        amenityIdMap.set(label, amenity.id);
    }

    console.log('Seeding hotels...');
    for (const hotelData of HOTELS_DATA) {
        console.log(`Creating hotel: ${hotelData.name}`);

        const hotel = await prisma.hotel.create({
            data: {
                name: hotelData.name,
                location: hotelData.location,
                distance: hotelData.distance,
                timeInMinutes: calculateWalkingTime(hotelData.distance),
                latitude: hotelData.latitude,
                longitude: hotelData.longitude,
                rating: hotelData.rating,
                reviews: hotelData.reviews,
                price: hotelData.price,
                isFeatured: hotelData.isFeatured,
                badge: hotelData.badge,
                description: hotelData.description,
                images: JSON.stringify(hotelData.images),
                features: JSON.stringify(hotelData.features),
                amenities: {
                    create: hotelData.amenities.map((label: string) => ({
                        amenity: {
                            connect: { id: amenityIdMap.get(label) }
                        }
                    }))
                },
                rooms: {
                    create: DEFAULT_ROOMS.map(room => ({
                        ...room,
                        features: JSON.stringify(room.features),
                        images: JSON.stringify(room.images),
                    }))
                }
            }
        });
    }

    console.log('Seeding completed successfully!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
