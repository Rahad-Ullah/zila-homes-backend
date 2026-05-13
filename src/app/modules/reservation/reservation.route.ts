import express from 'express';
import { ReservationController } from './reservation.controller';
import { ReservationValidations } from './reservation.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

// create reservation
router.post(
    '/create',
    auth(UserRole.Customer),
    validateRequest(ReservationValidations.createReservationValidation),
    ReservationController.createReservation,
);

// update reservation
router.patch(
    '/:id',
    auth(UserRole.Host, UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(ReservationValidations.updateReservationValidation),
    ReservationController.updateReservation,
);

// delete reservation
router.delete(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(ReservationValidations.deleteReservationValidation),
    ReservationController.deleteReservation,
);

// get reservation by id
router.get(
    '/:id',
    auth(UserRole.Customer, UserRole.Host, UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(ReservationValidations.getReservationByIdValidation),
    ReservationController.getReservationById,
);

// get all reservations
router.get(
    '/',
    auth(UserRole.Customer, UserRole.Host, UserRole.Admin, UserRole.SuperAdmin),
    ReservationController.getAllReservations,
);

export const reservationRoutes = router;
