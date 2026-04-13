import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema(
  {
    itemName: { type: String, required: true },
    quantity: { type: String },
    amount: { type: Number, required: true, min: 0 },
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    cycleId: { type: String, required: true }
  },
  { timestamps: true }
);

export default mongoose.model('Expense', expenseSchema);
