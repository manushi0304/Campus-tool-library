import "dotenv/config";
import mongoose from "mongoose";
import { Branch } from "../src/models/Branch.js";
import { Tool } from "../src/models/Tool.js";
import { Reservation } from "../src/models/Reservation.js";
import { config } from "../src/config.js";

async function main() {
  await mongoose.connect(config.mongodbUri, { dbName: config.dbName });
  console.log(`[DB] Connected to ${config.dbName}`);

  console.log("[SEED] Dropping existing collections (if any)...");
  await Promise.allSettled([
    Branch.collection.drop().catch(()=>{}),
    Tool.collection.drop().catch(()=>{}),
    Reservation.collection.drop().catch(()=>{})
  ]);

  // Branches (Bengaluru-ish coords)
  const branches = await Branch.insertMany([
    {
      name: "North Lab",
      address: "Block A, North Campus",
      location: { type: "Point", coordinates: [77.5946, 12.9716] },
      hours: "09:00-18:00"
    },
    {
      name: "Central Hub",
      address: "Main Gate",
      location: { type: "Point", coordinates: [77.59, 12.975] },
      hours: "08:00-20:00"
    },
    {
      name: "Workshop South",
      address: "Block C, South Campus",
      location: { type: "Point", coordinates: [77.60, 12.965] },
      hours: "10:00-17:00"
    }
  ]);

  // Tools
  const tools = await Tool.insertMany([
    { name: "DSLR Camera", category: "media", condition: "good", tags: ["canon","lens"], branchId: branches[1]._id, available: true },
    { name: "Tripod", category: "media", condition: "new", tags: ["stabilizer"], branchId: branches[1]._id, available: true },
    { name: "Soldering Iron", category: "electronics", condition: "good", tags: ["ee"], branchId: branches[0]._id, available: true },
    { name: "Multimeter", category: "electronics", condition: "fair", tags: ["ee","voltage"], branchId: branches[0]._id, available: true },
    { name: "3D Printer", category: "mechanical", condition: "good", tags: ["maker"], branchId: branches[2]._id, available: false },
    { name: "VR Headset", category: "media", condition: "good", tags: ["oculus"], branchId: branches[2]._id, available: true },
    { name: "Microscope", category: "lab", condition: "good", tags: ["bio"], branchId: branches[2]._id, available: true },
    { name: "Oscilloscope", category: "electronics", condition: "good", tags: ["signal"], branchId: branches[0]._id, available: true }
  ]);

  // Reservations
  const now = new Date();
  const oneDay = 24 * 3600 * 1000;
  await Reservation.insertMany([
    { userName: "manu",  toolId: tools[0]._id, pickupAt: new Date(now.getTime()+oneDay), returnAt: new Date(now.getTime()+2*oneDay), status: "pending" },
    { userName: "arun",  toolId: tools[2]._id, pickupAt: new Date(now.getTime()+2*oneDay), returnAt: new Date(now.getTime()+3*oneDay), status: "pending" },
    { userName: "anita", toolId: tools[5]._id, pickupAt: new Date(now.getTime()+oneDay),   returnAt: new Date(now.getTime()+3*oneDay), status: "picked" }
  ]);

  // Ensure Indexes
  await Promise.all([
    Branch.collection.createIndex({ location: "2dsphere" }),
    Tool.collection.createIndex({ category: 1, branchId: 1 }),
    Tool.collection.createIndex({ name: "text" }),
    Reservation.collection.createIndex({ toolId: 1, pickupAt: 1 })
  ]);

  console.log("[SEED] Inserted 3 branches, 8 tools, 3 reservations.");
  console.log("[SEED] Indexes ensured.");
  await mongoose.disconnect();
  console.log("[SEED] Done.");
}

main().catch(err => {
  console.error("[SEED] Error:", err);
  process.exit(1);
});
