"use client";

import { ShoppingCart, Trash2, Truck } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { summarize } from "@/lib/cart";
import { useCart, useCartHydrated } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/shipping";
import { EmptyState } from "./empty-state";
import { OrderSummary } from "./order-summary";
import { QuantityStepper } from "./quantity-stepper";

export function CartView() {
  const hydrated = useCartHydrated();
  const items = useCart((state) => state.items);
  const setQuantity = useCart((state) => state.setQuantity);
  const remove = useCart((state) => state.remove);

  if (!hydrated) return <div className="h-64 animate-pulse rounded-2xl bg-gray-200/70" aria-label="Loading your cart" />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Browse the store and add a few things you like."
        action={{ href: "/products", label: "Start shopping" }}
      />
    );
  }

  const summary = summarize(items);
  const amountToFreeDelivery = FREE_SHIPPING_THRESHOLD_PAISE - summary.subtotalPaise;

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[1fr_360px]">
      <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 p-4 sm:p-5">
            <Link href={`/products/${item.slug}`} className="relative size-24 shrink-0 overflow-hidden rounded-xl bg-gray-100">
              <Image src={item.imageUrl} alt={item.name} fill sizes="96px" className="object-cover" />
            </Link>
            <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <Link href={`/products/${item.slug}`} className="font-medium text-gray-900 hover:text-indigo-700">
                  {item.name}
                </Link>
                <p className="mt-1 text-sm text-gray-500">{formatPrice(item.pricePaise)} each</p>
              </div>
              <div className="flex items-center gap-4 sm:flex-col sm:items-end">
                <p className="font-semibold text-gray-900">{formatPrice(item.pricePaise * item.quantity)}</p>
                <div className="flex items-center gap-2">
                  <QuantityStepper
                    value={item.quantity}
                    max={item.maxQuantity}
                    onChange={(quantity) => setQuantity(item.productId, quantity)}
                    label={`Quantity of ${item.name}`}
                  />
                  <button
                    type="button"
                    onClick={() => remove(item.productId)}
                    className="grid size-9 place-items-center rounded-full text-gray-400 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove ${item.name}`}
                  >
                    <Trash2 className="size-4" aria-hidden />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-gray-900">Order summary</h2>
        <p className="flex items-center gap-2 rounded-xl bg-indigo-50 px-3 py-2 text-sm text-indigo-800">
          <Truck className="size-4 shrink-0" aria-hidden />
          {amountToFreeDelivery > 0
            ? `Add ${formatPrice(amountToFreeDelivery)} more for free delivery.`
            : "Your order ships free."}
        </p>
        <OrderSummary {...summary} />
        <Link
          href="/checkout"
          className="block rounded-full bg-indigo-600 px-6 py-3 text-center font-semibold text-white hover:bg-indigo-700"
        >
          Proceed to checkout
        </Link>
        <Link href="/products" className="block text-center text-sm font-medium text-gray-600 hover:text-gray-900">
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
