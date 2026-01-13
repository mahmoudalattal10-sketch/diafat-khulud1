import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { PayTabsResponse } from '@/types/payment';

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const data: PayTabsResponse = await request.json();

        // Log for debugging
        console.log('PayTabs Callback:', data);

        const { cart_id, payment_result, tran_ref } = data;

        if (!cart_id) {
            return NextResponse.json({ error: 'Missing cart_id' }, { status: 400 });
        }

        const booking = await prisma.booking.findUnique({
            where: { id: cart_id }
        });

        if (!booking) {
            return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
        }

        if (payment_result.response_status === 'A') {
            // Success
            await prisma.booking.update({
                where: { id: cart_id },
                data: {
                    status: 'CONFIRMED',
                    paymentRef: tran_ref
                } as any
            });

            // Send Email Confirmation Here (if moved from create booking)
            const { sendBookingConfirmation } = await import('@/lib/mail');
            // We need to fetch hotel/room names again or use Include in update, but update returns object
            // Let's re-fetch or assume data is enough. 
            // Ideally we move email logic to a shared function called here.

        } else {
            // Failed
            console.warn(`Payment failed for booking ${cart_id}: ${payment_result.response_message}`);
            // Optionally update status to CANCELLED or PAYMENT_FAILED
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Callback processing error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
