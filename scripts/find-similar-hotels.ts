
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Searching for potentially duplicate hotels...');

    const keywords = ['ميلينيوم', 'Millennium', 'النسيم', 'Naseem'];

    const hotels = await prisma.hotel.findMany({
        where: {
            OR: keywords.map(k => ({ name: { contains: k } }))
        },
        select: { id: true, name: true, updatedAt: true }
    });

    console.log('--- Matches Found ---');
    hotels.forEach(h => {
        console.log(`[${h.id}] ${h.name} (Updated: ${h.updatedAt})`);
    });
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
