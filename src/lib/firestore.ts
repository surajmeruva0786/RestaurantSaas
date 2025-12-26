import {
    collection,
    doc,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    query,
    orderBy,
    onSnapshot,
    setDoc,
    writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
    MenuItem,
    Category,
    Order,
    Reservation,
    Feedback,
    RestaurantSettings,
    Restaurant,
} from '../contexts/DataContext';

// Helper function to get restaurant path
const getRestaurantPath = (restaurantId: string, collectionName: string) => {
    return `restaurants/${restaurantId}/${collectionName}`;
};

// ============= Restaurant Management =============

export async function getAllRestaurants(): Promise<Restaurant[]> {
    const querySnapshot = await getDocs(collection(db, 'restaurants'));
    const restaurants: Restaurant[] = [];

    for (const docSnap of querySnapshot.docs) {
        const infoDoc = await getDoc(doc(db, `restaurants/${docSnap.id}/info`));
        if (infoDoc.exists()) {
            restaurants.push({ id: docSnap.id, ...infoDoc.data() } as Restaurant);
        }
    }

    return restaurants;
}

export async function getRestaurant(restaurantId: string): Promise<Restaurant | null> {
    const docRef = doc(db, `restaurants/${restaurantId}/info`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return { id: restaurantId, ...docSnap.data() } as Restaurant;
    }
    return null;
}

export async function createRestaurant(restaurant: Omit<Restaurant, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const restaurantId = restaurant.slug;
    const now = new Date().toISOString();

    const restaurantData: Restaurant = {
        ...restaurant,
        id: restaurantId,
        createdAt: now,
        updatedAt: now,
    };

    // Create restaurant info document
    await setDoc(doc(db, `restaurants/${restaurantId}/info`), restaurantData);

    // Initialize empty subcollections by creating placeholder docs (will be deleted when real data is added)
    const batch = writeBatch(db);

    // Create initial categories
    const defaultCategories = [
        { name: 'Starters', order: 1 },
        { name: 'Main Course', order: 2 },
        { name: 'Beverages', order: 3 },
        { name: 'Desserts', order: 4 },
    ];

    for (const category of defaultCategories) {
        const catRef = doc(collection(db, getRestaurantPath(restaurantId, 'categories')));
        batch.set(catRef, category);
    }

    await batch.commit();

    return restaurantId;
}

export async function updateRestaurant(restaurantId: string, data: Partial<Restaurant>): Promise<void> {
    const docRef = doc(db, `restaurants/${restaurantId}/info`);
    await updateDoc(docRef, {
        ...data,
        updatedAt: new Date().toISOString(),
    });
}

export async function deleteRestaurant(restaurantId: string): Promise<void> {
    const batch = writeBatch(db);

    // Delete all subcollections
    const subcollections = ['menuItems', 'categories', 'orders', 'reservations', 'feedbacks', 'settings'];

    for (const subcol of subcollections) {
        const snapshot = await getDocs(collection(db, getRestaurantPath(restaurantId, subcol)));
        snapshot.docs.forEach(doc => batch.delete(doc.ref));
    }

    // Delete info document
    batch.delete(doc(db, `restaurants/${restaurantId}/info`));

    await batch.commit();
}

export function subscribeToRestaurants(callback: (restaurants: Restaurant[]) => void) {
    const q = query(collection(db, 'restaurants'));
    return onSnapshot(q, async (snapshot) => {
        const restaurants: Restaurant[] = [];

        for (const docSnap of snapshot.docs) {
            const infoDoc = await getDoc(doc(db, `restaurants/${docSnap.id}/info`));
            if (infoDoc.exists()) {
                restaurants.push({ id: docSnap.id, ...infoDoc.data() } as Restaurant);
            }
        }

        callback(restaurants);
    });
}

// ============= Menu Items (Multi-tenant) =============

export async function getMenuItems(restaurantId: string): Promise<MenuItem[]> {
    const querySnapshot = await getDocs(collection(db, getRestaurantPath(restaurantId, 'menuItems')));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
}

export async function addMenuItem(restaurantId: string, item: Omit<MenuItem, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, getRestaurantPath(restaurantId, 'menuItems')), item);
    return docRef.id;
}

export async function updateMenuItem(restaurantId: string, id: string, item: Partial<MenuItem>): Promise<void> {
    const docRef = doc(db, getRestaurantPath(restaurantId, 'menuItems'), id);
    await updateDoc(docRef, item);
}

export async function deleteMenuItem(restaurantId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, getRestaurantPath(restaurantId, 'menuItems'), id));
}

export function subscribeToMenuItems(restaurantId: string, callback: (items: MenuItem[]) => void) {
    const q = query(collection(db, getRestaurantPath(restaurantId, 'menuItems')));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        callback(items);
    });
}

// ============= Categories (Multi-tenant) =============

