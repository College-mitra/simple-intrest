import bcrypt from 'bcryptjs';
import Group from '../models/Group.js';
import Notification from '../models/Notification.js';
import User from '../models/User.js';

export const listMembers = async (req, res) => {
  const members = await User.find({ group: req.user.group, active: true }).select('-password');
  res.json(members);
};

export const addMember = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });

    const hashed = await bcrypt.hash(password, 10);
    const member = await User.create({ name, email, password: hashed, role: 'member', group: req.user.group });
    await Group.findByIdAndUpdate(req.user.group, { $push: { members: member._id } });

    const note = await Notification.create({
      group: req.user.group,
      type: 'admin',
      message: `${req.user.name} added member ${member.name}`,
      createdBy: req.user._id
    });

    req.io.to(String(req.user.group)).emit('notification:new', note);
    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { id } = req.params;
    const member = await User.findOneAndUpdate(
      { _id: id, group: req.user.group, role: 'member' },
      { active: false },
      { new: true }
    );
    if (!member) return res.status(404).json({ message: 'Member not found' });

    await Group.findByIdAndUpdate(req.user.group, { $pull: { members: member._id } });

    const note = await Notification.create({
      group: req.user.group,
      type: 'admin',
      message: `${req.user.name} removed member ${member.name}`,
      createdBy: req.user._id
    });

    req.io.to(String(req.user.group)).emit('notification:new', note);
    res.json({ message: 'Member removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
