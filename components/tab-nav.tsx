"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function TabNav({ tabs, exact = [] }: { tabs: { href: string; label: string }[]; exact?: string[] }) {
  const pathname = usePathname();
  return (
    <nav className="flex gap-1 overflow-x-auto border-b border-black/10" aria-label="Section">
      {tabs.map((tab) => {
        const active = exact.includes(tab.href)
          ? pathname === tab.href
          : pathname === tab.href || pathname.startsWith(`${tab.href}/`);
        return (
          <Link
            key={tab.href}
            href={tab.href}
            aria-current={active ? "page" : undefined}
            className={`shrink-0 border-b-2 px-4 py-3 text-sm font-semibold ${
              active ? "border-gold text-ink" : "border-transparent text-neutral-500 hover:text-ink"
            }`}
          >
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}
