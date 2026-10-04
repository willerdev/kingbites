import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { AutoRefresh } from "@/components/auto-refresh";
import { StatusBadge } from "@/components/status-badge";
import { listOrdersForUser } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { isActive } from "@/lib/order-status";
import { requireUser } from "@/lib/session";
import { goldButtonClass } from "@/lib/styles";

export const metadata: Metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requireUser(["customer"], "/account");
  const orders = await listOrdersForUser(user.id);
  const active = orders.filter((order) => isActive(order.status));
  const billable = orders.filter((order) => order.status !== "cancelled");
  const spent = billable.reduce((sum, order) => sum + order.total, 0);
  const unpaid = billable.filter((order) => order.paymentStatus === "unpaid").reduce((sum, order) => sum + order.total, 0);

  return (
    <div className="space-y-8">
      {active.length > 0 ? <AutoRefresh seconds={20} /> : null}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Hi, {user.name.split(" ")[0]}</h2>
          <p className="text-sm text-neutral-500">Signed in as @{user.username}</p>
        </div>
        <form action={logout}>
          <button type="submit" className="rounded-full border border-black/10 px-4 py-2 text-sm font-semibold hover:bg-mist">
            Sign out
          </button>
        </form>
      </div>

      <dl className="grid gap-3 sm:grid-cols-3">
        {[
          { label: "Orders", value: String(orders.length) },
          { label: "Total spent", value: formatPrice(spent) },
          { label: "Unpaid bills", value: formatPrice(unpaid) },
        ].map((stat) => (
          <div key={stat.label} className="rounded-2xl bg-mist px-5 py-4">
            <dt className="text-sm text-neutral-500">{stat.label}</dt>
            <dd className="mt-1 text-2xl font-extrabold">{stat.value}</dd>
          </div>
        ))}
      </dl>

      <section>
        <h3 className="text-lg font-bold">Active deliveries</h3>
        {active.length === 0 ? (
          <div className="mt-3 rounded-2xl bg-mist px-5 py-8 text-center">
            <p className="font-semibold">Nothing on the way right now.</p>
            <Link href="/menu" className={`${goldButtonClass} mt-4`}>
              Order something
            </Link>
          </div>
        ) : (
          <ul className="mt-3 grid gap-3 md:grid-cols-2">
            {active.map((order) => (
              <li key={order.id}>
                <Link
                  href={`/account/orders/${order.id}`}
                  className="flex h-full flex-col rounded-2xl border border-black/5 p-4 hover:bg-mist"
                >
                  <span className="flex items-center justify-between gap-3">
                    <span className="font-semibold">{order.id}</span>
                    <StatusBadge status={order.status} />
                  </span>
                  <span className="mt-1 text-sm text-neutral-500">
                    {order.items.map((item) => `${item.qty}× ${item.name}`).join(", ")}
                  </span>
                  <span className="mt-3 flex items-center justify-between text-sm">
                    <span className="font-semibold">{formatPrice(order.total)}</span>
                    <span className="inline-flex items-center gap-1 font-semibold text-gold-deep">
                      Track <ArrowRight size={14} aria-hidden="true" />
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      {orders.length > active.length ? (
        <section>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold">Recent orders</h3>
            <Link href="/account/orders" className="text-sm font-semibold underline">
              See all
            </Link>
          </div>
          <ul className="mt-3 divide-y divide-black/5 rounded-2xl border border-black/5">
            {orders
              .filter((order) => !isActive(order.status))
              .slice(0, 3)
              .map((order) => (
                <li key={order.id}>
                  <Link href={`/account/orders/${order.id}`} className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-mist">
                    <span>
                      <span className="block text-sm font-semibold">{order.id}</span>
                      <span className="block text-xs text-neutral-500">{formatDate(order.createdAt)}</span>
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{formatPrice(order.total)}</span>
                      <StatusBadge status={order.status} />
                    </span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
