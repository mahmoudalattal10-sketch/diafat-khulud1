
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const term = process.argv[2];
    console.log(`Searching for: ${term}`);
    const hotels = await prisma.hotel.findMany({
        where: {
            OR: [
                { name: { contains: term } }
            ]
        }
    });
    console.log(hotels);
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
