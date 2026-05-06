import { Router } from "express";
import { requireAuth, type AuthedRequest } from "../middleware/requireAuth.js";

export const meRouter = Router();

// GET /api/me — returns the authed user. Phase 1 sanity endpoint.
meRouter.get("/", requireAuth, (req: AuthedRequest, res) => {
  res.json({ user: req.user });
});
