import cors from "cors";
import express from "express";
import helmet from "helmet";
import { healthCheckSchema } from "@propelt/shared";
import { env } from "./env.js";
import { supabase, supabaseAdmin } from "./supabase.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.frontendUrl,
  }),
);
app.use(express.json());

app.get("/health", (_request, response) => {
  response.json(
    healthCheckSchema.parse({
      status: "ok",
      service: "backend",
      timestamp: new Date().toISOString(),
    }),
  );
});

app.get("/status", (_request, response) => {
  response.json({
    status: "ok",
    supabaseClientConfigured: Boolean(supabase),
    supabaseAdminConfigured: Boolean(supabaseAdmin),
  });
});

app.listen(env.port, () => {
  console.log(`Backend listening on port ${env.port}`);
});
