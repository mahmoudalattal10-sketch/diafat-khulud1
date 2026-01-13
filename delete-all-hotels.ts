
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: 'file:./dev.db',
        },
    },
});

async function main() {
    try {
        console.log('Deleting all bookings first (foreign key constraint)...');
        await prisma.booking.deleteMany({});
        console.log('All bookings deleted.');

        console.log('Deleting all hotels...');
        const result = await prisma.hotel.deleteMany({});
        console.log(`Deleted ${result.count} hotels.`);

    } catch (error) {
        console.error('Error deleting data:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
