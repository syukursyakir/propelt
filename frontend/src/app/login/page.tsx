"use client";

import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Status = "idle" | "sending" | "sent" | "error";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
    if (error) {
      setStatus("error");
      setError(error.message);
      return;
    }
    setStatus("sent");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Sign in to Propelt</h1>
        <p className="mb-6 text-sm opacity-70">
          We&apos;ll email you a magic link. No password required.
        </p>

        {status === "sent" ? (
          <div className="rounded-md border border-green-500/30 bg-green-500/10 p-4 text-sm">
            Check <span className="font-medium">{email}</span> for your sign-in link.
          </div>
        ) : (
          <form onSubmit={onSubmit} className="flex flex-col gap-3">
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "sending"}
              className="rounded-md border border-black/10 bg-transparent px-3 py-2 outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/40"
            />
            <button
              type="submit"
              disabled={status === "sending" || email.length === 0}
              className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              {status === "sending" ? "Sending…" : "Send magic link"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        )}
      </div>
    </main>
  );
}
