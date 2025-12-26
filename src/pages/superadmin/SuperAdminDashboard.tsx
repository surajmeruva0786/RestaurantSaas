import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../lib/firestore';
import type { Restaurant } from '../../contexts/DataContext';

export default function SuperAdminDashboard() {
    const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = firestoreService.subscribeToRestaurants((data) => {
            setRestaurants(data);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const activeRestaurants = restaurants.filter(r => r.isOpen).length;
    const inactiveRestaurants = restaurants.length - activeRestaurants;

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div>
            <div className="mb-8">
                <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
                <p className="text-gray-600 mt-2">Overview of all restaurants</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm font-medium text-gray-600">Total Restaurants</div>
                    <div className="text-3xl font-bold text-gray-900 mt-2">{restaurants.length}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm font-medium text-gray-600">Active</div>
                    <div className="text-3xl font-bold text-green-600 mt-2">{activeRestaurants}</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow">
                    <div className="text-sm font-medium text-gray-600">Inactive</div>
                    <div className="text-3xl font-bold text-red-600 mt-2">{inactiveRestaurants}</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                    <Link
                        to="/super-admin/restaurants/new"
                        className="block px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-center font-medium"
                    >
                        + Add New Restaurant
                    </Link>
                    <Link
                        to="/super-admin/restaurants"
                        className="block px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-center font-medium"
                    >
                        View All Restaurants
                    </Link>
                </div>
            </div>

            {/* Recent Restaurants */}
            {restaurants.length > 0 && (
                <div className="mt-8 bg-white p-6 rounded-lg shadow">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Restaurants</h3>
                    <div className="space-y-3">
                        {restaurants.slice(0, 5).map((restaurant) => (
                            <div key={restaurant.id} className="flex justify-between items-center p-3 border border-gray-200 rounded-lg">
                                <div>
                                    <div className="font-medium text-gray-900">{restaurant.name}</div>
                                    <div className="text-sm text-gray-600">{restaurant.slug}</div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <span className={`px-2 py-1 text-xs rounded-full ${restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {restaurant.isOpen ? 'Active' : 'Inactive'}
                                    </span>
                                    <Link
                                        to={`/super-admin/restaurants/${restaurant.id}/edit`}
                                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                                    >
                                        Edit
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
