"use client";

import Link from "next/link";
import { useActionState } from "react";
import { saveMenuItem } from "@/app/actions/admin";
import { categories } from "@/lib/catalog";
import { fieldClass, goldButtonClass } from "@/lib/styles";
import type { MenuItem } from "@/lib/types";

const images = [
  "/images/burger.jpg",
  "/images/burger-bbq.jpg",
  "/images/chicken.jpg",
  "/images/wings.jpg",
  "/images/pizza.jpg",
  "/images/fries.jpg",
  "/images/loaded-fries.jpg",
  "/images/wrap.jpg",
  "/images/drink.jpg",
  "/images/cake.jpg",
];

export function MenuItemForm({ item }: { item: MenuItem | null }) {
  const [state, action, pending] = useActionState(saveMenuItem, undefined);

  return (
    <form action={action} className="grid gap-4 rounded-2xl bg-white p-5 ring-1 ring-black/5 md:grid-cols-2">
      <div className="flex items-center justify-between md:col-span-2">
        <h2 className="text-lg font-bold">{item ? `Edit ${item.name}` : "Add a menu item"}</h2>
        {item ? (
          <Link href="/admin/menu" className="text-sm font-semibold underline">
            New item instead
          </Link>
        ) : null}
      </div>
      <input type="hidden" name="existingId" value={item?.id ?? ""} />
      <label className="block text-sm font-semibold">
        Name
        <input name="name" className={fieldClass} defaultValue={item?.name} required />
      </label>
      <label className="block text-sm font-semibold">
        Category
        <select name="category" className={fieldClass} defaultValue={item?.category ?? "burgers"}>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </label>
      <label className="block text-sm font-semibold md:col-span-2">
        Description
        <textarea name="description" className={`${fieldClass} min-h-20`} defaultValue={item?.description} />
      </label>
      <label className="block text-sm font-semibold">
        Price (RWF)
        <input name="price" type="number" min={0} step={100} className={fieldClass} defaultValue={item?.price} required />
      </label>
      <label className="block text-sm font-semibold">
        Prep time (minutes)
        <input name="prepMinutes" type="number" min={1} className={fieldClass} defaultValue={item?.prepMinutes ?? 15} />
      </label>
      <label className="block text-sm font-semibold">
        Image
        <input name="image" list="menu-images" className={fieldClass} defaultValue={item?.image ?? "/images/burger.jpg"} />
        <datalist id="menu-images">
          {images.map((image) => (
            <option key={image} value={image} />
          ))}
        </datalist>
      </label>
      <label className="block text-sm font-semibold">
        Badge <span className="font-normal text-neutral-400">(optional)</span>
        <input name="badge" className={fieldClass} defaultValue={item?.badge ?? ""} placeholder="Bestseller, New, Spicy…" />
      </label>
      <div className="flex flex-wrap gap-5 text-sm md:col-span-2">
        <label className="flex items-center gap-2">
          <input type="checkbox" name="available" defaultChecked={item?.available ?? true} />
          Available to order
        </label>
        <label className="flex items-center gap-2">
          <input type="checkbox" name="popular" defaultChecked={item?.popular ?? false} />
          Show in “Popular this week”
        </label>
      </div>
      <div className="flex flex-wrap items-center gap-3 md:col-span-2">
        <button type="submit" disabled={pending} className={goldButtonClass}>
          {pending ? "Saving…" : item ? "Save changes" : "Add item"}
        </button>
        {state?.error ? <p className="text-sm font-medium text-red-600">{state.error}</p> : null}
        {state?.ok ? <p className="text-sm font-medium text-emerald-700">{state.ok}</p> : null}
      </div>
    </form>
  );
}
