import express from 'express';
import { InquiryController } from './inquiry.controller';

const router = express.Router();

router.get('/', InquiryController);

export const inquiryRoutes = router;