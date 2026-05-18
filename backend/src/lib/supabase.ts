import {
  createClient,
  type SupabaseClient,
  type SupabaseClientOptions,
  type WebSocketLikeConstructor,
} from "@supabase/supabase-js";
import WebSocket from "ws";
import { env } from "./env.js";

if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set");
}

const WebSocketTransport = WebSocket as unknown as WebSocketLikeConstructor;

const supabaseServerOptions = {
  auth: { autoRefreshToken: false, persistSession: false },
  realtime: { transport: WebSocketTransport },
} satisfies SupabaseClientOptions<"public">;

export const supabaseAdmin: SupabaseClient = createClient(
  env.SUPABASE_URL,
  env.SUPABASE_SERVICE_ROLE_KEY,
  supabaseServerOptions,
);

// User-scoped client: uses the caller's JWT so RLS policies apply.
// Use this from authed routes when you want the DB to enforce ownership.
export function supabaseAsUser(jwt: string): SupabaseClient {
  if (!env.SUPABASE_URL || !env.SUPABASE_ANON_KEY) {
    throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY must be set");
  }
  return createClient(env.SUPABASE_URL, env.SUPABASE_ANON_KEY, {
    ...supabaseServerOptions,
    global: { headers: { Authorization: `Bearer ${jwt}` } },
  });
}
