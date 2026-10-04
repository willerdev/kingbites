"use client";

import { useCallback, useSyncExternalStore } from "react";

const ADDRESS_KEY = "kings-bites-address";

let address = "";
let loaded = false;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  if (!loaded && typeof window !== "undefined") {
    loaded = true;
    address = localStorage.getItem(ADDRESS_KEY) ?? "";
  }
  return address;
}

export function useDeliveryAddress() {
  const current = useSyncExternalStore(subscribe, getSnapshot, () => "");

  const setAddress = useCallback((next: string) => {
    localStorage.setItem(ADDRESS_KEY, next);
    loaded = true;
    address = next;
    listeners.forEach((listener) => listener());
  }, []);

  return { address: current, setAddress };
}
