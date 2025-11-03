import express from 'express';
import mongoose from 'mongoose';
import { Tool } from '../models/Tool.js';
import { Branch } from '../models/Branch.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { createToolSchema, listToolsSchema, nearToolsQuerySchema } from '../validators/tools.js';
import { toObjectId } from '../utils/objectId.js';

const router = express.Router();

/**
 * POST /tools
 */
router.post('/', validate(createToolSchema), asyncHandler(async (req, res) => {
  const tool = await Tool.create(req.body);
  res.status(201).json({ ok: true, data: tool });
}));

/**
 * GET /tools
 * Filtering (q, category, branchId), pagination (page, limit)
 */
router.get('/', validate(listToolsSchema), asyncHandler(async (req, res) => {
  const { q, category, branchId, page, limit } = req.query;
  const filter = {};
  if (q) filter.$text = { $search: q };
  if (category) filter.category = category;
  if (branchId) filter.branchId = toObjectId(branchId);

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Tool.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Tool.countDocuments(filter)
  ]);
  res.json({ ok: true, page: Number(page), limit: Number(limit), total, data: items });
}));

/**
 * GET /tools/near?lng=&lat=&maxKm=&limit=
 * Join with nearest branches to list tools located at nearby branches
 */
router.get('/near', validate(nearToolsQuerySchema), asyncHandler(async (req, res) => {
  const { lng, lat, maxKm, limit } = req.query;
  const meters = Number(maxKm) * 1000;

  const results = await Branch.aggregate([
    {
      $geoNear: {
        near: { type: 'Point', coordinates: [Number(lng), Number(lat)] },
        distanceField: 'distance',
        spherical: true,
        maxDistance: meters
      }
    },
    { $limit: Number(limit) },
    {
      $lookup: {
        from: 'tools',
        localField: '_id',
        foreignField: 'branchId',
        as: 'tools'
      }
    },
    { $project: { name: 1, address: 1, distance: 1, 'tools.name': 1, 'tools.category': 1, 'tools.available': 1 } }
  ]);

  res.json({ ok: true, data: results });
}));

/**
 * PUT /tools/:id (basic updates)
 */
router.put('/:id', asyncHandler(async (req, res) => {
  const id = toObjectId(req.params.id);
  const allowed = ['name', 'category', 'condition', 'tags', 'branchId', 'available'];
  const update = {};
  for (const k of allowed) if (k in req.body) update[k] = req.body[k];

  const tool = await Tool.findByIdAndUpdate(id, update, { new: true });
  if (!tool) return res.status(404).json({ ok: false, error: 'Tool not found' });
  res.json({ ok: true, data: tool });
}));

/**
 * DELETE /tools/:id
 */
router.delete('/:id', asyncHandler(async (req, res) => {
  const id = toObjectId(req.params.id);
  const out = await Tool.findByIdAndDelete(id);
  if (!out) return res.status(404).json({ ok: false, error: 'Tool not found' });
  res.json({ ok: true, data: { deleted: true } });
}));

export default router;
