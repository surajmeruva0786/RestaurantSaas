import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Clock, User, Phone, MapPin, StickyNote } from 'lucide-react';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useData();
  const [filter, setFilter] = useState<'all' | 'new' | 'preparing' | 'completed'>('all');

  const filteredOrders =
    filter === 'all' ? orders : orders.filter(order => order.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-700 border-green-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Orders</h1>
        <div className="flex items-center gap-2">
          <span className="text-gray-600 text-sm">Filter:</span>
          <select
            value={filter}
            onChange={e => setFilter(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-sm"
          >
            <option value="all">All Orders</option>
            <option value="new">New</option>
            <option value="preparing">Preparing</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No orders found</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredOrders.map(order => (
            <div
              key={order.id}
              className={`bg-white rounded-lg border-2 ${
                order.status === 'new' ? 'border-orange-300' : 'border-gray-200'
              } overflow-hidden`}
            >
              {/* Header */}
              <div className="bg-gray-50 px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div>
                    <p className="text-gray-900">Order #{order.id}</p>
                    <p className="text-gray-600 text-sm flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(order.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <select
                  value={order.status}
                  onChange={e =>
                    updateOrderStatus(order.id, e.target.value as any)
                  }
                  className={`px-4 py-2 border rounded-lg outline-none text-sm ${getStatusColor(
                    order.status
                  )}`}
                >
                  <option value="new">New</option>
                  <option value="preparing">Preparing</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Customer Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-gray-700">
                      <User className="w-4 h-4 text-gray-400" />
                      <span>{order.customerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span>{order.customerPhone}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-700">
                      <MapPin className="w-4 h-4 text-gray-400" />
                      <span className="capitalize">{order.orderType}</span>
                      {order.tableNumber && (
                        <span className="text-gray-600">• Table {order.tableNumber}</span>
                      )}
                    </div>
                    {order.notes && (
                      <div className="flex items-start gap-2 text-gray-700">
                        <StickyNote className="w-4 h-4 text-gray-400 mt-0.5" />
                        <span className="text-sm">{order.notes}</span>
                      </div>
                    )}
                  </div>

                  {/* Order Items */}
                  <div>
                    <p className="text-gray-900 mb-3">Items:</p>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between text-sm bg-gray-50 p-2 rounded"
                        >
                          <span className="text-gray-700">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      ))}
                      <div className="flex justify-between pt-2 border-t border-gray-200">
                        <span className="text-gray-900">Total</span>
                        <span className="text-gray-900">₹{order.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
