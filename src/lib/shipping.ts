// Mirrors the delivery rule in the Ecom API, which always has the final say.

/** Orders at or above this subtotal ship free (₹999). */
export const FREE_SHIPPING_THRESHOLD_PAISE = 99_900;

/** Delivery fee for smaller orders (₹49). */
export const SHIPPING_FEE_PAISE = 4_900;

export function shippingFor(subtotalPaise: number): number {
  if (subtotalPaise === 0) return 0;
  return subtotalPaise >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : SHIPPING_FEE_PAISE;
}
