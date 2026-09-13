import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/authRoutes.js';
import groupRoutes from './routes/groupRoutes.js';
import resourceRoutes from './routes/resourceRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import { startBackgroundJobs } from './services/backgroundJobs.js';

dotenv.config({ path: './server/.env' });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/groups', groupRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/reports', reportRoutes);

app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'UniConnect',
    time: new Date().toISOString(),
    concepts: ['API Endpoints', 'Database', 'Authentication', 'Background Jobs', 'Reporting - PDF', 'Caching Logic', 'Test Suite']
  });
});

// Serve static frontend in production
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

app.use(express.static(distPath));
app.get('{*path}', (req, res, next) => {
  if (req.url.startsWith('/api')) return next();
  res.sendFile(path.join(distPath, 'index.html'), (err) => {
    if (err) {
      res.send('UniConnect API is running...');
    }
  });
});

// Start background jobs runner
startBackgroundJobs();

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`UniConnect API Server running on port ${PORT}`);
  });
}

export default app;
