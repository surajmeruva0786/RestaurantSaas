import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Shield, Store, Users } from 'lucide-react';

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-bold text-gray-900 mb-4">Restaurant SaaS Platform</h1>
                    <p className="text-xl text-gray-600">Multi-tenant restaurant management system</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                                <Shield className="w-6 h-6 text-orange-600" />
                            </div>
                            <CardTitle>Super Admin</CardTitle>
                            <CardDescription>Manage all restaurants in the platform</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/super-admin/login">
                                <Button className="w-full">
                                    Access Super Admin
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                <Store className="w-6 h-6 text-blue-600" />
                            </div>
                            <CardTitle>Restaurant Admin</CardTitle>
                            <CardDescription>Manage your restaurant's menu and orders</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/admin/login">
                                <Button variant="outline" className="w-full">
                                    Restaurant Login
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                                <Users className="w-6 h-6 text-green-600" />
                            </div>
                            <CardTitle>View Restaurants</CardTitle>
                            <CardDescription>Browse available restaurants</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link to="/super-admin/restaurants">
                                <Button variant="outline" className="w-full">
                                    Browse Restaurants
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                <Card className="max-w-2xl mx-auto">
                    <CardHeader>
                        <CardTitle>Getting Started</CardTitle>
                        <CardDescription>Quick setup guide</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600 font-bold">
                                1
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Login as Super Admin</h3>
                                <p className="text-sm text-gray-600">
                                    Use credentials: admin@restaurantsaas.com / admin123
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600 font-bold">
                                2
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Create Your First Restaurant</h3>
                                <p className="text-sm text-gray-600">
                                    Add a new restaurant with menu, settings, and branding
                                </p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3">
                            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0 text-orange-600 font-bold">
                                3
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900">Access Your Restaurant</h3>
                                <p className="text-sm text-gray-600">
                                    Visit /r/your-restaurant-slug to see your live restaurant page
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
