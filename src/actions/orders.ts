"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { ApiError, apiFetch } from "@/lib/api";
import { getSession } from "@/lib/session";
import type { Order, ShippingAddress } from "@/lib/types";
import { fieldErrors, orderLinesSchema, shippingSchema } from "@/lib/validation";

export interface CheckoutState {
  error?: string;
  fieldErrors?: Record<string, string>;
  values?: Partial<ShippingAddress>;
}

const ADDRESS_FIELDS = ["name", "phone", "address", "city", "state", "pincode"] as const;

export async function placeOrder(_previous: CheckoutState, formData: FormData): Promise<CheckoutState> {
  const session = await getSession();
  if (!session) redirect("/login?next=/checkout");

  const values = Object.fromEntries(
    ADDRESS_FIELDS.map((field) => [field, String(formData.get(field) ?? "")]),
  ) as Record<(typeof ADDRESS_FIELDS)[number], string>;

  const shipping = shippingSchema.safeParse(values);
  if (!shipping.success) return { fieldErrors: fieldErrors(shipping.error), values };

  let lines: unknown;
  try {
    lines = JSON.parse(String(formData.get("items") ?? "[]"));
  } catch {
    lines = [];
  }
  const items = orderLinesSchema.safeParse(lines);
  if (!items.success) return { error: "Your cart is empty or out of date. Please review it and try again.", values };

  let order: Order;
  try {
    ({ order } = await apiFetch<{ order: Order }>("/api/orders", {
      method: "POST",
      token: session.token,
      body: { items: items.data, shipping: shipping.data, paymentMethod: "cod" },
    }));
  } catch (error) {
    if (!(error instanceof ApiError)) throw error;
    const apiFieldErrors = error.details?.map((d) => [d.path.replace(/^shipping\./, ""), d.message]);
    return {
      error: error.message,
      fieldErrors: apiFieldErrors && Object.fromEntries(apiFieldErrors),
      values,
    };
  }

  redirect(`/orders/${order.id}?placed=1`);
}

export interface CancelOrderState {
  error?: string;
}

export async function cancelOrder(orderId: number, _previous: CancelOrderState): Promise<CancelOrderState> {
  const session = await getSession();
  if (!session) redirect(`/login?next=/orders/${orderId}`);

  try {
    await apiFetch(`/api/orders/${orderId}/cancel`, { method: "POST", token: session.token });
  } catch (error) {
    if (error instanceof ApiError) return { error: error.message };
    throw error;
  }

  revalidatePath(`/orders/${orderId}`);
  return {};
}
