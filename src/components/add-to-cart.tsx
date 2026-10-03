"use client";

import { CircleCheck, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { maxQuantityFor } from "@/lib/cart";
import { useCart, useCartHydrated } from "@/lib/cart-store";
import type { Product } from "@/lib/types";
import { QuantityStepper } from "./quantity-stepper";

export function AddToCart({ product }: { product: Product }) {
  const add = useCart((state) => state.add);
  const inCart = useCart((state) => state.items.find((item) => item.productId === product.id)?.quantity ?? 0);
  const hydrated = useCartHydrated();
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = setTimeout(() => setJustAdded(false), 2500);
    return () => clearTimeout(timer);
  }, [justAdded]);

  if (!product.inStock) {
    return <p className="rounded-xl bg-gray-100 px-4 py-3 text-sm font-medium text-gray-600">Currently out of stock</p>;
  }

  const remaining = Math.max(0, maxQuantityFor(product.stock) - (hydrated ? inCart : 0));
  const selected = Math.min(quantity, Math.max(remaining, 1));

  function handleAdd() {
    add(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        imageUrl: product.imageUrl,
        pricePaise: product.pricePaise,
        stock: product.stock,
      },
      selected,
    );
    setQuantity(1);
    setJustAdded(true);
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-3">
        <QuantityStepper value={selected} max={Math.max(remaining, 1)} onChange={setQuantity} />
        <button
          type="button"
          onClick={handleAdd}
          disabled={remaining === 0}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-2.5 font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-gray-300 sm:flex-none"
        >
          <ShoppingCart className="size-4" aria-hidden />
          Add to cart
        </button>
      </div>
      <div aria-live="polite" className="min-h-6 text-sm">
        {justAdded ? (
          <p className="flex items-center gap-1.5 text-emerald-700">
            <CircleCheck className="size-4" aria-hidden />
            Added to your cart.{" "}
            <Link href="/cart" className="font-semibold underline underline-offset-2">
              View cart
            </Link>
          </p>
        ) : (
          hydrated &&
          remaining === 0 && <p className="text-gray-500">You have the most you can order in your cart.</p>
        )}
      </div>
    </div>
  );
}
