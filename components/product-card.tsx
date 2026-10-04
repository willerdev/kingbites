"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, ShoppingCart, Star } from "lucide-react";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/format";
import type { MenuItem } from "@/lib/types";

export function ProductCard({ item }: { item: MenuItem }) {
  const { addItem, lines } = useCart();
  const inCart = lines.find((line) => line.id === item.id)?.qty ?? 0;

  return (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-black/5 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <Link href={`/menu/${item.id}`} className="relative aspect-[4/3] bg-mist">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(min-width: 1280px) 20vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover"
        />
        {item.badge ? (
          <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-ink">
            {item.badge}
          </span>
        ) : null}
      </Link>
      <div className="flex flex-1 flex-col p-4">
        <Link href={`/menu/${item.id}`} className="font-semibold leading-snug text-ink hover:underline">
          {item.name}
        </Link>
        <p className="mt-1 flex items-center gap-3 text-sm text-neutral-500">
          <span className="inline-flex items-center gap-1">
            <Star size={14} className="fill-gold text-gold" aria-hidden="true" />
            {item.rating.toFixed(1)} ({item.reviews})
          </span>
          <span className="inline-flex items-center gap-1 text-xs">
            <Clock size={12} aria-hidden="true" />
            {item.prepMinutes} min
          </span>
        </p>
        <p className="mt-2 text-lg font-bold text-ink">{formatPrice(item.price)}</p>
        <button
          type="button"
          onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image })}
          className="mt-auto inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-deep"
        >
          <ShoppingCart size={16} aria-hidden="true" />
          {inCart > 0 ? `Add to Cart · ${inCart}` : "Add to Cart"}
        </button>
      </div>
    </article>
  );
}

export function ProductGrid({ items }: { items: MenuItem[] }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((item) => (
        <ProductCard key={item.id} item={item} />
      ))}
    </div>
  );
}
