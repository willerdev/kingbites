"use client";

import Image from "next/image";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MenuItem[] | null>(null);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  useEffect(() => {
    let live = true;
    fetch("/api/menu")
      .then((response) => (response.ok ? response.json() : []))
      .then((data: MenuItem[]) => live && setItems(data))
      .catch(() => live && setItems([]));
    return () => {
      live = false;
    };
  }, []);

  const results = useMemo(() => {
    if (!items) return [];
    const needle = query.trim().toLowerCase();
    const matches = needle
      ? items.filter((item) => `${item.name} ${item.description} ${item.category}`.toLowerCase().includes(needle))
      : items;
    return matches.slice(0, 6);
  }, [items, query]);

  return (
    <div className="fixed inset-0 z-[70] bg-black/55 p-4" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Search the menu"
        className="mx-auto mt-10 w-full max-w-xl overflow-hidden rounded-2xl bg-white text-ink shadow-2xl sm:mt-20"
        onClick={(event) => event.stopPropagation()}
      >
        <form action="/menu" className="flex items-center gap-2 border-b border-black/5 px-4">
          <Search size={18} className="text-neutral-400" aria-hidden="true" />
          <label className="sr-only" htmlFor="menu-search">
            Search meals
          </label>
          <input
            id="menu-search"
            name="q"
            autoFocus
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search burgers, pizza, wings..."
            className="w-full py-4 text-sm outline-none"
          />
          <button type="button" onClick={onClose} className="rounded-full p-2 hover:bg-mist" aria-label="Close search">
            <X size={18} />
          </button>
        </form>
        <ul className="max-h-[60vh] overflow-auto p-2">
          {items === null ? (
            <li className="px-3 py-8 text-center text-sm text-neutral-500">Loading the menu…</li>
          ) : results.length === 0 ? (
            <li className="px-3 py-8 text-center text-sm text-neutral-500">No meals match that search.</li>
          ) : (
            results.map((item) => (
              <li key={item.id}>
                <Link
                  href={`/menu/${item.id}`}
                  onClick={onClose}
                  className="flex items-center gap-3 rounded-xl px-2 py-2 hover:bg-mist"
                >
                  <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg">
                    <Image src={item.image} alt="" fill sizes="48px" className="object-cover" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{item.name}</span>
                    <span className="block text-xs text-neutral-500">{formatPrice(item.price)}</span>
                  </span>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}
