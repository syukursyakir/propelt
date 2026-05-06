import type { Request, Response } from "express";
import type { ZodTypeAny, z } from "zod";

export function parseBody<T extends ZodTypeAny>(
  schema: T,
  req: Request,
  res: Response,
): z.infer<T> | null {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: "invalid_body", issues: result.error.flatten() });
    return null;
  }
  return result.data;
}

export function parseQuery<T extends ZodTypeAny>(
  schema: T,
  req: Request,
  res: Response,
): z.infer<T> | null {
  const result = schema.safeParse(req.query);
  if (!result.success) {
    res.status(400).json({ error: "invalid_query", issues: result.error.flatten() });
    return null;
  }
  return result.data;
}
