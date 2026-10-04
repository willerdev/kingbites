import { Bike, Phone } from "lucide-react";
import { StatusBadge } from "@/components/status-badge";
import { formatDate } from "@/lib/format";
import { statusSteps } from "@/lib/order-status";
import type { OrderWithItems } from "@/lib/types";

function mapUrl(lat: number, lng: number) {
  const d = 0.008;
  const bbox = [lng - d, lat - d, lng + d, lat + d].join(",");
  return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
}

export function OrderTracker({ order }: { order: OrderWithItems }) {
  const cancelled = order.status === "cancelled";
  const stepIndex = statusSteps.findIndex((step) => step.id === order.status);
  const eventTime = (status: string) => order.events.findLast((event) => event.status === status)?.createdAt;
  const location = order.status === "on-the-way" ? order.driverLocation : null;

  return (
    <section className="rounded-3xl border border-black/5 p-5 sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-neutral-500">Order {order.id}</p>
          <h2 className="text-2xl font-bold">
            {cancelled ? "Order cancelled" : statusSteps[stepIndex]?.label ?? "Order placed"}
          </h2>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {location ? (
        <div className="mt-6 overflow-hidden rounded-2xl border border-black/5">
          <iframe
            title="Rider location"
            src={mapUrl(location.lat, location.lng)}
            className="h-64 w-full"
            loading="lazy"
          />
          <p className="bg-mist px-4 py-2 text-xs text-neutral-500">
            Rider location updated {formatDate(location.seenAt)}
          </p>
        </div>
      ) : (
        <div className="relative mt-6 h-36 overflow-hidden rounded-2xl bg-[#142018]">
          <div className="absolute left-8 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-gold" />
          <div className="absolute left-10 right-16 top-1/2 border-t-2 border-dashed border-gold/70" />
          {order.status === "on-the-way" ? (
            <Bike className="absolute left-1/2 top-1/2 h-6 w-6 -translate-x-1/2 -translate-y-[130%] text-gold" />
          ) : null}
          <div className="absolute right-8 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-white" />
          <p className="absolute bottom-3 left-4 text-xs text-white/70">King&apos;s Bites, Kimihurura</p>
          <p className="absolute bottom-3 right-4 max-w-[50%] truncate text-right text-xs text-white/90">
            {order.address}
          </p>
        </div>
      )}

      {order.driver && !cancelled ? (
        <div className="mt-4 flex items-center justify-between gap-3 rounded-2xl bg-mist px-4 py-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink text-gold">
              <Bike size={18} aria-hidden="true" />
            </span>
            <div>
              <p className="text-sm font-semibold">{order.driver.name}</p>
              <p className="text-xs text-neutral-500">Your rider</p>
            </div>
          </div>
          {order.driver.phone ? (
            <a
              href={`tel:${order.driver.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-sm font-semibold"
            >
              <Phone size={14} aria-hidden="true" />
              Call
            </a>
          ) : null}
        </div>
      ) : null}

      {cancelled ? (
        <p className="mt-6 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          This order was cancelled{eventTime("cancelled") ? ` on ${formatDate(eventTime("cancelled")!)}` : ""}.
        </p>
      ) : (
        <ol className="mt-6 space-y-4">
          {statusSteps.map((step, index) => {
            const done = index <= stepIndex;
            const at = eventTime(step.id);
            return (
              <li key={step.id} className="flex gap-3">
                <span
                  className={`mt-1 h-3 w-3 shrink-0 rounded-full ${done ? "bg-gold" : "bg-neutral-200"}`}
                  aria-hidden="true"
                />
                <span className="flex-1">
                  <span className={`block text-sm font-semibold ${done ? "text-ink" : "text-neutral-400"}`}>
                    {step.label}
                  </span>
                  <span className="block text-sm text-neutral-500">{step.detail}</span>
                </span>
                {at && done ? <span className="text-xs text-neutral-400">{formatDate(at)}</span> : null}
              </li>
            );
          })}
        </ol>
      )}
    </section>
  );
}
