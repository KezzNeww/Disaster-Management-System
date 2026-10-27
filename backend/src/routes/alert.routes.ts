import { Router } from 'express';
import { alertController } from '../controllers/alert.controller';

const router = Router();

router.get('/', alertController.getActiveAlerts);
router.post('/broadcast', alertController.broadcastAlert);

export const alertRouter = router;
