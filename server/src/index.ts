import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import mongoose from 'mongoose';
import { connectDb } from './db';
import healthRouter from './routes/health';
import agoraRouter from './routes/agora';
import actionsRouter from './routes/actions';
import medicationsRouter from './routes/medications';
import rewardsRouter from './routes/rewards';
import pushRouter from './routes/push';
import authRouter from './routes/auth';
import { rescheduleAll } from './push';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Parse JSON bodies
app.use(express.json());

// CORS allowlist from environment (comma-separated). Defaults to localhost:3000 and the Vercel URL.
const defaultOrigins = 'http://localhost:3000,https://hospital-kohl-ten.vercel.app';
const allowedOrigins = (process.env.CORS_ORIGINS || defaultOrigins)
  .split(',')
  .map((s) => s.trim())
  .filter(Boolean);

const corsOptions: cors.CorsOptions = {
  origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
    // allow requests with no origin (e.g., curl, server-to-server)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
};

app.use(cors(corsOptions));

// Routes
app.use('/health', healthRouter);
app.use('/agora', agoraRouter);
app.use('/actions', actionsRouter);
app.use('/medications', medicationsRouter);
app.use('/rewards', rewardsRouter);
  app.use('/push', pushRouter);
  app.use('/auth', authRouter);

const MONGO_URI = process.env.MONGO_URI || '';

async function start() {
  try {
    if (!MONGO_URI) {
      console.warn('MONGO_URI not set. Skipping MongoDB connection.');
    } else {
      // Connect to MongoDB via mongoose
      await mongoose.connect(MONGO_URI, {
        // options can be added here if desired
      });
      console.log('Connected to MongoDB');

      mongoose.connection.on('error', (err: any) => {
        console.error('MongoDB connection error:', err);
      });
    }

    await connectDb();
    // reschedule any notifications for medications
    try {
      await rescheduleAll()
    } catch (e) {
      console.warn('Reschedule on startup failed', e)
    }
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
}

start();

export default app;
