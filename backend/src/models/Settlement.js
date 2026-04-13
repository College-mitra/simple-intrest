import mongoose from 'mongoose';

const settlementSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    cycleId: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    equalShare: { type: Number, required: true },
    balances: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        spent: Number,
        net: Number
      }
    ],
    transfers: [
      {
        from: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        to: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        amount: Number
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model('Settlement', settlementSchema);
