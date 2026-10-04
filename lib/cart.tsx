"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CartLine } from "@/lib/types";

type CartProduct = Omit<CartLine, "qty">;

const CART_KEY = "kings-bites-cart-v2";
const EMPTY: CartLine[] = [];

type Snapshot = {
  lines: CartLine[];
  toast: string | null;
  loaded: boolean;
};

const serverSnapshot: Snapshot = { lines: EMPTY, toast: null, loaded: false };
let linesCache: CartLine[] = EMPTY;
let toast: string | null = null;
let loaded = false;
let snapshot: Snapshot = serverSnapshot;
let toastTimer = 0;
const listeners = new Set<() => void>();

function emit() {
  snapshot = { lines: linesCache, toast, loaded: true };
  listeners.forEach((listener) => listener());
}

function load() {
  if (loaded || typeof window === "undefined") return;
  loaded = true;
  try {
    const raw = localStorage.getItem(CART_KEY);
    const parsed = raw ? (JSON.parse(raw) as CartLine[]) : EMPTY;
    linesCache = Array.isArray(parsed)
      ? parsed.filter((line) => line && line.qty > 0 && typeof line.price === "number")
      : EMPTY;
  } catch {
    linesCache = EMPTY;
  }
  snapshot = { lines: linesCache, toast, loaded: true };
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  load();
  return snapshot;
}

function writeLines(next: CartLine[]) {
  linesCache = next;
  loaded = true;
  localStorage.setItem(CART_KEY, JSON.stringify(next));
  emit();
}

function showToast(message: string) {
  toast = message;
  emit();
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => {
    toast = null;
    emit();
  }, 2600);
}

export function useCart() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => serverSnapshot);

  const addItem = useCallback((product: CartProduct, qty = 1) => {
    const lines = getSnapshot().lines;
    const existing = lines.find((line) => line.id === product.id);
    const next = existing
      ? lines.map((line) => (line.id === product.id ? { ...line, ...product, qty: line.qty + qty } : line))
      : [...lines, { ...product, qty }];
    writeLines(next);
    showToast(`${product.name} added to cart`);
  }, []);

  const setQty = useCallback((id: string, qty: number) => {
    const lines = getSnapshot().lines;
    writeLines(qty <= 0 ? lines.filter((line) => line.id !== id) : lines.map((line) => (line.id === id ? { ...line, qty } : line)));
  }, []);

  const removeItem = useCallback((id: string) => {
    writeLines(getSnapshot().lines.filter((line) => line.id !== id));
  }, []);

  const clear = useCallback(() => writeLines(EMPTY), []);

  const dismissToast = useCallback(() => {
    toast = null;
    window.clearTimeout(toastTimer);
    emit();
  }, []);

  return {
    lines: current.lines,
    count: current.lines.reduce((sum, line) => sum + line.qty, 0),
    loaded: current.loaded,
    toast: current.toast,
    addItem,
    setQty,
    removeItem,
    clear,
    dismissToast,
  };
}
