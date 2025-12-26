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
    Timestamp,
    setDoc,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
    MenuItem,
    Category,
    Order,
    Reservation,
    Feedback,
    RestaurantSettings,
} from '../contexts/DataContext';

// Collection names
const COLLECTIONS = {
    MENU_ITEMS: 'menuItems',
    CATEGORIES: 'categories',
    ORDERS: 'orders',
    RESERVATIONS: 'reservations',
    FEEDBACKS: 'feedbacks',
    SETTINGS: 'settings',
};

// ============= Menu Items =============

export async function getMenuItems(): Promise<MenuItem[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.MENU_ITEMS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
}

export async function addMenuItem(item: Omit<MenuItem, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.MENU_ITEMS), item);
    return docRef.id;
}

export async function updateMenuItem(id: string, item: Partial<MenuItem>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.MENU_ITEMS, id);
    await updateDoc(docRef, item);
}

export async function deleteMenuItem(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.MENU_ITEMS, id));
}

export function subscribeToMenuItems(callback: (items: MenuItem[]) => void) {
    const q = query(collection(db, COLLECTIONS.MENU_ITEMS));
    return onSnapshot(q, (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as MenuItem));
        callback(items);
    });
}

// ============= Categories =============

export async function getCategories(): Promise<Category[]> {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy('order'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
}

export async function addCategory(category: Omit<Category, 'id'>): Promise<string> {
    const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), category);
    return docRef.id;
}

export async function updateCategory(id: string, category: Partial<Category>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.CATEGORIES, id);
    await updateDoc(docRef, category);
}

export async function deleteCategory(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
}

export function subscribeToCategories(callback: (categories: Category[]) => void) {
    const q = query(collection(db, COLLECTIONS.CATEGORIES), orderBy('order'));
    return onSnapshot(q, (snapshot) => {
        const categories = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Category));
        callback(categories);
    });
}

// ============= Orders =============

export async function getOrders(): Promise<Order[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.ORDERS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
}

export async function addOrder(order: Omit<Order, 'id' | 'createdAt'>): Promise<string> {
    const orderData = {
        ...order,
        createdAt: new Date().toISOString(),
        status: 'new',
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.ORDERS), orderData);
    return docRef.id;
}

export async function updateOrderStatus(id: string, status: Order['status']): Promise<void> {
    const docRef = doc(db, COLLECTIONS.ORDERS, id);
    await updateDoc(docRef, { status });
}

export function subscribeToOrders(callback: (orders: Order[]) => void) {
    const q = query(collection(db, COLLECTIONS.ORDERS));
    return onSnapshot(q, (snapshot) => {
        const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Order));
        callback(orders);
    });
}

// ============= Reservations =============

export async function getReservations(): Promise<Reservation[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.RESERVATIONS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
}

export async function addReservation(
    reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>
): Promise<string> {
    const reservationData = {
        ...reservation,
        createdAt: new Date().toISOString(),
        status: 'pending',
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.RESERVATIONS), reservationData);
    return docRef.id;
}

export async function updateReservationStatus(
    id: string,
    status: Reservation['status']
): Promise<void> {
    const docRef = doc(db, COLLECTIONS.RESERVATIONS, id);
    await updateDoc(docRef, { status });
}

export function subscribeToReservations(callback: (reservations: Reservation[]) => void) {
    const q = query(collection(db, COLLECTIONS.RESERVATIONS));
    return onSnapshot(q, (snapshot) => {
        const reservations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Reservation));
        callback(reservations);
    });
}

// ============= Feedback =============

export async function getFeedbacks(): Promise<Feedback[]> {
    const querySnapshot = await getDocs(collection(db, COLLECTIONS.FEEDBACKS));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
}

export async function addFeedback(feedback: Omit<Feedback, 'id' | 'createdAt'>): Promise<string> {
    const feedbackData = {
        ...feedback,
        createdAt: new Date().toISOString(),
    };
    const docRef = await addDoc(collection(db, COLLECTIONS.FEEDBACKS), feedbackData);
    return docRef.id;
}

export function subscribeToFeedbacks(callback: (feedbacks: Feedback[]) => void) {
    const q = query(collection(db, COLLECTIONS.FEEDBACKS));
    return onSnapshot(q, (snapshot) => {
        const feedbacks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Feedback));
        callback(feedbacks);
    });
}

// ============= Settings =============

const SETTINGS_DOC_ID = 'restaurant-settings';

export async function getSettings(): Promise<RestaurantSettings | null> {
    const docRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data() as RestaurantSettings;
    }
    return null;
}

export async function updateSettings(settings: Partial<RestaurantSettings>): Promise<void> {
    const docRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    await setDoc(docRef, settings, { merge: true });
}

export async function initializeSettings(settings: RestaurantSettings): Promise<void> {
    const docRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    await setDoc(docRef, settings);
}

export function subscribeToSettings(callback: (settings: RestaurantSettings | null) => void) {
    const docRef = doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID);
    return onSnapshot(docRef, (snapshot) => {
        if (snapshot.exists()) {
            callback(snapshot.data() as RestaurantSettings);
        } else {
            callback(null);
        }
    });
}
