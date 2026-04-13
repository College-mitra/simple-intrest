import bcrypt from 'bcryptjs';
import Group from '../models/Group.js';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

export const registerGroupAdmin = async (req, res) => {
  try {
    const { groupName, name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const group = await Group.create({ name: groupName, members: [] });
    const hashed = await bcrypt.hash(password, 10);
    const admin = await User.create({ name, email, password: hashed, role: 'admin', group: group._id });

    group.admin = admin._id;
    group.members.push(admin._id);
    await group.save();

    res.status(201).json({ token: generateToken(admin._id), user: admin, group });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).populate('group');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ message: 'Invalid credentials' });

    res.json({ token: generateToken(user._id), user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
