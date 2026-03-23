import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  message: { type: String, default: '' },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Lead', leadSchema);
