import mongoose from 'mongoose';

const ToolSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  category: { type: String, required: true, enum: ['electronics', 'media', 'mechanical', 'lab', 'other'] },
  condition: { type: String, default: 'good', enum: ['new', 'good', 'fair', 'poor'] },
  tags: { type: [String], default: [] },
  branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
  available: { type: Boolean, default: true }
}, { timestamps: true });

ToolSchema.index({ category: 1, branchId: 1 });
ToolSchema.index({ name: 'text' });

export const Tool = mongoose.model('Tool', ToolSchema);
