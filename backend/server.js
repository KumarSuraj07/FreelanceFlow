const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const rateLimit = require('express-rate-limit');
const cron = require('node-cron');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const projectRoutes = require('./routes/projects');
const invoiceRoutes = require('./routes/invoices');
const noteRoutes = require('./routes/notes');
const { sendPaymentReminders } = require('./utils/emailService');

const app = express();

// Locked CORS — must be FIRST before helmet and everything else
const allowedOrigins = (process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:4173')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

console.log('Allowed origins:', allowedOrigins);

const corsOptions = {
  origin: (origin, callback) => {
    // allow server-to-server / curl (no origin header)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // handle preflight for all routes

// Security headers (after CORS so it doesn't interfere with preflight)
app.use(helmet({ crossOriginResourcePolicy: false }));

// Body parsing with size limit
app.use(express.json({ limit: '10kb' }));

// NoSQL injection sanitization
app.use(mongoSanitize());

// Rate limiters
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10, // max 10 login/signup attempts per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many auth attempts, please try again later.' },
});

app.use(globalLimiter);

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

// Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/invoices', invoiceRoutes);
app.use('/api/notes', noteRoutes);

// Global error handler — never leak internals
app.use((err, req, res, next) => {
  console.error(err.message);
  if (err.message?.startsWith('CORS blocked')) {
    return res.status(403).json({ message: 'CORS: origin not allowed' });
  }
  const status = err.status || 500;
  const message = status < 500 ? err.message : 'Internal server error';
  res.status(status).json({ message });
});

// Cron job for payment reminders (runs daily at 9 AM)
cron.schedule('0 9 * * *', () => {
  console.log('Running payment reminder job...');
  sendPaymentReminders();
});

// MongoDB connection with retry
const connectDB = async () => {
  const opts = { serverSelectionTimeoutMS: 5000 };
  try {
    await mongoose.connect(process.env.MONGODB_URI, opts);
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    setTimeout(connectDB, 5000); // retry after 5s
  }
};

mongoose.connection.on('disconnected', () => {
  console.warn('MongoDB disconnected — retrying...');
  setTimeout(connectDB, 5000);
});

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
