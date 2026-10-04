"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { logout } from "@/app/actions/auth";
import { Crown } from "@/components/logo";

type NavItem = { href: string; label: string };

export function PortalShell({
  title,
  nav,
  user,
  children,
}: {
  title: string;
  nav: NavItem[];
  user: { name: string; username: string };
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const root = nav[0]?.href;
  const isActive = (href: string) =>
    href === root ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <div className="min-h-full bg-mist lg:grid lg:grid-cols-[240px_1fr]">
      <aside className="bg-ink text-white lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col print:hidden">
        <div className="flex items-center justify-between gap-3 px-4 py-4 lg:block lg:px-5 lg:py-6">
          <Link href={root ?? "/"} className="flex items-center gap-2">
            <Crown className="h-8 w-8 text-gold" />
            <span className="leading-none">
              <span className="block text-sm font-extrabold">
                KING&apos;S <span className="text-gold">BITES</span>
              </span>
              <span className="mt-1 block text-[11px] text-white/60">{title}</span>
            </span>
          </Link>
          <form action={logout} className="lg:hidden">
            <button type="submit" className="rounded-full p-2 hover:bg-white/10" aria-label="Sign out">
              <LogOut size={18} />
            </button>
          </form>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-1 lg:flex-col lg:overflow-visible lg:px-3" aria-label={title}>
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={`shrink-0 rounded-xl px-3 py-2 text-sm font-medium ${
                isActive(item.href) ? "bg-gold text-ink" : "text-white/75 hover:bg-white/10 hover:text-white"
              }`}
            >
              {item.label}
            </Link>
          ))}
          <Link
            href="/"
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-sm text-white/50 hover:text-white lg:mt-auto"
          >
            View store <ExternalLink size={12} aria-hidden="true" />
          </Link>
        </nav>
        <div className="hidden border-t border-white/10 px-5 py-4 lg:block">
          <p className="truncate text-sm font-semibold">{user.name}</p>
          <p className="truncate text-xs text-white/50">@{user.username}</p>
          <form action={logout} className="mt-3">
            <button type="submit" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white">
              <LogOut size={14} aria-hidden="true" />
              Sign out
            </button>
          </form>
        </div>
      </aside>
      <main className="min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
    </div>
  );
}

export function PortalHeading({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-neutral-500">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}
