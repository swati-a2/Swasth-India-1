import express from 'express';
import Metric from '../models/Metric.js';

const router = express.Router();

const MOCK_METRICS = [
  { label: 'Lives Touched', value: 10000000, prefix: '', suffix: 'M+', display: '10M+', description: 'Members supported across India' },
  { label: 'Care Sessions', value: 2400000, prefix: '', suffix: 'M+', display: '2.4M+', description: 'Virtual & in-person sessions completed' },
  { label: 'Specialists', value: 1200, prefix: '', suffix: '+', display: '1,200+', description: 'Board-certified providers on platform' },
  { label: 'Employer Partners', value: 350, prefix: '', suffix: '+', display: '350+', description: 'Corporates offering Swasth benefits' },
  { label: 'Avg. CSAT Score', value: 4.9, prefix: '', suffix: '/5', display: '4.9/5', description: 'Member satisfaction rating' },
  { label: 'Cost Savings', value: 40, prefix: 'Up to ', suffix: '% ROI', display: 'Up to 40%', description: 'Reduction in maternal healthcare costs' },
];

router.get('/', async (_req, res) => {
  try {
    const metrics = await Metric.find({});
    if (metrics.length === 0) throw new Error('empty');
    res.json(metrics);
  } catch {
    res.json(MOCK_METRICS);
  }
});

export default router;
