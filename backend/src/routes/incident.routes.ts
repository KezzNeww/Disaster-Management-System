import { Router } from 'express';
import { incidentController } from '../controllers/incident.controller';

const router = Router();

router.get('/', incidentController.getAllIncidents);
router.post('/', incidentController.logIncident);
router.patch('/:id/status', incidentController.updateIncidentStatus);

export const incidentRouter = router;
