import { User } from '../user/user.model';
import { Property } from '../property/property.model';
import { Reservation } from '../reservation/reservation.model';

// -------------- get admin overview --------------
const getAdminOverview = async () => {
  const totalUsers = await User.countDocuments();
  const totalProperties = await Property.countDocuments();
  const totalReservations = await Reservation.countDocuments();
  const totalRevenue = await Reservation.aggregate([
    {
      $match: {
        status: 'completed',
      },
    },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$totalPrice' },
      },
    },
  ]);
  return {
    totalUsers,
    totalProperties,
    totalReservations,
    totalRevenue: totalRevenue[0]?.totalRevenue || 0,
  };
};

export const AnalyticsServices = {
  getAdminOverview,
};