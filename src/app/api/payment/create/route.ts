import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { auth } from '@/auth';
import { createPaymentPage } from '@/lib/paytabs';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const session = await auth();
        if (!session?.user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const { bookingId } = body;

        const booking = await prisma.booking.findUnique({
            where: { id: bookingId },
            include: { user: true }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        // Check ownership
        if (booking.userId !== session.user.id && session.user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // Create Payment Page
        const paymentData = await createPaymentPage(
            booking.id,
            booking.userId,
            booking.totalPrice,
            'SAR',
            {
                name: booking.guestName || booking.user.name || 'Guest',
                email: booking.guestEmail || booking.user.email,
                phone: booking.guestPhone || booking.user.phone || '0000000000',
                address: 'Makkah',
                city: 'Makkah',
                country: 'SA'
            }
        );

        if (paymentData) {
            return NextResponse.json(paymentData);
        } else {
            return NextResponse.json({ error: 'Failed to initiate payment' }, { status: 500 });
        }

    } catch (error) {
        console.error('Payment initiation error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
