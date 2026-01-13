const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const DEFAULT_ROOMS = [
    {
        name: 'غرفة قياسية مزدوجة',
        type: 'Standard Double',
        price: 150,
        capacityAdults: 2,
        capacityChildren: 1,
        maxExtraBeds: 0,
        extraBedPrice: 0,
        beds: 'سرير مزدوج كبير',
        size: '25 م²',
        view: 'المدينة',
        features: ['واي فاي مجاني', 'تكييف', 'تلفزيون شاشة مسطحة', 'خزنة'],
        images: [
            'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1080',
            'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=1080'
        ],
        status: 'active',
        availableCount: 15
    },
    {
        name: 'غرفة ديلوكس',
        type: 'Deluxe',
        price: 250,
        capacityAdults: 2,
        capacityChildren: 2,
        maxExtraBeds: 1,
        extraBedPrice: 80,
        beds: 'سرير كينج',
        size: '32 م²',
        view: 'إطلالة جزئية',
        features: ['واي فاي مجاني', 'تكييف', 'ميني بار', 'حمام فاخر', 'روب حمام'],
        images: [
            'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=1080',
            'https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=1080'
        ],
        status: 'active',
        availableCount: 10
    },
    {
        name: 'جناح عائلي',
        type: 'Family Suite',
        price: 450,
        capacityAdults: 4,
        capacityChildren: 3,
        maxExtraBeds: 2,
        extraBedPrice: 100,
        beds: '2 سرير كينج + أريكة سرير',
        size: '55 م²',
        view: 'بانورامية',
        features: ['غرفة معيشة', 'مطبخ صغير', '2 حمام', 'شرفة خاصة', 'إفطار مجاني'],
        images: [
            'https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1080',
            'https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=1080'
        ],
        status: 'active',
        availableCount: 5
    },
    {
        name: 'جناح تنفيذي',
        type: 'Executive Suite',
        price: 650,
        capacityAdults: 2,
        capacityChildren: 1,
        maxExtraBeds: 1,
        extraBedPrice: 120,
        beds: 'سرير كينج فاخر',
        size: '70 م²',
        view: 'إطلالة على الحرم',
        features: ['صالة خاصة', 'خدمة الكونسيرج', 'إفطار VIP', 'سبا مجاني', 'نقل خاص'],
        images: [
            'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=1080',
            'https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=1080'
        ],
        status: 'active',
        availableCount: 3
    }
];

async function main() {
    console.log('🏨 Adding rooms to all hotels...\n');

    // Get all hotels
    const hotels = await prisma.hotel.findMany();
    console.log(`Found ${hotels.length} hotels\n`);

    for (const hotel of hotels) {
        // Check if hotel already has rooms
        const existingRooms = await prisma.room.count({
            where: { hotelId: hotel.id }
        });

        if (existingRooms > 0) {
            console.log(`⏭️ ${hotel.name} already has ${existingRooms} rooms, skipping...`);
            continue;
        }

        // Add rooms to hotel
        for (const roomData of DEFAULT_ROOMS) {
            // Adjust price based on hotel's base price
            const priceMultiplier = hotel.price / 300;
            const adjustedPrice = Math.round(roomData.price * priceMultiplier);

            await prisma.room.create({
                data: {
                    hotelId: hotel.id,
                    name: roomData.name,
                    type: roomData.type,
                    price: adjustedPrice,
                    capacityAdults: roomData.capacityAdults,
                    capacityChildren: roomData.capacityChildren,
                    maxExtraBeds: roomData.maxExtraBeds,
                    extraBedPrice: roomData.extraBedPrice,
                    beds: roomData.beds,
                    size: roomData.size,
                    view: roomData.view,
                    features: JSON.stringify(roomData.features),
                    images: JSON.stringify(roomData.images),
                    status: roomData.status,
                    availableCount: roomData.availableCount
                }
            });
        }
        console.log(`✓ Added 4 rooms to: ${hotel.name}`);
    }

    console.log('\n✅ All rooms added successfully!');
    console.log('═══════════════════════════════════════');
    console.log('Each hotel now has 4 room types:');
    console.log('  - غرفة قياسية مزدوجة');
    console.log('  - غرفة ديلوكس');
    console.log('  - جناح عائلي');
    console.log('  - جناح تنفيذي');
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
