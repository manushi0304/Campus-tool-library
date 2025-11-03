import mongoose from 'mongoose';
import { config } from './config.js';

export async function connectWithRetry(retries = 5, delayMs = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await mongoose.connect(config.mongodbUri, { dbName: config.dbName });
      console.log(`[DB] Connected to ${config.dbName}`);
      return;
    } catch (err) {
      console.error(`[DB] Connection attempt ${attempt} failed:`, err.message);
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delayMs));
    }
  }
}
