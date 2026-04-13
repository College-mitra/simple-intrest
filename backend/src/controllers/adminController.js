import Expense from '../models/Expense.js';
import Notification from '../models/Notification.js';

export const resetCycle = async (req, res) => {
  try {
    const { newCycleId } = req.body;
    if (!newCycleId) return res.status(400).json({ message: 'newCycleId required' });

    await Expense.updateMany({ group: req.user.group, cycleId: 'current' }, { $set: { cycleId: `archived-${Date.now()}` } });

    const note = await Notification.create({
      group: req.user.group,
      type: 'admin',
      message: `${req.user.name} reset cycle to ${newCycleId}`,
      createdBy: req.user._id
    });

    req.io.to(String(req.user.group)).emit('notification:new', note);
    res.json({ message: 'Cycle reset completed. Use x-cycle-id header for new cycle operations.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
