import mongoose from 'mongoose';
export function toObjectId(id) {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error('Invalid ObjectId');
    err.status = 400;
    err.code = 'INVALID_OBJECT_ID';
    throw err;
  }
  return new mongoose.Types.ObjectId(id);
}
