import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/container";
import { ProductGrid } from "@/components/product-card";
import { popularItems } from "@/lib/data/menu";

export async function PopularSection() {
  const items = await popularItems(5);

  return (
    <section className="bg-white pb-12 sm:pb-14">
      <Container>
        <SectionHeading
          title="Popular This Week"
          action={
            <Link
              href="/menu"
              className="inline-flex items-center gap-1 text-sm font-semibold text-ink hover:text-gold-deep"
            >
              View All
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
          }
        />
        <ProductGrid items={items} />
      </Container>
    </section>
  );
}
