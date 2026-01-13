export interface PaymentInitiationRequest {
    bookingId: string;
    userId: string;
    amount: number;
}

export interface PayTabsResponse {
    tran_ref: string;
    tran_type: string;
    cart_id: string;
    cart_description: string;
    cart_currency: string;
    cart_amount: string;
    tran_currency: string;
    tran_total: string;
    customer_details: {
        name: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        state: string;
        country: string;
        zip: string;
        ip: string;
    };
    payment_result: {
        response_status: string; // "A" for success
        response_code: string;
        response_message: string;
        transaction_time: string;
    };
    payment_info: {
        payment_method: string;
        card_type: string;
        card_scheme: string;
        payment_description: string;
        expiryMonth: string;
        expiryYear: string;
    };
}
