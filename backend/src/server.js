const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');

const config = require('./config/env');
const prisma = require('./config/prisma');
const { ensurePostgresRunning } = require('./config/embeddedDb');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');

// Route Imports
const healthRouter = require('./routes/health');
const servicesRouter = require('./routes/services');
const projectsRouter = require('./routes/projects');
const inquiriesRouter = require('./routes/inquiries');
const contactRouter = require('./routes/contact');
const testimonialsRouter = require('./routes/testimonials');
const businessRouter = require('./routes/business');
const socialRouter = require('./routes/social');
const adminRouter = require('./routes/admin');

const app = express();

// 1. Security HTTP Headers
app.use(
  helmet({
    contentSecurityPolicy: false, // Allows flexible asset loading for the static frontend
    crossOriginEmbedderPolicy: false,
  })
);

// 2. CORS Configuration
const allowedOrigins = [
  config.frontendUrl,
  'http://localhost:8080',
  'http://127.0.0.1:8080',
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, or same-origin)
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(null, true); // Permissive in development
    },
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// 3. Rate Limiter (Protects public API against brute-force & spam)
const apiLimiter = rateLimit({
  windowMs: config.rateLimitWindowMs,
  max: config.rateLimitMax,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
});

app.use('/api/', apiLimiter);

// 4. Request Parsing with payload limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// 5. Public Static Frontend Assets
const frontendPath = path.resolve(__dirname, '../../frontend');
app.use(express.static(frontendPath));

// 6. Mount API Routes
app.use('/api/health', healthRouter);
app.use('/api/services', servicesRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/inquiries', inquiriesRouter);
app.use('/api/contact', contactRouter);
app.use('/api/testimonials', testimonialsRouter);
app.use('/api/business', businessRouter);
app.use('/api/social-links', socialRouter);
app.use('/api/admin', adminRouter);

// 7. Fallback to Frontend index.html for non-API client routes
app.get('*', (req, res, next) => {
  if (req.originalUrl.startsWith('/api/')) {
    return next();
  }
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// 8. 404 & Centralized Error Handlers
app.use('/api/*', notFoundHandler);
app.use(errorHandler);

// 9. Server Initialization with Database Pre-flight Check
async function startServer() {
  try {
    // Ensure PostgreSQL instance is available
    await ensurePostgresRunning();

    // Verify Prisma database connectivity
    await prisma.$connect();
    console.log('[Database] Successfully connected to PostgreSQL via Prisma.');

    const server = app.listen(config.port, () => {
      console.log('==================================================');
      console.log(`  PIRO WOODY CONCEPTS — PRODUCTION BACKEND`);
      console.log(`  Running on: http://localhost:${config.port}`);
      console.log(`  Health Check: http://localhost:${config.port}/api/health`);
      console.log(`  Frontend: http://localhost:${config.port}`);
      console.log(`  Environment: ${config.nodeEnv}`);
      console.log('==================================================');
    });

    // Graceful Shutdown
    const shutdown = async (signal) => {
      console.log(`\n[Server] Received ${signal}. Gracefully shutting down...`);
      server.close(async () => {
        await prisma.$disconnect();
        console.log('[Database] Prisma disconnected.');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } catch (error) {
    console.error('[Server Error] Failed to start backend server:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  startServer();
}

module.exports = { app, startServer };
