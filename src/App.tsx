import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { SuperAdminProvider } from './contexts/SuperAdminContext';

// Customer pages
import RestaurantHome from './pages/customer/RestaurantHome';
import MenuPage from './pages/customer/MenuPage';
import CheckoutPage from './pages/customer/CheckoutPage';
import ReservePage from './pages/customer/ReservePage';
import FeedbackPage from './pages/customer/FeedbackPage';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminOrders from './pages/admin/AdminOrders';
import AdminMenu from './pages/admin/AdminMenu';
import AdminReservations from './pages/admin/AdminReservations';
import AdminFeedback from './pages/admin/AdminFeedback';
import AdminSettings from './pages/admin/AdminSettings';

// Super Admin pages
import SuperAdminLogin from './pages/superadmin/SuperAdminLogin';
import SuperAdminDashboard from './pages/superadmin/SuperAdminDashboard';
import RestaurantsList from './pages/superadmin/RestaurantsList';
import RestaurantForm from './pages/superadmin/RestaurantForm';

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import SuperAdminLayout from './components/layouts/SuperAdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import SuperAdminProtectedRoute from './components/SuperAdminProtectedRoute';
import RestaurantApp from './components/RestaurantApp';

export default function App() {
  return (
    <Router>
      <SuperAdminProvider>
        <AuthProvider>
          <Routes>
            {/* Super Admin Routes */}
            <Route path="/super-admin/login" element={<SuperAdminLogin />} />
            <Route
              path="/super-admin/*"
              element={
                <SuperAdminProtectedRoute>
                  <SuperAdminLayout>
                    <Routes>
                      <Route path="dashboard" element={<SuperAdminDashboard />} />
                      <Route path="restaurants" element={<RestaurantsList />} />
                      <Route path="restaurants/new" element={<RestaurantForm />} />
                      <Route path="restaurants/:id/edit" element={<RestaurantForm />} />
                    </Routes>
                  </SuperAdminLayout>
                </SuperAdminProtectedRoute>
              }
            />

            {/* Restaurant Customer Routes - Wrapped with RestaurantApp */}
            <Route
              path="/r/:slug/*"
              element={
                <RestaurantApp>
                  <CartProvider>
                    <Routes>
                      <Route index element={<RestaurantHome />} />
                      <Route path="menu" element={<MenuPage />} />
                      <Route path="checkout" element={<CheckoutPage />} />
                      <Route path="reserve" element={<ReservePage />} />
                      <Route path="feedback" element={<FeedbackPage />} />
                    </Routes>
                  </CartProvider>
                </RestaurantApp>
              }
            />

            {/* Restaurant Admin Routes - Wrapped with RestaurantApp */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
              path="/admin/*"
              element={
                <RestaurantApp>
                  <ProtectedRoute>
                    <AdminLayout>
                      <Routes>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="orders" element={<AdminOrders />} />
                        <Route path="menu" element={<AdminMenu />} />
                        <Route path="reservations" element={<AdminReservations />} />
                        <Route path="feedback" element={<AdminFeedback />} />
                        <Route path="settings" element={<AdminSettings />} />
                      </Routes>
                    </AdminLayout>
                  </ProtectedRoute>
                </RestaurantApp>
              }
            />

            {/* Default redirect to demo restaurant */}
            <Route path="/" element={<Navigate to="/r/demo-restaurant" replace />} />
          </Routes>
        </AuthProvider>
      </SuperAdminProvider>
    </Router>
  );
}
