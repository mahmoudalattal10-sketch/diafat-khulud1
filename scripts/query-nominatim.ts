


async function main() {
    const queries = [
        // Makkah - Missing
        "Voco Makkah an IHG Hotel",
        "Voco Makkah",
        "Novotel Makkah Thakher City",
        "Sheraton Makkah Jabal Al Kaaba Hotel",
        "Swissôtel Al Maqam Makkah",
        "Retaj Inn Makkah",
        "Address Jabal Omar Makkah",

        // Madinah
        "Al Manakha Rotana Madinah",
        "InterContinental Dar Al Iman Madinah",
        "Sofitel Shahd Al Madinah",
        "Anwar Al Madinah Mövenpick",
        "Madinah Hilton",
        "InterContinental Dar Al Hijra Madinah",
        "Maden Hotel Madinah",
        "Crowne Plaza Madinah",
        "Millennium Al Aqeeq Madinah",
        "Elaf Taiba Hotel",
        "Emaar Royal Hotel Medina"
    ];

    for (const q of queries) {
        try {
            const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`;
            console.log(`Querying: ${q}`);
            const res = await fetch(url, {
                headers: { 'User-Agent': 'DiafatKhulud/1.0' }
            });
            const data = await res.json();

            if (data && data.length > 0) {
                console.log(`FOUND: ${q} -> Lat: ${data[0].lat}, Lon: ${data[0].lon}`);
            } else {
                console.log(`NOT FOUND: ${q}`);
            }
        } catch (e: any) {
            console.error(`Error querying ${q}:`, e.message);
        }
        // Be nice to the API
        await new Promise(r => setTimeout(r, 1000));
    }
}

main().catch(console.error);
