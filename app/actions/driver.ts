"use server";

import { refresh } from "next/cache";
import { sql } from "@/lib/db";
import { requireUser } from "@/lib/session";

async function requireDriver() {
  return requireUser(["driver"]);
}

export async function claimDelivery(orderId: string) {
  const driver = await requireDriver();
  await sql`
    UPDATE orders SET driver_id = ${driver.id}, updated_at = now()
    WHERE id = ${orderId} AND driver_id IS NULL AND status IN ('preparing', 'ready')`;
  refresh();
}

export async function pickUpDelivery(orderId: string) {
  const driver = await requireDriver();
  const rows = await sql`
    UPDATE orders SET status = 'on-the-way', updated_at = now()
    WHERE id = ${orderId} AND driver_id = ${driver.id} AND status IN ('preparing', 'ready')
    RETURNING id`;
  if (rows.length > 0) {
    await sql`INSERT INTO order_events (order_id, status, note) VALUES (${orderId}, 'on-the-way', ${`Picked up by ${driver.name}`})`;
  }
  refresh();
}

export async function completeDelivery(orderId: string, formData: FormData) {
  const driver = await requireDriver();
  const collected = formData.get("collected") === "on";
  const rows = await sql`
    UPDATE orders
    SET status = 'delivered', delivered_at = now(), updated_at = now(),
        payment_status = CASE WHEN ${collected} THEN 'paid' ELSE payment_status END
    WHERE id = ${orderId} AND driver_id = ${driver.id} AND status = 'on-the-way'
    RETURNING id`;
  if (rows.length > 0) {
    await sql`INSERT INTO order_events (order_id, status, note) VALUES (${orderId}, 'delivered', ${`Delivered by ${driver.name}`})`;
  }
  refresh();
}

export async function releaseDelivery(orderId: string) {
  const driver = await requireDriver();
  await sql`
    UPDATE orders SET driver_id = NULL, updated_at = now()
    WHERE id = ${orderId} AND driver_id = ${driver.id} AND status IN ('preparing', 'ready')`;
  refresh();
}

export async function shareLocation(lat: number, lng: number) {
  const driver = await requireDriver();
  if (!Number.isFinite(lat) || !Number.isFinite(lng) || Math.abs(lat) > 90 || Math.abs(lng) > 180) return;
  await sql`
    UPDATE orders SET driver_lat = ${lat}, driver_lng = ${lng}, driver_seen_at = now()
    WHERE driver_id = ${driver.id} AND status = 'on-the-way'`;
}
