import { ChevronRight, Package } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/empty-state";
import { OrderStatusBadge } from "@/components/order-status-badge";
import { apiFetch } from "@/lib/api";
import { formatDate, formatPrice } from "@/lib/format";
import { getSession } from "@/lib/session";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Your orders" };

export default async function OrdersPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/orders");

  const { orders } = await apiFetch<{ orders: Order[] }>("/api/orders", { token: session.token });

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-bold tracking-tight text-gray-900">Your orders</h1>

      {orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="When you place an order, you can track it here."
          action={{ href: "/products", label: "Start shopping" }}
        />
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-5 transition hover:border-indigo-300 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex -space-x-3">
                  {order.items.slice(0, 3).map((item) => (
                    <span key={item.productId} className="relative size-14 overflow-hidden rounded-xl bg-gray-100 ring-2 ring-white">
                      {item.imageUrl && <Image src={item.imageUrl} alt="" fill sizes="56px" className="object-cover" />}
                    </span>
                  ))}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="font-semibold text-gray-900">Order #{order.id}</p>
                    <OrderStatusBadge status={order.status} />
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    Placed on {formatDate(order.createdAt)} · {order.itemCount} {order.itemCount === 1 ? "item" : "items"}
                  </p>
                </div>
                <div className="flex items-center gap-2 font-semibold text-gray-900">
                  {formatPrice(order.totalPaise)}
                  <ChevronRight className="size-5 text-gray-400" aria-hidden />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
