import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    message: { type: String, required: true },
    type: { type: String, enum: ['expense', 'admin', 'system'], default: 'system' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { timestamps: true }
);

export default mongoose.model('Notification', notificationSchema);
