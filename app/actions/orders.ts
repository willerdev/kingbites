"use server";

import { randomInt } from "node:crypto";
import bcrypt from "bcryptjs";
import { refresh } from "next/cache";
import { sql } from "@/lib/db";
import { cartTotals } from "@/lib/format";
import { requireUser } from "@/lib/session";
import type { PaymentMethod } from "@/lib/types";

const PAYMENTS: PaymentMethod[] = ["momo", "airtel", "cash"];

type PlaceOrderInput = {
  lines: { id: string; qty: number }[];
  name: string;
  phone: string;
  address: string;
  notes: string;
  payment: PaymentMethod;
  saveAddress: boolean;
};

export async function placeOrder(input: PlaceOrderInput): Promise<{ error: string } | { orderId: string }> {
  const user = await requireUser(["customer"], "/checkout");

  const name = input.name.trim();
  const phone = input.phone.trim();
  const address = input.address.trim();
  const notes = input.notes.trim().slice(0, 500);
  if (name.length < 2 || phone.replace(/\D/g, "").length < 9 || address.length < 3) {
    return { error: "Add your name, a phone number, and a delivery address." };
  }
  if (!PAYMENTS.includes(input.payment)) return { error: "Choose a payment method." };

  const quantities = new Map<string, number>();
  for (const line of input.lines) {
    const qty = Math.floor(Number(line.qty));
    if (qty > 0 && qty <= 50) quantities.set(line.id, (quantities.get(line.id) ?? 0) + qty);
  }
  if (quantities.size === 0) return { error: "Your cart is empty." };

  const ids = [...quantities.keys()];
  const rows = await sql`SELECT id, name, image, price, available FROM menu_items WHERE id = ANY(${ids})`;
  const unavailable = ids.filter((id) => !rows.some((row) => row.id === id && row.available));
  if (unavailable.length > 0) {
    return { error: "Some items in your cart are no longer available. Remove them and try again." };
  }

  const items = rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    image: row.image as string,
    price: Number(row.price),
    qty: quantities.get(row.id as string)!,
  }));
  const totals = cartTotals(items);

  for (let attempt = 0; attempt < 3; attempt++) {
    const orderId = `KB-${randomInt(100000, 999999)}`;
    try {
      await sql.transaction([
        sql`
          INSERT INTO orders (id, user_id, customer_name, phone, address, notes, payment_method, subtotal, delivery_fee, total)
          VALUES (${orderId}, ${user.id}, ${name}, ${phone}, ${address}, ${notes}, ${input.payment},
                  ${totals.subtotal}, ${totals.deliveryFee}, ${totals.total})`,
        ...items.map(
          (item) => sql`
            INSERT INTO order_items (order_id, menu_item_id, name, image, price, qty)
            VALUES (${orderId}, ${item.id}, ${item.name}, ${item.image}, ${item.price}, ${item.qty})`,
        ),
        sql`INSERT INTO order_events (order_id, status, note) VALUES (${orderId}, 'placed', 'Order received')`,
        ...(input.saveAddress
          ? [sql`UPDATE users SET phone = ${phone}, address = ${address} WHERE id = ${user.id}`]
          : []),
      ]);
      return { orderId };
    } catch (error) {
      if (!String(error).includes("orders_pkey")) throw error;
    }
  }
  return { error: "We could not place the order. Please try again." };
}

export async function cancelOrder(orderId: string) {
  const user = await requireUser(["customer"]);
  const rows = await sql`
    UPDATE orders SET status = 'cancelled', updated_at = now()
    WHERE id = ${orderId} AND user_id = ${user.id} AND status = 'placed'
    RETURNING id`;
  if (rows.length > 0) {
    await sql`INSERT INTO order_events (order_id, status, note) VALUES (${orderId}, 'cancelled', 'Cancelled by customer')`;
  }
  refresh();
}

export type FormResult = { error?: string; ok?: string } | undefined;

export async function updateProfile(_state: FormResult, formData: FormData): Promise<FormResult> {
  const user = await requireUser();
  const name = String(formData.get("name") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const address = String(formData.get("address") ?? "").trim();
  if (name.length < 2) return { error: "Enter your name." };
  await sql`UPDATE users SET name = ${name}, phone = ${phone}, address = ${address} WHERE id = ${user.id}`;
  refresh();
  return { ok: "Profile saved." };
}

export async function changePassword(_state: FormResult, formData: FormData): Promise<FormResult> {
  const user = await requireUser();
  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  if (next.length < 6) return { error: "Use a new password of at least 6 characters." };
  const [row] = await sql`SELECT password_hash FROM users WHERE id = ${user.id}`;
  if (!row || !(await bcrypt.compare(current, row.password_hash as string))) {
    return { error: "Your current password is not correct." };
  }
  const hash = await bcrypt.hash(next, 10);
  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${user.id}`;
  return { ok: "Password changed." };
}
