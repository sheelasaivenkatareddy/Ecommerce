import { Banknote, CircleCheck, MapPin } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { CancelOrderButton, ClearCart } from "@/components/order-actions";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { OrderSummary } from "@/components/order-summary";
import { ApiError, apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { Order, OrderStatus } from "@/lib/types";

export async function generateMetadata({ params }: PageProps<"/orders/[id]">): Promise<Metadata> {
  return { title: `Order #${(await params).id}` };
}

const STEPS: { status: OrderStatus; label: string }[] = [
  { status: "pending", label: "Placed" },
  { status: "confirmed", label: "Confirmed" },
  { status: "shipped", label: "Shipped" },
  { status: "delivered", label: "Delivered" },
];

export default async function OrderPage({ params, searchParams }: PageProps<"/orders/[id]">) {
  const { id } = await params;
  const justPlaced = (await searchParams).placed === "1";

  const session = await getSession();
  if (!session) redirect(`/login?next=/orders/${id}`);
  if (!/^\d+$/.test(id)) notFound();

  let order: Order;
  try {
    ({ order } = await apiFetch<{ order: Order }>(`/api/orders/${id}`, { token: session.token }));
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }

  const currentStep = STEPS.findIndex((step) => step.status === order.status);

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      {justPlaced && (
        <>
          <ClearCart />
          <div className="mb-8 flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-emerald-800">
            <CircleCheck className="mt-0.5 size-5 shrink-0" aria-hidden />
            <div>
              <p className="font-semibold">Thank you! Your order has been placed.</p>
              <p className="text-sm">We will let you know when it ships. Pay {formatPrice(order.totalPaise)} on delivery.</p>
            </div>
          </div>
        </>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/orders" className="text-sm font-medium text-gray-500 hover:text-gray-900">
            ← All orders
          </Link>
          <h1 className="mt-2 flex flex-wrap items-center gap-3 text-3xl font-bold tracking-tight text-gray-900">
            Order #{order.id} <OrderStatusBadge status={order.status} />
          </h1>
          <p className="mt-1 text-sm text-gray-500">Placed on {formatDate(order.createdAt)}</p>
        </div>
        {order.status === "pending" && <CancelOrderButton orderId={order.id} />}
      </div>

      {order.status === "cancelled" ? (
        <p className="mt-8 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-600">
          This order was cancelled. No payment is due.
        </p>
      ) : (
        <ol className="mt-8 grid grid-cols-4 gap-2 rounded-2xl border border-gray-200 bg-white p-5">
          {STEPS.map((step, index) => {
            const done = index <= currentStep;
            return (
              <li key={step.status} className="text-center">
                <div className={`h-1.5 rounded-full ${done ? "bg-indigo-600" : "bg-gray-200"}`} />
                <p className={`mt-2 text-xs font-medium sm:text-sm ${done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
              </li>
            );
          })}
        </ol>
      )}

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[1fr_320px]">
        <ul className="divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white">
          {order.items.map((item) => (
            <li key={item.productId} className="flex items-center gap-4 p-4">
              <span className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-gray-100">
                {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="64px" className="object-cover" />}
              </span>
              <div className="flex-1">
                {item.productSlug ? (
                  <Link href={`/products/${item.productSlug}`} className="font-medium text-gray-900 hover:text-indigo-700">
                    {item.name}
                  </Link>
                ) : (
                  <p className="font-medium text-gray-900">{item.name}</p>
                )}
                <p className="text-sm text-gray-500">
                  {formatPrice(item.unitPricePaise)} × {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-gray-900">{formatPrice(item.lineTotalPaise)}</p>
            </li>
          ))}
        </ul>

        <aside className="space-y-6 rounded-2xl border border-gray-200 bg-white p-6">
          <OrderSummary
            subtotalPaise={order.subtotalPaise}
            shippingPaise={order.shippingPaise}
            totalPaise={order.totalPaise}
            itemCount={order.itemCount}
          />
          <div className="space-y-1 border-t border-gray-200 pt-5 text-sm text-gray-600">
            <p className="flex items-center gap-2 font-semibold text-gray-900">
              <MapPin className="size-4" aria-hidden /> Delivery address
            </p>
            <p>{order.shipping.name}</p>
            <p>{order.shipping.address}</p>
            <p>
              {order.shipping.city}, {order.shipping.state} {order.shipping.pincode}
            </p>
            <p>Phone: {order.shipping.phone}</p>
          </div>
          <p className="flex items-center gap-2 border-t border-gray-200 pt-5 text-sm text-gray-600">
            <Banknote className="size-4" aria-hidden /> Cash on Delivery
          </p>
        </aside>
      </div>
    </div>
  );
}
