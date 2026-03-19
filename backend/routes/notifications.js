const express = require('express');
const auth = require('../middleware/auth');
const Invoice = require('../models/Invoice');
const Project = require('../models/Project');

const router = express.Router();
router.use(auth);

router.get('/', async (req, res) => {
  try {
    const uid = req.user._id;
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const in3Days = new Date(now);
    in3Days.setDate(in3Days.getDate() + 3);

    const [invoices, projects] = await Promise.all([
      Invoice.find({ userId: uid, status: { $in: ['Unpaid', 'Overdue', 'Paid'] } })
        .populate('clientId', 'name')
        .sort({ updatedAt: -1 }),
      Project.find({ userId: uid, status: { $ne: 'Completed' } })
        .populate('clientId', 'name')
        .sort({ deadline: 1 }),
    ]);

    const notifs = [];

    // Overdue invoices
    invoices
      .filter(inv => inv.status === 'Overdue')
      .forEach(inv => {
        const days = Math.floor((now - new Date(inv.dueDate)) / 86400000);
        notifs.push({
          id: `overdue-${inv._id}`,
          type: 'overdue',
          title: 'Invoice Overdue',
          desc: `${inv.invoiceNumber} for ${inv.clientId?.name || 'Unknown'} — $${inv.total.toLocaleString()} (${days}d overdue)`,
          time: inv.dueDate,
          priority: 'high',
        });
      });

    // Invoices due within 3 days (unpaid)
    invoices
      .filter(inv => inv.status === 'Unpaid' && new Date(inv.dueDate) >= now && new Date(inv.dueDate) <= in3Days)
      .forEach(inv => {
        const dueDate = new Date(inv.dueDate);
        const isToday = dueDate.toDateString() === now.toDateString();
        const isTomorrow = dueDate.toDateString() === tomorrow.toDateString();
        const label = isToday ? 'due today' : isTomorrow ? 'due tomorrow' : `due in ${Math.ceil((dueDate - now) / 86400000)}d`;
        notifs.push({
          id: `due-soon-${inv._id}`,
          type: 'due_soon',
          title: 'Payment Due Soon',
          desc: `${inv.invoiceNumber} for ${inv.clientId?.name || 'Unknown'} — $${inv.total.toLocaleString()} ${label}`,
          time: inv.dueDate,
          priority: isToday ? 'high' : 'medium',
        });
      });

    // Recently paid invoices (last 24h)
    const yesterday = new Date(Date.now() - 86400000);
    invoices
      .filter(inv => inv.status === 'Paid' && new Date(inv.updatedAt) >= yesterday)
      .forEach(inv => {
        notifs.push({
          id: `paid-${inv._id}`,
          type: 'paid',
          title: 'Invoice Paid',
          desc: `${inv.invoiceNumber} from ${inv.clientId?.name || 'Unknown'} — $${inv.total.toLocaleString()} received`,
          time: inv.updatedAt,
          priority: 'low',
        });
      });

    // Project deadlines within 3 days
    projects
      .filter(p => p.deadline && new Date(p.deadline) >= now && new Date(p.deadline) <= in3Days)
      .forEach(p => {
        const dl = new Date(p.deadline);
        const isToday = dl.toDateString() === now.toDateString();
        const isTomorrow = dl.toDateString() === tomorrow.toDateString();
        const label = isToday ? 'today' : isTomorrow ? 'tomorrow' : `in ${Math.ceil((dl - now) / 86400000)}d`;
        notifs.push({
          id: `deadline-${p._id}`,
          type: 'deadline',
          title: 'Project Deadline',
          desc: `"${p.title}" for ${p.clientId?.name || 'Unknown'} is due ${label}`,
          time: p.deadline,
          priority: isToday ? 'high' : 'medium',
        });
      });

    // Overdue projects (deadline passed, not completed)
    projects
      .filter(p => p.deadline && new Date(p.deadline) < now)
      .forEach(p => {
        const days = Math.floor((now - new Date(p.deadline)) / 86400000);
        notifs.push({
          id: `project-overdue-${p._id}`,
          type: 'project_overdue',
          title: 'Project Overdue',
          desc: `"${p.title}" for ${p.clientId?.name || 'Unknown'} is ${days}d past deadline`,
          time: p.deadline,
          priority: 'high',
        });
      });

    // Sort: high priority first, then by time desc
    const order = { high: 0, medium: 1, low: 2 };
    notifs.sort((a, b) => order[a.priority] - order[b.priority] || new Date(b.time) - new Date(a.time));

    res.json(notifs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
