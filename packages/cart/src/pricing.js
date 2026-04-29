export const getDiscountBase = (subtotal, deliveryFee) => subtotal + deliveryFee;
export const getDiscountAmount = (subtotal, deliveryFee, discountRate) => {
    if (discountRate <= 0) {
        return 0;
    }
    return getDiscountBase(subtotal, deliveryFee) * discountRate;
};
export const getTotalWithPricing = (subtotal, deliveryFee, discountRate) => subtotal + deliveryFee - getDiscountAmount(subtotal, deliveryFee, discountRate);
