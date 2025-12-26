import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import * as firestoreService from '../lib/firestore';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  isVeg: boolean;
  isAvailable: boolean;
  image?: string;
}

export interface Category {
  id: string;
  name: string;
  order: number;
}

export interface Order {
  id: string;
  items: Array<{ id: string; name: string; quantity: number; price: number }>;
  customerName: string;
  customerPhone: string;
  orderType: 'dine-in' | 'takeaway';
  tableNumber?: string;
  notes?: string;
  total: number;
  status: 'new' | 'preparing' | 'completed';
  createdAt: string;
}

export interface Reservation {
  id: string;
  customerName: string;
  customerPhone: string;
  date: string;
  time: string;
  numberOfPeople: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface Feedback {
  id: string;
  rating: number;
  comment: string;
  customerName?: string;
  createdAt: string;
}

export interface RestaurantSettings {
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  openingHours: string;
  isOpen: boolean;
  cuisine: string[];
  rating?: number;
}

export interface Restaurant {
  id: string;
  slug: string;
  name: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  openingHours: string;
  isOpen: boolean;
  cuisine: string[];
  rating?: number;
  description?: string;
  logo?: string;
  coverImage?: string;
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  menuItems: MenuItem[];
  categories: Category[];
  orders: Order[];
  reservations: Reservation[];
  feedbacks: Feedback[];
  settings: RestaurantSettings;
  addMenuItem: (item: Omit<MenuItem, 'id'>) => void;
  updateMenuItem: (id: string, item: Partial<MenuItem>) => void;
  deleteMenuItem: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => void;
  updateOrderStatus: (id: string, status: Order['status']) => void;
  addReservation: (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => void;
  updateReservationStatus: (id: string, status: Reservation['status']) => void;
  addFeedback: (feedback: Omit<Feedback, 'id' | 'createdAt'>) => void;
  updateSettings: (settings: Partial<RestaurantSettings>) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock initial data
const initialCategories: Category[] = [
  { id: '1', name: 'Starters', order: 1 },
  { id: '2', name: 'Main Course', order: 2 },
  { id: '3', name: 'Beverages', order: 3 },
  { id: '4', name: 'Desserts', order: 4 },
];

const initialMenuItems: MenuItem[] = [
  {
    id: '1',
    name: 'Paneer Tikka',
    description: 'Grilled cottage cheese with aromatic spices',
    price: 250,
    category: '1',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '2',
    name: 'Chicken Wings',
    description: 'Crispy fried wings with hot sauce',
    price: 300,
    category: '1',
    isVeg: false,
    isAvailable: true,
  },
  {
    id: '3',
    name: 'Butter Chicken',
    description: 'Tender chicken in rich tomato gravy',
    price: 350,
    category: '2',
    isVeg: false,
    isAvailable: true,
  },
  {
    id: '4',
    name: 'Dal Makhani',
    description: 'Creamy black lentils slow-cooked overnight',
    price: 200,
    category: '2',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '5',
    name: 'Fresh Lime Soda',
    description: 'Refreshing lime with soda',
    price: 80,
    category: '3',
    isVeg: true,
    isAvailable: true,
  },
  {
    id: '6',
    name: 'Gulab Jamun',
    description: 'Soft milk dumplings in sugar syrup',
    price: 120,
    category: '4',
    isVeg: true,
    isAvailable: true,
  },
];

const initialSettings: RestaurantSettings = {
  name: 'Demo Restaurant',
  address: '123 Food Street, Gourmet City',
  phone: '+91 9876543210',
  whatsapp: '+91 9876543210',
  openingHours: '11:00 AM - 11:00 PM',
  isOpen: true,
  cuisine: ['Indian', 'Chinese', 'Continental'],
  rating: 4.5,
};

export function DataProvider({ children, restaurantId }: { children: ReactNode; restaurantId: string }) {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
  const [settings, setSettings] = useState<RestaurantSettings>(initialSettings);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Firestore listeners and load data
  useEffect(() => {
    let unsubscribers: (() => void)[] = [];

    const initializeData = async () => {
      try {
        // Check if settings exist in Firestore, if not initialize with default
        const firestoreSettings = await firestoreService.getSettings(restaurantId);
        if (!firestoreSettings) {
          await firestoreService.initializeSettings(restaurantId, initialSettings);
        }

        // Subscribe to real-time updates
        const unsubMenuItems = firestoreService.subscribeToMenuItems(restaurantId, (items) => {
          setMenuItems(items.length > 0 ? items : initialMenuItems);
        });

        const unsubCategories = firestoreService.subscribeToCategories(restaurantId, (cats) => {
          setCategories(cats.length > 0 ? cats : initialCategories);
        });

        const unsubOrders = firestoreService.subscribeToOrders(restaurantId, (orders) => {
          setOrders(orders);
        });

        const unsubReservations = firestoreService.subscribeToReservations(restaurantId, (reservations) => {
          setReservations(reservations);
        });

        const unsubFeedbacks = firestoreService.subscribeToFeedbacks(restaurantId, (feedbacks) => {
          setFeedbacks(feedbacks);
        });

        const unsubSettings = firestoreService.subscribeToSettings(restaurantId, (settings) => {
          if (settings) {
            setSettings(settings);
          }
        });

        unsubscribers = [
          unsubMenuItems,
          unsubCategories,
          unsubOrders,
          unsubReservations,
          unsubFeedbacks,
          unsubSettings,
        ];

        // Initialize default data if collections are empty
        const [menuItemsData, categoriesData] = await Promise.all([
          firestoreService.getMenuItems(restaurantId),
          firestoreService.getCategories(restaurantId),
        ]);

        if (menuItemsData.length === 0) {
          // Initialize with default menu items
          for (const item of initialMenuItems) {
            await firestoreService.addMenuItem(restaurantId, item);
          }
        }

        if (categoriesData.length === 0) {
          // Initialize with default categories
          for (const category of initialCategories) {
            await firestoreService.addCategory(restaurantId, category);
          }
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error initializing Firestore data:', error);
        // Fallback to initial data if Firestore fails
        setMenuItems(initialMenuItems);
        setCategories(initialCategories);
        setSettings(initialSettings);
        setIsLoading(false);
      }
    };

    initializeData();

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [restaurantId]);

  const addMenuItem = async (item: Omit<MenuItem, 'id'>) => {
    try {
      await firestoreService.addMenuItem(restaurantId, item);
    } catch (error) {
      console.error('Error adding menu item:', error);
    }
  };

  const updateMenuItem = async (id: string, item: Partial<MenuItem>) => {
    try {
      await firestoreService.updateMenuItem(restaurantId, id, item);
    } catch (error) {
      console.error('Error updating menu item:', error);
    }
  };

  const deleteMenuItem = async (id: string) => {
    try {
      await firestoreService.deleteMenuItem(restaurantId, id);
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      await firestoreService.addCategory(restaurantId, category);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id: string, category: Partial<Category>) => {
    try {
      await firestoreService.updateCategory(restaurantId, id, category);
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      await firestoreService.deleteCategory(restaurantId, id);
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const addOrder = async (order: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      await firestoreService.addOrder(restaurantId, order);
    } catch (error) {
      console.error('Error adding order:', error);
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      await firestoreService.updateOrderStatus(restaurantId, id, status);
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const addReservation = async (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    try {
      await firestoreService.addReservation(restaurantId, reservation);
    } catch (error) {
      console.error('Error adding reservation:', error);
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      await firestoreService.updateReservationStatus(restaurantId, id, status);
    } catch (error) {
      console.error('Error updating reservation status:', error);
    }
  };

  const addFeedback = async (feedback: Omit<Feedback, 'id' | 'createdAt'>) => {
    try {
      await firestoreService.addFeedback(restaurantId, feedback);
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  const updateSettings = async (newSettings: Partial<RestaurantSettings>) => {
    try {
      await firestoreService.updateSettings(restaurantId, newSettings);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <DataContext.Provider
      value={{
        menuItems,
        categories,
        orders,
        reservations,
        feedbacks,
        settings,
        addMenuItem,
        updateMenuItem,
        deleteMenuItem,
        addCategory,
        updateCategory,
        deleteCategory,
        addOrder,
        updateOrderStatus,
        addReservation,
        updateReservationStatus,
        addFeedback,
        updateSettings,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within DataProvider');
  }
  return context;
}
