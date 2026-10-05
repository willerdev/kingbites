CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  username text NOT NULL UNIQUE,
  name text NOT NULL,
  phone text NOT NULL DEFAULT '',
  address text NOT NULL DEFAULT '',
  password_hash text NOT NULL,
  role text NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'admin', 'driver')),
  active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS sessions (
  token_hash text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS sessions_user_idx ON sessions(user_id);

CREATE TABLE IF NOT EXISTS menu_items (
  id text PRIMARY KEY,
  name text NOT NULL,
  description text NOT NULL DEFAULT '',
  price integer NOT NULL CHECK (price >= 0),
  category text NOT NULL,
  image text NOT NULL,
  prep_minutes integer NOT NULL DEFAULT 15,
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  reviews integer NOT NULL DEFAULT 0,
  badge text,
  popular boolean NOT NULL DEFAULT false,
  available boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS orders (
  id text PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES users(id),
  driver_id uuid REFERENCES users(id),
  status text NOT NULL DEFAULT 'placed'
    CHECK (status IN ('placed', 'preparing', 'ready', 'on-the-way', 'delivered', 'cancelled')),
  customer_name text NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  notes text NOT NULL DEFAULT '',
  payment_method text NOT NULL CHECK (payment_method IN ('momo', 'airtel', 'cash')),
  payment_status text NOT NULL DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid')),
  subtotal integer NOT NULL,
  delivery_fee integer NOT NULL,
  total integer NOT NULL,
  driver_lat double precision,
  driver_lng double precision,
  driver_seen_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  delivered_at timestamptz
);
CREATE INDEX IF NOT EXISTS orders_user_idx ON orders(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS orders_driver_idx ON orders(driver_id, status);
CREATE INDEX IF NOT EXISTS orders_status_idx ON orders(status, created_at DESC);

CREATE TABLE IF NOT EXISTS order_items (
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  menu_item_id text NOT NULL REFERENCES menu_items(id),
  name text NOT NULL,
  image text NOT NULL,
  price integer NOT NULL,
  qty integer NOT NULL CHECK (qty > 0),
  PRIMARY KEY (order_id, menu_item_id)
);

CREATE TABLE IF NOT EXISTS order_events (
  id bigserial PRIMARY KEY,
  order_id text NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status text NOT NULL,
  note text NOT NULL DEFAULT '',
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS order_events_order_idx ON order_events(order_id, created_at);

ALTER TABLE users ADD COLUMN IF NOT EXISTS allergies text NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS sugar_tolerance text NOT NULL DEFAULT '';
ALTER TABLE users ADD COLUMN IF NOT EXISTS medical_restrictions text NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS allergies text NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS sugar_tolerance text NOT NULL DEFAULT '';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS medical_restrictions text NOT NULL DEFAULT '';
