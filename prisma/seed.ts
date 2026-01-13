import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const STANDARD_AMENITIES = [
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

const HOTELS_DATA = [
    {
        id: 1,
        name: 'فندق أبراج مكة',
        location: 'مكة المكرمة، الحرم',
        distance: '50 متر عن الحرم',
        coordinates: [21.4196, 39.8252],
        rating: 4.8,
        reviews: 1240,
        price: 550,
        isFeatured: true,
        badge: 'خصم حصري',
        description: 'يتميز فندق أبراج مكة بموقعه الاستراتيجي المطل مباشرة على المسجد الحرام، ويقدم تجربة إقامة فاخرة للحجاج والمعتمرين مع خدمات متكاملة ومرافق عصرية.',
        images: ['/images/makkah.png', '/images/hotels.png', '/images/makkah.png', '/images/hotels.png', '/images/makkah.png'],
        features: ['إطلالة كعبة', 'واي فاي', 'إفطار'],
        rooms: [
            {
                id: 'r1',
                name: 'غرفة ديلوكس مطلة على الكعبة',
                type: 'double',
                price: 850,
                capacity: { adults: 2, children: 1 },
                beds: '1 سرير مزدوج كبير',
                size: '35 م²',
                view: 'إطلالة كاملة على الكعبة',
                features: ['واي فاي', 'تلفزيون', 'ميني بار'],
                images: ['/images/hotels.png']
            },
            {
                id: 'r2',
                name: 'غرفة رباعية قياسية',
                type: 'quad',
                price: 550,
                capacity: { adults: 4, children: 0 },
                beds: '4 أسرة فردية',
                size: '40 م²',
                view: 'إطلالة على المدينة',
                features: ['واي فاي', 'تكييف'],
                images: ['/images/hotels.png']
            }
        ]
    },
    {
        id: 2,
        name: 'سويس أوتيل المقام',
        location: 'مكة المكرمة، وقف الملك عبد العزيز',
        distance: '100 متر عن الحرم',
        coordinates: [21.4180, 39.8240],
        rating: 4.7,
        reviews: 850,
        price: 600,
        isFeatured: true,
        badge: 'الأكثر طلباً',
        description: 'فندق فاخر يقع ضمن مجمع أبراج البيت، يوفر وصولاً مباشراً إلى الحرم المكي الشريف مع إطلالات بانورامية خلابة.',
        images: ['/images/hotels.png', '/images/makkah.png', '/images/hotels.png'],
        features: ['إطلالة مباشرة', 'مواصلات', 'واي فاي'],
        rooms: [
            {
                id: 'r3',
                name: 'جناح جونيور',
                type: 'suite',
                price: 1200,
                capacity: { adults: 2, children: 2 },
                beds: '1 سرير كبير + صالة',
                size: '60 م²',
                view: 'إطلالة جزئية للحرم',
                features: ['مطبخ صغير', 'منطقة جلوس'],
                images: ['/images/hotels.png']
            }
        ]
    },
    // Adding 2 more hotels to keep script short but sufficient
    {
        id: 7,
        name: 'فندق أنوار المدينة',
        location: 'المدينة المنورة',
        distance: '200 متر عن الحرم',
        coordinates: [24.4682, 39.6116],
        rating: 4.5,
        reviews: 1100,
        price: 290,
        description: 'يتميز فندق أنوار المدينة بموقعه القريب من الحرم النبوي الشريف، ويقدم إقامة مريحة بأسعار مميزة للعائلات.',
        images: ['/images/madinah.png', '/images/hotels.png', '/images/madinah.png'],
        features: ['سعر مميز', 'عائلي', 'مجاني'],
        rooms: []
    }
];

async function main() {
    console.log('Cleaning database...');
    await prisma.nearbyPlace.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.room.deleteMany();
    await prisma.hotelAmenity.deleteMany();
    await prisma.amenity.deleteMany();
    await prisma.hotel.deleteMany();

    console.log('Seeding Amenities...');
    const amenityMap = new Map();

    for (const a of STANDARD_AMENITIES) {
        const created = await prisma.amenity.create({
            data: {
                icon: a.icon,
                label: a.label
            }
        });
        amenityMap.set(a.label, created.id);
    }

    console.log('Seeding Hotels...');
    for (const h of HOTELS_DATA) {
        const hotel = await prisma.hotel.create({
            data: {
                // We use the ID from data? Assuming auto-increment, we shouldn't force ID unless using mongo/cuid.
                // Schema has @default(autoincrement()) for Hotel ID (Int).
                // We can force it or let it generate.
                // Let's remove ID from input and let it generate.
                name: h.name,
                location: h.location,
                distance: h.distance,
                latitude: h.coordinates[0],
                longitude: h.coordinates[1],
                rating: h.rating,
                reviews: h.reviews,
                price: h.price,
                description: h.description,
                images: JSON.stringify(h.images),
                badge: h.badge || null,
                features: JSON.stringify(h.features),
                isFeatured: h.isFeatured || false
            }
        });

        // Link Amenities (All Standard for these mocks)
        for (const a of STANDARD_AMENITIES) {
            const amId = amenityMap.get(a.label);
            if (amId) {
                await prisma.hotelAmenity.create({
                    data: {
                        hotelId: hotel.id,
                        amenityId: amId
                    }
                });
            }
        }

        // Create Rooms
        for (const r of h.rooms) {
            await prisma.room.create({
                data: {
                    hotelId: hotel.id, // Linked
                    name: r.name,
                    type: r.type,
                    price: r.price,
                    capacityAdults: r.capacity.adults,
                    capacityChildren: r.capacity.children,
                    beds: r.beds,
                    size: r.size,
                    view: r.view,
                    features: JSON.stringify(r.features),
                    images: JSON.stringify(r.images),
                    availableCount: 5
                }
            });
        }
    }

    console.log('Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
