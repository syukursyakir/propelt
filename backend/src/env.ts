import "dotenv/config";

export type BackendEnv = {
  nodeEnv: string;
  port: number;
  frontendUrl: string;
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
};

const parsePort = (value: string | undefined) => {
  if (!value) {
    return 4000;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 4000;
};

export const env: BackendEnv = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: parsePort(process.env.PORT),
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  supabaseUrl: process.env.SUPABASE_URL,
  supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
};
