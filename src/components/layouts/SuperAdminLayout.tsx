import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';
import { Button } from '../../components/ui/button';
import { Shield, LayoutDashboard, Store, LogOut } from 'lucide-react';

export default function SuperAdminLayout() {
    const { logout } = useSuperAdmin();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/super-admin/login');
    };

    const navItems = [
        { to: '/super-admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
        { to: '/super-admin/restaurants', icon: Store, label: 'Restaurants' },
    ];

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                                <Shield className="w-5 h-5 text-orange-600" />
                            </div>
                            <div>
                                <h1 className="text-lg font-bold text-gray-900">Super Admin</h1>
                                <p className="text-xs text-gray-600">Restaurant SaaS Platform</p>
                            </div>
                        </div>
                        <Button variant="outline" onClick={handleLogout} size="sm">
                            <LogOut className="w-4 h-4" />
                            Logout
                        </Button>
                    </div>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.to}
                                    to={item.to}
                                    className="flex items-center gap-2 px-4 py-3 text-sm font-medium text-gray-700 hover:text-orange-600 hover:bg-orange-50 rounded-t-lg transition-colors"
                                >
                                    <Icon className="w-4 h-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <Outlet />
            </main>
        </div>
    );
}
