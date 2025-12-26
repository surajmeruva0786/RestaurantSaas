import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../lib/firestore';
import type { Restaurant } from '../../contexts/DataContext';

export default function RestaurantsList() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const unsubscribe = firestoreService.subscribeToRestaurants((data) => {
            setRestaurants(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const handleDelete = async (id: string, name: string) => {
        if (window.confirm(`Are you sure you want to delete "${name}"? This will delete all associated data (menu items, orders, etc.).`)) {
            try {
                await firestoreService.deleteRestaurant(id);
            } catch (error) {
                console.error('Error deleting restaurant:', error);
                alert('Failed to delete restaurant');
            }
        }
    };

    const handleToggleStatus = async (restaurant: Restaurant) => {
        try {
            await firestoreService.updateRestaurant(restaurant.id, {
                isOpen: !restaurant.isOpen,
            });
        } catch (error) {
            console.error('Error updating restaurant status:', error);
        }
    };

    const filteredRestaurants = restaurants.filter(r =>
        r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.slug.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="text-center py-12">Loading restaurants...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900">Restaurants</h2>
                    <p className="text-gray-600 mt-2">Manage all restaurants</p>
                </div>
                <Link
                    to="/super-admin/restaurants/new"
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                    + Add Restaurant
                </Link>
            </div>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search restaurants..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                />
            </div>

            {/* Restaurants Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                {filteredRestaurants.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        {searchTerm ? 'No restaurants found' : 'No restaurants yet. Add your first restaurant!'}
                    </div>
                ) : (
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Restaurant
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Contact
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredRestaurants.map((restaurant) => (
                                <tr key={restaurant.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div>
                                            <div className="text-sm font-medium text-gray-900">{restaurant.name}</div>
                                            <div className="text-sm text-gray-500">{restaurant.address}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 font-mono">{restaurant.slug}</div>
                                        <a
                                            href={`/r/${restaurant.slug}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-xs text-orange-600 hover:text-orange-700"
                                        >
                                            View Site →
                                        </a>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">{restaurant.phone}</div>
                                        <div className="text-sm text-gray-500">{restaurant.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(restaurant)}
                                            className={`px-2 py-1 text-xs rounded-full font-medium ${restaurant.isOpen
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                } transition-colors`}
                                        >
                                            {restaurant.isOpen ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-3">
                                        <Link
                                            to={`/super-admin/restaurants/${restaurant.id}/edit`}
                                            className="text-orange-600 hover:text-orange-700"
                                        >
                                            Edit
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(restaurant.id, restaurant.name)}
                                            className="text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
