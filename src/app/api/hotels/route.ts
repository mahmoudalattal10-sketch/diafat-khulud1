import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

export const dynamic = 'force-dynamic';
const prisma = new PrismaClient();

// GET /api/hotels
// Query Params: destination, guests, minPrice, maxPrice, rating
// Helper to safely parse JSON
// Helper to safely parse JSON
const safeJsonParse = (jsonString: string | null | undefined, fallback: any = []) => {
    if (!jsonString) return fallback;
    try {
        const parsed = JSON.parse(jsonString);
        // If fallback is an array, enforce parsed is also an array
        if (Array.isArray(fallback) && !Array.isArray(parsed)) {
            console.warn('JSON Parse Warning: Expected array but got ' + typeof parsed);
            return fallback;
        }
        return parsed !== null ? parsed : fallback;
    } catch (error) {
        console.error('JSON Parse Error:', error);
        return fallback;
    }
};

// GET /api/hotels
// Query Params: destination, guests, minPrice, maxPrice, rating
export async function GET(request: Request): Promise<NextResponse> {
    try {
        const { searchParams } = new URL(request.url);
        // ... (existing code for search params)

        const destination = searchParams.get('destination') || searchParams.get('location'); // Support both
        const minPrice = searchParams.get('minPrice');
        const maxPrice = searchParams.get('maxPrice');
        const checkIn = searchParams.get('checkIn');
        const checkOut = searchParams.get('checkOut');

        const andConditions: any[] = [];

        if (destination) {
            const keywords = destination.trim().split(/\s+/).filter(k => k.length > 0);
            if (keywords.length > 0) {
                andConditions.push({
                    AND: keywords.map(k => ({
                        OR: [
                            { location: { contains: k } },
                            { name: { contains: k } }
                        ]
                    }))
                });
            }
        }

        if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);

            andConditions.push({
                OR: [
                    {
                        AND: [
                            { OR: [{ availableFrom: null }, { availableFrom: { lte: checkInDate } }] },
                            { OR: [{ availableTo: null }, { availableTo: { gte: checkOutDate } }] }
                        ]
                    },
                    {
                        rooms: {
                            some: {
                                AND: [
                                    { OR: [{ availableFrom: null }, { availableFrom: { lte: checkInDate } }] },
                                    { OR: [{ availableTo: null }, { availableTo: { gte: checkOutDate } }] }
                                ]
                            }
                        }
                    }
                ]
            });
        } else {
            if (checkIn) {
                andConditions.push({ OR: [{ availableFrom: null }, { availableFrom: { lte: new Date(checkIn) } }] });
            }
            if (checkOut) {
                andConditions.push({ OR: [{ availableTo: null }, { availableTo: { gte: new Date(checkOut) } }] });
            }
        }

        if (minPrice) andConditions.push({ price: { gte: parseFloat(minPrice) } });
        if (maxPrice) andConditions.push({ price: { lte: parseFloat(maxPrice) } });

        const whereClause = andConditions.length > 0 ? { AND: andConditions } : {};

        const hotels = await prisma.hotel.findMany({
            where: whereClause,
            include: {
                amenities: {
                    include: {
                        amenity: true
                    }
                },
                rooms: true,
                nearby: true
            }
        });

        // Transform data
        let transformedHotels = hotels.map((hotel: any) => {
            // Calculate walking time if missing in DB
            let timeInMinutes = (hotel as any).timeInMinutes;
            if (!timeInMinutes && hotel.distance) {
                const match = hotel.distance.match(/(\d+\.?\d*)/);
                if (match) {
                    const km = parseFloat(match[1]);
                    timeInMinutes = Math.max(1, Math.round(km * 12));
                }
            }

            return {
                ...hotel,
                timeInMinutes,
                images: safeJsonParse(hotel.images, []),
                features: safeJsonParse(hotel.features, []),
                coordinates: [hotel.latitude, hotel.longitude] as [number, number],
                availableFrom: hotel.availableFrom,
                availableTo: hotel.availableTo,
                amenities: hotel.amenities.map((ha: any) => ({
                    label: ha.amenity.label,
                    icon: ha.amenity.icon
                })),
                rooms: hotel.rooms.map((room: any) => ({
                    ...room,
                    features: safeJsonParse(room.features, []),
                    images: safeJsonParse(room.images, []),
                    capacity: {
                        adults: room.capacityAdults,
                        children: room.capacityChildren
                    },
                    maxExtraBeds: room.maxExtraBeds || 0,
                    extraBedPrice: room.extraBedPrice || 0,
                    availableFrom: room.availableFrom,
                    availableTo: room.availableTo
                }))
            };
        });

        // Guest Filtering
        const adults = parseInt(searchParams.get('adults') || '0');
        const roomsCount = parseInt(searchParams.get('rooms') || '0');

        // Filter hotels if they don't have any room satisfying the guests req (considering extra beds)
        if (adults > 0 && roomsCount > 0) {
            const adultsPerRoom = Math.ceil(adults / roomsCount);
            transformedHotels = transformedHotels.filter(hotel =>
                hotel.rooms.some((room: any) =>
                    (room.capacity.adults + (room.maxExtraBeds || 0)) >= adultsPerRoom
                )
            );
        }

        return NextResponse.json(transformedHotels);
    } catch (error) {
        console.error('Error fetching hotels:', error);
        return NextResponse.json({ error: 'Failed to fetch hotels' }, { status: 500 });
    }
}

