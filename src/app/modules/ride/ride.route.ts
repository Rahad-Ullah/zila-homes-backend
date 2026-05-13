import express from 'express';
import { RideController } from './ride.controller';

const router = express.Router();

router.get('/', RideController);

export const rideRoutes = router;