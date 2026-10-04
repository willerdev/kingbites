import { Navigation, Phone } from "lucide-react";
import { claimDelivery, completeDelivery, pickUpDelivery, releaseDelivery } from "@/app/actions/driver";
import { AutoRefresh } from "@/components/auto-refresh";
import { LocationSharer } from "@/components/driver/location-sharer";
import { PortalHeading } from "@/components/portal-shell";
import { PaymentBadge, StatusBadge } from "@/components/status-badge";
import { listDriverOrders, listOpenDeliveries } from "@/lib/data/orders";
import { formatDate, formatPrice, paymentLabel } from "@/lib/format";
import { isActive } from "@/lib/order-status";
import { requireUser } from "@/lib/session";
import type { Order, OrderItem } from "@/lib/types";

type DeliveryOrder = Order & { items: OrderItem[] };

export default async function DriverPage() {
  const driver = await requireUser(["driver"], "/driver");
  const [mine, open] = await Promise.all([listDriverOrders(driver.id), listOpenDeliveries()]);
  const active = mine.filter((order) => isActive(order.status));
  const riding = active.some((order) => order.status === "on-the-way");

  return (
    <>
      <AutoRefresh seconds={15} />
      <PortalHeading title={`Hi, ${driver.name.split(" ")[0]}`} subtitle="Your deliveries refresh every 15 seconds." />
      {riding ? (
        <div className="mb-6">
          <LocationSharer />
        </div>
      ) : null}

      <section>
        <h2 className="mb-3 text-lg font-bold">My deliveries ({active.length})</h2>
        {active.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-neutral-500 ring-1 ring-black/5">
            No deliveries assigned. Claim one below when the kitchen starts cooking.
          </p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {active.map((order) => (
              <DeliveryCard key={order.id} order={order}>
                {order.status === "on-the-way" ? (
                  <form action={completeDelivery.bind(null, order.id)} className="space-y-3">
                    {order.paymentStatus === "unpaid" ? (
                      <label className="flex items-center gap-2 rounded-xl bg-orange-50 px-3 py-2 text-sm text-orange-900">
                        <input type="checkbox" name="collected" defaultChecked={order.paymentMethod === "cash"} />
                        I collected {formatPrice(order.total)}
                        {order.paymentMethod === "cash" ? " in cash" : ` via ${paymentLabel(order.paymentMethod)}`}
                      </label>
                    ) : null}
                    <button type="submit" className="w-full rounded-full bg-emerald-600 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700">
                      Mark delivered
                    </button>
                  </form>
                ) : (
                  <div className="flex gap-2">
                    <form action={pickUpDelivery.bind(null, order.id)} className="flex-1">
                      <button
                        type="submit"
                        className="w-full rounded-full bg-gold py-2.5 text-sm font-semibold text-ink hover:bg-gold-deep"
                      >
                        {order.status === "ready" ? "Picked up — start delivery" : "Picked up early"}
                      </button>
                    </form>
                    <form action={releaseDelivery.bind(null, order.id)}>
                      <button type="submit" className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold hover:bg-mist">
                        Release
                      </button>
                    </form>
                  </div>
                )}
              </DeliveryCard>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-10">
        <h2 className="mb-3 text-lg font-bold">Open deliveries ({open.length})</h2>
        {open.length === 0 ? (
          <p className="rounded-2xl bg-white px-4 py-8 text-center text-sm text-neutral-500 ring-1 ring-black/5">
            Nothing waiting for a rider.
          </p>
        ) : (
          <ul className="grid gap-4 lg:grid-cols-2">
            {open.map((order) => (
              <DeliveryCard key={order.id} order={order}>
                <form action={claimDelivery.bind(null, order.id)}>
                  <button type="submit" className="w-full rounded-full bg-ink py-2.5 text-sm font-semibold text-white">
                    Take this delivery
                  </button>
                </form>
              </DeliveryCard>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

function DeliveryCard({ order, children }: { order: DeliveryOrder; children: React.ReactNode }) {
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${order.address}, Kigali, Rwanda`)}`;
  return (
    <li className="flex flex-col gap-3 rounded-2xl bg-white p-4 ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-bold">{order.id}</p>
          <p className="text-xs text-neutral-400">{formatDate(order.createdAt)}</p>
        </div>
        <StatusBadge status={order.status} />
      </div>
      <div className="rounded-xl bg-mist px-3 py-2 text-sm">
        <p className="font-semibold">{order.customerName}</p>
        <p className="text-neutral-600">{order.address}</p>
        {order.notes ? <p className="mt-1 text-xs text-amber-800">Note: {order.notes}</p> : null}
      </div>
      <div className="flex gap-2">
        <a
          href={`tel:${order.phone.replace(/\s/g, "")}`}
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-black/10 py-2 text-sm font-semibold"
        >
          <Phone size={14} aria-hidden="true" /> Call
        </a>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-black/10 py-2 text-sm font-semibold"
        >
          <Navigation size={14} aria-hidden="true" /> Directions
        </a>
      </div>
      <p className="text-sm text-neutral-600">{order.items.map((item) => `${item.qty}× ${item.name}`).join(", ")}</p>
      <div className="flex items-center justify-between text-sm">
        <span className="font-bold">{formatPrice(order.total)}</span>
        <span className="flex items-center gap-1 text-xs">
          {paymentLabel(order.paymentMethod)} <PaymentBadge status={order.paymentStatus} />
        </span>
      </div>
      {children}
    </li>
  );
}