// POST /api/hotels (Admin Only)
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const session = await auth();

        // Check if user is admin
        if (!session?.user || session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();

        // Basic validation (can use Zod here)
        // Assume body is well-formed for now or add validation

        // Create hotel
        // Note: Relation creation (rooms, amenities) needs careful handling
        // For simplicity, assuming valid structure matching Schema

        const { amenities, rooms, nearby, coordinates, ...hotelData } = body;

        // 1. Create Hotel with nested relations
        const hotel = await prisma.hotel.create({
            data: {
                ...hotelData,
                latitude: coordinates?.[0] || 21.4225,
                longitude: coordinates?.[1] || 39.8262,
                images: JSON.stringify(hotelData.images || []),
                features: JSON.stringify(hotelData.features || []),
                availableFrom: hotelData.availableFrom ? new Date(hotelData.availableFrom) : null,
                availableTo: hotelData.availableTo ? new Date(hotelData.availableTo) : null,
                // Create adjacent relations
                rooms: {
                    create: (rooms || []).map((r: any) => ({
                        name: r.name,
                        type: r.type,
                        price: parseFloat(r.price),
                        capacityAdults: parseInt(r.capacity) || 2,
                        capacityChildren: 0,
                        maxExtraBeds: parseInt(r.maxExtraBeds) || 0,
                        extraBedPrice: parseFloat(r.extraBedPrice) || 0,
                        beds: r.beds,
                        size: String(r.size),
                        view: r.view || '',
                        features: JSON.stringify(r.features || []),
                        images: JSON.stringify(r.images || []),
                        status: r.status || 'active',
                        availableCount: parseInt(r.availableCount) || 1,
                        availableFrom: r.availableFrom ? new Date(r.availableFrom) : null,
                        availableTo: r.availableTo ? new Date(r.availableTo) : null
                    }))
                },
                nearby: {
                    create: (nearby || []).filter((n: any) => n.label.trim() !== '').map((n: any) => ({
                        label: n.label,
                        dist: n.dist,
                        type: n.type
                    }))
                }
            }
        });

        // 2. Link Amenities 
        if (amenities && amenities.length > 0) {
            for (const a of amenities) {
                // Find or create the base amenity
                let amenity = await prisma.amenity.findFirst({
                    where: { label: a.label }
                });

                if (!amenity) {
                    amenity = await prisma.amenity.create({
                        data: {
                            label: a.label,
                            icon: a.icon
                        }
                    });
                }

                // Link to hotel
                await prisma.hotelAmenity.create({
                    data: {
                        hotelId: hotel.id,
                        amenityId: amenity.id
                    }
                }).catch(() => { /* skip if already exists */ });
            }
        }

        return NextResponse.json(hotel, { status: 201 });

    } catch (error) {
        console.error('Error creating hotel:', error);
        return NextResponse.json({ error: 'Failed to create hotel' }, { status: 500 });
    }
}
