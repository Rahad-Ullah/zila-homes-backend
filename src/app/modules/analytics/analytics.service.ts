import { User } from '../user/user.model';
import { Property } from '../property/property.model';
import { Reservation } from '../reservation/reservation.model';

// -------------- get admin overview --------------
const getAdminOverview = async (query: Record<string, unknown>) => {
  const year = Number(query?.year) || new Date().getFullYear();

  const [
    totalUsers,
    userDistribution,
    totalProperties,
    totalReservations,
    totalRevenueResult,
    dbRevenueGrowth,
  ] = await Promise.all([
    User.countDocuments(),
    User.aggregate([
      {
        $match: {
          role: { $ne: 'super_admin' },
        },
      },
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
        },
      },
    ]),
    Property.countDocuments(),
    Reservation.countDocuments(),
    Reservation.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, totalRevenue: { $sum: '$pricing.total' } } },
    ]),
    Reservation.aggregate([
      {
        $match: {
          status: 'completed',
          createdAt: {
            $gte: new Date(year, 0, 1),
            $lt: new Date(year + 1, 0, 1),
          },
        },
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$pricing.total' },
        },
      },
    ]),
  ]);

  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  // create a map of the DB results for quick lookup [month_number: revenue]
  const revenueMap = new Map<number, number>(
    dbRevenueGrowth.map(item => [item._id, item.revenue]),
  );

  // generate the definitive 12-month array
  const revenueGrowth = monthNames.map((month, index) => {
    const monthNumber = index + 1;
    return {
      month,
      revenue: revenueMap.get(monthNumber) || 0,
    };
  });

  return {
    totalUsers,
    userDistribution,
    totalProperties,
    totalReservations,
    totalRevenue: totalRevenueResult[0]?.totalRevenue || 0,
    revenueGrowth,
  };
};

export const AnalyticsServices = {
  getAdminOverview,
};
