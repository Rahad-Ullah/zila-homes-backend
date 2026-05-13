import express from 'express';
import { ReservationController } from './reservation.controller';

const router = express.Router();

router.get('/', ReservationController);

export const reservationRoutes = router;