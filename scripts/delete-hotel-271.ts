
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const idToDelete = 271;
    console.log(`Deleting duplicate hotel with ID: ${idToDelete}...`);

    try {
        await prisma.hotel.delete({
            where: { id: idToDelete }
        });
        console.log('Successfully deleted hotel.');
    } catch (e: any) {
        console.log('Error deleting hotel (might not exist):', e.message);
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
