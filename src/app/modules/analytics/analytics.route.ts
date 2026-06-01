import express from 'express';
import { AnalyticsController } from './analytics.controller';

const router = express.Router();

// get admin overview
router.get('/overview/admin', AnalyticsController.getAdminOverview);

export const analyticsRoutes = router;