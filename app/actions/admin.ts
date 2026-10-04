"use server";

import bcrypt from "bcryptjs";
import { refresh, revalidatePath } from "next/cache";
import { sql } from "@/lib/db";
import { isCategoryId } from "@/lib/catalog";
import { allStatuses } from "@/lib/order-status";
import { requireUser } from "@/lib/session";
import type { OrderStatus, PaymentStatus } from "@/lib/types";

async function requireAdmin() {
  return requireUser(["admin"]);
}

export async function setOrderStatus(orderId: string, status: OrderStatus) {
  await requireAdmin();
  if (!allStatuses.includes(status)) return;
  const rows = await sql`
    UPDATE orders
    SET status = ${status}, updated_at = now(),
        delivered_at = CASE WHEN ${status} = 'delivered' THEN now() ELSE delivered_at END
    WHERE id = ${orderId} AND status <> ${status}
    RETURNING id`;
  if (rows.length > 0) {
    await sql`INSERT INTO order_events (order_id, status, note) VALUES (${orderId}, ${status}, 'Updated by restaurant')`;
  }
  refresh();
}

export async function assignDriver(orderId: string, formData: FormData) {
  await requireAdmin();
  const driverId = String(formData.get("driverId") ?? "") || null;
  if (driverId) {
    const [driver] = await sql`SELECT id FROM users WHERE id = ${driverId} AND role = 'driver' AND active`;
    if (!driver) return;
  }
  await sql`UPDATE orders SET driver_id = ${driverId}, updated_at = now() WHERE id = ${orderId}`;
  refresh();
}

export async function setPaymentStatus(orderId: string, status: PaymentStatus) {
  await requireAdmin();
  if (status !== "paid" && status !== "unpaid") return;
  await sql`UPDATE orders SET payment_status = ${status}, updated_at = now() WHERE id = ${orderId}`;
  refresh();
}

export type AdminFormResult = { error?: string; ok?: string } | undefined;

export async function saveMenuItem(_state: AdminFormResult, formData: FormData): Promise<AdminFormResult> {
  await requireAdmin();
  const existingId = String(formData.get("existingId") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  const description = String(formData.get("description") ?? "").trim();
  const price = Math.round(Number(formData.get("price")));
  const category = String(formData.get("category") ?? "");
  const image = String(formData.get("image") ?? "").trim() || "/images/burger.jpg";
  const prepMinutes = Math.max(1, Math.round(Number(formData.get("prepMinutes")) || 15));
  const badge = String(formData.get("badge") ?? "").trim() || null;
  const popular = formData.get("popular") === "on";
  const available = formData.get("available") === "on";

  if (name.length < 2) return { error: "Give the item a name." };
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a price in RWF." };
  if (!isCategoryId(category)) return { error: "Choose a category." };
  if (!/^\/images\/[\w.-]+$/.test(image)) {
    return { error: "Image must be a file in public/images, like /images/burger.jpg." };
  }

  if (existingId) {
    await sql`
      UPDATE menu_items SET name = ${name}, description = ${description}, price = ${price}, category = ${category},
        image = ${image}, prep_minutes = ${prepMinutes}, badge = ${badge}, popular = ${popular}, available = ${available}
      WHERE id = ${existingId}`;
  } else {
    const base = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "item";
    const taken = await sql`SELECT id FROM menu_items WHERE id LIKE ${`${base}%`}`;
    const id = taken.length === 0 ? base : `${base}-${taken.length + 1}`;
    await sql`
      INSERT INTO menu_items (id, name, description, price, category, image, prep_minutes, badge, popular, available)
      VALUES (${id}, ${name}, ${description}, ${price}, ${category}, ${image}, ${prepMinutes}, ${badge}, ${popular}, ${available})`;
  }
  revalidatePath("/", "layout");
  return { ok: existingId ? "Item updated." : "Item added to the menu." };
}

export async function setMenuAvailability(id: string, available: boolean) {
  await requireAdmin();
  await sql`UPDATE menu_items SET available = ${available} WHERE id = ${id}`;
  revalidatePath("/", "layout");
}

export async function createStaff(_state: AdminFormResult, formData: FormData): Promise<AdminFormResult> {
  await requireAdmin();
  const name = String(formData.get("name") ?? "").trim();
  const username = String(formData.get("username") ?? "").trim().toLowerCase();
  const phone = String(formData.get("phone") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  const role = String(formData.get("role") ?? "driver");

  if (name.length < 2) return { error: "Enter a name." };
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) return { error: "Usernames are 3–32 letters, numbers, dots, dashes, or underscores." };
  if (password.length < 6) return { error: "Use a password of at least 6 characters." };
  if (role !== "driver" && role !== "admin") return { error: "Choose a role." };

  const taken = await sql`SELECT 1 FROM users WHERE username = ${username}`;
  if (taken.length > 0) return { error: "That username is taken." };

  const hash = await bcrypt.hash(password, 10);
  await sql`
    INSERT INTO users (username, name, phone, password_hash, role)
    VALUES (${username}, ${name}, ${phone}, ${hash}, ${role})`;
  refresh();
  return { ok: `${role === "driver" ? "Rider" : "Admin"} account created for @${username}.` };
}

export async function setUserActive(userId: string, active: boolean) {
  const admin = await requireAdmin();
  if (userId === admin.id) return;
  await sql`UPDATE users SET active = ${active} WHERE id = ${userId}`;
  if (!active) await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
  refresh();
}

export async function resetPassword(userId: string, formData: FormData) {
  await requireAdmin();
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) return;
  const hash = await bcrypt.hash(password, 10);
  await sql`UPDATE users SET password_hash = ${hash} WHERE id = ${userId}`;
  await sql`DELETE FROM sessions WHERE user_id = ${userId}`;
  refresh();
}
