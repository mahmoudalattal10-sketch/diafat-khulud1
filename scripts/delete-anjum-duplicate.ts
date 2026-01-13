
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const idToDelete = 274;
    console.log(`Deleting hotel with ID: ${idToDelete}...`);

    try {
        await prisma.hotel.delete({
            where: { id: idToDelete }
        });
        console.log(`Successfully deleted hotel ${idToDelete}.`);
    } catch (e) {
        console.error(`Error deleting hotel: ${e}`);
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
