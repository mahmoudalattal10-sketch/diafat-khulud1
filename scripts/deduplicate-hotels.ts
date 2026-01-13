
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('Fetching hotels...');
    const hotels = await prisma.hotel.findMany({
        orderBy: { updatedAt: 'desc' } // Sort by newest update first
    });

    console.log(`Found ${hotels.length} hotels total.`);

    const seenNames = new Set<string>();
    const toDelete: number[] = [];

    // Since we sorted by updatedAt DESC, the first time we see a name, it's the "keeper" (newest).
    // Any subsequent occurrence of the same name is an older duplicate to be deleted.
    for (const hotel of hotels) {
        // Normalize name: trim and collapse spaces
        const name = hotel.name.trim().replace(/\s+/g, ' ');

        if (seenNames.has(name)) {
            console.log(`Duplicate found: [${hotel.id}] ${name} (Updated: ${hotel.updatedAt}) - Marked for deletion`);
            toDelete.push(hotel.id);
        } else {
            console.log(`Keeping: [${hotel.id}] ${name} (Updated: ${hotel.updatedAt})`);
            seenNames.add(name);
        }
    }

    if (toDelete.length === 0) {
        console.log('No duplicates found.');
        return;
    }

    console.log(`Deleting ${toDelete.length} duplicate hotels...`);

    const result = await prisma.hotel.deleteMany({
        where: {
            id: { in: toDelete }
        }
    });

    console.log(`Successfully deleted ${result.count} duplicates.`);
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
