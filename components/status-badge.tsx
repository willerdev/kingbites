import { statusLabel, statusTone } from "@/lib/order-status";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusTone(status)}`}>
      {statusLabel(status)}
    </span>
  );
}

export function PaymentBadge({ status }: { status: PaymentStatus }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        status === "paid" ? "bg-emerald-100 text-emerald-800" : "bg-orange-100 text-orange-800"
      }`}
    >
      {status === "paid" ? "Paid" : "Unpaid"}
    </span>
  );
}
