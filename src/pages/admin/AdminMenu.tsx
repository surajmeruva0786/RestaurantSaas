import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Plus, Edit, Trash2, ToggleLeft, ToggleRight, X } from 'lucide-react';

export default function AdminMenu() {
  const {
    menuItems,
    categories,
    addMenuItem,
    updateMenuItem,
    deleteMenuItem,
    addCategory,
    deleteCategory,
  } = useData();

  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showItemModal, setShowItemModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const [itemForm, setItemForm] = useState({
    name: '',
    description: '',
    price: '',
    isVeg: true,
    isAvailable: true,
  });

  const [categoryForm, setCategoryForm] = useState({
    name: '',
  });

  // Set first category as selected by default
  if (!selectedCategory && categories.length > 0) {
    setSelectedCategory(categories[0].id);
  }

  const handleAddItem = () => {
    setEditingItem(null);
    setItemForm({
      name: '',
      description: '',
      price: '',
      isVeg: true,
      isAvailable: true,
    });
    setShowItemModal(true);
  };

  const handleEditItem = (item: any) => {
    setEditingItem(item.id);
    setItemForm({
      name: item.name,
      description: item.description,
      price: item.price.toString(),
      isVeg: item.isVeg,
      isAvailable: item.isAvailable,
    });
    setShowItemModal(true);
  };

  const handleSaveItem = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedCategory) {
      alert('Please select a category first');
      return;
    }

    const itemData = {
      name: itemForm.name,
      description: itemForm.description,
      price: parseFloat(itemForm.price),
      category: selectedCategory,
      isVeg: itemForm.isVeg,
      isAvailable: itemForm.isAvailable,
    };

    if (editingItem) {
      updateMenuItem(editingItem, itemData);
    } else {
      addMenuItem(itemData);
    }

    setShowItemModal(false);
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    addCategory({
      name: categoryForm.name,
      order: categories.length + 1,
    });
    setCategoryForm({ name: '' });
    setShowCategoryModal(false);
  };

  const categoryItems = menuItems.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Menu Management</h1>
        <button
          onClick={handleAddItem}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Item
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Categories Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-gray-900">Categories</h2>
              <button
                onClick={() => setShowCategoryModal(true)}
                className="text-orange-600 hover:text-orange-700 p-1"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            <div className="p-2">
              {categories
                .sort((a, b) => a.order - b.order)
                .map(category => {
                  const itemCount = menuItems.filter(
                    item => item.category === category.id
                  ).length;
                  return (
                    <div
                      key={category.id}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg cursor-pointer mb-1 ${
                        selectedCategory === category.id
                          ? 'bg-orange-50 text-orange-600'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <span>
                        {category.name} ({itemCount})
                      </span>
                      {itemCount === 0 && (
                        <button
                          onClick={e => {
                            e.stopPropagation();
                            if (
                              confirm(`Delete category "${category.name}"?`)
                            ) {
                              deleteCategory(category.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="p-6">
              {!selectedCategory ? (
                <p className="text-gray-500 text-center py-12">
                  Select a category to view items
                </p>
              ) : categoryItems.length === 0 ? (
                <p className="text-gray-500 text-center py-12">
                  No items in this category
                </p>
              ) : (
                <div className="space-y-4">
                  {categoryItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-start gap-4 p-4 border border-gray-200 rounded-lg"
                    >
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

                      <div className="flex-1">
                        <h3 className="text-gray-900 mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <p className="text-gray-900">₹{item.price}</p>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            updateMenuItem(item.id, { isAvailable: !item.isAvailable })
                          }
                          className={`${
                            item.isAvailable ? 'text-green-600' : 'text-gray-400'
                          }`}
                          title={item.isAvailable ? 'Available' : 'Not Available'}
                        >
                          {item.isAvailable ? (
                            <ToggleRight className="w-8 h-8" />
                          ) : (
                            <ToggleLeft className="w-8 h-8" />
                          )}
                        </button>
                        <button
                          onClick={() => handleEditItem(item)}
                          className="text-blue-600 hover:text-blue-700 p-2"
                        >
                          <Edit className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(`Delete "${item.name}"?`)) {
                              deleteMenuItem(item.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-700 p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add/Edit Item Modal */}
      {showItemModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-gray-900">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <button
                onClick={() => setShowItemModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSaveItem} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Name *</label>
                <input
                  type="text"
                  required
                  value={itemForm.name}
                  onChange={e => setItemForm({ ...itemForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Description *</label>
                <textarea
                  required
                  value={itemForm.description}
                  onChange={e =>
                    setItemForm({ ...itemForm, description: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-gray-700 mb-2">Price (₹) *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={itemForm.price}
                  onChange={e => setItemForm({ ...itemForm, price: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemForm.isVeg}
                    onChange={e => setItemForm({ ...itemForm, isVeg: e.target.checked })}
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Vegetarian</span>
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={itemForm.isAvailable}
                    onChange={e =>
                      setItemForm({ ...itemForm, isAvailable: e.target.checked })
                    }
                    className="w-4 h-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
                  />
                  <span className="text-gray-700">Available</span>
                </label>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowItemModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCategoryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-gray-900">Add New Category</h2>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleAddCategory} className="p-6 space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Category Name *</label>
                <input
                  type="text"
                  required
                  value={categoryForm.name}
                  onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="e.g., Appetizers"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                >
                  Add Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
