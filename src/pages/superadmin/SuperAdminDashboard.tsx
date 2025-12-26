import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../lib/firestore';
import type { Restaurant } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Store, TrendingUp, TrendingDown, Plus } from 'lucide-react';

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

    const stats = [
        {
            label: 'Total Restaurants',
            value: restaurants.length,
            icon: Store,
            color: 'bg-blue-50 text-blue-600',
        },
        {
            label: 'Active',
            value: activeRestaurants,
            icon: TrendingUp,
            color: 'bg-green-50 text-green-600',
        },
        {
            label: 'Inactive',
            value: inactiveRestaurants,
            icon: TrendingDown,
            color: 'bg-red-50 text-red-600',
        },
    ];

    if (loading) {
        return <div className="text-center py-12">Loading...</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of all restaurants in the platform</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, index) => {
                    const Icon = stat.icon;
                    return (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    </div>
                                    <div className={`p-3 rounded-lg ${stat.color}`}>
                                        <Icon className="w-6 h-6" />
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <Card>
                <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>Manage your restaurant platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Link to="/super-admin/restaurants/new">
                        <Button className="w-full" size="lg">
                            <Plus className="w-4 h-4" />
                            Add New Restaurant
                        </Button>
                    </Link>
                    <Link to="/super-admin/restaurants">
                        <Button variant="outline" className="w-full" size="lg">
                            View All Restaurants
                        </Button>
                    </Link>
                </CardContent>
            </Card>

            {/* Recent Restaurants */}
            {restaurants.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Restaurants</CardTitle>
                        <CardDescription>Latest additions to the platform</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {restaurants.slice(0, 5).map((restaurant) => (
                                <div key={restaurant.id} className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div>
                                        <div className="font-medium text-gray-900">{restaurant.name}</div>
                                        <div className="text-sm text-gray-600">/r/{restaurant.slug}</div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${restaurant.isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {restaurant.isOpen ? 'Active' : 'Inactive'}
                                        </span>
                                        <Link to={`/super-admin/restaurants/${restaurant.id}/edit`}>
                                            <Button variant="ghost" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
