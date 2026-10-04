import { categories, type CategoryId } from "@/lib/types";

export { categories };

export function getCategory(id: string) {
  return categories.find((category) => category.id === id);
}

export function isCategoryId(value: string): value is CategoryId {
  return categories.some((category) => category.id === value);
}

export const restaurant = {
  name: "King's Bites",
  address: "KG 7 Ave, Kimihurura, Kigali",
  phone: "+250 788 000 000",
  email: "hello@kingsbites.rw",
  area: "Kigali, Rwanda",
};
