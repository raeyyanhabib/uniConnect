import express from 'express';
import { getResources, createResource, requestBorrow } from '../controllers/resourceController.js';
import { authenticateToken } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(30), getResources);
router.post('/', authenticateToken, createResource);
router.post('/:id/borrow', authenticateToken, requestBorrow);

export default router;
