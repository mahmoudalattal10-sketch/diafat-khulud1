export interface PricingParams {
    basePrice: number;
    baseCapacity: number; // Standard number of adults included in base price
    adults: number;
    children: number;
    allowSingleDiscount?: boolean;
}

export interface PricingBreakdown {
    totalPrice: number;
    basePrice: number;
    singleDiscount: number;
    extraAdultsCharge: number;
    childrenCharge: number;
    currency: string;
}

/**
 * Calculates the total room price based on the Smart Yield strategy.
 * 
 * Strategy:
 * 1. Base Price: Covers up to `baseCapacity` adults.
 * 2. Single Discount: 15% off base price if 1 adult (and allowed).
 * 3. Extra Adult: 25% of base price per extra adult above baseCapacity.
 * 4. Children: 1st child free, subsequent children 10% of base price.
 */
export function calculateSmartPrice(params: PricingParams): PricingBreakdown {
    const { basePrice, baseCapacity, adults, children, allowSingleDiscount = true } = params;

    let total = basePrice;
    let singleDiscount = 0;
    let extraAdultsCharge = 0;
    let childrenCharge = 0;

    // Standard Smart Formula

    // Simplified Logic: Direct Base Price Mapping for Exact Admin Match
    // We are temporarily disabling smart adjustments to ensure "What you see is what you get"

    // 1. Single Occupancy Discount (DISABLED)
    /*
    if (adults === 1 && baseCapacity >= 2 && allowSingleDiscount) {
        singleDiscount = basePrice * 0.15;
        total -= singleDiscount;
    }
    */

    // 2. Extra Adults Charge (DISABLED)
    /*
    if (adults > baseCapacity) {
        const extraCount = adults - baseCapacity;
        extraAdultsCharge = extraCount * (basePrice * 0.25);
        total += extraAdultsCharge;
    }
    */

    // 3. Child Policy (DISABLED)
    /*
    if (children > 1) {
        const chargeableChildren = children - 1;
        childrenCharge = chargeableChildren * (basePrice * 0.10);
        total += childrenCharge;
    }
    */

    return {
        totalPrice: Math.round(total),
        basePrice,
        singleDiscount: Math.round(singleDiscount),
        extraAdultsCharge: Math.round(extraAdultsCharge),
        childrenCharge: Math.round(childrenCharge),
        currency: 'SAR'
    };
}
