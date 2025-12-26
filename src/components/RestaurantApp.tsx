import { useEffect, useState } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { DataProvider } from '../contexts/DataContext';
import * as firestoreService from '../lib/firestore';
import type { Restaurant } from '../contexts/DataContext';

export default function RestaurantApp({ children }: { children: React.ReactNode }) {
    const { slug } = useParams<{ slug: string }>();
    const [restaurant, setRestaurant] = useState<Restaurant | null | undefined>(undefined);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) {
            setLoading(false);
            return;
        }

        // Fetch restaurant by slug
        firestoreService.getRestaurant(slug).then((data) => {
            setRestaurant(data);
            setLoading(false);
        }).catch((error) => {
            console.error('Error fetching restaurant:', error);
            setRestaurant(null);
            setLoading(false);
        });
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading restaurant...</p>
                </div>
            </div>
        );
    }

    if (!slug || restaurant === null) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">Restaurant Not Found</h1>
                    <p className="text-gray-600 mb-8">The restaurant you're looking for doesn't exist.</p>
                    <a
                        href="/"
                        className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                    >
                        Go Home
                    </a>
                </div>
            </div>
        );
    }

    if (!restaurant) {
        return <Navigate to="/" replace />;
    }

    return (
        <DataProvider restaurantId={slug}>
            {children}
        </DataProvider>
    );
}
