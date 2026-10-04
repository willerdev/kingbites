import { readFileSync } from "node:fs";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

const url = process.env.DATABASE_URL;
if (!url) {
  console.error("DATABASE_URL is not set. Add it to .env.local.");
  process.exit(1);
}

const sql = neon(url);
const root = new URL("../db/", import.meta.url);

const schema = readFileSync(new URL("schema.sql", root), "utf8");
for (const statement of schema.split(/;\s*$/m).map((part) => part.trim()).filter(Boolean)) {
  await sql.query(statement);
}
console.log("Schema ready.");

const menu = JSON.parse(readFileSync(new URL("menu.json", root), "utf8"));
for (const item of menu) {
  await sql`
    INSERT INTO menu_items (id, name, description, price, category, image, prep_minutes, rating, reviews, badge, popular)
    VALUES (${item.id}, ${item.name}, ${item.description}, ${item.price}, ${item.category}, ${item.image},
            ${item.prep_minutes}, ${item.rating}, ${item.reviews}, ${item.badge ?? null}, ${item.popular ?? false})
    ON CONFLICT (id) DO NOTHING`;
}
console.log(`Menu seeded (${menu.length} items, existing items left unchanged).`);

const [existing] = await sql`SELECT id FROM users WHERE username = 'admin'`;
if (existing) {
  console.log("Admin account already exists.");
} else {
  const hash = await bcrypt.hash("admin", 10);
  await sql`
    INSERT INTO users (username, name, password_hash, role)
    VALUES ('admin', 'Administrator', ${hash}, 'admin')`;
  console.log("Created admin account (username: admin, password: admin). Change it after first sign-in.");
}
