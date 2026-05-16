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
    path: '/notifications',
    route: notificationRoutes,
  },
]

apiRoutes.forEach(route => router.use(route.path, route.route));

export default router;
