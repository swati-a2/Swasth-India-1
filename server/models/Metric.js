import mongoose from 'mongoose';

const metricSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: Number, required: true },
  unit: { type: String, default: '' },
  prefix: { type: String, default: '' },
  suffix: { type: String, default: '' },
  category: { type: String, default: 'impact' },
  description: { type: String, default: '' },
});

export default mongoose.model('Metric', metricSchema);
