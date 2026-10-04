import Image from "next/image";
import { Bike, Clock, ShieldCheck } from "lucide-react";
import { Container } from "@/components/container";
import { Crown } from "@/components/logo";

const points = [
  { icon: Clock, label: "Real-time tracking" },
  { icon: ShieldCheck, label: "Safe & secure" },
  { icon: Bike, label: "On-time delivery" },
];

export function DeliveryBanner() {
  return (
    <Container className="pb-16">
      <section className="overflow-hidden rounded-3xl bg-ink text-white">
        <div className="grid lg:grid-cols-[minmax(220px,280px)_1fr_220px]">
          <div className="relative min-h-52">
            <Image
              src="/images/courier.jpg"
              alt="Courier riding with a food delivery backpack"
              fill
              sizes="280px"
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/10 to-ink lg:bg-gradient-to-r" />
          </div>
          <div className="px-6 py-8 sm:px-8">
            <h2 className="text-3xl font-black tracking-tight sm:text-4xl">
              FAST & SAFE <span className="text-gold">DELIVERY</span>
            </h2>
            <ul className="mt-6 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:gap-8">
              {points.map((point) => (
                <li key={point.label} className="flex items-center gap-2 text-sm text-white/85">
                  <point.icon size={18} className="text-gold" aria-hidden="true" />
                  {point.label}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-center px-6 pb-8 lg:justify-center lg:px-4 lg:pb-0">
            <p className="relative isolate max-w-[12rem] rotate-[-6deg] text-center font-script text-3xl leading-tight text-ink">
              <span className="absolute -inset-x-3 -inset-y-2 -z-10 -rotate-2 rounded-[40%] bg-gold" />
              <Crown className="mx-auto mb-1 h-6 w-6" />
              Your meal is on the way!
            </p>
          </div>
        </div>
      </section>
    </Container>
  );
}
