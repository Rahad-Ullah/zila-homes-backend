import express from 'express';
import { PropertyController } from './property.controller';

const router = express.Router();

router.get('/', PropertyController);

export const propertyRoutes = router;