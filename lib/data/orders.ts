import "server-only";
import { sql } from "@/lib/db";
import { toSugarTolerance } from "@/lib/dietary";
import type { Order, OrderEvent, OrderItem, OrderStatus, OrderWithItems, PaymentMethod, PaymentStatus } from "@/lib/types";

type Row = Record<string, unknown>;

const BASE = `
  SELECT o.*, d.name AS driver_name, d.phone AS driver_phone
  FROM orders o LEFT JOIN users d ON d.id = o.driver_id`;

function iso(value: unknown) {
  return value ? new Date(value as string).toISOString() : null;
}

function toOrder(row: Row): Order {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    status: row.status as OrderStatus,
    customerName: row.customer_name as string,
    phone: row.phone as string,
    address: row.address as string,
    notes: row.notes as string,
    paymentMethod: row.payment_method as PaymentMethod,
    paymentStatus: row.payment_status as PaymentStatus,
    subtotal: Number(row.subtotal),
    deliveryFee: Number(row.delivery_fee),
    total: Number(row.total),
    dietary: {
      allergies: (row.allergies as string) ?? "",
      sugarTolerance: toSugarTolerance(row.sugar_tolerance),
      medicalRestrictions: (row.medical_restrictions as string) ?? "",
    },
    driver: row.driver_id
      ? { id: row.driver_id as string, name: row.driver_name as string, phone: (row.driver_phone as string) ?? "" }
      : null,
    driverLocation:
      row.driver_lat != null && row.driver_lng != null
        ? { lat: Number(row.driver_lat), lng: Number(row.driver_lng), seenAt: iso(row.driver_seen_at) ?? "" }
        : null,
    createdAt: iso(row.created_at)!,
    updatedAt: iso(row.updated_at)!,
    deliveredAt: iso(row.delivered_at),
  };
}

async function attachItems(orders: Order[]): Promise<(Order & { items: OrderItem[] })[]> {
  if (orders.length === 0) return [];
  const ids = orders.map((order) => order.id);
  const rows = await sql`SELECT * FROM order_items WHERE order_id = ANY(${ids}) ORDER BY name`;
  return orders.map((order) => ({
    ...order,
    items: rows
      .filter((row) => row.order_id === order.id)
      .map((row) => ({
        menuItemId: row.menu_item_id,
        name: row.name,
        image: row.image,
        price: Number(row.price),
        qty: Number(row.qty),
      })),
  }));
}

export async function getOrder(id: string): Promise<OrderWithItems | null> {
  const rows = await sql.query(`${BASE} WHERE o.id = $1`, [id]);
  if (!rows[0]) return null;
  const [withItems] = await attachItems([toOrder(rows[0])]);
  const events = await sql`SELECT status, note, created_at FROM order_events WHERE order_id = ${id} ORDER BY created_at`;
  return {
    ...withItems,
    events: events.map(
      (row): OrderEvent => ({ status: row.status, note: row.note, createdAt: iso(row.created_at)! }),
    ),
  };
}

export async function listOrdersForUser(userId: string) {
  const rows = await sql.query(`${BASE} WHERE o.user_id = $1 ORDER BY o.created_at DESC LIMIT 100`, [userId]);
  return attachItems(rows.map(toOrder));
}

export async function listOrders({ status, limit = 100 }: { status?: OrderStatus | "active"; limit?: number } = {}) {
  if (status === "active") {
    const rows = await sql.query(
      `${BASE} WHERE o.status NOT IN ('delivered', 'cancelled') ORDER BY o.created_at ASC LIMIT $1`,
      [limit],
    );
    return attachItems(rows.map(toOrder));
  }
  const rows = status
    ? await sql.query(`${BASE} WHERE o.status = $1 ORDER BY o.created_at DESC LIMIT $2`, [status, limit])
    : await sql.query(`${BASE} ORDER BY o.created_at DESC LIMIT $1`, [limit]);
  return attachItems(rows.map(toOrder));
}

export async function listDriverOrders(driverId: string) {
  const rows = await sql.query(
    `${BASE} WHERE o.driver_id = $1 ORDER BY (o.status = 'delivered'), o.created_at DESC LIMIT 50`,
    [driverId],
  );
  return attachItems(rows.map(toOrder));
}

export async function listOpenDeliveries() {
  const rows = await sql.query(
    `${BASE} WHERE o.driver_id IS NULL AND o.status IN ('preparing', 'ready') ORDER BY o.created_at ASC LIMIT 50`,
    [],
  );
  return attachItems(rows.map(toOrder));
}

export async function adminStats() {
  const [row] = await sql`
    SELECT
      count(*) FILTER (WHERE created_at >= date_trunc('day', now())) AS orders_today,
      coalesce(sum(total) FILTER (WHERE created_at >= date_trunc('day', now()) AND status <> 'cancelled'), 0) AS revenue_today,
      count(*) FILTER (WHERE status NOT IN ('delivered', 'cancelled')) AS active,
      coalesce(sum(total) FILTER (WHERE payment_status = 'unpaid' AND status <> 'cancelled'), 0) AS unpaid,
      coalesce(sum(total) FILTER (WHERE payment_status = 'paid'), 0) AS collected
    FROM orders`;
  const [users] = await sql`
    SELECT count(*) FILTER (WHERE role = 'customer') AS customers,
           count(*) FILTER (WHERE role = 'driver' AND active) AS drivers
    FROM users`;
  return {
    ordersToday: Number(row.orders_today),
    revenueToday: Number(row.revenue_today),
    active: Number(row.active),
    unpaid: Number(row.unpaid),
    collected: Number(row.collected),
    customers: Number(users.customers),
    drivers: Number(users.drivers),
  };
}

export async function listDrivers() {
  const rows = await sql`
    SELECT u.id, u.name, u.phone,
      count(o.id) FILTER (WHERE o.status NOT IN ('delivered', 'cancelled')) AS active_orders
    FROM users u LEFT JOIN orders o ON o.driver_id = u.id
    WHERE u.role = 'driver' AND u.active
    GROUP BY u.id ORDER BY u.name`;
  return rows.map((row) => ({
    id: row.id as string,
    name: row.name as string,
    phone: row.phone as string,
    activeOrders: Number(row.active_orders),
  }));
}
