import { NextResponse } from 'next/server';

export async function POST(request: Request): Promise<NextResponse> {
    try {
        const body = await request.json();
        console.log('PayTabs Callback Received:', JSON.stringify(body, null, 2));

        // Note: PayTabs sends a POST request with the transaction result.
        // You should verify the signature here for production security.

        const { tran_ref, payment_result, cart_id } = body;

        if (payment_result?.response_status === 'A') {
            console.log(`Payment Accepted for Cart: ${cart_id}, Ref: ${tran_ref}`);
            // Update your database here
        } else {
            console.log(`Payment Failed/Declined for Cart: ${cart_id}`);
        }

        return NextResponse.json({ message: 'Callback received' });
    } catch (error: any) {
        console.error('Callback Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
