import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { PaymentBadge, StatusBadge } from "@/components/status-badge";
import { listOrdersForUser } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { requireUser } from "@/lib/session";
import { goldButtonClass } from "@/lib/styles";

export const metadata: Metadata = { title: "Order history" };

export default async function OrdersPage() {
  const user = await requireUser(["customer"], "/account/orders");
  const orders = await listOrdersForUser(user.id);

  if (orders.length === 0) {
    return (
      <div className="rounded-3xl bg-mist px-6 py-16 text-center">
        <p className="text-xl font-bold">No orders yet.</p>
        <Link href="/menu" className={`${goldButtonClass} mt-6`}>
          Browse the menu
        </Link>
      </div>
    );
  }

  return (
    <ul className="space-y-3">
      {orders.map((order) => (
        <li key={order.id}>
          <Link
            href={`/account/orders/${order.id}`}
            className="flex flex-col gap-3 rounded-2xl border border-black/5 p-4 hover:bg-mist sm:flex-row sm:items-center"
          >
            <span className="flex -space-x-3">
              {order.items.slice(0, 3).map((item) => (
                <span key={item.menuItemId} className="relative h-12 w-12 overflow-hidden rounded-full ring-2 ring-white">
                  <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                </span>
              ))}
            </span>
            <span className="min-w-0 flex-1">
              <span className="flex flex-wrap items-center gap-2">
                <span className="font-semibold">{order.id}</span>
                <StatusBadge status={order.status} />
                <PaymentBadge status={order.paymentStatus} />
              </span>
              <span className="mt-1 block truncate text-sm text-neutral-500">
                {order.items.map((item) => `${item.qty}× ${item.name}`).join(", ")}
              </span>
              <span className="block text-xs text-neutral-400">{formatDate(order.createdAt)}</span>
            </span>
            <span className="text-lg font-bold">{formatPrice(order.total)}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
