import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';

const prisma = new PrismaClient();

// GET /api/bookings
export async function GET(request: Request): Promise<NextResponse> {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const isAdmin = session.user.role === 'ADMIN';

        const bookings = await prisma.booking.findMany({
            where: isAdmin ? {} : { userId: session.user.id }, // Admin sees all, User sees own
            include: {
                hotel: {
                    select: {
                        name: true,
                        location: true,
                        images: true
                    }
                },
                room: {
                    select: {
                        name: true,
                        type: true
                    }
                },
                user: { // Admin might want to know who booked
                    select: {
                        name: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        // Parse images JSON for simplified frontend consumption
        const transformedBookings = bookings.map((b: any) => ({
            ...b,
            hotel: {
                ...b.hotel,
                images: JSON.parse(b.hotel.images) // assuming images is JSON string
            }
        }));

        return NextResponse.json(transformedBookings);

    } catch (error) {
        console.error('Error fetching bookings:', error);
        return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
    }
}

// POST /api/bookings
export async function POST(request: Request): Promise<NextResponse> {
    try {
        const session = await auth();
        // Allow booking guest? Maybe not for now. Enforce login.
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { hotelId, roomId, checkIn, checkOut, guestName, guestEmail, guestPhone } = body;

        // Validation logic here (check dates, availability)
        // For prototype -> production, we skip complex availability check for speed, 
        // but ideally we check if room is free.

        // Get Room Price to calc total
        const room = await prisma.room.findUnique({ where: { id: roomId } });
        if (!room) return NextResponse.json({ error: 'Room not found' }, { status: 404 });

        // Availability Check
        const cin = new Date(checkIn);
        const cout = new Date(checkOut);

        const conflicts = await prisma.booking.findMany({
            where: {
                roomId: roomId,
                status: 'CONFIRMED',
                OR: [
                    {
                        // Existing checkIn is between new dates
                        checkIn: { gte: cin, lt: cout }
                    },
                    {
                        // Existing checkOut is between new dates
                        checkOut: { gt: cin, lte: cout }
                    },
                    {
                        // Existing booking encompasses new dates
                        checkIn: { lte: cin },
                        checkOut: { gte: cout }
                    }
                ]
            }
        });

        if (conflicts.length > 0) {
            return NextResponse.json({ error: 'Room is not available for the selected dates' }, { status: 409 });
        }

        const days = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
        const totalPrice = room.price * (days > 0 ? days : 1);

        const booking = await prisma.booking.create({
            data: {
                userId: session.user.id,
                hotelId: Number(hotelId),
                roomId: roomId,
                checkIn: new Date(checkIn),
                checkOut: new Date(checkOut),
                totalPrice,
                status: 'PENDING', // Wait for payment
                guestName: guestName || session.user.name,
                guestEmail: guestEmail || session.user.email,
                guestPhone: guestPhone // from body
            },
            include: {
                hotel: { select: { name: true } },
                room: { select: { type: true } }
            }
        });

        // Send Email Confirmation (Async - don't block response)
        const { sendBookingConfirmation } = await import('@/lib/mail');
        sendBookingConfirmation(booking.guestEmail || session.user.email || '', {
            id: booking.id,
            guestName: booking.guestName,
            hotelName: booking.hotel.name,
            roomType: booking.room.type,
            checkIn: booking.checkIn,
            checkOut: booking.checkOut,
            totalPrice: booking.totalPrice
        }).catch(err => console.error('Failed to send email:', err));

        return NextResponse.json(booking, { status: 201 });

    } catch (error) {
        console.error('Error creating booking:', error);
        return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
    }
}
