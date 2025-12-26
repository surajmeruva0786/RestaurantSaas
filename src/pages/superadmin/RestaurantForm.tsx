import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import * as firestoreService from '../../lib/firestore';
import type { Restaurant } from '../../contexts/DataContext';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Badge } from '../../components/ui/badge';
import { X } from 'lucide-react';

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
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">
                    {isEdit ? 'Edit Restaurant' : 'Add New Restaurant'}
                </h1>
                <p className="text-gray-600 mt-2">
                    {isEdit ? 'Update restaurant information' : 'Create a new restaurant in the platform'}
                </p>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Restaurant Information</CardTitle>
                        <CardDescription>Basic details about the restaurant</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Basic Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Restaurant Name *</Label>
                                <Input
                                    id="name"
                                    required
                                    value={formData.name}
                                    onChange={(e) => handleNameChange(e.target.value)}
                                    placeholder="My Restaurant"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="slug">
                                    URL Slug * {isEdit && <span className="text-gray-500 text-xs">(Cannot be changed)</span>}
                                </Label>
                                <Input
                                    id="slug"
                                    required
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    disabled={isEdit}
                                    placeholder="my-restaurant"
                                />
                                <p className="text-xs text-gray-500">URL: /r/{formData.slug || 'your-slug'}</p>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    placeholder="contact@restaurant.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone *</Label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    placeholder="+91 9876543210"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="whatsapp">WhatsApp</Label>
                                <Input
                                    id="whatsapp"
                                    type="tel"
                                    value={formData.whatsapp}
                                    onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                    placeholder="+91 9876543210"
                                />
                            </div>
                        </div>

                        {/* Address & Hours */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="123 Food Street, City"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="hours">Opening Hours *</Label>
                                <Input
                                    id="hours"
                                    required
                                    value={formData.openingHours}
                                    onChange={(e) => setFormData({ ...formData, openingHours: e.target.value })}
                                    placeholder="11:00 AM - 11:00 PM"
                                />
                            </div>
                        </div>

                        {/* Cuisine Types */}
                        <div className="space-y-2">
                            <Label htmlFor="cuisine">Cuisine Types *</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="cuisine"
                                    value={formData.cuisineInput}
                                    onChange={(e) => setFormData({ ...formData, cuisineInput: e.target.value })}
                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddCuisine())}
                                    placeholder="e.g., Indian, Chinese, Italian"
                                />
                                <Button type="button" onClick={handleAddCuisine} variant="outline">
                                    Add
                                </Button>
                            </div>
                            {formData.cuisine.length > 0 && (
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.cuisine.map((cuisine) => (
                                        <Badge key={cuisine} variant="secondary" className="gap-1">
                                            {cuisine}
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveCuisine(cuisine)}
                                                className="ml-1 hover:text-red-600"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </Badge>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Textarea
                                id="description"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                placeholder="Brief description of the restaurant..."
                            />
                        </div>

                        {/* Status */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="isOpen"
                                checked={formData.isOpen}
                                onCheckedChange={(checked) => setFormData({ ...formData, isOpen: checked })}
                            />
                            <Label htmlFor="isOpen" className="cursor-pointer">
                                Restaurant is Active
                            </Label>
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-end gap-3">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => navigate('/super-admin/restaurants')}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving}>
                            {saving ? 'Saving...' : isEdit ? 'Update Restaurant' : 'Create Restaurant'}
                        </Button>
                    </CardFooter>
                </Card>
            </form>
        </div>
    );
}
