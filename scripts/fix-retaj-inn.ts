
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Fixing Retaj Inn data...");

    // Find the hotel (searching for the one we mistakenly named Retaj Al Bayt with the far coords)
    // Coords were roughly 21.4239, 39.8497
    const hotels = await prisma.hotel.findMany({
        where: {
            OR: [
                { name: { contains: 'ريتاج' } },
                { name: { contains: 'Retaj' } }
            ]
        }
    });

    for (const h of hotels) {
        console.log(`Found: ${h.name} (${h.id}) - Dist: ${h.distance} - Time: ${h.timeInMinutes}`);

        // Check if this is the one with the coordinates ~2.5km away
        if (h.latitude && h.longitude && h.longitude > 39.84) {
            console.log("-> This is Retaj Inn (based on coordinates). Fixing metadata...");

            await prisma.hotel.update({
                where: { id: h.id },
                data: {
                    name: "فندق ريتاج ان مكة", // Correct Name
                    distance: "2.5 كم عن الحرم", // Correct Distance
                    timeInMinutes: 25, // Approx walking estimate (or drive?) 2.5km is ~30min walk
                    badge: "اقتصادي", // Correct Badge
                    features: JSON.stringify(["خدمة نقل", "واي فاي مجاني", "مطعم"]), // Generic features, removing "Abraj Al Bayt"
                    description: "فندق اقتصادي مميز يبعد مسافة قصيرة عن الحرم المكي، يوفر خدمات مريحة وأسعار منافسة.",
                }
            });
            console.log("-> Updated successfully.");
        } else {
            console.log("-> Skipping (coordinates do not match Retaj Inn).");
        }
    }
}

main()
    .catch(console.error)
    .finally(async () => await prisma.$disconnect());
