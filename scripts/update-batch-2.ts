
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const updates = [
    // Makkah
    { names: ['Sheraton Makkah', 'شيراتون'], lat: 21.4255940, lng: 39.8194398 },
    { names: ['Swissôtel Al Maqam', 'سويس المقام'], lat: 21.4184744, lng: 39.8244146 },

    // Madinah
    { names: ['Al Manakha Rotana', 'مناخ روتانا'], lat: 24.4644275, lng: 39.6062511 },
    { names: ['Sofitel Shahd', 'سوفيتل شهد'], lat: 24.4721055, lng: 39.6114864 },
    { names: ['Anwar Al Madinah', 'أنوار المدينة'], lat: 24.4713757, lng: 39.6078202 },
    { names: ['Madinah Hilton', 'المدينة المنورة هيلتون'], lat: 24.4720629, lng: 39.6084761 },
    { names: ['Maden Hotel', 'مادن'], lat: 24.4729583, lng: 39.6108774 },
    { names: ['Crowne Plaza Madinah', 'كراون بلازا'], lat: 24.4638755, lng: 39.6101126 },
    { names: ['Elaf Taiba', 'إيلاف طيبة'], lat: 24.4712903, lng: 39.6069402 },
    { names: ['Emaar Royal', 'إعمار رويال'], lat: 24.4731989, lng: 39.6134487 }
];

async function main() {
    console.log('Updating batch 2 hotels...');

    for (const u of updates) {
        // Try to find by multiple name parts to be safe
        const hotels = await prisma.hotel.findMany({
            where: {
                OR: u.names.map(n => ({ name: { contains: n } }))
            }
        });

        if (hotels.length === 0) {
            console.log(`Skipping ${u.names[0]}... Not found in DB.`);
            continue;
        }

        for (const h of hotels) {
            // Avoid updating if it looks like a different hotel (simple safety check)
            // e.g. "Hilton" might match "Hilton Makkah" when we want "Madinah Hilton"
            // We can check location field if available, but for now we trust the specific names provided.

            // Double check for Madinah specifically
            if (u.names[0].includes('Madinah') || u.names[0].includes('المدينة')) {
                const isMadinah = h.location.includes('Madina') || h.location.includes('المدينة') || h.name.includes('Madina') || h.name.includes('المدينة');
                if (!isMadinah) {
                    console.log(`Skipping ${h.name} (ID: ${h.id}) - location mismatch (Expected Madinah).`);
                    continue;
                }
            }

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
