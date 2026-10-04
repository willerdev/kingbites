"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, LogOut, MapPin, Menu, Search, ShoppingCart, User, X } from "lucide-react";
import { Suspense, use, useEffect, useState } from "react";
import { logout } from "@/app/actions/auth";
import { Logo } from "@/components/logo";
import { SearchDialog } from "@/components/search-dialog";
import { restaurant } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import type { SessionUser } from "@/lib/types";

const links = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/track", label: "Track Order" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

function portalFor(user: SessionUser) {
  if (user.role === "admin") return { href: "/admin", label: "Admin portal" };
  if (user.role === "driver") return { href: "/driver", label: "Rider portal" };
  return { href: "/account", label: "My account" };
}

type HeaderProps = { userPromise: Promise<SessionUser | null> };

export function SiteHeader({ userPromise }: HeaderProps) {
  const pathname = usePathname();
  const { count } = useCart();
  const [menuState, setMenuState] = useState({ path: pathname, menuOpen: false, searchOpen: false });

  if (menuState.path !== pathname) {
    setMenuState({ path: pathname, menuOpen: false, searchOpen: false });
  }

  const { menuOpen, searchOpen } = menuState;

  useEffect(() => {
    document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen, searchOpen]);

  return (
    <header className="sticky top-0 z-50 bg-ink text-white">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center gap-3 px-4 sm:px-6 lg:px-8">
        <Logo />
        <nav className="ml-4 hidden items-center gap-5 text-sm font-medium lg:flex" aria-label="Primary">
          {links.map((link) => {
            const active = isActive(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={`relative py-1 ${active ? "text-white" : "text-white/80 hover:text-white"}`}
              >
                {link.label}
                {active ? <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-gold" /> : null}
              </Link>
            );
          })}
        </nav>
        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <span className="hidden items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-sm md:inline-flex">
            <MapPin size={14} aria-hidden="true" />
            {restaurant.area}
          </span>
          <button
            type="button"
            onClick={() => setMenuState((state) => ({ ...state, searchOpen: true }))}
            className="rounded-full p-2 hover:bg-white/10"
            aria-label="Search menu"
          >
            <Search size={18} />
          </button>
          <Suspense fallback={<span className="hidden h-9 w-9 sm:inline-block" />}>
            <AccountButton userPromise={userPromise} />
          </Suspense>
          <Link href="/cart" className="relative rounded-full p-2 hover:bg-white/10" aria-label="Cart">
            <ShoppingCart size={18} />
            {count > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 text-[10px] font-bold text-ink">
                {count > 9 ? "9+" : count}
              </span>
            ) : null}
          </Link>
          <button
            type="button"
            className="rounded-full p-2 hover:bg-white/10 lg:hidden"
            onClick={() => setMenuState((state) => ({ ...state, menuOpen: !state.menuOpen }))}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>
      {menuOpen ? (
        <div className="border-t border-white/10 bg-ink px-4 py-4 lg:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-3 text-base font-medium hover:bg-white/5"
              >
                {link.label}
              </Link>
            ))}
            <Suspense fallback={null}>
              <MobileAccountLinks userPromise={userPromise} />
            </Suspense>
          </nav>
        </div>
      ) : null}
      {searchOpen ? (
        <SearchDialog onClose={() => setMenuState((state) => ({ ...state, searchOpen: false }))} />
      ) : null}
    </header>
  );
}

function AccountButton({ userPromise }: HeaderProps) {
  const user = use(userPromise);
  if (!user) {
    return (
      <Link
        href="/login"
        className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-white/10 sm:inline-flex"
      >
        <User size={16} aria-hidden="true" />
        Sign in
      </Link>
    );
  }
  const portal = portalFor(user);
  return (
    <Link
      href={portal.href}
      className="hidden items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold hover:bg-white/10 sm:inline-flex"
      title={portal.label}
    >
      {user.role === "customer" ? <User size={16} aria-hidden="true" /> : <LayoutDashboard size={16} aria-hidden="true" />}
      <span className="max-w-28 truncate">{user.name.split(" ")[0]}</span>
    </Link>
  );
}

function MobileAccountLinks({ userPromise }: HeaderProps) {
  const user = use(userPromise);
  const itemClass = "rounded-xl px-3 py-3 text-base font-medium hover:bg-white/5";
  if (!user) {
    return (
      <>
        <Link href="/login" className={itemClass}>
          Sign in
        </Link>
        <Link href="/signup" className={itemClass}>
          Create account
        </Link>
      </>
    );
  }
  const portal = portalFor(user);
  return (
    <>
      <Link href={portal.href} className={itemClass}>
        {portal.label}
      </Link>
      <form action={logout}>
        <button type="submit" className={`${itemClass} flex w-full items-center gap-2 text-left text-white/70`}>
          <LogOut size={16} aria-hidden="true" />
          Sign out
        </button>
      </form>
    </>
  );
}

export function CartToast() {
  const { toast, dismissToast } = useCart();
  if (!toast) return null;
  return (
    <div
      role="status"
      className="fixed bottom-4 right-4 z-[60] flex max-w-sm items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-sm text-white shadow-xl"
    >
      <span className="h-2 w-2 shrink-0 rounded-full bg-gold" aria-hidden="true" />
      <p className="flex-1">{toast}</p>
      <Link href="/cart" onClick={dismissToast} className="font-semibold text-gold">
        View cart
      </Link>
    </div>
  );
}
