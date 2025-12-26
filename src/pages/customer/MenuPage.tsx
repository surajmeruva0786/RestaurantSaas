import { useState, useRef, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { ArrowLeft } from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import MenuItemCard from '../../components/MenuItemCard';
import MobileActionBar from '../../components/MobileActionBar';
import CartDrawer from '../../components/CartDrawer';
import FloatingCartButton from '../../components/FloatingCartButton';

export default function MenuPage() {
  const { slug } = useParams();
  const { menuItems, categories, settings } = useData();
  const [activeCategory, setActiveCategory] = useState<string>('');
  const categoryRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Set first category as active by default
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  const scrollToCategory = (categoryId: string) => {
    setActiveCategory(categoryId);
    categoryRefs.current[categoryId]?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const availableItems = menuItems.filter(item => item.isAvailable);

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-6">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link to={`/r/${slug}`} className="text-gray-700 hover:text-gray-900">
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-gray-900">{settings.name}</h1>
              <p className="text-gray-600 text-sm">{settings.cuisine.join(' • ')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category Tabs - Sticky */}
      <div className="bg-white border-b border-gray-200 sticky top-[73px] z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto scrollbar-hide">
            {categories
              .sort((a, b) => a.order - b.order)
              .map(category => {
                const itemCount = availableItems.filter(
                  item => item.category === category.id
                ).length;
                if (itemCount === 0) return null;

                return (
                  <button
                    key={category.id}
                    onClick={() => scrollToCategory(category.id)}
                    className={`py-3 px-4 whitespace-nowrap border-b-2 transition-colors ${
                      activeCategory === category.id
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    {category.name} ({itemCount})
                  </button>
                );
              })}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {categories
          .sort((a, b) => a.order - b.order)
          .map(category => {
            const categoryItems = availableItems.filter(
              item => item.category === category.id
            );
            if (categoryItems.length === 0) return null;

            return (
              <div
                key={category.id}
                ref={el => (categoryRefs.current[category.id] = el)}
                className="mb-8 scroll-mt-32"
              >
                <h2 className="text-gray-900 mb-4">{category.name}</h2>
                <div className="space-y-4">
                  {categoryItems.map(item => (
                    <MenuItemCard key={item.id} item={item} />
                  ))}
                </div>
              </div>
            );
          })}

        {availableItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No menu items available at the moment</p>
          </div>
        )}
      </div>

      <MobileActionBar />
      <FloatingCartButton />
      <CartDrawer />
    </div>
  );
}
