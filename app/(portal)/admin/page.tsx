import Link from "next/link";
import { DriverSelect, StatusActions } from "@/components/admin/order-controls";
import { AutoRefresh } from "@/components/auto-refresh";
import { PortalHeading } from "@/components/portal-shell";
import { PaymentBadge } from "@/components/status-badge";
import { adminStats, listDrivers, listOrders } from "@/lib/data/orders";
import { formatDate, formatPrice, paymentLabel } from "@/lib/format";
import { requireUser } from "@/lib/session";
import type { OrderStatus } from "@/lib/types";

const columns: { status: OrderStatus; title: string }[] = [
  { status: "placed", title: "New" },
  { status: "preparing", title: "Preparing" },
  { status: "ready", title: "Ready" },
  { status: "on-the-way", title: "On the way" },
];

export default async function AdminDashboard() {
  await requireUser(["admin"], "/admin");
  const [stats, active, drivers] = await Promise.all([adminStats(), listOrders({ status: "active" }), listDrivers()]);

  return (
    <>
      <AutoRefresh seconds={15} />
      <PortalHeading title="Dashboard" subtitle="Live kitchen board. Refreshes every 15 seconds." />
      <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          { label: "Orders today", value: String(stats.ordersToday) },
          { label: "Revenue today", value: formatPrice(stats.revenueToday) },
          { label: "Active orders", value: String(stats.active) },
          { label: "Unpaid bills", value: formatPrice(stats.unpaid) },
          { label: "Collected (all time)", value: formatPrice(stats.collected) },
          { label: "Customers", value: String(stats.customers) },
          { label: "Active riders", value: String(stats.drivers) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-white px-4 py-4 ring-1 ring-black/5">
            <dt className="text-xs text-neutral-500">{stat.label}</dt>
            <dd className="mt-1 text-xl font-extrabold sm:text-2xl">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <div className="mt-8 grid gap-4 md:grid-cols-2 2xl:grid-cols-4">
        {columns.map((column) => {
          const orders = active.filter((order) => order.status === column.status);
          return (
            <section key={column.status} className="rounded-2xl bg-white/60 p-3 ring-1 ring-black/5">
              <h2 className="flex items-center justify-between px-1 pb-3 text-sm font-bold">
                {column.title}
                <span className="rounded-full bg-ink px-2 py-0.5 text-xs text-white">{orders.length}</span>
              </h2>
              <ul className="space-y-3">
                {orders.length === 0 ? (
                  <li className="rounded-xl border border-dashed border-black/10 px-3 py-6 text-center text-xs text-neutral-400">
                    Nothing here
                  </li>
                ) : (
                  orders.map((order) => (
                    <li key={order.id} className="space-y-3 rounded-xl bg-white p-3 shadow-sm ring-1 ring-black/5">
                      <div className="flex items-start justify-between gap-2">
                        <Link href={`/admin/orders/${order.id}`} className="font-semibold hover:underline">
                          {order.id}
                        </Link>
                        <span className="text-xs text-neutral-400">{formatDate(order.createdAt)}</span>
                      </div>
                      <ul className="text-sm">
                        {order.items.map((item) => (
                          <li key={item.menuItemId}>
                            {item.qty}× {item.name}
                          </li>
                        ))}
                      </ul>
                      {order.notes ? (
                        <p className="rounded-lg bg-amber-50 px-2 py-1 text-xs text-amber-900">“{order.notes}”</p>
                      ) : null}
                      <p className="text-xs text-neutral-500">
                        {order.customerName} · {order.phone}
                        <br />
                        {order.address}
                      </p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">{formatPrice(order.total)}</span>
                        <span className="flex items-center gap-1">
                          {paymentLabel(order.paymentMethod)} <PaymentBadge status={order.paymentStatus} />
                        </span>
                      </div>
                      <DriverSelect order={order} drivers={drivers} />
                      <StatusActions order={order} compact />
                    </li>
                  ))
                )}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
