import type { NextFunction, Request, Response } from "express";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseAdmin, supabaseAsUser } from "../lib/supabase.js";
import { logger } from "../lib/logger.js";

export interface AuthedRequest extends Request {
  user?: { id: string; email: string | undefined };
  supabase?: SupabaseClient;
}

export async function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const header = req.header("authorization");
  if (!header || !header.toLowerCase().startsWith("bearer ")) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }
  const token = header.slice(7).trim();
  if (!token) {
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  const { data, error } = await supabaseAdmin.auth.getUser(token);
  if (error || !data.user) {
    logger.warn("auth_verify_failed", { err: error?.message });
    res.status(401).json({ error: "unauthorized" });
    return;
  }

  req.user = { id: data.user.id, email: data.user.email };
  req.supabase = supabaseAsUser(token);
  next();
}
