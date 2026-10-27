import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { config } from './config/env';
import { connectDatabase } from './config/database';
import { apiRouter } from './routes';
import { errorHandlerMiddleware } from './middleware/errorHandler.middleware';
import { rateLimiterMiddleware } from './middleware/rateLimiter.middleware';
import { logger } from './utils/logger';

const app = express();

// Security and utility middleware
app.use(helmet());
app.use(
  cors({
    origin: config.clientUrl,
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use(rateLimiterMiddleware);

// Mount Tactical API Routes
app.use('/api', apiRouter);

// Global Error Handler
app.use(errorHandlerMiddleware);

// Start server and initialize MongoDB Atlas connection
async function startServer() {
  await connectDatabase();

  app.listen(config.port, () => {
    logger.info(`Enterprise Disaster Command Server active on port ${config.port}`);
    logger.info(`Environment: ${config.nodeEnv}`);
    logger.info(`Health check: http://localhost:${config.port}/api/health`);
  });
}

startServer();

export default app;
