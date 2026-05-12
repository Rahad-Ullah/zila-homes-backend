import express from 'express';
import { PropertyController } from './property.controller';
import { PropertyValidations } from './property.validation';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// create accommodation
router.post(
    '/accommodation/create',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    fileUploadHandler(),
    validateRequest(PropertyValidations.createAccommodationSchema),
    PropertyController.createAccommodation,
);

// update accommodation
router.patch(
    '/accommodation/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    fileUploadHandler(),
    validateRequest(PropertyValidations.updatePropertySchema),
    PropertyController.updateAccommodation,
);

// create listing
router.post(
    '/listing/create',
    auth(UserRole.Host),
    fileUploadHandler(),
    validateRequest(PropertyValidations.createListingSchema),
    PropertyController.createListing,
);

export const PropertyRoutes = router;