import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db',
        },
    },
});

async function checkCoordinates() {
    const hotels = await prisma.hotel.findMany({
        select: {
            id: true,
            name: true,
            latitude: true,
            longitude: true,
            location: true
        },
        take: 5
    });

    console.log('First 5 hotels in database:\n');
    hotels.forEach(hotel => {
        console.log(`${hotel.name} (${hotel.location})`);
        console.log(`  Latitude: ${hotel.latitude}`);
        console.log(`  Longitude: ${hotel.longitude}`);
        console.log(`  Coordinates: [${hotel.latitude}, ${hotel.longitude}]\n`);
    });

    await prisma.$disconnect();
}

checkCoordinates();
