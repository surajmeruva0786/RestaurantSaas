import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as firestoreService from '../../lib/firestore';
import type { Restaurant } from '../../contexts/DataContext';

export default function RestaurantForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);

    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        slug: '',
        email: '',
        phone: '',
        whatsapp: '',
        address: '',
        openingHours: '11:00 AM - 11:00 PM',
        cuisine: [] as string[],
        cuisineInput: '',
        description: '',
        isOpen: true,
    });

    useEffect(() => {
        if (isEdit && id) {
            firestoreService.getRestaurant(id).then((restaurant) => {
                if (restaurant) {
                    setFormData({
                        name: restaurant.name,
                        slug: restaurant.slug,
                        email: restaurant.email,
                        phone: restaurant.phone,
                        whatsapp: restaurant.whatsapp,
                        address: restaurant.address,
                        openingHours: restaurant.openingHours,
                        cuisine: restaurant.cuisine,
                        cuisineInput: '',
                        description: restaurant.description || '',
                        isOpen: restaurant.isOpen,
                    });
                }
                setLoading(false);
            });
        }
    }, [id, isEdit]);

    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleNameChange = (name: string) => {
        setFormData({
            ...formData,
            name,
            slug: isEdit ? formData.slug : generateSlug(name),
        });
    };

    const handleAddCuisine = () => {
        if (formData.cuisineInput.trim() && !formData.cuisine.includes(formData.cuisineInput.trim())) {
            setFormData({
                ...formData,
                cuisine: [...formData.cuisine, formData.cuisineInput.trim()],
                cuisineInput: '',
            });
        }
    };

    const handleRemoveCuisine = (cuisine: string) => {
        setFormData({
            ...formData,
            cuisine: formData.cuisine.filter(c => c !== cuisine),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);

        try {
            const restaurantData: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'> = {
                name: formData.name,
                slug: formData.slug,
                email: formData.email,
                phone: formData.phone,
                whatsapp: formData.whatsapp,
                address: formData.address,
                openingHours: formData.openingHours,
                cuisine: formData.cuisine,
                description: formData.description,
                isOpen: formData.isOpen,
            };

            if (isEdit && id) {
                await firestoreService.updateRestaurant(id, restaurantData);
            } else {
                await firestoreService.createRestaurant(restaurantData);
            }

            navigate('/super-admin/restaurants');
        } catch (error) {
            console.error('Error saving restaurant:', error);
            alert('Failed to save restaurant');
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">
                    {isEdit ? 'Edit Restaurant' : 'Add New Restaurant'}
                </h2>
                <p className="text-gray-600 mt-2">
                    {isEdit ? 'Update restaurant information' : 'Create a new restaurant'}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Restaurant Name *
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(e) => handleNameChange(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="My Restaurant"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Slug * {isEdit && '(Cannot be changed)'}
                        </label>
                        <input
                            type="text"
                            required
                            value={formData.slug}
                            onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                            disabled={isEdit}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent disabled:bg-gray-100"
                            placeholder="my-restaurant"
                        />
                        <p className="text-xs text-gray-500 mt-1">URL: /r/{formData.slug}</p>
                    </div>
                </div>

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Email *
                        </label>
                        <input
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="contact@restaurant.com"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Phone *
                        </label>
                        <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="+91 9876543210"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            WhatsApp
                        </label>
                        <input
                            type="tel"
                            value={formData.whatsapp}
                            onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="+91 9876543210"
                        />
                    </div>
                </div>

                {/* Address */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Address *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.address}
                        onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="123 Food Street, City"
                    />
                </div>

                {/* Opening Hours */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Opening Hours *
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.openingHours}
                        onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="11:00 AM - 11:00 PM"
                    />
                </div>

                {/* Cuisine Types */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Cuisine Types *
                    </label>
                    <div className="flex space-x-2 mb-2">
                        <input
                            type="text"
                            value={formData.cuisineInput}
                            onChange={(e) => setFormData({ ...formData, cuisineInput: e.target.value })}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCuisine())}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            placeholder="e.g., Indian, Chinese, Italian"
                        />
                        <button
                            type="button"
                            onClick={handleAddCuisine}
                            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.cuisine.map((cuisine) => (
                            <span
                                key={cuisine}
                                className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm flex items-center space-x-2"
                            >
                                <span>{cuisine}</span>
                                <button
                                    type="button"
                                    onClick={() => handleRemoveCuisine(cuisine)}
                                    className="text-orange-600 hover:text-orange-800"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Description
                    </label>
                    <textarea
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        placeholder="Brief description of the restaurant..."
                    />
                </div>

                {/* Status */}
                <div className="flex items-center space-x-2">
                    <input
                        type="checkbox"
                        id="isOpen"
                        checked={formData.isOpen}
                        onChange={(e) => setFormData({ ...formData, isOpen: e.target.checked })}
                        className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <label htmlFor="isOpen" className="text-sm font-medium text-gray-700">
                        Restaurant is Active
                    </label>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate('/super-admin/restaurants')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50"
                    >
                        {saving ? 'Saving...' : isEdit ? 'Update Restaurant' : 'Create Restaurant'}
                    </button>
                </div>
            </form>
        </div>
    );
}
