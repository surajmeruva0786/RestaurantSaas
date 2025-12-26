import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';

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

// Layouts
import AdminLayout from './components/layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <CartProvider>
            <Routes>
              {/* Customer Routes */}
              <Route path="/r/:slug" element={<RestaurantHome />} />
              <Route path="/r/:slug/menu" element={<MenuPage />} />
              <Route path="/r/:slug/checkout" element={<CheckoutPage />} />
              <Route path="/r/:slug/reserve" element={<ReservePage />} />
              <Route path="/r/:slug/feedback" element={<FeedbackPage />} />

              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route
                path="/admin/*"
                element={
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
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/r/demo-restaurant" replace />} />
            </Routes>
          </CartProvider>
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}
