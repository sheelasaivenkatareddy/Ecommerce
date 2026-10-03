import { shippingFor } from "./shipping";

/** The API accepts at most this many units of one product per order. */
export const MAX_UNITS_PER_PRODUCT = 10;

export interface CartItem {
  productId: number;
  slug: string;
  name: string;
  imageUrl: string;
  /** Price shown to the customer; the API recalculates it at checkout. */
  pricePaise: number;
  quantity: number;
  /** Most units the customer can buy: the stock, capped at the per-order limit. */
  maxQuantity: number;
}

export interface CartProduct {
  productId: number;
  slug: string;
  name: string;
  imageUrl: string;
  pricePaise: number;
  stock: number;
}

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function maxQuantityFor(stock: number): number {
  return Math.max(0, Math.min(stock, MAX_UNITS_PER_PRODUCT));
}

export function addToCart(items: CartItem[], product: CartProduct, quantity: number): CartItem[] {
  const maxQuantity = maxQuantityFor(product.stock);
  if (maxQuantity === 0 || quantity < 1) return items;

  const details = {
    productId: product.productId,
    slug: product.slug,
    name: product.name,
    imageUrl: product.imageUrl,
    pricePaise: product.pricePaise,
    maxQuantity,
  };
  const existing = items.find((item) => item.productId === product.productId);
  if (!existing) return [...items, { ...details, quantity: clamp(quantity, 1, maxQuantity) }];

  return items.map((item) =>
    item.productId === product.productId
      ? { ...details, quantity: clamp(item.quantity + quantity, 1, maxQuantity) }
      : item,
  );
}

export function updateQuantity(items: CartItem[], productId: number, quantity: number): CartItem[] {
  if (quantity < 1) return removeFromCart(items, productId);
  return items.map((item) =>
    item.productId === productId
      ? { ...item, quantity: clamp(Math.floor(quantity), 1, item.maxQuantity) }
      : item,
  );
}

export function removeFromCart(items: CartItem[], productId: number): CartItem[] {
  return items.filter((item) => item.productId !== productId);
}

export interface CartSummary {
  itemCount: number;
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
}

export function summarize(items: CartItem[]): CartSummary {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotalPaise = items.reduce((sum, item) => sum + item.pricePaise * item.quantity, 0);
  const shippingPaise = shippingFor(subtotalPaise);
  return { itemCount, subtotalPaise, shippingPaise, totalPaise: subtotalPaise + shippingPaise };
}

/** The minimal payload the API needs: it looks up names and prices itself. */
export function toOrderLines(items: CartItem[]) {
  return items.map((item) => ({ productId: item.productId, quantity: item.quantity }));
}
