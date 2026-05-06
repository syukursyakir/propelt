import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-8 text-center">
      <h1 className="text-5xl font-semibold tracking-tight">Propelt</h1>
      <p className="max-w-md text-lg opacity-70">
        Generate every asset you need to launch your product on Product Hunt, HN, Reddit, and more.
      </p>
      <Link
        href="/login"
        className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background"
      >
        Sign in
      </Link>
    </main>
  );
}
