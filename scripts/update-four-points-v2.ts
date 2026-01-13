
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Verifying and Updating Four Points location...');

    // Coordinates from the new link parameters: !3d21.3803482!4d39.8740213
    const lat = 21.3803482;
    const lng = 39.8740213;

    const hotels = await prisma.hotel.findMany({
        where: {
            OR: [
                { name: { contains: 'Four Points' } },
                { name: { contains: 'فوربوينتس' } },
                { name: { contains: 'شيراتون النسيم' } }
            ]
        }
    });

    for (const h of hotels) {
        console.log(`Found: ${h.name} (Current: ${h.latitude}, ${h.longitude})`);
        if (h.latitude && h.longitude && (Math.abs(h.latitude - lat) > 0.0001 || Math.abs(h.longitude - lng) > 0.0001)) {
            console.log(`Updating to ${lat}, ${lng}...`);
            await prisma.hotel.update({
                where: { id: h.id },
                data: { latitude: lat, longitude: lng }
            });
            console.log('Updated.');
        } else {
            console.log('Location already matches.');
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
