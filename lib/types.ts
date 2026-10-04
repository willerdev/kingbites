export const categories = [
  { id: "burgers", name: "Burgers", image: "/images/burger.jpg" },
  { id: "chicken", name: "Chicken", image: "/images/chicken.jpg" },
  { id: "pizza", name: "Pizza", image: "/images/pizza.jpg" },
  { id: "fries", name: "Fries", image: "/images/fries.jpg" },
  { id: "wraps", name: "Wraps", image: "/images/wrap.jpg" },
  { id: "drinks", name: "Drinks", image: "/images/drink.jpg" },
  { id: "desserts", name: "Desserts", image: "/images/cake.jpg" },
] as const;

export type CategoryId = (typeof categories)[number]["id"];

export type MenuItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  rating: number;
  reviews: number;
  category: CategoryId;
  image: string;
  prepMinutes: number;
  badge: string | null;
  popular: boolean;
  available: boolean;
};

export type CartLine = {
  id: string;
  qty: number;
  name: string;
  price: number;
  image: string;
};

export type Role = "customer" | "admin" | "driver";

export type SessionUser = {
  id: string;
  username: string;
  name: string;
  phone: string;
  address: string;
  role: Role;
};

export type PaymentMethod = "momo" | "airtel" | "cash";
export type PaymentStatus = "unpaid" | "paid";

export type OrderStatus = "placed" | "preparing" | "ready" | "on-the-way" | "delivered" | "cancelled";

export type OrderItem = {
  menuItemId: string;
  name: string;
  image: string;
  price: number;
  qty: number;
};

export type OrderEvent = {
  status: OrderStatus;
  note: string;
  createdAt: string;
};

export type Order = {
  id: string;
  userId: string;
  status: OrderStatus;
  customerName: string;
  phone: string;
  address: string;
  notes: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  subtotal: number;
  deliveryFee: number;
  total: number;
  driver: { id: string; name: string; phone: string } | null;
  driverLocation: { lat: number; lng: number; seenAt: string } | null;
  createdAt: string;
  updatedAt: string;
  deliveredAt: string | null;
};

export type OrderWithItems = Order & { items: OrderItem[]; events: OrderEvent[] };
