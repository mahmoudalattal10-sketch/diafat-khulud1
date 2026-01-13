
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Searching for Anjum duplicates...");
    const hotels = await prisma.hotel.findMany({
        where: {
            OR: [
                { name: { contains: 'Anjum' } },
                { name: { contains: 'انجم' } },
                { name: { contains: 'أنجم' } }
            ]
        }
    });

    hotels.forEach(h => {
        console.log(`ID: ${h.id} | Name: ${h.name} | Rating: ${h.rating}`);
    });
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
