import { assignDriver, setOrderStatus, setPaymentStatus } from "@/app/actions/admin";
import type { Order, OrderStatus } from "@/lib/types";

const NEXT: Partial<Record<OrderStatus, OrderStatus[]>> = {
  placed: ["preparing", "cancelled"],
  preparing: ["ready", "cancelled"],
  ready: ["on-the-way", "cancelled"],
  "on-the-way": ["delivered"],
};

const ACTION_LABEL: Partial<Record<OrderStatus, string>> = {
  preparing: "Accept & start cooking",
  ready: "Mark ready for pickup",
  "on-the-way": "Mark out for delivery",
  delivered: "Mark delivered",
  cancelled: "Cancel order",
};

const SHORT_LABEL: Partial<Record<OrderStatus, string>> = {
  preparing: "Accept",
  ready: "Ready",
  "on-the-way": "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancel",
};

export function StatusActions({ order, compact = false }: { order: Order; compact?: boolean }) {
  const next = NEXT[order.status] ?? [];
  if (next.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-2">
      {next.map((status) => (
        <form key={status} action={setOrderStatus.bind(null, order.id, status)}>
          <button
            type="submit"
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              status === "cancelled"
                ? "border border-red-200 text-red-700 hover:bg-red-50"
                : "bg-gold text-ink hover:bg-gold-deep"
            }`}
          >
            {compact ? SHORT_LABEL[status] : ACTION_LABEL[status]}
          </button>
        </form>
      ))}
    </div>
  );
}

export function DriverSelect({
  order,
  drivers,
}: {
  order: Order;
  drivers: { id: string; name: string; activeOrders: number }[];
}) {
  if (order.status === "delivered" || order.status === "cancelled") return null;
  return (
    <form action={assignDriver.bind(null, order.id)} className="flex flex-wrap items-center gap-2">
      <label className="sr-only" htmlFor={`driver-${order.id}`}>
        Rider
      </label>
      <select
        id={`driver-${order.id}`}
        name="driverId"
        defaultValue={order.driver?.id ?? ""}
        className="min-w-0 flex-1 rounded-full border border-black/10 bg-white px-3 py-1.5 text-xs"
      >
        <option value="">Unassigned</option>
        {drivers.map((driver) => (
          <option key={driver.id} value={driver.id}>
            {driver.name} ({driver.activeOrders} active)
          </option>
        ))}
      </select>
      <button type="submit" className="rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white">
        Assign
      </button>
    </form>
  );
}

export function PaymentToggle({ order }: { order: Order }) {
  const next = order.paymentStatus === "paid" ? "unpaid" : "paid";
  return (
    <form action={setPaymentStatus.bind(null, order.id, next)}>
      <button type="submit" className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold hover:bg-mist">
        {next === "paid" ? "Mark paid" : "Mark unpaid"}
      </button>
    </form>
  );
}
