const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const umkmRoutes = require('./routes/umkmRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const goalRoutes = require('./routes/goalRoutes');
const budgetRoutes = require('./routes/budgetRoutes');
const reportRoutes = require('./routes/reportRoutes');
const anomalyRoutes = require('./routes/anomalyRoutes');
const chatRoutes = require('./routes/chatRoutes');
const forecastRoutes = require('./routes/forecastRoutes');
const aiModelRoutes = require('./routes/aiModelRoutes');
const productRoutes = require('./routes/productRoutes');
const stockLogRoutes = require('./routes/stockLogRoutes');
const debtRoutes = require('./routes/debtRoutes');
const voiceRoutes = require('./routes/voiceRoutes');

const app = express();
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:5174'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log(`[Express] ${req.method} ${req.url}`);
  next();
});
app.use('/api/auth', authRoutes);
app.use('/api/umkm', umkmRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/goals', goalRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/anomalies', anomalyRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/forecasts', forecastRoutes);
app.use('/api/ai-models', aiModelRoutes);
app.use('/api/products', productRoutes);
app.use('/api/stock-logs', stockLogRoutes);
app.use('/api/debts', debtRoutes);
app.use('/api', voiceRoutes);

app.get('/api/health', (req, res) => res.json({ status: 'OK' }));

module.exports = app;
