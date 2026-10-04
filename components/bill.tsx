import { PaymentBadge } from "@/components/status-badge";
import { restaurant } from "@/lib/catalog";
import { formatDate, formatPrice, paymentLabel } from "@/lib/format";
import type { OrderWithItems } from "@/lib/types";

export function Bill({ order }: { order: OrderWithItems }) {
  return (
    <article className="rounded-3xl bg-white p-6 ring-1 ring-black/5 print:p-0 print:ring-0">
      <header className="flex flex-wrap items-start justify-between gap-4 border-b border-black/10 pb-4">
        <div>
          <p className="text-lg font-extrabold">
            KING&apos;S <span className="text-gold-deep">BITES</span>
          </p>
          <p className="text-xs text-neutral-500">{restaurant.address}</p>
          <p className="text-xs text-neutral-500">{restaurant.phone}</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">Bill {order.id}</p>
          <p className="text-xs text-neutral-500">{formatDate(order.createdAt)}</p>
          <div className="mt-1">
            <PaymentBadge status={order.paymentStatus} />
          </div>
        </div>
      </header>
      <div className="mt-4 grid gap-1 text-sm sm:grid-cols-2">
        <p>
          <span className="text-neutral-500">Billed to: </span>
          {order.customerName}
        </p>
        <p className="sm:text-right">
          <span className="text-neutral-500">Phone: </span>
          {order.phone}
        </p>
        <p className="sm:col-span-2">
          <span className="text-neutral-500">Deliver to: </span>
          {order.address}
        </p>
      </div>
      <table className="mt-5 w-full text-sm">
        <thead>
          <tr className="border-b border-black/10 text-left text-xs uppercase tracking-wide text-neutral-500">
            <th className="py-2 font-semibold">Item</th>
            <th className="py-2 text-center font-semibold">Qty</th>
            <th className="py-2 text-right font-semibold">Price</th>
            <th className="py-2 text-right font-semibold">Amount</th>
          </tr>
        </thead>
        <tbody>
          {order.items.map((item) => (
            <tr key={item.menuItemId} className="border-b border-black/5">
              <td className="py-2">{item.name}</td>
              <td className="py-2 text-center">{item.qty}</td>
              <td className="py-2 text-right">{formatPrice(item.price)}</td>
              <td className="py-2 text-right">{formatPrice(item.price * item.qty)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <dl className="ml-auto mt-4 max-w-xs space-y-1 text-sm">
        <div className="flex justify-between">
          <dt className="text-neutral-500">Subtotal</dt>
          <dd>{formatPrice(order.subtotal)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-neutral-500">Delivery</dt>
          <dd>{order.deliveryFee === 0 ? "Free" : formatPrice(order.deliveryFee)}</dd>
        </div>
        <div className="flex justify-between border-t border-black/10 pt-2 text-base font-bold">
          <dt>Total</dt>
          <dd>{formatPrice(order.total)}</dd>
        </div>
        <div className="flex justify-between text-xs text-neutral-500">
          <dt>Payment</dt>
          <dd>{paymentLabel(order.paymentMethod)}</dd>
        </div>
      </dl>
      {order.status === "cancelled" ? (
        <p className="mt-4 text-sm font-semibold text-red-600">This order was cancelled. Nothing is owed.</p>
      ) : null}
    </article>
  );
}
