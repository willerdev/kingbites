"use client";

import { useState } from "react";
import { fieldClass, goldButtonClass } from "@/lib/styles";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("sending");
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, message }),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("sent");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-3xl bg-mist px-6 py-12">
        <h2 className="text-2xl font-bold">Thanks, {name.split(" ")[0] || "there"}.</h2>
        <p className="mt-2 text-neutral-600">We received your note. This demo does not send email yet.</p>
        <button type="button" onClick={() => setStatus("idle")} className={`${goldButtonClass} mt-6`}>
          Send another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <label className="block text-sm font-semibold">
        Name
        <input className={fieldClass} value={name} onChange={(event) => setName(event.target.value)} required />
      </label>
      <label className="block text-sm font-semibold">
        Email
        <input
          type="email"
          className={fieldClass}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />
      </label>
      <label className="block text-sm font-semibold">
        Message
        <textarea
          className={`${fieldClass} min-h-32`}
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          required
        />
      </label>
      {status === "error" ? <p className="text-sm text-red-600">Could not send that. Try again.</p> : null}
      <button type="submit" className={goldButtonClass} disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send message"}
      </button>
    </form>
  );
}
