import { Router } from 'express';
import * as dashboardController from '../controllers/dashboard.controller';

const router = Router();

router.get('/metrics', dashboardController.getDashboardMetrics);
router.get('/recent-bookings', dashboardController.getRecentBookings);
router.get('/upcoming-photoshoots', dashboardController.getUpcomingPhotoshoots);

export default router;
