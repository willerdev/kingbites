import "server-only";
import { sql } from "@/lib/db";
import type { CategoryId, MenuItem } from "@/lib/types";

type Row = Record<string, unknown>;

function toItem(row: Row): MenuItem {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    price: Number(row.price),
    rating: Number(row.rating),
    reviews: Number(row.reviews),
    category: row.category as CategoryId,
    image: row.image as string,
    prepMinutes: Number(row.prep_minutes),
    badge: (row.badge as string | null) ?? null,
    popular: Boolean(row.popular),
    available: Boolean(row.available),
  };
}

export async function listMenu({ includeUnavailable = false } = {}) {
  const rows = includeUnavailable
    ? await sql`SELECT * FROM menu_items ORDER BY category, popular DESC, name`
    : await sql`SELECT * FROM menu_items WHERE available ORDER BY popular DESC, rating DESC, name`;
  return rows.map(toItem);
}

export async function getMenuItem(id: string) {
  const rows = await sql`SELECT * FROM menu_items WHERE id = ${id}`;
  return rows[0] ? toItem(rows[0]) : null;
}

export async function popularItems(limit = 5) {
  const rows = await sql`
    SELECT * FROM menu_items WHERE available
    ORDER BY popular DESC, rating DESC, name LIMIT ${limit}`;
  return rows.map(toItem);
}

export async function relatedItems(item: MenuItem, limit = 4) {
  const rows = await sql`
    SELECT * FROM menu_items
    WHERE available AND category = ${item.category} AND id <> ${item.id}
    ORDER BY rating DESC LIMIT ${limit}`;
  return rows.map(toItem);
}
