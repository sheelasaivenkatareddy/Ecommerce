import { useSyncExternalStore } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { addToCart, type CartItem, type CartProduct, removeFromCart, updateQuantity } from "./cart";

interface CartState {
  items: CartItem[];
  add: (product: CartProduct, quantity: number) => void;
  setQuantity: (productId: number, quantity: number) => void;
  remove: (productId: number) => void;
  clear: () => void;
}

/**
 * The shopping cart, saved in localStorage. Hydration is deferred until the browser
 * (see CartHydrator) so the server and the first client render always agree.
 */
export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      add: (product, quantity) => set((state) => ({ items: addToCart(state.items, product, quantity) })),
      setQuantity: (productId, quantity) =>
        set((state) => ({ items: updateQuantity(state.items, productId, quantity) })),
      remove: (productId) => set((state) => ({ items: removeFromCart(state.items, productId) })),
      clear: () => set({ items: [] }),
    }),
    {
      name: "storefront-cart",
      version: 1,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
      skipHydration: true,
    },
  ),
);

/** True once the saved cart has been loaded in the browser. */
export function useCartHydrated(): boolean {
  return useSyncExternalStore(
    (onChange) => useCart.persist.onFinishHydration(onChange),
    () => useCart.persist.hasHydrated(),
    () => false,
  );
}
