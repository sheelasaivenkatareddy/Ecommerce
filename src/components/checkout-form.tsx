"use client";

import { Banknote, LoaderCircle, ShoppingCart } from "lucide-react";
import Image from "next/image";
import { useActionState } from "react";
import { type CheckoutState, placeOrder } from "@/actions/orders";
import { summarize, toOrderLines } from "@/lib/cart";
import { useCart, useCartHydrated } from "@/lib/cart-store";
import { formatPrice } from "@/lib/format";
import { useFieldErrors } from "@/lib/use-field-errors";
import { INDIAN_STATES } from "@/lib/validation";
import { EmptyState } from "./empty-state";
import { Field, FormAlert, SelectField } from "./form-field";
import { OrderSummary } from "./order-summary";

export function CheckoutForm({ customerName }: { customerName: string }) {
  const hydrated = useCartHydrated();
  const items = useCart((state) => state.items);
  const [state, formAction, pending] = useActionState<CheckoutState, FormData>(placeOrder, {});
  const { errorFor, onChange } = useFieldErrors(state.fieldErrors);

  if (!hydrated) return <div className="h-96 animate-pulse rounded-2xl bg-gray-200/70" aria-label="Loading checkout" />;

  if (items.length === 0) {
    return (
      <EmptyState
        icon={ShoppingCart}
        title="Your cart is empty"
        description="Add something to your cart before checking out."
        action={{ href: "/products", label: "Browse products" }}
      />
    );
  }

  const summary = summarize(items);
  const values = state.values ?? {};

  return (
    <form action={formAction} onChange={onChange} className="grid items-start gap-8 lg:grid-cols-[1fr_380px]">
      <input type="hidden" name="items" value={JSON.stringify(toOrderLines(items))} />

      <div className="space-y-6">
        {state.error && <FormAlert>{state.error}</FormAlert>}

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Delivery address</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <Field
              label="Full name"
              name="name"
              autoComplete="name"
              required
              defaultValue={values.name ?? customerName}
              error={errorFor("name")}
              className="sm:col-span-2"
            />
            <Field
              label="Mobile number"
              name="phone"
              type="tel"
              inputMode="numeric"
              autoComplete="tel-national"
              placeholder="10-digit number"
              maxLength={10}
              required
              defaultValue={values.phone}
              error={errorFor("phone")}
            />
            <Field
              label="PIN code"
              name="pincode"
              inputMode="numeric"
              autoComplete="postal-code"
              placeholder="6 digits"
              maxLength={6}
              required
              defaultValue={values.pincode}
              error={errorFor("pincode")}
            />
            <Field
              label="Address"
              name="address"
              autoComplete="street-address"
              placeholder="House number, street, area"
              required
              defaultValue={values.address}
              error={errorFor("address")}
              className="sm:col-span-2"
            />
            <Field
              label="City"
              name="city"
              autoComplete="address-level2"
              required
              defaultValue={values.city}
              error={errorFor("city")}
            />
            <SelectField
              // React does not update a select's default after mount, so remount it to keep
              // the customer's choice when the form is reset after a validation error.
              key={values.state ?? ""}
              label="State"
              name="state"
              options={INDIAN_STATES}
              placeholder="Choose a state"
              autoComplete="address-level1"
              required
              defaultValue={values.state ?? ""}
              error={errorFor("state")}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
          <label className="mt-4 flex items-start gap-3 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4">
            <input type="radio" name="paymentMethod" value="cod" defaultChecked className="mt-1 accent-indigo-600" />
            <span>
              <span className="flex items-center gap-2 font-medium text-gray-900">
                <Banknote className="size-4" aria-hidden /> Cash on Delivery
              </span>
              <span className="mt-0.5 block text-sm text-gray-600">Pay in cash or UPI when your order arrives.</span>
            </span>
          </label>
        </section>
      </div>

      <aside className="space-y-5 rounded-2xl border border-gray-200 bg-white p-6 lg:sticky lg:top-24">
        <h2 className="text-lg font-semibold text-gray-900">Your order</h2>
        <ul className="space-y-3">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3 text-sm">
              <span className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                <Image src={item.imageUrl} alt="" fill sizes="48px" className="object-cover" />
              </span>
              <span className="flex-1 text-gray-700">
                {item.name} <span className="text-gray-400">× {item.quantity}</span>
              </span>
              <span className="font-medium text-gray-900">{formatPrice(item.pricePaise * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <OrderSummary {...summary} />
        <button
          type="submit"
          disabled={pending}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white hover:bg-indigo-700 disabled:cursor-wait disabled:bg-indigo-400"
        >
          {pending && <LoaderCircle className="size-4 animate-spin" aria-hidden />}
          {pending ? "Placing your order…" : `Place order · ${formatPrice(summary.totalPaise)}`}
        </button>
        <p className="text-center text-xs text-gray-500">Final prices are confirmed by the store when you place the order.</p>
      </aside>
    </form>
  );
}
