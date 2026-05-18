import type { NextFunction, Request, Response } from "express";
import { supabase } from "./supabase.js";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
      accessToken?: string;
    }
  }
}

export const requireUser = async (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (!supabase) {
    response.status(500).json({ error: "Supabase is not configured" });
    return;
  }

  const header = request.header("authorization");
  const token = header?.startsWith("Bearer ") ? header.slice(7) : undefined;

  if (!token) {
    response.status(401).json({ error: "Missing bearer token" });
    return;
  }

  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    response.status(401).json({ error: "Invalid session" });
    return;
  }

  request.userId = data.user.id;
  request.accessToken = token;
  next();
};
