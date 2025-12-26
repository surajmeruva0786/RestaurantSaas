import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useSuperAdmin } from '../../contexts/SuperAdminContext';

export default function SuperAdminLayout() {
    const { logout } = useSuperAdmin();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/super-admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <header className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Super Admin Panel</h1>
                        <p className="text-sm text-gray-600">Restaurant SaaS Management</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                    >
                        Logout
                    </button>
                </div>
            </header>

            {/* Navigation */}
            <nav className="bg-white border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex space-x-8">
                        <Link
                            to="/super-admin/dashboard"
                            className="px-3 py-4 text-sm font-medium text-gray-700 hover:text-orange-600 border-b-2 border-transparent hover:border-orange-600 transition-colors"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/super-admin/restaurants"
                            className="px-3 py-4 text-sm font-medium text-gray-700 hover:text-orange-600 border-b-2 border-transparent hover:border-orange-600 transition-colors"
                        >
                            Restaurants
                        </Link>
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
