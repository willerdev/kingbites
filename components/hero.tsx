"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRight, MapPin } from "lucide-react";
import { useState } from "react";
import { Crown } from "@/components/logo";
import { useDeliveryAddress } from "@/lib/location";

export function Hero() {
  const router = useRouter();
  const { address, setAddress } = useDeliveryAddress();
  const [draft, setDraft] = useState<string | null>(null);
  const [error, setError] = useState("");
  const value = draft ?? address;

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const next = value.trim();
    if (next.length < 3) {
      setError("Enter a delivery address to find food.");
      return;
    }
    setError("");
    setAddress(next);
    router.push(`/menu?address=${encodeURIComponent(next)}`);
  }

  return (
    <section className="relative isolate overflow-hidden bg-[#120d09] text-white">
      <div className="absolute inset-0">
        <Image
          src="/images/hero.jpg"
          alt="Burgers and cold drinks on a wooden board"
          fill
          priority
          sizes="100vw"
          className="object-cover object-[72%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#120d09] from-15% via-[#120d09]/88 via-48% to-[#120d09]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#120d09]/40 via-transparent to-[#120d09]/25 md:hidden" />
      </div>

      <div className="relative mx-auto grid min-h-[540px] max-w-7xl items-center px-4 py-14 sm:min-h-[580px] sm:px-6 lg:min-h-[620px] lg:grid-cols-[minmax(0,560px)_1fr] lg:px-8 lg:py-20">
        <div>
          <p className="inline-flex rounded-full bg-gold px-3 py-1 text-[11px] font-extrabold tracking-wide text-ink">
            FAST • FRESH • DELICIOUS
          </p>
          <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
            KING’S <span className="text-gold">BITES</span>
          </h1>
          <p className="mt-2 font-script text-4xl text-gold sm:text-5xl">Rule Your Hunger.</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/80 sm:text-base">
            Your favorite meals, delivered fast and fresh right to your door. From burgers to
            chicken, pizza and more — we bring the taste you love!
          </p>
          <form
            onSubmit={onSubmit}
            className="mt-7 flex max-w-xl flex-col gap-2 rounded-3xl bg-white p-2 shadow-xl sm:flex-row sm:items-center sm:rounded-full sm:p-1.5"
          >
            <label className="flex min-w-0 flex-1 items-center gap-2 px-2">
              <MapPin size={18} className="shrink-0 text-ink" aria-hidden="true" />
              <span className="sr-only">Delivery address</span>
              <input
                value={value}
                onChange={(event) => setDraft(event.target.value)}
                placeholder="Enter your delivery address..."
                className="w-full bg-transparent py-2 text-sm text-ink outline-none placeholder:text-neutral-400"
              />
            </label>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold text-ink transition hover:bg-gold-deep"
            >
              Find Food
              <ArrowRight size={16} aria-hidden="true" />
            </button>
          </form>
          {error ? <p className="mt-2 text-sm text-gold">{error}</p> : null}
        </div>
        <div className="pointer-events-none hidden justify-end lg:flex">
          <p className="rotate-[-8deg] text-right font-script text-4xl leading-tight text-gold xl:text-5xl">
            <Crown className="mb-1 ml-auto h-8 w-8" />
            Good Food
            <br />
            Good Mood
          </p>
        </div>
      </div>
    </section>
  );
}
