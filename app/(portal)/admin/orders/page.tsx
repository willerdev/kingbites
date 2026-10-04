import type { Metadata } from "next";
import Link from "next/link";
import { PortalHeading } from "@/components/portal-shell";
import { PaymentBadge, StatusBadge } from "@/components/status-badge";
import { listOrders } from "@/lib/data/orders";
import { formatDate, formatPrice, paymentLabel } from "@/lib/format";
import { allStatuses, statusLabel } from "@/lib/order-status";
import { requireUser } from "@/lib/session";
import type { OrderStatus } from "@/lib/types";

export const metadata: Metadata = { title: "Orders" };

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  await requireUser(["admin"], "/admin/orders");
  const { status } = await searchParams;
  const filter = status === "active" || allStatuses.includes(status as OrderStatus) ? (status as OrderStatus | "active") : undefined;
  const orders = await listOrders({ status: filter, limit: 200 });
  const filters = [
    { value: "", label: "All" },
    { value: "active", label: "Active" },
    ...allStatuses.map((value) => ({ value, label: statusLabel(value) })),
  ];

  return (
    <>
      <PortalHeading title="Orders" subtitle={`${orders.length} shown`} />
      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {filters.map((entry) => {
          const active = (filter ?? "") === entry.value;
          return (
            <Link
              key={entry.value}
              href={entry.value ? `/admin/orders?status=${entry.value}` : "/admin/orders"}
              className={`shrink-0 rounded-full px-3 py-1.5 text-sm font-semibold ${
                active ? "bg-ink text-white" : "bg-white text-ink ring-1 ring-black/5 hover:bg-white/70"
              }`}
            >
              {entry.label}
            </Link>
          );
        })}
      </div>
      <div className="overflow-x-auto rounded-2xl bg-white ring-1 ring-black/5">
        <table className="w-full min-w-[820px] text-sm">
          <thead className="border-b border-black/5 text-left text-xs uppercase tracking-wide text-neutral-500">
            <tr>
              <th className="px-4 py-3 font-semibold">Order</th>
              <th className="px-4 py-3 font-semibold">Placed</th>
              <th className="px-4 py-3 font-semibold">Customer</th>
              <th className="px-4 py-3 font-semibold">Rider</th>
              <th className="px-4 py-3 font-semibold">Status</th>
              <th className="px-4 py-3 font-semibold">Payment</th>
              <th className="px-4 py-3 text-right font-semibold">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-black/5">
            {orders.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-neutral-400">
                  No orders match this filter.
                </td>
              </tr>
            ) : (
              orders.map((order) => (
                <tr key={order.id} className="hover:bg-mist/60">
                  <td className="px-4 py-3">
                    <Link href={`/admin/orders/${order.id}`} className="font-semibold underline">
                      {order.id}
                    </Link>
                    <span className="block text-xs text-neutral-400">
                      {order.items.reduce((sum, item) => sum + item.qty, 0)} items
                    </span>
                  </td>
                  <td className="px-4 py-3 text-neutral-500">{formatDate(order.createdAt)}</td>
                  <td className="px-4 py-3">
                    {order.customerName}
                    <span className="block text-xs text-neutral-400">{order.phone}</span>
                  </td>
                  <td className="px-4 py-3">{order.driver?.name ?? <span className="text-neutral-400">—</span>}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={order.status} />
                  </td>
                  <td className="px-4 py-3">
                    <PaymentBadge status={order.paymentStatus} />
                    <span className="block text-xs text-neutral-400">{paymentLabel(order.paymentMethod)}</span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold">{formatPrice(order.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}
