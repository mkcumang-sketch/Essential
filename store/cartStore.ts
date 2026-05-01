import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

// Agar tere items ka structure alag hai toh yahan apne hisaab se fields rakh lena
interface CartItem {
    _id?: string;
    id?: string;
    productId?: string;
    name?: string;
    title?: string;
    price: number;
    offerPrice?: number;
    qty: number;
    [key: string]: any; // Baaki extra fields ke liye
}

interface CartState {
    items: CartItem[];
    addToCart: (item: CartItem) => void;
    removeItem: (id: string) => void;
    removeFromCart: (id: string) => void; 
    clearCart: () => void;
}

// 🚀 SMART FIX: Ye function background mein chupchaap DB ko update karega
const syncWithBackend = async (items: CartItem[]) => {
    try {
        await fetch('/api/cart/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items }),
        });
    } catch (error) {
        console.error('Database Sync Failed:', error);
    }
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            
            addToCart: (item) => {
                const currentItems = get().items;
                const itemId = item._id || item.id || item.productId;
                const existingItem = currentItems.find(i => (i._id || i.id || i.productId) === itemId);
                
                let newItems;
                if (existingItem) {
                    newItems = currentItems.map(i => (i._id || i.id || i.productId) === itemId ? { ...i, qty: i.qty + 1 } : i);
                } else {
                    newItems = [...currentItems, { ...item, qty: item.qty || 1 }];
                }
                
                set({ items: newItems });
                syncWithBackend(newItems); // 🚀 DB UPDATE
            },
            
            removeItem: (id) => {
                const newItems = get().items.filter(i => (i._id || i.id || i.productId) !== id);
                set({ items: newItems });
                syncWithBackend(newItems); // 🚀 DB UPDATE
            },
            
            removeFromCart: (id) => {
                const newItems = get().items.filter(i => (i._id || i.id || i.productId) !== id);
                set({ items: newItems });
                syncWithBackend(newItems); // 🚀 DB UPDATE
            },
            
            clearCart: () => {
                set({ items: [] });
                syncWithBackend([]); // 🚀 DB CLEAR (Order place hone ke baad DB khali kar dega)
            }
        }),
        {
            name: 'cart-storage', // Is naam ko mat badalna
            storage: createJSONStorage(() => localStorage),
        }
    )
);