import { UtensilsCrossed, ShoppingBag, Phone, MessageCircle } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useData } from '../contexts/DataContext';

export default function MobileActionBar() {
  const { slug } = useParams();
  const { totalItems, openCart } = useCart();
  const { settings } = useData();

  const handleCall = () => {
    window.location.href = `tel:${settings.phone}`;
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${settings.whatsapp.replace(/[^0-9]/g, '')}`, '_blank');
  };

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
      <div className="grid grid-cols-4 gap-1 p-2">
        <Link
          to={`/r/${slug}/menu`}
          className="flex flex-col items-center gap-1 py-2 text-gray-700 hover:text-orange-600"
        >
          <UtensilsCrossed className="w-5 h-5" />
          <span className="text-xs">Menu</span>
        </Link>

        <button
          onClick={openCart}
          className="flex flex-col items-center gap-1 py-2 text-gray-700 hover:text-orange-600 relative"
        >
          <ShoppingBag className="w-5 h-5" />
          <span className="text-xs">Cart</span>
          {totalItems > 0 && (
            <span className="absolute top-0 right-4 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              {totalItems}
            </span>
          )}
        </button>

        <button
          onClick={handleCall}
          className="flex flex-col items-center gap-1 py-2 text-gray-700 hover:text-orange-600"
        >
          <Phone className="w-5 h-5" />
          <span className="text-xs">Call</span>
        </button>

        <button
          onClick={handleWhatsApp}
          className="flex flex-col items-center gap-1 py-2 text-gray-700 hover:text-orange-600"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-xs">WhatsApp</span>
        </button>
      </div>
    </div>
  );
}
