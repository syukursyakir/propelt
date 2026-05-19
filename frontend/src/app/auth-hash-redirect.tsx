"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";

export function AuthHashRedirect() {
  const router = useRouter();

  useEffect(() => {
    const hash = window.location.hash;

    if (!hash.includes("access_token")) {
      return;
    }

    const params = new URLSearchParams(hash.slice(1));
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");

    if (!accessToken || !refreshToken) {
      window.history.replaceState(null, "", window.location.pathname);
      router.replace("/auth");
      return;
    }

    supabase.auth
      .setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      })
      .finally(() => {
        window.history.replaceState(null, "", "/dashboard");
        router.replace("/dashboard");
      });
  }, [router]);

  return null;
}
