import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Container, SectionHeading } from "@/components/container";
import { categories } from "@/lib/catalog";

export function CategoryRow() {
  return (
    <section className="bg-white py-12 sm:py-14">
      <Container>
        <SectionHeading title="Browse by Category" />
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/menu?category=${category.id}`}
              className="group flex flex-col items-center rounded-2xl bg-mist px-3 py-4 text-center transition hover:-translate-y-0.5 hover:bg-[#eceef1]"
            >
              <span className="relative h-20 w-20 overflow-hidden rounded-2xl bg-white sm:h-24 sm:w-24">
                <Image
                  src={category.image}
                  alt=""
                  fill
                  sizes="96px"
                  className="object-cover transition duration-300 group-hover:scale-105"
                />
              </span>
              <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-ink">
                {category.name}
                <ChevronRight size={14} aria-hidden="true" className="text-neutral-400" />
              </span>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
