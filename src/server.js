import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import path from 'path';
import { fileURLToPath } from 'url';
import { config } from './config.js';
import { connectWithRetry } from './db.js';
import branchesRouter from './routes/branches.js';
import toolsRouter from './routes/tools.js';
import reservationsRouter from './routes/reservations.js';
import reportsRouter from './routes/reports.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
// src/server.js
import app from "./app.js";
import { connectMongo } from "./db.js";

const PORT = process.env.PORT || 3000;

(async () => {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`[HTTP] Listening on port ${PORT}`);
    console.log(`[INFO] Visit minimal form at /public/create-reservation.html`);
  });
})();


const app = express();
app.use(morgan('dev'));
app.use(cors());
app.use(express.json({ limit: '256kb' }));
app.use(express.urlencoded({ extended: false }));

// Static for the minimal HTML form
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const publicDir = path.resolve(__dirname, "..", "public");
// Routes
app.use('/branches', branchesRouter);
app.use('/tools', toolsRouter);
app.use('/reservations', reservationsRouter);
app.use('/reports', reportsRouter);
app.use("/public", express.static(publicDir));


// 404 and Error
app.use(notFound);
app.use(errorHandler);

// Boot
connectWithRetry().then(() => {
  app.listen(config.port, () => {
    console.log(`[HTTP] Listening on port ${config.port}`);
    console.log(`[INFO] Change PORT or MONGODB_URI in .env`);
    console.log("[INFO] Static served from", publicDir);
    console.log(`[INFO] Visit minimal form at /public/create-reservation.html`);
  });
}).catch(err => {
  console.error('[FATAL] Could not start server:', err);
  process.exit(1);
});