export async function getCategories(restaurantId: string): Promise<Category[]> {
    const q = query(collection(db, getRestaurantPath(restaurantId, 'categories')), orderBy('order'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function addCategory(restaurantId: string, category: Omit<Category, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, getRestaurantPath(restaurantId, 'categories')), category);
    return docRef.id;
}

export async function updateCategory(restaurantId: string, id: string, category: Partial<Category>): Promise<void> {
    const docRef = doc(db, getRestaurantPath(restaurantId, 'categories'), id);
    await updateDoc(docRef, category);
}

export async function deleteCategory(restaurantId: string, id: string): Promise<void> {
    await deleteDoc(doc(db, getRestaurantPath(restaurantId, 'categories'), id));
}

export function subscribeToCategories(restaurantId: string, callback: (categories: Category[]) => void) {
    const q = query(collection(db, getRestaurantPath(restaurantId, 'categories')), orderBy('order'));
    return onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        callback(categories);
    });
}

// ============= Orders (Multi-tenant) =============

export async function getOrders(restaurantId: string): Promise<Order[]> {
    const querySnapshot = await getDocs(collection(db, getRestaurantPath(restaurantId, 'orders')));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function addOrder(restaurantId: string, order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    const orderData = {
        ...order,
        createdAt: new Date().toISOString(),
        status: 'new',
    };
    const docRef = await addDoc(collection(db, getRestaurantPath(restaurantId, 'orders')), orderData);
    return docRef.id;
}

export async function updateOrderStatus(restaurantId: string, id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, getRestaurantPath(restaurantId, 'orders'), id);
    await updateDoc(docRef, { status });
}

export function subscribeToOrders(restaurantId: string, callback: (orders: Order[]) => void) {
    const q = query(collection(db, getRestaurantPath(restaurantId, 'orders')));
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        callback(orders);
    });
}

// ============= Reservations (Multi-tenant) =============

export async function getReservations(restaurantId: string): Promise<Reservation[]> {
    const querySnapshot = await getDocs(collection(db, getRestaurantPath(restaurantId, 'reservations')));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
}

export async function addReservation(
    restaurantId: string,
    reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>
): Promise<string> {
    const reservationData = {
        ...reservation,
        createdAt: new Date().toISOString(),
        status: 'pending',
    };
    const docRef = await addDoc(collection(db, getRestaurantPath(restaurantId, 'reservations')), reservationData);
    return docRef.id;
}

export async function updateReservationStatus(
    restaurantId: string,
    id: string,
    status: Reservation['status']
): Promise<void> {
    const docRef = doc(db, getRestaurantPath(restaurantId, 'reservations'), id);
    await updateDoc(docRef, { status });
}

export function subscribeToReservations(restaurantId: string, callback: (reservations: Reservation[]) => void) {
    const q = query(collection(db, getRestaurantPath(restaurantId, 'reservations')));
    return onSnapshot(q, (snapshot) => {
        const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
        callback(reservations);
    });
}

// ============= Feedback (Multi-tenant) =============

export async function getFeedbacks(restaurantId: string): Promise<Feedback[]> {
    const querySnapshot = await getDocs(collection(db, getRestaurantPath(restaurantId, 'feedbacks')));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
}

export async function addFeedback(restaurantId: string, feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<string> {
    const feedbackData = {
        ...feedback,
        createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, getRestaurantPath(restaurantId, 'feedbacks')), feedbackData);
    return docRef.id;
}

export function subscribeToFeedbacks(restaurantId: string, callback: (feedbacks: Feedback[]) => void) {
    const q = query(collection(db, getRestaurantPath(restaurantId, 'feedbacks')));
    return onSnapshot(q, (snapshot) => {
        const feedbacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
        callback(feedbacks);
    });
}

// ============= Settings (Multi-tenant) =============

const SETTINGS_DOC_ID = 'restaurant-settings';

export async function getSettings(restaurantId: string): Promise<RestaurantSettings | null> {
    const docRef = doc(db, getRestaurantPath(restaurantId, 'settings'), SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as RestaurantSettings;
    }
    return null;
}

export async function updateSettings(restaurantId: string, settings: Partial<RestaurantSettings>): Promise<void> {
    const docRef = doc(db, getRestaurantPath(restaurantId, 'settings'), SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
}

export async function initializeSettings(restaurantId: string, settings: RestaurantSettings): Promise<void> {
    const docRef = doc(db, getRestaurantPath(restaurantId, 'settings'), SETTINGS_DOC_ID);
    await setDoc(docRef, settings);
}

export function subscribeToSettings(restaurantId: string, callback: (settings: RestaurantSettings | null) => void) {
    const docRef = doc(db, getRestaurantPath(restaurantId, 'settings'), SETTINGS_DOC_ID);
    return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data() as RestaurantSettings);
        } else {
            callback(null);
        }
    });
}
