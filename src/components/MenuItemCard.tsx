import { Plus, Minus } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { MenuItem } from '../contexts/DataContext';
import { useState } from 'react';

interface MenuItemCardProps {
  item: MenuItem;
}

export default function MenuItemCard({ item }: MenuItemCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const cartItem = items.find(i => i.id === item.id);
  const [imageError, setImageError] = useState(false);

  const handleAdd = () => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      isVeg: item.isVeg,
    });
  };

  const handleIncrement = () => {
    if (cartItem) {
      updateQuantity(item.id, cartItem.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (cartItem) {
      updateQuantity(item.id, cartItem.quantity - 1);
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
      <div className="flex gap-4">
        {/* Content */}
        <div className="flex-1">
          {/* Veg/Non-veg indicator */}
          <div
            className={`inline-flex w-5 h-5 border-2 ${
              item.isVeg ? 'border-green-600' : 'border-red-600'
            } rounded-sm items-center justify-center mb-2`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                item.isVeg ? 'bg-green-600' : 'bg-red-600'
              }`}
            />
          </div>

          <h3 className="text-gray-900 mb-1">{item.name}</h3>
          <p className="text-gray-600 text-sm mb-3">{item.description}</p>
          <p className="text-gray-900">₹{item.price}</p>

          {/* Add to cart button */}
          {!item.isAvailable ? (
            <button
              disabled
              className="mt-3 px-4 py-2 bg-gray-100 text-gray-400 rounded-lg cursor-not-allowed text-sm"
            >
              Not Available
            </button>
          ) : cartItem ? (
            <div className="mt-3 inline-flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">
              <button
                onClick={handleDecrement}
                className="text-orange-600 hover:bg-orange-100 rounded p-1"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-orange-600 min-w-[20px] text-center">
                {cartItem.quantity}
              </span>
              <button
                onClick={handleIncrement}
                className="text-orange-600 hover:bg-orange-100 rounded p-1"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={handleAdd}
              className="mt-3 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add
            </button>
          )}
        </div>

        {/* Image */}
        {item.image && !imageError && (
          <div className="w-24 h-24 flex-shrink-0">
            <img
              src={item.image}
              alt={item.name}
              onError={() => setImageError(true)}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
}
