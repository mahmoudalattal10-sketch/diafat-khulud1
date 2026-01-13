import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const count = await prisma.hotel.count();
    console.log(`Hotel Count: ${count}`);
    const hotels = await prisma.hotel.findMany({ select: { id: true, name: true, location: true } });
    console.log('Hotels:', JSON.stringify(hotels, null, 2));
}

main()
    .finally(() => prisma.$disconnect());
