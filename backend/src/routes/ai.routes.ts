import { Router } from 'express';
import { aiController } from '../controllers/ai.controller';

const router = Router();

router.get('/predict/:disasterId', aiController.getPrediction);
router.post('/simulate/:disasterId', aiController.runSimulation);

export const aiRouter = router;
