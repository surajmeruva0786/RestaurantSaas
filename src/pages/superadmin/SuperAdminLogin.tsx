import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Shield } from 'lucide-react';

export default function SuperAdminLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useSuperAdmin();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const success = login(email, password);
        if (success) {
            navigate('/super-admin/dashboard');
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="text-center space-y-2">
                    <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-2">
                        <Shield className="w-6 h-6 text-orange-600" />
                    </div>
                    <CardTitle className="text-2xl">Super Admin</CardTitle>
                    <CardDescription>Restaurant SaaS Management Portal</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email Address</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                placeholder="admin@restaurantsaas.com"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                placeholder="••••••••"
                            />
                        </div>

                        {error && (
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}

                        <Button type="submit" className="w-full">
                            Sign In
                        </Button>

                        <div className="text-center text-sm text-gray-600 pt-4 border-t">
                            <p className="mb-1">Default credentials:</p>
                            <p className="font-mono text-xs text-gray-500">admin@restaurantsaas.com / admin123</p>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
