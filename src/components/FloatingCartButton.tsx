import { ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

export default function FloatingCartButton() {
  const { totalItems, openCart } = useCart();

  if (totalItems === 0) return null;

  return (
    <button
      onClick={openCart}
      className="fixed bottom-20 md:bottom-6 right-6 bg-orange-500 text-white p-4 rounded-full shadow-lg hover:bg-orange-600 transition-all z-30 flex items-center justify-center"
    >
      <ShoppingBag className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </button>
  );
}
