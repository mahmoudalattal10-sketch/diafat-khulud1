
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting availability seeding...');

    const hotels = await prisma.hotel.findMany({
        include: { rooms: true }
    });

    const startDate = new Date('2026-01-12'); // Today per user prompt

    for (const hotel of hotels) {
        // Random duration between 15 and 45 days
        const daysToAdd = Math.floor(Math.random() * 30) + 15;
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + daysToAdd);

        console.log(`Updating Hotel: ${hotel.name} (ID: ${hotel.id})`);
        console.log(`  Availability: ${startDate.toISOString().split('T')[0]} to ${endDate.toISOString().split('T')[0]}`);

        // Update Hotel
        await prisma.hotel.update({
            where: { id: hotel.id },
            data: {
                availableFrom: startDate,
                availableTo: endDate
            }
        });

        // Update Rooms to match hotel availability
        // Or we could make them slightly varied, but matching logic is safer for "admin set default" feel
        if (hotel.rooms.length > 0) {
            await prisma.room.updateMany({
                where: { hotelId: hotel.id },
                data: {
                    availableFrom: startDate,
                    availableTo: endDate
                }
            });
            console.log(`  Updated ${hotel.rooms.length} rooms.`);
        }
    }

    console.log('✅ Seeding completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
