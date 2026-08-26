require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cron = require('node-cron');

const connectDB = require('./config/db');
const { runMarketSync } = require('./jobs/marketDataSync');

const authRoutes = require('./routes/authRoutes');
const marketRoutes = require('./routes/marketRoutes');
const listingRoutes = require('./routes/listingRoutes');
const requirementRoutes = require('./routes/requirementRoutes');
const orderRoutes = require('./routes/orderRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();

app.use(
  cors({
    origin: (process.env.CORS_ORIGIN || 'http://localhost:5173').split(','),
  })
);
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok', time: new Date().toISOString() }));

app.use('/api/auth', authRoutes);
app.use('/api/market', marketRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/requirements', requirementRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/notifications', notificationRoutes);

// Catch-all error handler so a thrown error returns clean JSON instead of crashing the process
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.', details: err.message });
});

const PORT = process.env.PORT || 5000;

async function start() {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`KisanMitra API running on http://localhost:${PORT}`);
  });

  // Run once at startup so you have data immediately, then on the configured schedule.
  runMarketSync().catch((err) => console.error('Initial market sync failed:', err.message));

  const schedule = process.env.MARKET_SYNC_CRON || '*/30 * * * *';
  cron.schedule(schedule, () => {
    runMarketSync().catch((err) => console.error('Scheduled market sync failed:', err.message));
  });
  console.log(`Market data sync scheduled: "${schedule}"`);
}

start();
