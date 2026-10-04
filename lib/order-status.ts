import type { OrderStatus } from "@/lib/types";

export const statusSteps: { id: OrderStatus; label: string; detail: string }[] = [
  { id: "placed", label: "Order placed", detail: "The kitchen has your order." },
  { id: "preparing", label: "Preparing", detail: "Your meal is on the grill." },
  { id: "ready", label: "Ready for pickup", detail: "Packed and waiting for a rider." },
  { id: "on-the-way", label: "On the way", detail: "A rider picked it up." },
  { id: "delivered", label: "Delivered", detail: "Enjoy. Rule your hunger." },
];

export const allStatuses: OrderStatus[] = [...statusSteps.map((step) => step.id), "cancelled"];

export function statusLabel(status: OrderStatus) {
  if (status === "cancelled") return "Cancelled";
  return statusSteps.find((step) => step.id === status)?.label ?? status;
}

export function statusTone(status: OrderStatus) {
  switch (status) {
    case "delivered":
      return "bg-emerald-100 text-emerald-800";
    case "cancelled":
      return "bg-red-100 text-red-700";
    case "on-the-way":
      return "bg-sky-100 text-sky-800";
    case "ready":
      return "bg-violet-100 text-violet-800";
    case "preparing":
      return "bg-amber-100 text-amber-800";
    default:
      return "bg-neutral-100 text-neutral-700";
  }
}

export function isActive(status: OrderStatus) {
  return status !== "delivered" && status !== "cancelled";
}
