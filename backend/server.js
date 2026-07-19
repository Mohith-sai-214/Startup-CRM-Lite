import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import rateLimit from 'express-rate-limit';
import mongoSanitize from './middleware/mongoSanitize.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Import local configurations, routes, and custom error handler
import { connectDB } from './config/database.js';
import authRoutes from './routes/authRoutes.js';
import leadRoutes from './routes/leadRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Environment variables loading and validation
// Attempt to load from local backend/.env first, otherwise fallback to current directory
const localEnvPath = path.join(__dirname, '.env');
const envPath = fs.existsSync(localEnvPath) ? localEnvPath : path.join(process.cwd(), '.env');
dotenv.config({ path: envPath });

/**
 * Validates that all required environment configurations are loaded.
 * Prevents booting the application with incomplete settings in staging/production.
 */
const checkRequiredEnvVars = () => {
  const requiredVars = ['MONGODB_URI', 'JWT_SECRET', 'PORT'];
  const missingVars = [];

  requiredVars.forEach((varName) => {
    if (!process.env[varName]) {
      missingVars.push(varName);
    }
  });

  if (missingVars.length > 0) {
    console.error('CRITICAL ERROR: Missing configuration in environment files:');
    missingVars.forEach((v) => console.error(`  - ${v}`));
    process.exit(1);
  }
};

// Validate environment parameters before initiating database connections
checkRequiredEnvVars();

// Initialize the Express app
const app = express();

// 2. Establish connection to MongoDB Atlas
connectDB();

// 3. Security & Utility Middlewares Configuration
const NODE_ENV = process.env.NODE_ENV || 'development';

// A. Production CORS setup with dynamic allowed origins validation (Must run first for header inclusion)
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'https://your-app.vercel.app'
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin, matched origins, or localhost origins during development
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (NODE_ENV === 'development' && origin.startsWith('http://localhost:'))
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true
  })
);

// B. Global HTTP security headers integration
app.use(helmet());

// C. General & Auth specific Rate Limiters to defend against DDoS/Brute-force
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 100, // Limit each IP to 100 requests per window
  message: {
    success: false,
    message: 'Too many requests, please try again later.'
  }
});

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes window
  max: 10, // Limit each IP to 10 auth requests per window (brute-force defense)
  message: {
    success: false,
    message: 'Too many auth attempts.'
  }
});

app.use('/api/', generalLimiter);
app.use('/api/auth/', authLimiter);

// D. MongoDB Query Injection Protection (Sanitizes req.body, req.query, req.params)
app.use(mongoSanitize());

// E. Environment-dependent request logging formatting
if (NODE_ENV === 'production') {
  app.use(morgan('combined')); // Detailed Combined Apache format for production logs
} else {
  app.use(morgan('dev')); // Colorized development logging format
}

// F. Request body parsing constraints
app.use(express.json({ limit: '10kb' })); // Mitigate large payload memory starvation attacks
app.use(express.urlencoded({ extended: true }));

// 4. Route registration
app.use('/api/auth', authRoutes);
app.use('/api/leads', leadRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date()
  });
});

// Serve static assets in production mode
if (NODE_ENV === 'production') {
  const frontendDist = path.join(__dirname, '../dist');
  app.use(express.static(frontendDist));

  // Any non-API route serves index.html
  app.get('*', (req, res, next) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.resolve(frontendDist, 'index.html'));
    } else {
      next();
    }
  });
}

// Centralized error handler registered last (Must catch all downstream errors)
app.use(errorHandler);

// 5. Server initialization
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${NODE_ENV} mode`);
});

/**
 * Executes a clean server teardown closing MongoDB connections and listeners.
 * @param {string} signal - The process signal trigger (SIGINT / SIGTERM).
 */
const handleGracefulShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Server shutting down gracefully...`);

  server.close(async () => {
    console.log('Express HTTP connections closed.');
    try {
      await mongoose.connection.close();
      console.log('MongoDB Atlas connection closed.');
      process.exit(0);
    } catch (error) {
      console.error('Error during database connection closing:', error);
      process.exit(1);
    }
  });
};

// Wire OS signal listener callbacks
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));
process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));

export default app;
