import { create } from 'zustand';
import { OrderItem, Stall } from '../types';

interface CartState {
  items: OrderItem[];
  stall: Stall | null;
  addItem: (item: OrderItem, stall: Stall) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  stall: null,
  addItem: (newItem, newStall) => {
    const { items, stall } = get();
    
    // Core Business Rule: Single-Stall Cart
    if (stall && stall.id !== newStall.id) {
      // In a real app, we'd trigger a modal. Here we return or rely on the UI to check.
      // We'll throw an error that the UI can catch to show the modal.
      throw new Error('MULTIPLE_STALL_ERROR');
    }

    const existingItemIndex = items.findIndex(item => item.menuItemId === newItem.menuItemId && item.specialInstructions === newItem.specialInstructions);

    if (existingItemIndex > -1) {
      const updatedItems = [...items];
      updatedItems[existingItemIndex].quantity += newItem.quantity;
      set({ items: updatedItems, stall: newStall });
    } else {
      set({ items: [...items, newItem], stall: newStall });
    }
  },
  removeItem: (itemId) => {
    const updatedItems = get().items.filter(item => item.id !== itemId);
    set({ items: updatedItems, stall: updatedItems.length === 0 ? null : get().stall });
  },
  updateQuantity: (itemId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(itemId);
      return;
    }
    const updatedItems = get().items.map(item => 
      item.id === itemId ? { ...item, quantity } : item
    );
    set({ items: updatedItems });
  },
  clearCart: () => set({ items: [], stall: null }),
  getTotal: () => {
    return get().items.reduce((total, item) => total + (item.price * item.quantity), 0);
  },
}));
