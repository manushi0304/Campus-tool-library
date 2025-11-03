import mongoose from 'mongoose';

const ReservationSchema = new mongoose.Schema({
  userName: { type: String, required: true, trim: true },
  toolId: { type: mongoose.Schema.Types.ObjectId, ref: 'Tool', required: true },
  pickupAt: { type: Date, required: true },
  returnAt: { type: Date, required: true },
  status: { type: String, enum: ['pending', 'picked', 'returned', 'cancelled'], default: 'pending' }
}, { timestamps: true });

ReservationSchema.index({ toolId: 1, pickupAt: 1 });

export const Reservation = mongoose.model('Reservation', ReservationSchema);
