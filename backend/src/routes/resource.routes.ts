import { Router } from 'express';
import { resourceController } from '../controllers/resource.controller';

const router = Router();

router.get('/', resourceController.getAllResources);
router.post('/:id/dispatch', resourceController.dispatchResource);
router.patch('/:id/status', resourceController.updateResourceStatus);

export const resourceRouter = router;
