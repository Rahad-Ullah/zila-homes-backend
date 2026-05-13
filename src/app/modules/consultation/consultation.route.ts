import express from 'express';
import { ConsultationController } from './consultation.controller';
import { ConsultationValidations } from './consultation.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

// create consultation route
router.post(
    '/create',
    validateRequest(ConsultationValidations.createConsultationValidation),
    ConsultationController.createConsultation
);

// update consultation route
router.patch(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(ConsultationValidations.updateConsultationValidation),
    ConsultationController.updateConsultation
);

// delete consultation route
router.delete(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(ConsultationValidations.deleteConsultationValidation),
    ConsultationController.deleteConsultation
);

// get consultation by id route
router.get(
    '/:id',
    auth(UserRole.Customer, UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(ConsultationValidations.getSingleConsultationValidation),
    ConsultationController.getConsultationById
);

// get all consultations route
router.get(
    '/',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    ConsultationController.getAllConsultations
);

export const consultationRoutes = router;