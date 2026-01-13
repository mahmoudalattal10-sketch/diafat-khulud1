
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    // 1. Update Voco
    console.log('Updating Voco Makkah...');
    const vocoLat = 21.407812;
    const vocoLng = 39.818487;

    await prisma.hotel.updateMany({
        where: { name: { contains: 'Voco' } },
        data: { latitude: vocoLat, longitude: vocoLng }
    });
    console.log('Voco updated.');

    // 2. Check Retaj
    console.log('Checking for Retaj hotels...');
    const retajHotels = await prisma.hotel.findMany({
        where: { name: { contains: 'Retaj' } },
        select: { id: true, name: true, location: true }
    });
    console.log('Retaj Hotels found:', retajHotels);

    // 3. Update Novotel Thakher (using previous reliable search info if available, or just log for now)
    // Source Step 3286: 21.442547, 39.820746
    console.log('Updating Novotel Thakher...');
    const novotelLat = 21.442547;
    const novotelLng = 39.820746;

    await prisma.hotel.updateMany({
        where: {
            AND: [
                { name: { contains: 'Novotel' } },
                { name: { contains: 'Thakher' } }
            ]
        },
        data: { latitude: novotelLat, longitude: novotelLng }
    });
    console.log('Novotel updated.');
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
