import { healthCheckSchema } from "@propelt/shared";

const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL ?? "http://localhost:4000";
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

export default async function Home() {
  let apiStatus = "not checked";

  try {
    const response = await fetch(`${backendUrl}/health`, {
      cache: "no-store",
      next: { revalidate: 0 },
    });
    const data: unknown = await response.json();
    apiStatus = healthCheckSchema.parse(data).status;
  } catch {
    apiStatus = "unavailable";
  }

  return (
    <main className="shell">
      <section className="panel" aria-labelledby="page-title">
        <p className="eyebrow">Propelt</p>
        <h1 id="page-title">Clean deployment skeleton</h1>
        <p>
          This repo is ready for a Next.js frontend, an Express API, Supabase
          configuration, and shared TypeScript contracts.
        </p>
        <div className="status" aria-label="Environment status">
          <div className="status-row">
            <span>Backend URL</span>
            <strong>{backendUrl}</strong>
          </div>
          <div className="status-row">
            <span>API health</span>
            <strong>{apiStatus}</strong>
          </div>
          <div className="status-row">
            <span>Supabase public URL</span>
            <strong>{supabaseUrl ? "configured" : "missing"}</strong>
          </div>
        </div>
      </section>
    </main>
  );
}
