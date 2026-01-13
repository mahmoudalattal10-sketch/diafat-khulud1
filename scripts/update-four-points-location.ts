
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Updating location for Four Points by Sheraton Makkah Al Naseem...');

    // Coordinates from user: 21.3803482, 39.8740213
    const newLat = 21.3803482;
    const newLng = 39.8740213;

    // Search for the hotel by name (flexible search)
    const hotels = await prisma.hotel.findMany({
        where: {
            OR: [
                { name: { contains: 'فوربوينتس' } },
                { name: { contains: 'Four Points' } },
                { name: { contains: 'شيراتون النسيم' } }
            ]
        }
    });

    if (hotels.length === 0) {
        console.log('Hotel not found!');
        return;
    }

    // Update all matching hotels (in case of duplicates, though we removed one)
    for (const hotel of hotels) {
        console.log(`Updating hotel: ${hotel.name} (ID: ${hotel.id})`);

        await prisma.hotel.update({
            where: { id: hotel.id },
            data: {
                latitude: newLat,
                longitude: newLng,
                // Also update textual location if needed, but keeping it as is usually fine
            }
        });
        console.log(`Updated ID ${hotel.id} to Lat: ${newLat}, Lng: ${newLng}`);
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
