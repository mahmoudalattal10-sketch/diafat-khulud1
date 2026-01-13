import { NextResponse } from 'next/server';
const paytabs = require('paytabs_pt2');

export async function POST(request: Request): Promise<NextResponse | Response> {
    try {
        const body = await request.json();
        const { amount, cartId, cartDescription, customerDetails } = body;

        const profileID = process.env.PAYTABS_PROFILE_ID;
        const serverKey = process.env.PAYTABS_SERVER_KEY;
        const region = process.env.PAYTABS_REGION; // e.g., 'SAU' for Saudi
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3002';

        paytabs.setConfig(profileID, serverKey, region);

        return new Promise((resolve) => {
            paytabs.createPaymentPage(
                ['all'], // payment methods
                ['sale', 'ecom'], // transaction type and class
                [cartId, 'SAR', parseFloat(amount), cartDescription],
                [
                    customerDetails.name,
                    customerDetails.email,
                    customerDetails.phone,
                    customerDetails.address,
                    customerDetails.city,
                    customerDetails.state,
                    customerDetails.country,
                    customerDetails.zip,
                    '127.0.0.1' // customer IP
                ],
                [
                    customerDetails.name,
                    customerDetails.email,
                    customerDetails.phone,
                    customerDetails.address,
                    customerDetails.city,
                    customerDetails.state,
                    customerDetails.country,
                    customerDetails.zip,
                    '127.0.0.1' // shipping IP
                ],
                [
                    `${appUrl}/api/payment/paytabs/callback`, // callback URL
                    `${appUrl}/payment/success` // return URL
                ],
                'ar', // language
                (response: any) => {
                    if (response.redirect_url) {
                        resolve(NextResponse.json({ redirectUrl: response.redirect_url }));
                    } else {
                        console.error('PayTabs Error Response:', response);
                        resolve(NextResponse.json({ error: response.result || 'Failed to create payment page' }, { status: 400 }));
                    }
                },
                false // framed
            );
        });
    } catch (error: any) {
        console.error('Payment Initiation Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
