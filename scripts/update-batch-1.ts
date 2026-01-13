
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
    { namePart: 'ميلينيوم', namePart2: 'النسيم', lat: 21.3809242, lng: 39.8728923 },
    { namePart: 'المروة', namePart2: 'روتانا', lat: 21.4191648, lng: 39.8260952 },
    { namePart: 'أنجم', namePart2: 'مكة', lat: 21.4246115, lng: 39.8197910 }
];

async function main() {
    console.log('Updating found hotels...');

    for (const u of updates) {
        const hotels = await prisma.hotel.findMany({
            where: {
                AND: [
                    { name: { contains: u.namePart } },
                    { name: { contains: u.namePart2 } }
                ]
            }
        });

        if (hotels.length === 0) {
            console.log(`Skipping ${u.namePart}... Not found in DB.`);
            continue;
        }

        for (const h of hotels) {
            console.log(`Updating ${h.name} (${h.id}) -> ${u.lat}, ${u.lng}`);
            await prisma.hotel.update({
                where: { id: h.id },
                data: { latitude: u.lat, longitude: u.lng }
            });
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
