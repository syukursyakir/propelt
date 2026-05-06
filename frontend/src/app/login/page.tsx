"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type Step = "email" | "code";
type Status = "idle" | "pending";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSendCode(e: React.FormEvent) {
    e.preventDefault();
    setStatus("pending");
    setError(null);
    const supabase = createSupabaseBrowserClient();
    // Omitting emailRedirectTo tells Supabase to send a 6-digit code,
    // not a clickable link. (Bypasses Gmail/scanner link prefetching.)
    const { error } = await supabase.auth.signInWithOtp({ email });
    setStatus("idle");
    if (error) {
      setError(error.message);
      return;
    }
    setStep("code");
  }

  async function onVerify(e: React.FormEvent) {
    e.preventDefault();
    setStatus("pending");
    setError(null);
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: "email",
    });
    if (error) {
      setStatus("idle");
      setError(error.message);
      return;
    }
    router.replace("/dashboard");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-3xl font-semibold tracking-tight">Sign in to Propelt</h1>
        <p className="mb-6 text-sm opacity-70">
          {step === "email"
            ? "Enter your email — we'll send you a sign-in code."
            : `Enter the code we sent to ${email}.`}
        </p>

        {step === "email" ? (
          <form onSubmit={onSendCode} className="flex flex-col gap-3">
            <input
              type="email"
              required
              autoFocus
              autoComplete="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={status === "pending"}
              className="rounded-md border border-black/10 bg-transparent px-3 py-2 outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/40"
            />
            <button
              type="submit"
              disabled={status === "pending" || email.length === 0}
              className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              {status === "pending" ? "Sending…" : "Send code"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
          </form>
        ) : (
          <form onSubmit={onVerify} className="flex flex-col gap-3">
            <input
              type="text"
              required
              autoFocus
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="[0-9]{6,10}"
              maxLength={10}
              placeholder="Enter code"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
              disabled={status === "pending"}
              className="rounded-md border border-black/10 bg-transparent px-3 py-2 text-center font-mono text-lg tracking-[0.3em] outline-none focus:border-black/30 dark:border-white/15 dark:focus:border-white/40"
            />
            <button
              type="submit"
              disabled={status === "pending" || code.length < 6}
              className="rounded-md bg-foreground px-3 py-2 text-sm font-medium text-background disabled:opacity-50"
            >
              {status === "pending" ? "Verifying…" : "Verify"}
            </button>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <button
              type="button"
              onClick={() => {
                setStep("email");
                setCode("");
                setError(null);
              }}
              disabled={status === "pending"}
              className="text-xs underline opacity-60 hover:opacity-100"
            >
              Use a different email
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
