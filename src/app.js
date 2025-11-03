// src/app.js
import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { connectMongo } from "./db.js";
import branchesRouter from "./routes/branches.js";
import toolsRouter from "./routes/tools.js";
import reservationsRouter from "./routes/reservations.js";
import reportsRouter from "./routes/reports.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// --- Core middleware ---
app.use(cors());                       // allow your frontend/vercel domain
app.use(express.json({ limit: "1mb" })); // body parser

// --- Static files (served at /public/...) ---
const publicDir = path.resolve(__dirname, "..", "public");
app.use("/public", express.static(publicDir));

// --- DB connect on first request (serverless-safe) ---
app.use(async (req, res, next) => {
  try {
    await connectMongo(); // cached in db.js (no repeated dials)
    next();
  } catch (err) {
    next(err);
  }
});

// --- Routes ---
app.use("/branches", branchesRouter);
app.use("/tools", toolsRouter);
app.use("/reservations", reservationsRouter);
app.use("/reports", reportsRouter);

// --- 404 ---
app.use((req, res) => {
  res.status(404).json({ ok: false, error: "Route not found" });
});

// --- Global error handler ---
app.use((err, req, res, next) => {
  console.error("[ERR]", err);
  const status = err.status || 500;
  res.status(status).json({
    ok: false,
    code: err.code || "INTERNAL_ERROR",
    message: err.message || "Unexpected error"
  });
});

export default app;
