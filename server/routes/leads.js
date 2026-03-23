import express from 'express';
import Lead from '../models/Lead.js';

const router = express.Router();
const LEADS_FALLBACK = [];

router.post('/', async (req, res) => {
  const { name, email, company, role, message } = req.body;
  if (!name || !email) return res.status(400).json({ error: 'Name and email are required.' });
  try {
    const lead = new Lead({ name, email, company, role, message });
    await lead.save();
    res.status(201).json({ success: true, id: lead._id });
  } catch {
    LEADS_FALLBACK.push({ name, email, company, role, message, createdAt: new Date() });
    res.status(201).json({ success: true, id: `mock-${Date.now()}` });
  }
});

export default router;
