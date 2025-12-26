import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { Save, ToggleLeft, ToggleRight } from 'lucide-react';

export default function AdminSettings() {
  const { settings, updateSettings } = useData();
  const [formData, setFormData] = useState(settings);
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleCuisineChange = (value: string) => {
    const cuisines = value.split(',').map(c => c.trim()).filter(Boolean);
    setFormData({ ...formData, cuisine: cuisines });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-gray-900">Restaurant Settings</h1>
        {saved && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-lg text-sm">
            Settings saved successfully!
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="max-w-3xl">
        <div className="bg-white rounded-lg border border-gray-200 p-6 space-y-6">
          {/* Basic Info */}
          <div>
            <h2 className="text-gray-900 mb-4">Basic Information</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Restaurant Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={e => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Address *</label>
                <textarea
                  required
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-700 mb-2">Phone Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 mb-2">WhatsApp Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.whatsapp}
                    onChange={e =>
                      setFormData({ ...formData, whatsapp: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Operating Hours */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-gray-900 mb-4">Operating Hours</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">Opening Hours *</label>
                <input
                  type="text"
                  required
                  value={formData.openingHours}
                  onChange={e =>
                    setFormData({ ...formData, openingHours: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="e.g., 11:00 AM - 11:00 PM"
                />
              </div>

              <div>
                <label className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, isOpen: !formData.isOpen })
                    }
                    className={`${formData.isOpen ? 'text-green-600' : 'text-gray-400'}`}
                  >
                    {formData.isOpen ? (
                      <ToggleRight className="w-12 h-12" />
                    ) : (
                      <ToggleLeft className="w-12 h-12" />
                    )}
                  </button>
                  <span className="text-gray-700">
                    Restaurant is currently{' '}
                    <strong>{formData.isOpen ? 'Open' : 'Closed'}</strong>
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Cuisine & Rating */}
          <div className="pt-6 border-t border-gray-200">
            <h2 className="text-gray-900 mb-4">Additional Info</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-gray-700 mb-2">
                  Cuisine Types (comma-separated) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cuisine.join(', ')}
                  onChange={e => handleCuisineChange(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="e.g., Indian, Chinese, Continental"
                />
                <p className="text-gray-600 text-sm mt-1">
                  Current: {formData.cuisine.join(', ')}
                </p>
              </div>

              <div>
                <label className="block text-gray-700 mb-2">Rating (Optional)</label>
                <input
                  type="number"
                  min="0"
                  max="5"
                  step="0.1"
                  value={formData.rating || ''}
                  onChange={e =>
                    setFormData({
                      ...formData,
                      rating: e.target.value ? parseFloat(e.target.value) : undefined,
                    })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                  placeholder="0.0 - 5.0"
                />
              </div>
            </div>
          </div>

          {/* Save Button */}
          <div className="pt-6 border-t border-gray-200">
            <button
              type="submit"
              className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600 transition-colors flex items-center gap-2"
            >
              <Save className="w-5 h-5" />
              Save Settings
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
