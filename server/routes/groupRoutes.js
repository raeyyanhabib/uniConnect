import express from 'express';
import { getGroups, createGroup, joinGroup, addAnnouncement } from '../controllers/groupController.js';
import { authenticateToken } from '../middleware/auth.js';
import { cacheMiddleware } from '../middleware/cache.js';

const router = express.Router();

router.get('/', cacheMiddleware(30), getGroups);
router.post('/', authenticateToken, createGroup);
router.post('/:id/join', authenticateToken, joinGroup);
router.post('/:id/announcements', authenticateToken, addAnnouncement);

export default router;
