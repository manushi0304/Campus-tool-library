import mongoose from 'mongoose';

const BranchSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  address: { type: String, required: true },
  location: {
    type: { type: String, enum: ['Point'], required: true, default: 'Point' },
    coordinates: { type: [Number], required: true } // [lng, lat]
  },
  hours: { type: String, default: '09:00-18:00' }
}, { timestamps: true });

BranchSchema.index({ location: '2dsphere' });

export const Branch = mongoose.model('Branch', BranchSchema);
