import express from 'express';
import { Branch } from '../models/Branch.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { createBranchSchema, nearQuerySchema } from '../validators/branches.js';

const router = express.Router();

/**
 * POST /branches
 * Create a branch
 */
router.post('/', validate(createBranchSchema), asyncHandler(async (req, res) => {
  const branch = await Branch.create(req.body);
  res.status(201).json({ ok: true, data: branch });
}));

/**
 * GET /branches/near?lng=&lat=&maxKm=&limit=
 * Find branches near a coordinate using 2dsphere index
 */
router.get('/near', validate(nearQuerySchema), asyncHandler(async (req, res) => {
  const { lng, lat, maxKm, limit } = req.query;
  const meters = Number(maxKm) * 1000;
  const branches = await Branch.find({
    location: { $near: { $geometry: { type: 'Point', coordinates: [Number(lng), Number(lat)] }, $maxDistance: meters } }
  }).limit(Number(limit));
  res.json({ ok: true, data: branches });
}));

export default router;
