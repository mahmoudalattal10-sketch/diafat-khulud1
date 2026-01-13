
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    const missing = [
        { term: 'ريتاج', termEn: 'Retaj', lat: 21.423985, lng: 39.849767 }, // From user link
        { term: 'العنوان', termEn: 'Address', lat: 21.419, lng: 39.824 }, // Approx Jabal Omar
        { term: 'دار الإيمان', termEn: 'Dar Al Iman', lat: 24.467, lng: 39.610 }, // Approx Madinah Central
        { term: 'دار الهجرة', termEn: 'Dar Al Hijra', lat: 24.470, lng: 39.607 }, // Approx Madinah
        { term: 'العقيق', termEn: 'Al Aqeeq', lat: 24.469, lng: 39.608 } // Approx
    ];

    for (const m of missing) {
        console.log(`Searching for ${m.termEn} / ${m.term}`);
        const hotels = await prisma.hotel.findMany({
            where: {
                OR: [
                    { name: { contains: m.term } },
                    { name: { contains: m.termEn } }
                ]
            }
        });

        if (hotels.length === 0) {
            console.log(`  -> Not found in DB.`);
        } else {
            for (const h of hotels) {
                console.log(`  -> Found: ${h.name} (${h.id}). Updating...`);
                // Only update if it seems like a real match contextually (e.g. city)
                // For now, we update.
                await prisma.hotel.update({
                    where: { id: h.id },
                    data: { latitude: m.lat, longitude: m.lng }
                });
                console.log(`     Updated ${h.name} to ${m.lat}, ${m.lng}`);
            }
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
