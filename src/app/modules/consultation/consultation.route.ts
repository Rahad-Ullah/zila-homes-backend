import express from 'express';
import { ConsultationController } from './consultation.controller';

const router = express.Router();

router.get('/', ConsultationController);

export const consultationRoutes = router;