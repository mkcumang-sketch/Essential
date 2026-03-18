import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  productId: string;
  name: string;
  price: number;
  qty: number;
  sku: string; // Enterprise Variant ID
  imageUrl: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (sku: string) => void;
  updateQty: (sku: string, qty: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingItem = state.items.find((i) => i.sku === item.sku);
        if (existingItem) {
          return {
            items: state.items.map((i) => 
              i.sku === item.sku ? { ...i, qty: i.qty + item.qty } : i
            )
          };
        }
        return { items: [...state.items, item] };
      }),

      removeItem: (sku) => set((state) => ({
        items: state.items.filter((i) => i.sku !== sku)
      })),

      updateQty: (sku, qty) => set((state) => ({
        items: state.items.map((i) => (i.sku === sku ? { ...i, qty } : i))
      })),

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce((total, item) => total + (item.price * item.qty), 0);
      }
    }),
    {
      name: 'imperial-cart-storage', // Saves to localStorage automatically
    }
  )
);