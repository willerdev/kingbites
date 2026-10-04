import type { Metadata } from "next";
import { PortalHeading } from "@/components/portal-shell";
import { PaymentBadge } from "@/components/status-badge";
import { listDriverOrders } from "@/lib/data/orders";
import { formatDate, formatPrice } from "@/lib/format";
import { requireUser } from "@/lib/session";

export const metadata: Metadata = { title: "History" };

export default async function DriverHistoryPage() {
  const driver = await requireUser(["driver"], "/driver/history");
  const delivered = (await listDriverOrders(driver.id)).filter((order) => order.status === "delivered");
  const collected = delivered
    .filter((order) => order.paymentMethod === "cash" && order.paymentStatus === "paid")
    .reduce((sum, order) => sum + order.total, 0);

  return (
    <>
      <PortalHeading title="Delivery history" subtitle={`${delivered.length} delivered · ${formatPrice(collected)} cash collected`} />
      {delivered.length === 0 ? (
        <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-neutral-500 ring-1 ring-black/5">
          Completed deliveries show up here.
        </p>
      ) : (
        <ul className="divide-y divide-black/5 rounded-2xl bg-white ring-1 ring-black/5">
          {delivered.map((order) => (
            <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 text-sm">
              <span>
                <span className="block font-semibold">{order.id}</span>
                <span className="block text-xs text-neutral-500">
                  {order.address} · {formatDate(order.deliveredAt ?? order.updatedAt)}
                </span>
              </span>
              <span className="flex items-center gap-2">
                <span className="font-semibold">{formatPrice(order.total)}</span>
                <PaymentBadge status={order.paymentStatus} />
              </span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
