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
    '/create-accommodation',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    fileUploadHandler(),
    validateRequest(PropertyValidations.createAccommodationSchema),
    PropertyController.createAccommodation,
);

export const PropertyRoutes = router;