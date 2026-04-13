import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { connectDB } from '../config/db.js';
import Group from '../models/Group.js';
import User from '../models/User.js';
import Expense from '../models/Expense.js';

dotenv.config();
await connectDB();

await Promise.all([Group.deleteMany({}), User.deleteMany({}), Expense.deleteMany({})]);

const group = await Group.create({ name: 'MessMates Demo' });
const password = await bcrypt.hash('password123', 10);
const admin = await User.create({ name: 'Babul', email: 'babul@example.com', password, role: 'admin', group: group._id });
const raj = await User.create({ name: 'Rajendra', email: 'rajendra@example.com', password, role: 'member', group: group._id });
const amit = await User.create({ name: 'Amit', email: 'amit@example.com', password, role: 'member', group: group._id });

group.admin = admin._id;
group.members = [admin._id, raj._id, amit._id];
await group.save();

await Expense.create([
  { itemName: 'Rice', amount: 500, quantity: '10kg', addedBy: admin._id, group: group._id, cycleId: 'current' },
  { itemName: 'Oil', amount: 300, quantity: '2L', addedBy: raj._id, group: group._id, cycleId: 'current' },
  { itemName: 'Vegetables', amount: 450, quantity: 'weekly', addedBy: amit._id, group: group._id, cycleId: 'current' }
]);

console.log('Seed complete');
process.exit(0);
