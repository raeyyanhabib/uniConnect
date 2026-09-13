import express from 'express';
import { generatePdfReport } from '../controllers/reportController.js';

const router = express.Router();

router.get('/pdf', generatePdfReport);

export default router;
