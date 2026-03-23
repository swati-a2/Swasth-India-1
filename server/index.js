import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import providersRouter from './routes/providers.js';
import metricsRouter from './routes/metrics.js';
import calculatorRouter from './routes/calculator.js';
import leadsRouter from './routes/leads.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/swasth_india';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

app.use('/api/providers', providersRouter);
app.use('/api/metrics', metricsRouter);
app.use('/api/calculator', calculatorRouter);
app.use('/api/leads', leadsRouter);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected:', MONGO_URI);
    app.listen(PORT, () => console.log(`🚀 Swasth India API running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('⚠️  Starting server without DB (using mock data mode)...');
    app.listen(PORT, () => console.log(`🚀 Server running (no-DB mode) on http://localhost:${PORT}`));
  });
