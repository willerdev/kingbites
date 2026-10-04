import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Clock, Star } from "lucide-react";
import { Container } from "@/components/container";
import { ProductGrid } from "@/components/product-card";
import { ItemPurchase } from "@/components/item-purchase";
import { getMenuItem, relatedItems } from "@/lib/data/menu";
import { formatPrice } from "@/lib/format";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = await getMenuItem(id);
  return { title: item?.name ?? "Meal", description: item?.description };
}

export default async function MenuItemPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = await getMenuItem(id);
  if (!item) notFound();
  const related = await relatedItems(item);

  return (
    <Container className="py-8 sm:py-12">
      <div className="grid items-start gap-8 lg:grid-cols-2">
        <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-mist">
          <Image
            src={item.image}
            alt={item.name}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          {item.badge ? (
            <span className="rounded-full bg-gold px-2.5 py-1 text-xs font-bold">{item.badge}</span>
          ) : null}
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight sm:text-4xl">{item.name}</h1>
          <p className="mt-2 flex flex-wrap items-center gap-3 text-sm text-neutral-500">
            <span className="inline-flex items-center gap-1">
              <Star size={14} className="fill-gold text-gold" aria-hidden="true" />
              {item.rating.toFixed(1)} ({item.reviews} reviews)
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={14} aria-hidden="true" />
              Ready in {item.prepMinutes} min
            </span>
          </p>
          <p className="mt-4 max-w-xl text-neutral-600">{item.description}</p>
          <p className="mt-5 text-3xl font-bold">{formatPrice(item.price)}</p>
          {item.available ? (
            <ItemPurchase product={{ id: item.id, name: item.name, price: item.price, image: item.image }} />
          ) : (
            <p className="mt-6 inline-flex rounded-full bg-mist px-4 py-2 text-sm font-semibold text-neutral-500">
              Sold out for now
            </p>
          )}
        </div>
      </div>
      {related.length > 0 ? (
        <section className="mt-14">
          <h2 className="text-2xl font-bold">More in this category</h2>
          <span className="mt-2 block h-1 w-10 rounded-full bg-gold" />
          <div className="mt-6">
            <ProductGrid items={related} />
          </div>
        </section>
      ) : null}
    </Container>
  );
}
