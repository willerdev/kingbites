import { Suspense } from "react";
import { CategoryRow } from "@/components/category-row";
import { Container } from "@/components/container";
import { DeliveryBanner } from "@/components/delivery-banner";
import { Hero } from "@/components/hero";
import { PopularSection } from "@/components/popular-section";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryRow />
      <Suspense
        fallback={
          <Container className="pb-12">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="h-80 animate-pulse rounded-2xl bg-mist" />
              ))}
            </div>
          </Container>
        }
      >
        <PopularSection />
      </Suspense>
      <DeliveryBanner />
    </>
  );
}
