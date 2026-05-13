import express from 'express';
import { RideController } from './ride.controller';
import { RideValidations } from './ride.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

// create ride
router.post(
    '/create',
    validateRequest(RideValidations.createRideSchema),
    RideController.createRide,
);

// update ride
router.patch(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(RideValidations.updateRideSchema),
    RideController.updateRide,
);

// delete ride
router.delete(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(RideValidations.rideIdSchema),
    RideController.deleteRide,
);

// get ride by id
router.get(
    '/:id',
    auth(UserRole.Customer, UserRole.Driver, UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(RideValidations.rideIdSchema),
    RideController.getRideById,
);

// get all rides
router.get(
    '/',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    RideController.getAllRides,
);

export const rideRoutes = router;
