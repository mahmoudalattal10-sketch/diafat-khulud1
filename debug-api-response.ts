
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db',
        },
    },
});

async function main() {
    console.log('Fetching hotels from DB...');
    const hotels = await prisma.hotel.findMany({
        include: {
            amenities: { include: { amenity: true } },
            rooms: true,
            nearby: true
        }
    });

    console.log(`DB returned ${hotels.length} hotels.`);

    // Simulate API Transformation
    const transformedHotels = hotels.map((hotel: any) => ({
        ...hotel,
        images: JSON.parse(hotel.images),
        features: JSON.parse(hotel.features),
        coordinates: [hotel.latitude, hotel.longitude] as [number, number],
        // availableFrom etc...
        rooms: hotel.rooms.map((room: any) => ({
            ...room,
            features: JSON.parse(room.features),
            images: JSON.parse(room.images),
            capacity: {
                adults: room.capacityAdults,
                children: room.capacityChildren
            },
            maxExtraBeds: room.maxExtraBeds || 0,
        }))
    }));

    console.log('Transformed hotels count:', transformedHotels.length);

    // Simulate Frontend Filters
    let result = [...transformedHotels];
    const adultsParam = 2; // Default from page

    // Filter by Guests
    result = result.filter(h => {
        if (!h.rooms || h.rooms.length === 0) {
            console.log(`Hotel ${h.id} (${h.name}) rejected: No rooms`);
            return false;
        }
        const hasCapacity = h.rooms.some((room: any) => {
            const roomCapacity = typeof room.capacity === 'number' ? room.capacity : (room.capacity?.adults || 2);
            // console.log(`  Room ${room.id} capacity:`, roomCapacity);
            return roomCapacity >= adultsParam;
        });
        if (!hasCapacity) {
            console.log(`Hotel ${h.id} (${h.name}) rejected: Insufficient capacity`);
        }
        return hasCapacity;
    });

    console.log(`After Guest Filter (Adults=2): ${result.length}`);

    // Filter by Price (0-5000)
    result = result.filter(h => h.price >= 0 && h.price <= 5000);
    console.log(`After Price Filter: ${result.length}`);

    // Log first hotel
    if (result.length > 0) {
        console.log('First hotel sample:', JSON.stringify(result[0], null, 2));
    }
}

main()
    .catch(e => console.error(e))
    .finally(async () => {
        await prisma.$disconnect();
    });
