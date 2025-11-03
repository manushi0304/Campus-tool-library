import express from 'express';
import { Tool } from '../models/Tool.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

const router = express.Router();

/**
 * GET /reports/category-stats
 * Aggregation: group by category, count, availableCount
 */
router.get('/category-stats', asyncHandler(async (req, res) => {
  const stats = await Tool.aggregate([
    {
      $group: {
        _id: '$category',
        total: { $sum: 1 },
        availableCount: { $sum: { $cond: ['$available', 1, 0] } }
      }
    },
    { $sort: { total: -1 } }
  ]);
  res.json({ ok: true, data: stats });
}));

export default router;
