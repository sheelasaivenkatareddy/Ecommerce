"use client";

import { useActionState, useEffect } from "react";
import { type CancelOrderState, cancelOrder } from "@/actions/orders";
import { useCart, useCartHydrated } from "@/lib/cart-store";

export function CancelOrderButton({ orderId }: { orderId: number }) {
  const [state, formAction, pending] = useActionState<CancelOrderState, FormData>(
    cancelOrder.bind(null, orderId),
    {},
  );

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm("Cancel this order? The items will go back into stock.")) event.preventDefault();
      }}
    >
      <button
        type="submit"
        disabled={pending}
        className="rounded-full border border-red-200 px-4 py-2 text-sm font-semibold text-red-600 hover:bg-red-50 disabled:opacity-50"
      >
        {pending ? "Cancelling…" : "Cancel order"}
      </button>
      {state.error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {state.error}
        </p>
      )}
    </form>
  );
}

/** Empties the cart once an order has been placed successfully. */
export function ClearCart() {
  const hydrated = useCartHydrated();
  const clear = useCart((state) => state.clear);

  useEffect(() => {
    if (hydrated) clear();
  }, [hydrated, clear]);

  return null;
}
