import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface SuperAdminContextType {
    isAuthenticated: boolean;
    login: (email: string, password: string) => boolean;
    logout: () => void;
}

const SuperAdminContext = createContext<SuperAdminContextType | undefined>(undefined);

export function SuperAdminProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Check if already logged in on mount
    useEffect(() => {
        const auth = sessionStorage.getItem('superAdminAuth');
        if (auth === 'true') {
            setIsAuthenticated(true);
        }
    }, []);

    const login = (email: string, password: string): boolean => {
        const validEmail = import.meta.env.VITE_SUPER_ADMIN_EMAIL || 'admin@restaurantsaas.com';
        const validPassword = import.meta.env.VITE_SUPER_ADMIN_PASSWORD || 'admin123';

        if (email === validEmail && password === validPassword) {
            setIsAuthenticated(true);
            sessionStorage.setItem('superAdminAuth', 'true');
            return true;
        }
        return false;
    };

    const logout = () => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('superAdminAuth');
    };

    return (
        <SuperAdminContext.Provider value={{ isAuthenticated, login, logout }}>
            {children}
        </SuperAdminContext.Provider>
    );
}

export function useSuperAdmin() {
    const context = useContext(SuperAdminContext);
    if (!context) {
        throw new Error('useSuperAdmin must be used within SuperAdminProvider');
    }
    return context;
}
