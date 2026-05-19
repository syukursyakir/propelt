"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type IconKey = "home" | "resumes" | "newapp" | "user";
type AnyIconName = IconKey | "chevron" | "signout";

type NavItem = {
  href: string;
  label: string;
  iconKey: IconKey;
  /** Path prefix that activates this link. Defaults to href. */
  match?: string;
};

const NAV: NavItem[] = [
  { href: "/dashboard", label: "Home", iconKey: "home" },
  { href: "/resumes", label: "Resumes", iconKey: "resumes" },
  {
    href: "/applications/new",
    label: "New application",
    iconKey: "newapp",
    match: "/applications",
  },
  { href: "/onboarding", label: "Full onboarding", iconKey: "user" },
];

const STORAGE_KEY = "propelt:sidebar-collapsed";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname() ?? "";
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Hydrate from localStorage after mount.
  useEffect(() => {
    try {
      if (window.localStorage.getItem(STORAGE_KEY) === "1") {
        setCollapsed(true);
      }
    } catch {
      // localStorage may be blocked
    }
    setMounted(true);
  }, []);

  // Persist on change.
  useEffect(() => {
    if (!mounted) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, collapsed ? "1" : "0");
    } catch {
      // ignore
    }
  }, [collapsed, mounted]);

  const signOut = async () => {
    await supabase.auth.signOut();
    router.replace("/auth");
  };

  const isActive = (item: NavItem) => {
    const match = item.match ?? item.href;
    return pathname === match || pathname.startsWith(match + "/");
  };

  return (
    <div className={`app-shell${collapsed ? " app-shell--collapsed" : ""}`}>
      <aside className="app-sidebar" aria-label="Workspace navigation">
        <div className="app-sidebar-head">
          <Link className="app-brand" href="/dashboard" aria-label="Propelt home">
            <span className="app-brand-mark" aria-hidden="true">P</span>
            <span className="app-nav-label app-brand-text">Propelt</span>
          </Link>
          <button
            type="button"
            className="app-sidebar-toggle"
            onClick={() => setCollapsed((value) => !value)}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-expanded={!collapsed}
          >
            <Icon name="chevron" />
          </button>
        </div>

        <nav className="app-nav" aria-label="Primary">
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`app-nav-link${active ? " active" : ""}`}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
              >
                <Icon name={item.iconKey} />
                <span className="app-nav-label">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="app-sidebar-footer">
          <p className="app-sidebar-meta app-nav-label">Signed in workspace</p>
          <button
            type="button"
            className="button ghost app-signout"
            onClick={signOut}
            title={collapsed ? "Sign out" : undefined}
            aria-label="Sign out"
          >
            <Icon name="signout" />
            <span className="app-nav-label">Sign out</span>
          </button>
        </div>
      </aside>

      <section className="app-main">{children}</section>
    </div>
  );
}

function Icon({ name }: { name: AnyIconName }) {
  switch (name) {
    case "home":
      return (
        <svg className="app-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M3 11l9-7 9 7" />
          <path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9" />
        </svg>
      );
    case "resumes":
      return (
        <svg className="app-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 17h6" />
        </svg>
      );
    case "newapp":
      return (
        <svg className="app-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M7 3h7l5 5v11a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" />
          <path d="M14 3v5h5" />
          <path d="M12 12v6M9 15h6" />
        </svg>
      );
    case "user":
      return (
        <svg className="app-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="9" r="3.5" />
          <path d="M5 20c0-3.5 3-6 7-6s7 2.5 7 6" />
        </svg>
      );
    case "signout":
      return (
        <svg className="app-icon" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M10 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5" />
          <polyline points="15 16 20 12 15 8" />
          <path d="M20 12H9" />
        </svg>
      );
    case "chevron":
      return (
        <svg
          className="app-icon app-icon--chevron"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <polyline points="14 6 8 12 14 18" />
        </svg>
      );
  }
}
