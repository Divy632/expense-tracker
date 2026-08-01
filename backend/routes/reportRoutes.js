import express from 'express';
import { getSummary, getTrend, getCategoryBreakdown } from '../controllers/reportController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.get('/summary', getSummary);
router.get('/trend', getTrend);
router.get('/category-breakdown', getCategoryBreakdown);

export default router;
