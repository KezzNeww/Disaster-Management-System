import { Router } from 'express';
import { disasterRouter } from './disaster.routes';
import { incidentRouter } from './incident.routes';
import { aiRouter } from './ai.routes';
import { resourceRouter } from './resource.routes';
import { alertRouter } from './alert.routes';

const router = Router();

// Tactical API Sub-Routers
router.use('/disasters', disasterRouter);
router.use('/incidents', incidentRouter);
router.use('/ai', aiRouter);
router.use('/resources', resourceRouter);
router.use('/alerts', alertRouter);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.json({
    status: 'OPTIMAL',
    timestamp: new Date().toISOString(),
    service: 'AEGIS-DISASTER-COMMAND-API',
    uptime: process.uptime(),
  });
});

export const apiRouter = router;
