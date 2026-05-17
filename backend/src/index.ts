import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./lib/env.js";
import { logger } from "./lib/logger.js";
import { meRouter } from "./routes/me.js";
import { resumeRouter } from "./routes/resume.js";

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "1mb" }));
app.use(morgan("tiny"));

const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 120,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use(globalLimiter);

app.get("/health", (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.use("/api/me", meRouter);
app.use("/api/resume", resumeRouter);

// Product routes mount here as the job-copilot flow ships.
// app.use("/api/job-target", jobTargetRouter);
// app.use("/api/questions", questionsRouter);
// app.use("/api/documents", documentsRouter);
// app.use("/api/webhooks", webhooksRouter);

app.use((err: unknown, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error("unhandled_error", { err: err instanceof Error ? err.message : String(err) });
  res.status(500).json({ error: "internal_error" });
});

app.listen(env.PORT, () => {
  logger.info("backend_started", { port: env.PORT, env: env.NODE_ENV });
});
