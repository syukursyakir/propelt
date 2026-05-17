import { redirect } from "next/navigation";
import Link from "next/link";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { SignOutButton } from "./sign-out-button";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 p-8">
      <header className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <SignOutButton />
      </header>
      <p className="text-sm opacity-70">
        Signed in as <span className="font-medium">{user.email}</span>
      </p>
      <div className="rounded-md border border-black/10 p-6 dark:border-white/15">
        <p className="text-sm opacity-70">
          Your resume, target role, and AI coaching progress will appear here as the new job-search flow ships.
        </p>
        <Link
          href="/resume"
          className="mt-4 inline-flex rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          Add resume
        </Link>
      </div>
    </main>
  );
}
