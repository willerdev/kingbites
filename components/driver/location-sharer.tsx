"use client";

import { MapPin } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { shareLocation } from "@/app/actions/driver";

const SEND_EVERY_MS = 15000;

export function LocationSharer() {
  const [on, setOn] = useState(false);
  const [status, setStatus] = useState("Customers see a map once you share your location.");
  const lastSent = useRef(0);

  useEffect(() => {
    if (!on) return;
    const watch = navigator.geolocation.watchPosition(
      (position) => {
        const now = Date.now();
        if (now - lastSent.current < SEND_EVERY_MS) return;
        lastSent.current = now;
        shareLocation(position.coords.latitude, position.coords.longitude)
          .then(() => setStatus(`Location shared at ${new Date().toLocaleTimeString()}.`))
          .catch(() => setStatus("Could not send location. Retrying…"));
      },
      (error) => {
        setStatus(error.code === error.PERMISSION_DENIED ? "Location permission was denied." : "Waiting for GPS…");
        if (error.code === error.PERMISSION_DENIED) setOn(false);
      },
      { enableHighAccuracy: true, maximumAge: 10000 },
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, [on]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-ink px-4 py-3 text-white">
      <p className="flex items-center gap-2 text-sm">
        <MapPin size={16} className={on ? "text-gold" : "text-white/50"} aria-hidden="true" />
        {status}
      </p>
      <button
        type="button"
        onClick={() => {
          if (on) {
            setOn(false);
            setStatus("Location sharing paused.");
            return;
          }
          if (!("geolocation" in navigator)) {
            setStatus("This device cannot share location.");
            return;
          }
          lastSent.current = 0;
          setStatus("Waiting for GPS…");
          setOn(true);
        }}
        className={`rounded-full px-4 py-1.5 text-sm font-semibold ${on ? "bg-white/15" : "bg-gold text-ink"}`}
      >
        {on ? "Stop sharing" : "Share live location"}
      </button>
    </div>
  );
}
