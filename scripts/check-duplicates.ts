
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const hotels = await prisma.hotel.findMany({
        select: {
            id: true,
            name: true,
            price: true,
            location: true
        }
    });

    console.log('--- Database Hotels ---');
    hotels.forEach(h => {
        console.log(`[${h.id}] ${h.name} - ${h.price} SAR - ${h.location}`);
    });
    console.log('-----------------------');

    // Identify Duplicates
    const seen = new Map();
    const duplicates = [];

    for (const h of hotels) {
        if (seen.has(h.name)) {
            duplicates.push(h);
        } else {
            seen.set(h.name, h.id);
        }
    }

    if (duplicates.length > 0) {
        console.log('FOUND DUPLICATES:', duplicates.map(d => `${d.name} (ID: ${d.id})`));
    } else {
        console.log('No exact name duplicates found.');
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
