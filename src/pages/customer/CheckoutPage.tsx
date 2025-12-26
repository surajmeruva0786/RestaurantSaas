import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useData } from '../../contexts/DataContext';

export default function CheckoutPage() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { addOrder, settings } = useData();

  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    orderType: 'dine-in' as 'dine-in' | 'takeaway',
    tableNumber: '',
    notes: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [orderId, setOrderId] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const order = {
      items: items.map(item => ({
        id: item.id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
      })),
      customerName: formData.customerName,
      customerPhone: formData.customerPhone,
      orderType: formData.orderType,
      tableNumber: formData.orderType === 'dine-in' ? formData.tableNumber : undefined,
      notes: formData.notes || undefined,
      total: totalPrice,
      status: 'new' as const,
    };

    addOrder(order);
    const newOrderId = `ORD${Date.now().toString().slice(-6)}`;
    setOrderId(newOrderId);
    setSubmitted(true);
    clearCart();
  };

  if (items.length === 0 && !submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <Link
            to={`/r/${slug}/menu`}
            className="inline-block bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg p-8 text-center max-w-md">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-gray-900 mb-2">Order Placed Successfully!</h2>
          <p className="text-gray-600 mb-6">Order ID: {orderId}</p>
          <p className="text-gray-700 mb-6">
            Thank you for your order! We'll get started on it right away.
          </p>
          <div className="space-y-3">
            <Link
              to={`/r/${slug}/menu`}
              className="block w-full bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Order More
            </Link>
            <Link
              to={`/r/${slug}`}
              className="block w-full bg-gray-100 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={`/r/${slug}/menu`} className="text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <h1 className="text-gray-900">Checkout</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Order Summary */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-gray-900 mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-700">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-gray-900">₹{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 flex justify-between">
            <span className="text-gray-900">Total</span>
            <span className="text-gray-900">₹{totalPrice}</span>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg p-6">
          <h2 className="text-gray-900 mb-4">Your Details</h2>

          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-gray-700 mb-2">
                Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={formData.customerName}
                onChange={e =>
                  setFormData({ ...formData, customerName: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter your name"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-gray-700 mb-2">
                Mobile Number *
              </label>
              <input
                id="phone"
                type="tel"
                required
                value={formData.customerPhone}
                onChange={e =>
                  setFormData({ ...formData, customerPhone: e.target.value })
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Enter mobile number"
              />
            </div>

            <div>
              <label className="block text-gray-700 mb-2">Order Type *</label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, orderType: 'dine-in' })}
                  className={`px-4 py-3 border rounded-lg transition-colors ${
                    formData.orderType === 'dine-in'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Dine-in
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, orderType: 'takeaway', tableNumber: '' })
                  }
                  className={`px-4 py-3 border rounded-lg transition-colors ${
                    formData.orderType === 'takeaway'
                      ? 'border-orange-500 bg-orange-50 text-orange-600'
                      : 'border-gray-300 text-gray-700 hover:border-gray-400'
                  }`}
                >
                  Takeaway
                </button>
              </div>
            </div>

            {formData.orderType === 'dine-in' && (
              <div>
                <label htmlFor="table" className="block text-gray-700 mb-2">
                  Table Number *
                </label>
                <input
                  id="table"
                  type="text"
                  required
                  value={formData.tableNumber}
                  onChange={e =>
                    setFormData({ ...formData, tableNumber: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="Enter table number"
                />
              </div>
            )}

            <div>
              <label htmlFor="notes" className="block text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                id="notes"
                rows={3}
                value={formData.notes}
                onChange={e => setFormData({ ...formData, notes: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                placeholder="Any special requests?"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Place Order - ₹{totalPrice}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
