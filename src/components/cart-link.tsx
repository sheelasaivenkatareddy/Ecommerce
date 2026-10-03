"use client";

import { ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useCart, useCartHydrated } from "@/lib/cart-store";

export function CartLink() {
  const hydrated = useCartHydrated();
  const count = useCart((state) => state.items.reduce((sum, item) => sum + item.quantity, 0));
  const showCount = hydrated && count > 0;

  return (
    <Link
      href="/cart"
      aria-label={showCount ? `Cart, ${count} items` : "Cart"}
      className="relative grid size-10 place-items-center rounded-full text-gray-700 hover:bg-gray-100"
    >
      <ShoppingCart className="size-5" aria-hidden />
      {showCount && (
        <span className="absolute -top-0.5 -right-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-indigo-600 px-1 text-[11px] font-semibold text-white">
          {count}
        </span>
      )}
    </Link>
  );
}
