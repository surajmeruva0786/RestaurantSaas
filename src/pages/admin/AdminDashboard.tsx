import { useData } from '../../contexts/DataContext';
import { ShoppingBag, Calendar, MessageSquare, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  const { orders, reservations, feedbacks, settings } = useData();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(
    order => order.createdAt.split('T')[0] === today
  );
  const pendingOrders = orders.filter(order => order.status === 'new');
  const todayReservations = reservations.filter(
    res => res.date === today && res.status !== 'cancelled'
  );
  const todayRevenue = todayOrders.reduce((sum, order) => sum + order.total, 0);

  const stats = [
    {
      label: "Today's Orders",
      value: todayOrders.length,
      icon: ShoppingBag,
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/orders',
    },
    {
      label: 'Pending Orders',
      value: pendingOrders.length,
      icon: ShoppingBag,
      color: 'bg-orange-50 text-orange-600',
      link: '/admin/orders',
    },
    {
      label: "Today's Reservations",
      value: todayReservations.length,
      icon: Calendar,
      color: 'bg-green-50 text-green-600',
      link: '/admin/reservations',
    },
    {
      label: "Today's Revenue",
      value: `₹${todayRevenue}`,
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
      link: '/admin/orders',
    },
  ];

  const recentOrders = orders.slice(0, 5);
  const recentFeedbacks = feedbacks.slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-gray-900 mb-2">Welcome back!</h1>
        <p className="text-gray-600">Here's what's happening with {settings.name} today</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link
              key={index}
              to={stat.link}
              className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-lg ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-gray-900 text-2xl">{stat.value}</p>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">Recent Orders</h2>
            <Link to="/admin/orders" className="text-orange-600 hover:text-orange-700 text-sm">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentOrders.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No orders yet</div>
            ) : (
              recentOrders.map(order => (
                <div key={order.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-gray-900">{order.customerName}</p>
                      <p className="text-gray-600 text-sm">
                        {order.items.length} items • ₹{order.total}
                      </p>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${
                        order.status === 'new'
                          ? 'bg-orange-100 text-orange-700'
                          : order.status === 'preparing'
                          ? 'bg-blue-100 text-blue-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {new Date(order.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recent Feedback */}
        <div className="bg-white rounded-lg border border-gray-200">
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-gray-900">Recent Feedback</h2>
            <Link to="/admin/feedback" className="text-orange-600 hover:text-orange-700 text-sm">
              View All →
            </Link>
          </div>
          <div className="divide-y divide-gray-200">
            {recentFeedbacks.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No feedback yet</div>
            ) : (
              recentFeedbacks.map(feedback => (
                <div key={feedback.id} className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[...Array(5)].map((_, i) => (
                            <span
                              key={i}
                              className={`text-sm ${
                                i < feedback.rating ? 'text-orange-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          ))}
                        </div>
                        {feedback.customerName && (
                          <span className="text-gray-700 text-sm">{feedback.customerName}</span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{feedback.comment}</p>
                    </div>
                  </div>
                  <p className="text-gray-500 text-xs">
                    {new Date(feedback.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
