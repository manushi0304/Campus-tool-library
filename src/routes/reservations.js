import express from 'express';
import { Reservation } from '../models/Reservation.js';
import { Tool } from '../models/Tool.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { validate } from '../middleware/validate.js';
import { createReservationSchema, listReservationsSchema } from '../validators/reservations.js';
import { toObjectId } from '../utils/objectId.js';

const router = express.Router();

/**
 * POST /reservations
 * Validates availability & time window
 */
router.post('/', validate(createReservationSchema), asyncHandler(async (req, res) => {
  const { toolId, pickupAt, returnAt, userName } = req.body;

  const tool = await Tool.findById(toObjectId(toolId));
  if (!tool) return res.status(404).json({ ok: false, error: 'Tool not found' });
  if (!tool.available) return res.status(400).json({ ok: false, error: 'Tool not available' });

  // Optional: check overlapping reservations
  const overlap = await Reservation.findOne({
    toolId: tool._id,
    status: { $in: ['pending', 'picked'] },
    $or: [
      { pickupAt: { $lt: new Date(returnAt) }, returnAt: { $gt: new Date(pickupAt) } }
    ]
  });

  if (overlap) return res.status(400).json({ ok: false, error: 'Time window overlaps another reservation' });

  const created = await Reservation.create({ userName, toolId: tool._id, pickupAt, returnAt, status: 'pending' });
  res.status(201).json({ ok: true, data: created });
}));

/**
 * GET /reservations
 */
router.get('/', validate(listReservationsSchema), asyncHandler(async (req, res) => {
  const { toolId, status, page, limit } = req.query;
  const filter = {};
  if (toolId) filter.toolId = toObjectId(toolId);
  if (status) filter.status = status;

  const skip = (Number(page) - 1) * Number(limit);
  const [items, total] = await Promise.all([
    Reservation.find(filter).skip(skip).limit(Number(limit)).sort({ createdAt: -1 }),
    Reservation.countDocuments(filter)
  ]);

  res.json({ ok: true, page: Number(page), limit: Number(limit), total, data: items });
}));

/**
 * PATCH /reservations/:id/status
 */
router.patch('/:id/status', asyncHandler(async (req, res) => {
  const id = toObjectId(req.params.id);
  const allowed = ['pending', 'picked', 'returned', 'cancelled'];
  if (!req.body.status || !allowed.includes(req.body.status)) {
    return res.status(400).json({ ok: false, error: 'Invalid status' });
  }
  const r = await Reservation.findByIdAndUpdate(id, { status: req.body.status }, { new: true });
  if (!r) return res.status(404).json({ ok: false, error: 'Reservation not found' });
  res.json({ ok: true, data: r });
}));

export default router;
