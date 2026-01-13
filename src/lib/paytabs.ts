import { PaymentInitiationRequest, PayTabsResponse } from '@/types/payment';

// PayTabs Configuration
const PROFILE_ID = process.env.PAYTABS_PROFILE_ID || '149176'; // Test Profile
const SERVER_KEY = process.env.PAYTABS_SERVER_KEY || 'SKJ969TR9Z-JGRW2Z9GMD-KL92K2K29R';
const REGION = process.env.PAYTABS_REGION || 'SAU'; // SAU, ARE, EGY, etc.

const BASE_URL = `https://secure-${REGION.toLowerCase()}.paytabs.com/payment/request`;

export async function createPaymentPage(
    bookingId: string,
    userId: string,
    amount: number,
    currency: string = 'SAR',
    customerDetails: { name: string, email: string, phone: string, address?: string, city?: string, state?: string, country?: string, zip?: string }
): Promise<{ redirect_url: string, trace_id: string } | null> {

    const payload = {
        profile_id: PROFILE_ID,
        tran_type: "sale",
        tran_class: "ecom",
        cart_id: bookingId,
        cart_description: `Hotel Booking #${bookingId}`,
        cart_currency: currency,
        cart_amount: amount,
        callback: `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/callback`,
        return: `${process.env.NEXT_PUBLIC_APP_URL}/checkout/result`,
        customer_details: {
            name: customerDetails.name,
            email: customerDetails.email,
            phone: customerDetails.phone || "0000000000",
            street1: customerDetails.address || "Main St",
            city: customerDetails.city || "Jeddah",
            state: customerDetails.state || "Makkah",
            country: customerDetails.country || "SA",
            zip: customerDetails.zip || "00000"
        },
        hide_shipping: true
    };

    try {
        const response = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Authorization': SERVER_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (data.redirect_url) {
            return {
                redirect_url: data.redirect_url,
                trace_id: data.tran_ref
            };
        } else {
            console.error('PayTabs Error:', data);
            return null;
        }
    } catch (error) {
        console.error('PayTabs Request Failed:', error);
        return null;
    }
}
