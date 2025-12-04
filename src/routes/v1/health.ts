import { Router } from 'express';
import { healthController } from '../../controllers/healthController';

const router = Router();

// Health check endpoint (no auth required)
router.get('/', healthController.check);

export default router;

