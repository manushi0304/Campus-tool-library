// src/db.js
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017";
const dbName = process.env.DB_NAME || "campus_tool_library";

// cache across hot-reloads / serverless invocations
let cached = globalThis.__mongoCached;

if (!cached) {
  cached = globalThis.__mongoCached = { client: null, db: null, promise: null };
}

export async function connectMongo() {
  if (cached.db) return cached.db;
  if (!cached.promise) {
    const client = new MongoClient(uri, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
    });
    cached.promise = client.connect().then((cl) => {
      cached.client = cl;
      cached.db = cl.db(dbName);
      console.log("[DB] Connected to", dbName);
      return cached.db;
    });
  }
  return cached.promise;
}

export function getDb() {
  if (!cached.db) throw new Error("Mongo not connected yet");
  return cached.db;
}
