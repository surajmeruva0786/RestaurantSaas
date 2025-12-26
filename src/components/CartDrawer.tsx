import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useNavigate, useParams } from 'react-router-dom';

export default function CartDrawer() {
  const { items, updateQuantity, totalPrice, isOpen, closeCart } = useCart();
  const navigate = useNavigate();
  const { slug } = useParams();

  const handleCheckout = () => {
    closeCart();
    navigate(`/r/${slug}/checkout`);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-gray-900 flex items-center gap-2">
            <ShoppingBag className="w-5 h-5" />
            Your Cart ({items.length})
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-500 hover:text-gray-700 p-2"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map(item => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  {/* Veg/Non-veg indicator */}
                  <div
                    className={`w-5 h-5 border-2 ${
                      item.isVeg ? 'border-green-600' : 'border-red-600'
                    } rounded-sm flex items-center justify-center flex-shrink-0 mt-1`}
                  >
                    <div
                      className={`w-2.5 h-2.5 rounded-full ${
                        item.isVeg ? 'bg-green-600' : 'bg-red-600'
                      }`}
                    />
                  </div>

                  {/* Item details */}
                  <div className="flex-1">
                    <h3 className="text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">₹{item.price}</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-2 py-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="text-gray-600 hover:text-orange-600 p-1"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-gray-900 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="text-gray-600 hover:text-orange-600 p-1"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Item total */}
                  <div className="text-gray-900 min-w-[60px] text-right">
                    ₹{item.price * item.quantity}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-900">Total</span>
              <span className="text-gray-900">₹{totalPrice}</span>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full bg-orange-500 text-white py-3 rounded-lg hover:bg-orange-600 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}
