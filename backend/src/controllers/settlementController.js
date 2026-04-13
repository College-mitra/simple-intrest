import PDFDocument from 'pdfkit';
import Expense from '../models/Expense.js';
import Settlement from '../models/Settlement.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';
import { calculateSettlement } from '../services/settlementService.js';

export const generateSettlement = async (req, res) => {
  try {
    const cycleId = req.headers['x-cycle-id'] || 'current';
    const users = await User.find({ group: req.user.group, active: true });
    const expenses = await Expense.find({ group: req.user.group, cycleId }).populate('addedBy', 'name');
    const result = calculateSettlement(users, expenses);

    const settlement = await Settlement.create({
      group: req.user.group,
      cycleId,
      totalAmount: result.totalAmount,
      equalShare: result.equalShare,
      balances: result.balances.map((b) => ({ user: b.user._id, spent: b.spent, net: b.net })),
      transfers: result.transfers.map((t) => ({ from: t.from._id, to: t.to._id, amount: t.amount }))
    });

    const populated = await Settlement.findById(settlement._id)
      .populate('balances.user', 'name')
      .populate('transfers.from', 'name')
      .populate('transfers.to', 'name');

    const note = await Notification.create({
      group: req.user.group,
      type: 'admin',
      message: `${req.user.name} generated settlement report`,
      createdBy: req.user._id
    });
    req.io.to(String(req.user.group)).emit('notification:new', note);

    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getSettlementPdf = async (req, res) => {
  try {
    const settlement = await Settlement.findById(req.params.id)
      .populate('balances.user', 'name')
      .populate('transfers.from', 'name')
      .populate('transfers.to', 'name');
    if (!settlement) return res.status(404).json({ message: 'Settlement not found' });

    const expenses = await Expense.find({ group: req.user.group, cycleId: settlement.cycleId }).populate('addedBy', 'name');

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=settlement-${settlement._id}.pdf`);

    const doc = new PDFDocument({ margin: 30 });
    doc.pipe(res);

    doc.fontSize(18).text('MessMates Settlement Report');
    doc.moveDown().fontSize(12).text(`Cycle: ${settlement.cycleId}`);
    doc.text(`Total Amount: ₹${settlement.totalAmount}`);
    doc.text(`Equal Share: ₹${settlement.equalShare}`);

    doc.moveDown().fontSize(14).text('Transactions');
    expenses.forEach((e) => doc.fontSize(10).text(`${e.addedBy.name} - ${e.itemName} - ₹${e.amount} - ${new Date(e.createdAt).toLocaleString()}`));

    doc.moveDown().fontSize(14).text('Settlement Transfers');
    settlement.transfers.forEach((t) => doc.fontSize(11).text(`${t.from.name} pays ₹${t.amount} to ${t.to.name}`));

    doc.end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
