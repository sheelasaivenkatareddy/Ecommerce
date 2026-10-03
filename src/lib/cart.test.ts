import { describe, expect, it } from "vitest";
import { addToCart, type CartProduct, MAX_UNITS_PER_PRODUCT, removeFromCart, summarize, toOrderLines, updateQuantity } from "./cart";

const mug: CartProduct = {
  productId: 12,
  slug: "ceramic-coffee-mug",
  name: "Ceramic Coffee Mug",
  imageUrl: "https://images.unsplash.com/photo-1",
  pricePaise: 34_900,
  stock: 150,
};
const watch: CartProduct = { ...mug, productId: 10, slug: "watch", name: "Watch", pricePaise: 899_900, stock: 3 };

describe("cart", () => {
  it("adds new products and merges repeat additions", () => {
    let items = addToCart([], mug, 2);
    items = addToCart(items, mug, 1);
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ productId: 12, quantity: 3, maxQuantity: MAX_UNITS_PER_PRODUCT });
  });

  it("never exceeds the stock or the per-order limit", () => {
    expect(addToCart([], watch, 5)[0]?.quantity).toBe(3);
    expect(addToCart([], mug, 25)[0]?.quantity).toBe(MAX_UNITS_PER_PRODUCT);
    expect(addToCart([], { ...mug, stock: 0 }, 1)).toEqual([]);
  });

  it("updates quantities within bounds and removes at zero", () => {
    const items = addToCart(addToCart([], mug, 2), watch, 1);
    expect(updateQuantity(items, 10, 99).find((i) => i.productId === 10)?.quantity).toBe(3);
    expect(updateQuantity(items, 12, 0).map((i) => i.productId)).toEqual([10]);
    expect(removeFromCart(items, 10).map((i) => i.productId)).toEqual([12]);
  });

  it("summarises totals and applies the free-delivery threshold", () => {
    expect(summarize([])).toEqual({ itemCount: 0, subtotalPaise: 0, shippingPaise: 0, totalPaise: 0 });
    expect(summarize(addToCart([], mug, 2))).toEqual({
      itemCount: 2,
      subtotalPaise: 69_800,
      shippingPaise: 4_900,
      totalPaise: 74_700,
    });
    expect(summarize(addToCart([], watch, 1)).shippingPaise).toBe(0);
  });

  it("sends only product ids and quantities to the API", () => {
    expect(toOrderLines(addToCart([], mug, 2))).toEqual([{ productId: 12, quantity: 2 }]);
  });
});
