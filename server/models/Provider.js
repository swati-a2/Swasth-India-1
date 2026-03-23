import mongoose from 'mongoose';

const providerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  sub: { type: String, default: '' },
  location: { type: String, default: 'Remote & In-Person' },
  rating: { type: Number, default: 4.8, min: 0, max: 5 },
  reviews: { type: Number, default: 0 },
  yearsExp: { type: Number, default: 5 },
  avatar: { type: String, default: '' },
  bio: { type: String, default: '' },
  available: { type: Boolean, default: true },
  tags: [String],
}, { timestamps: true });

export default mongoose.model('Provider', providerSchema);
