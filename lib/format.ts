import type { CartLine, PaymentMethod } from "@/lib/types";

export const DELIVERY_FEE = 1500;
export const FREE_DELIVERY_FROM = 25000;

export function formatPrice(amount: number) {
  return `RWF ${new Intl.NumberFormat("en-RW").format(amount)}`;
}

export function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Africa/Kigali",
  }).format(new Date(value));
}

export function paymentLabel(method: PaymentMethod) {
  switch (method) {
    case "momo":
      return "MTN Mobile Money";
    case "airtel":
      return "Airtel Money";
    case "cash":
      return "Cash on delivery";
  }
}

export function resolveCart(lines: CartLine[]) {
  return lines.map((line) => ({ ...line, lineTotal: line.price * line.qty }));
}

export function cartTotals(lines: { price: number; qty: number }[]) {
  const subtotal = lines.reduce((sum, line) => sum + line.price * line.qty, 0);
  const deliveryFee = subtotal === 0 || subtotal >= FREE_DELIVERY_FROM ? 0 : DELIVERY_FEE;
  return { subtotal, deliveryFee, total: subtotal + deliveryFee };
}
