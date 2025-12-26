import { Navigate } from 'react-router-dom';
import { useSuperAdmin } from '../contexts/SuperAdminContext';
import { ReactNode } from 'react';

export default function SuperAdminProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated } = useSuperAdmin();

    if (!isAuthenticated) {
        return <Navigate to="/super-admin/login" replace />;
    }

    return <>{children}</>;
}
