import { formatPrice } from "@/lib/format";

interface OrderSummaryProps {
  subtotalPaise: number;
  shippingPaise: number;
  totalPaise: number;
  itemCount: number;
}

export function OrderSummary({ subtotalPaise, shippingPaise, totalPaise, itemCount }: OrderSummaryProps) {
  return (
    <dl className="space-y-2 text-sm">
      <div className="flex justify-between text-gray-600">
        <dt>
          Subtotal ({itemCount} {itemCount === 1 ? "item" : "items"})
        </dt>
        <dd className="font-medium text-gray-900">{formatPrice(subtotalPaise)}</dd>
      </div>
      <div className="flex justify-between text-gray-600">
        <dt>Delivery</dt>
        <dd className={shippingPaise === 0 ? "font-medium text-emerald-700" : "font-medium text-gray-900"}>
          {shippingPaise === 0 ? "Free" : formatPrice(shippingPaise)}
        </dd>
      </div>
      <div className="flex justify-between border-t border-gray-200 pt-3 text-base font-semibold text-gray-900">
        <dt>Total</dt>
        <dd>{formatPrice(totalPaise)}</dd>
      </div>
    </dl>
  );
}
