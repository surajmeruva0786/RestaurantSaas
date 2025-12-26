import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as firestoreService from '../../lib/firestore';
import type { Restaurant } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Plus, Search, ExternalLink } from 'lucide-react';

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
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Restaurants</h1>
                    <p className="text-gray-600 mt-2">Manage all restaurants in the platform</p>
                </div>
                <Link to="/super-admin/restaurants/new">
                    <Button size="lg">
                        <Plus className="w-4 h-4" />
                        Add Restaurant
                    </Button>
                </Link>
            </div>

            {/* Search */}
            <Card>
                <CardContent className="pt-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            type="text"
                            placeholder="Search restaurants by name or slug..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Restaurants List */}
            <Card>
                <CardHeader>
                    <CardTitle>All Restaurants ({filteredRestaurants.length})</CardTitle>
                    <CardDescription>
                        {searchTerm ? `Showing results for "${searchTerm}"` : 'Complete list of restaurants'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredRestaurants.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            {searchTerm ? 'No restaurants found matching your search' : 'No restaurants yet. Add your first restaurant!'}
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {filteredRestaurants.map((restaurant) => (
                                <div key={restaurant.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h3 className="font-semibold text-gray-900">{restaurant.name}</h3>
                                            <Badge variant={restaurant.isOpen ? "default" : "secondary"}>
                                                {restaurant.isOpen ? 'Active' : 'Inactive'}
                                            </Badge>
                                        </div>
                                        <div className="text-sm text-gray-600 space-y-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">/r/{restaurant.slug}</span>
                                                <a
                                                    href={`/r/${restaurant.slug}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-orange-600 hover:text-orange-700 flex items-center gap-1"
                                                >
                                                    <ExternalLink className="w-3 h-3" />
                                                    <span className="text-xs">View Site</span>
                                                </a>
                                            </div>
                                            <p>{restaurant.address}</p>
                                            <p>{restaurant.phone} • {restaurant.email}</p>
                                            {restaurant.cuisine.length > 0 && (
                                                <div className="flex gap-1 flex-wrap">
                                                    {restaurant.cuisine.map(c => (
                                                        <span key={c} className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 ml-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => handleToggleStatus(restaurant)}
                                        >
                                            {restaurant.isOpen ? 'Deactivate' : 'Activate'}
                                        </Button>
                                        <Link to={`/super-admin/restaurants/${restaurant.id}/edit`}>
                                            <Button variant="outline" size="sm">
                                                Edit
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="destructive"
                                            size="sm"
                                            onClick={() => handleDelete(restaurant.id, restaurant.name)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
