import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  restaurantId: string | null;
  login: (username: string, password: string, restaurantId: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [restaurantId, setRestaurantId] = useState<string | null>(null);

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth');
    if (auth) {
      const data = JSON.parse(auth);
      setIsAuthenticated(true);
      setRestaurantId(data.restaurantId);
    }
  }, []);

  const login = (username: string, password: string, restId: string) => {
    // Simple mock authentication
    if (username === 'admin' && password === 'admin123') {
      setIsAuthenticated(true);
      setRestaurantId(restId);
      localStorage.setItem('adminAuth', JSON.stringify({ restaurantId: restId }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRestaurantId(null);
    localStorage.removeItem('adminAuth');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, restaurantId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
