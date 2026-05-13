import express from 'express';
import { InquiryController } from './inquiry.controller';
import { InquiryValidations } from './inquiry.validation';
import validateRequest from '../../middlewares/validateRequest';
import auth from '../../middlewares/auth';
import { UserRole } from '../user/user.constant';

const router = express.Router();

// create inquiry
router.post(
    '/create',
    validateRequest(InquiryValidations.createInquiryValidation),
    InquiryController.createInquiry,
);

// update inquiry
router.patch(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(InquiryValidations.updateInquiryValidation),
    InquiryController.updateInquiry,
);

// delete inquiry
router.delete(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(InquiryValidations.getInquiryByIdValidation),
    InquiryController.deleteInquiry,
);

// get inquiry by id
router.get(
    '/:id',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    validateRequest(InquiryValidations.getInquiryByIdValidation),
    InquiryController.getInquiryById,
);

// get all inquiries
router.get(
    '/',
    auth(UserRole.Admin, UserRole.SuperAdmin),
    InquiryController.getAllInquiries,
);

export const inquiryRoutes = router;