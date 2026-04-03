export type PricingConfig = {
  deliveryFee: number;
  discountRate: number;
};

export const getDiscountBase = (subtotal: number, deliveryFee: number): number =>
  subtotal + deliveryFee;

export const getDiscountAmount = (
  subtotal: number,
  deliveryFee: number,
  discountRate: number
): number => {
  if (discountRate <= 0) {
    return 0;
  }

  return getDiscountBase(subtotal, deliveryFee) * discountRate;
};

export const getTotalWithPricing = (
  subtotal: number,
  deliveryFee: number,
  discountRate: number
): number => subtotal + deliveryFee - getDiscountAmount(subtotal, deliveryFee, discountRate);
