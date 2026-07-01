import express from 'express';
import { AuthRoutes } from '../app/modules/auth/auth.route';
import { UserRoutes } from '../app/modules/user/user.route';
import { notificationRoutes } from '../app/modules/notification/notification.route';
import { PropertyRoutes } from '../app/modules/property/property.route';
import { inquiryRoutes } from '../app/modules/inquiry/inquiry.route';
import { reservationRoutes } from '../app/modules/reservation/reservation.route';
import { rideRoutes } from '../app/modules/ride/ride.route';
import { consultationRoutes } from '../app/modules/consultation/consultation.route';
import { wishlistRoutes } from '../app/modules/wishlist/wishlist.route';
import { reviewRoutes } from '../app/modules/review/review.route';
import { blogRoutes } from '../app/modules/blog/blog.route';
import { newsletterRoutes } from '../app/modules/newsletter/newsletter.route';
import { disclaimerRoutes } from '../app/modules/disclaimer/disclaimer.route';
import { settingRoutes } from '../app/modules/setting/setting.route';
import { transactionRoutes } from '../app/modules/transaction/transaction.route';
import { advertisementRoutes } from '../app/modules/advertisement/advertisement.route';
import { analyticsRoutes } from '../app/modules/analytics/analytics.route';
import { adminRoutes } from '../app/modules/admin/admin.route';
const router = express.Router();

const apiRoutes: { path: string; route: any }[] = [
  {
    path: '/users',
    route: UserRoutes,
  },
  {
    path: '/admins',
    route: adminRoutes,
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
    path: '/inquiries',
    route: inquiryRoutes,
  },
  {
    path: '/reservations',
    route: reservationRoutes,
  },
  {
    path: '/rides',
    route: rideRoutes,
  },
  {
    path: '/consultations',
    route: consultationRoutes,
  },
  {
    path: '/transactions',
    route: transactionRoutes,
  },
  {
    path: '/wishlists',
    route: wishlistRoutes,
  },
  {
    path: '/reviews',
    route: reviewRoutes,
  },
  {
    path: '/blogs',
    route: blogRoutes,
  },
  {
    path: '/newsletters',
    route: newsletterRoutes,
  },
  {
    path: '/advertisements',
    route: advertisementRoutes,
  },
  {
    path: '/notifications',
    route: notificationRoutes,
  },
  {
    path: '/disclaimers',
    route: disclaimerRoutes,
  },
  {
    path: '/settings',
    route: settingRoutes,
  },
  {
    path: '/analytics',
    route: analyticsRoutes,
  },
];

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
