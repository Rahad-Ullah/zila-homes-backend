import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { notificationRoutes } from '../app/modules/notification/notification.route';
import { PropertyRoutes } from '../app/modules/property/property.route';
const router = express.Router();

const apiRoutes: { path: string; route: any }[] = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/auth',
    route: AuthRoutes,
  },
  {
    path: '/properties',
    route: PropertyRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
]

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
