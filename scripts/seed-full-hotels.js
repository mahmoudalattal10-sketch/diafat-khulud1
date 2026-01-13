const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const HOTELS_DATA = [
    {
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
        description: 'يقع فندق فور بوينتس باي شيراتون مكة المكرمة النسيم في حي النسيم الهادئ على مقربة من المسجد الحرام. يتميز الفندق بتصميمه العصري ويوفر خدمة نقل مجانية منتظمة إلى الحرم.',
        images: [
            'https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?q=80&w=1080',
            'https://images.unsplash.com/photo-1560448204-e897cda51f87?q=80&w=1080',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?q=80&w=1080',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1080'
        ],
        features: ['خدمة نقل مجانية', 'طراز عثماني', 'إفطار جيد'],
        timeInMinutes: 72
    },
    {
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
        description: 'يعد فندق ميلينيوم مكة المكرمة النسيم جزءاً من مجمع الراجحي المتكامل، ويوفر بيئة مريحة للحجاج والمعتمرين.',
        images: [
            'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?q=80&w=1080',
            'https://images.unsplash.com/photo-1549294413-26f195200c16?q=80&w=1080',
            'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=1080',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080'
        ],
        features: ['خدمة نقل منتظمة', 'مجمع متكامل', 'بوفيه متنوع'],
        timeInMinutes: 72
    },
    {
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
        description: 'فندق فوكو مكة المكرمة هو فندق حديث افتتح عام 2023، ويضم أكثر من 4321 غرفة وجناحاً.',
        images: [
            'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1080',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080',
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1080',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1080'
        ],
        features: ['فندق حديث جداً', 'خدمة نقل 24/7', 'مواقف مجانية'],
        timeInMinutes: 16
    },
    {
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
        description: 'يقع فندق المروة ريحان من روتانا في الصف الأول من مجمع أبراج البيت المرموق.',
        images: [
            'https://images.unsplash.com/photo-1596700465243-718663844837?q=80&w=1080',
            'https://images.unsplash.com/photo-1574621035072-a0e28f3237f3?q=80&w=1080',
            'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?q=80&w=1080',
            'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1080'
        ],
        features: ['في برج الساعة', 'إطلالة مباشرة', 'موقع استثنائي'],
        timeInMinutes: 1
    },
    {
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
        description: 'يتميز فندق أنجم مكة المكرمة بموقعه الاستراتيجي - على بعد 50 خطوة فقط من بوابة الملك عبدالله.',
        images: [
            'https://images.unsplash.com/photo-1590073242678-cfe2f7926715?q=80&w=1080',
            'https://images.unsplash.com/photo-1512918760532-3ed1df0736bc?q=80&w=1080',
            'https://images.unsplash.com/photo-1562790351-d273a961e05b?q=80&w=1080',
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1080'
        ],
        features: ['موقع ممتاز جداً', 'نفق خاص', 'إفطار متنوع'],
        timeInMinutes: 1
    },
    {
        name: 'دار الإيمان رويال',
        location: 'شارع إبراهيم الخليل، مكة المكرمة',
        latitude: 21.420000,
        longitude: 39.827000,
        distance: '0.2 كم من الحرم',
        rating: 4.3,
        reviews: 8500,
        price: 550,
        isFeatured: false,
        badge: 'في المنطقة المركزية',
        description: 'فندق دار الإيمان رويال يقع في قلب المنطقة المركزية بمكة المكرمة.',
        images: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1080',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1080',
            'https://images.unsplash.com/photo-1596700465243-718663844837?q=80&w=1080',
            'https://images.unsplash.com/photo-1606046604972-77cc51695ce8?q=80&w=1080'
        ],
        features: ['موقع مركزي', 'إطلالة رائعة', 'خدمة ممتازة'],
        timeInMinutes: 3
    },
    {
        name: 'سويس أوتيل المقام مكة',
        location: 'برج F، مجمع أبراج البيت، شارع إبراهيم الخليل، مكة المكرمة',
        latitude: 21.418571,
        longitude: 39.825528,
        distance: '0.1 كم من الحرم',
        rating: 4.45,
        reviews: 24000,
        price: 750,
        isFeatured: true,
        badge: 'في برج الساعة',
        description: 'يقع فندق سويس أوتيل المقام ضمن مجمع أبراج البيت المرموق، على بعد 100-200 متر من المسجد الحرام.',
        images: [
            'https://images.unsplash.com/photo-1565058865430-81f1852d7729?q=80&w=1080',
            'https://images.unsplash.com/photo-1518049362265-d5b2a6467637?q=80&w=1080',
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1080',
            'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=1080'
        ],
        features: ['في برج الساعة', 'مدخل خاص', 'إطلالة على الكعبة'],
        timeInMinutes: 2
    },
    {
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
        description: 'فندق العنوان جبل عمر مكة المكرمة هو أيقونة الفخامة الحديثة، حاصل على تقييم ممتاز 9.0/10.',
        images: [
            'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=1080',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1080',
            'https://images.unsplash.com/photo-1596700465243-718663844837?q=80&w=1080',
            'https://images.unsplash.com/photo-1606046604972-77cc51695ce8?q=80&w=1080'
        ],
        features: ['تصميم عصري', 'نظافة فائقة', 'خدمة احترافية'],
        timeInMinutes: 5
    },
    {
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
        description: 'يقع فندق دار الإيمان إنتركونتيننتال في موقع استثنائي في ساحة المسجد النبوي الشريف.',
        images: [
            'https://images.unsplash.com/photo-1548680650-61bcd4ad8b3a?q=80&w=1080',
            'https://images.unsplash.com/photo-1565557623262-b51c2513a641?q=80&w=1080',
            'https://images.unsplash.com/photo-1590073844006-33379778ae09?q=80&w=1080',
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1080'
        ],
        features: ['موقع في الساحة', 'إطلالة مباشرة', 'طاقم ممتاز'],
        timeInMinutes: 1
    },
    {
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
        description: 'فندق سوفيتيل شهد المدينة يجمع بين الأناقة الفرنسية وكرم الضيافة العربية.',
        images: [
            'https://images.unsplash.com/photo-1562916124-67253457c10c?q=80&w=1080',
            'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?q=80&w=1080',
            'https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=1080',
            'https://images.unsplash.com/photo-1606046604972-77cc51695ce8?q=80&w=1080'
        ],
        features: ['تصميم فاخر', 'موقع استثنائي', 'طعام راقي'],
        timeInMinutes: 2
    },
    {
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
        description: 'فندق إيلاف طيبة حصل على تقييم استثنائي 9.7/10 على بوكينج! يقع في الصف الأول أمام المسجد النبوي.',
        images: [
            'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=1080',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1080',
            'https://images.unsplash.com/photo-1512918760532-3ed1df0736bc?q=80&w=1080',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080'
        ],
        features: ['في الصف الأول', 'تقييمات مثالية', 'قيمة ممتازة'],
        timeInMinutes: 1
    },
    {
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
        description: 'يقدم فندق هيلتون المدينة المنورة معايير الضيافة العالمية في قلب المدينة المقدسة.',
        images: [
            'https://images.unsplash.com/photo-1560448204-e897cda51f87?q=80&w=1080',
            'https://images.unsplash.com/photo-1554646408-20d0f7f320b9?q=80&w=1080',
            'https://images.unsplash.com/photo-1596436889106-be35e843f974?q=80&w=1080',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080'
        ],
        features: ['علامة هيلتون', 'موقع قريب', 'متاجر بالموقع'],
        timeInMinutes: 4
    }
];

