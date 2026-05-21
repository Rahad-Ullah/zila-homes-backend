import express from 'express';
import { AdvertisementController } from './advertisement.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';
import validateRequest from '../../middlewares/validateRequest';
import { AdvertisementValidations } from './advertisement.validation';
import fileUploadHandler from '../../middlewares/fileUploadHandler';

const router = express.Router();

// create advertisement
router.post(
    '/create',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    fileUploadHandler(),
    validateRequest(AdvertisementValidations.createAdvertisementValidation),
    AdvertisementController.createAdvertisement,
);

// update advertisement
router.patch(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    fileUploadHandler(),
    validateRequest(AdvertisementValidations.updateAdvertisementValidation),
    AdvertisementController.updateAdvertisement,
);

// delete advertisement
router.delete(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    AdvertisementController.deleteAdvertisement,
);

// get all advertisements
router.get(
    '/',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    AdvertisementController.getAllAdvertisements,
);

// get active advertisements
router.get('/active', AdvertisementController.getActiveAdvertisements);

export const advertisementRoutes = router;
