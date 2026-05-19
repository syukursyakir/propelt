"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function AuthPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = async () => {
    setError("");
    setMessage("");
    setLoading(true);

    const result =
      mode === "signin"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password });

    setLoading(false);

    if (result.error) {
      setError(result.error.message);
      return;
    }

    if (mode === "signup" && !result.data.session) {
      setMessage("Check your email to confirm your account.");
      return;
    }

    router.replace("/dashboard");
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
  };

  return (
    <main className="page">
      <nav className="nav">
        <Link className="brand" href="/">
          Propelt
        </Link>
      </nav>
      <section className="workspace" style={{ maxWidth: 520, paddingTop: 48 }}>
        <div className="card stack">
          <div>
            <h1>{mode === "signin" ? "Log in" : "Create account"}</h1>
            <p className="muted">
              Save resumes, generate tailored applications, and come back to
              your results.
            </p>
          </div>
          {error ? <div className="error">{error}</div> : null}
          {message ? <div className="success">{message}</div> : null}
          <button className="button secondary" type="button" onClick={handleGoogle}>
            Continue with Google
          </button>
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>
          <button
            className="button"
            type="button"
            disabled={loading}
            onClick={handleEmail}
          >
            {loading ? "Please wait..." : mode === "signin" ? "Log in" : "Sign up"}
          </button>
          <button
            className="button ghost"
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
          >
            {mode === "signin"
              ? "Need an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>
      </section>
    </main>
  );
}
