"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/components/container";
import { ProductCard } from "@/components/product-card";
import { categories, getCategory, isCategoryId, restaurant } from "@/lib/catalog";
import type { MenuItem } from "@/lib/types";

type Sort = "featured" | "price" | "rating";

export function MenuBrowser({
  menu,
  initialCategory = "",
  initialQuery = "",
  initialAddress = "",
}: {
  menu: MenuItem[];
  initialCategory?: string;
  initialQuery?: string;
  initialAddress?: string;
}) {
  const router = useRouter();
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<Sort>("featured");

  const items = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const pool = menu.filter(
      (item) =>
        (category && isCategoryId(category) ? item.category === category : true) &&
        (!needle || `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(needle)),
    );
    return [...pool].sort((a, b) => compareItems(a, b, sort));
  }, [category, menu, query, sort]);

  function selectCategory(next: string) {
    setCategory(next);
    const params = new URLSearchParams();
    if (next) params.set("category", next);
    if (query) params.set("q", query);
    if (initialAddress) params.set("address", initialAddress);
    const suffix = params.toString();
    router.replace(suffix ? `/menu?${suffix}` : "/menu", { scroll: false });
  }

  const categoryName = isCategoryId(category) ? getCategory(category)?.name : null;

  return (
    <Container className="py-8 sm:py-10">
      {initialAddress ? (
        <p className="mb-6 rounded-2xl bg-mist px-4 py-3 text-sm">
          Delivering to <span className="font-semibold">{initialAddress}</span> from our Kimihurura kitchen.
        </p>
      ) : (
        <p className="mb-6 text-sm text-neutral-500">Cooked to order and delivered across {restaurant.area}.</p>
      )}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
        <label className="sr-only" htmlFor="menu-filter">
          Filter meals
        </label>
        <input
          id="menu-filter"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search the menu"
          className="w-full rounded-full border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-gold lg:max-w-xs"
        />
        <div className="flex gap-2 overflow-x-auto pb-1">
          <FilterChip active={category === ""} onClick={() => selectCategory("")}>
            All
          </FilterChip>
          {categories.map((entry) => (
            <FilterChip
              key={entry.id}
              active={category === entry.id}
              onClick={() => selectCategory(entry.id)}
            >
              {entry.name}
            </FilterChip>
          ))}
        </div>
        <label className="ml-auto flex items-center gap-2 text-sm text-neutral-500">
          Sort
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value as Sort)}
            className="rounded-full border border-black/10 bg-white px-3 py-2 text-sm text-ink outline-none"
          >
            <option value="featured">Featured</option>
            <option value="price">Price</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>
      <div className="mt-6 flex items-baseline justify-between">
        <h2 className="text-xl font-bold">{categoryName ?? "Full menu"}</h2>
        <p className="text-sm text-neutral-500">
          {items.length} {items.length === 1 ? "meal" : "meals"}
        </p>
      </div>
      {items.length === 0 ? (
        <div className="mt-8 rounded-2xl bg-mist px-6 py-16 text-center">
          <p className="text-lg font-semibold">Nothing matches right now.</p>
          <button type="button" onClick={() => selectCategory("")} className="mt-4 text-sm font-semibold text-ink underline">
            Show the full menu
          </button>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {items.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </Container>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold ${
        active ? "bg-ink text-white" : "bg-mist text-ink hover:bg-[#e7e9ec]"
      }`}
    >
      {children}
    </button>
  );
}

function compareItems(a: MenuItem, b: MenuItem, sort: Sort) {
  if (sort === "price") return a.price - b.price;
  if (sort === "rating") return b.rating - a.rating;
  if (a.popular !== b.popular) return a.popular ? -1 : 1;
  return b.rating - a.rating;
}