async function main() {
    console.log('🚀 Seeding complete hotel data to Neon PostgreSQL...\n');

    // First, delete existing hotels
    console.log('🗑️ Clearing existing hotels...');
    await prisma.hotel.deleteMany({});
    console.log('✅ Old hotels cleared\n');

    // Seed hotels
    console.log('🏨 Adding hotels with full details...');
    for (const hotel of HOTELS_DATA) {
        await prisma.hotel.create({
            data: {
                name: hotel.name,
                location: hotel.location,
                latitude: hotel.latitude,
                longitude: hotel.longitude,
                distance: hotel.distance,
                rating: hotel.rating,
                reviews: hotel.reviews,
                price: hotel.price,
                isFeatured: hotel.isFeatured,
                badge: hotel.badge,
                description: hotel.description,
                images: JSON.stringify(hotel.images),
                features: JSON.stringify(hotel.features),
                timeInMinutes: hotel.timeInMinutes
            }
        });
        console.log(`  ✓ Added: ${hotel.name}`);
    }

    console.log(`\n✅ Successfully seeded ${HOTELS_DATA.length} hotels with complete data!`);
    console.log('═══════════════════════════════════════');
    console.log('Hotels now have: images, prices, descriptions, ratings, and features!');
    console.log('═══════════════════════════════════════\n');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
