import { Router } from 'express';
import { disasterController } from '../controllers/disaster.controller';

const router = Router();

router.get('/', disasterController.getAllDisasters);
router.get('/:id', disasterController.getDisasterById);
router.post('/', disasterController.createDisaster);
router.put('/:id', disasterController.updateDisaster);

export const disasterRouter = router;
