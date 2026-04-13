import Expense from '../models/Expense.js';
import Notification from '../models/Notification.js';

export const listExpenses = async (req, res) => {
  const { member, startDate, endDate } = req.query;
  const query = { group: req.user.group };

  if (member) query.addedBy = member;
  if (startDate || endDate) {
    query.createdAt = {};
    if (startDate) query.createdAt.$gte = new Date(startDate);
    if (endDate) query.createdAt.$lte = new Date(endDate);
  }

  const expenses = await Expense.find(query).populate('addedBy', 'name').sort({ createdAt: -1 });
  res.json(expenses);
};

export const addExpense = async (req, res) => {
  try {
    const cycleId = req.headers['x-cycle-id'] || 'current';
    const { itemName, quantity, amount } = req.body;
    const expense = await Expense.create({
      itemName,
      quantity,
      amount,
      group: req.user.group,
      addedBy: req.user._id,
      cycleId
    });

    const populated = await expense.populate('addedBy', 'name');
    const message = `${req.user.name} added ${itemName} worth ₹${amount}`;
    const note = await Notification.create({ group: req.user.group, message, type: 'expense', createdBy: req.user._id });

    req.io.to(String(req.user.group)).emit('expense:new', populated);
    req.io.to(String(req.user.group)).emit('notification:new', note);

    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
