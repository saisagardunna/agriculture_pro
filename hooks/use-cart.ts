import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQuantity: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  getTotalPrice: () => number;
  clearCart: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item: CartItem) =>
        set((state: CartState) => {
          console.log("Adding item:", item);
          const existingItem = state.items.find((i) => i.id === item.id);
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      updateQuantity: (id: string, quantity: number) =>
        set((state: CartState) => {
          console.log("Updating quantity for", id, "to", quantity);
          return {
            items: state.items
              .map((item) =>
                item.id === id ? { ...item, quantity: Math.max(1, quantity) } : item
              )
              .filter((item) => item.quantity > 0),
          };
        }),
      removeItem: (id: string) =>
        set((state: CartState) => {
          console.log("Removing item", id);
          return {
            items: state.items.filter((item) => item.id !== id),
          };
        }),
      getTotalPrice: () => {
        const total = get().items.reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0);
        console.log("Calculating total price:", total);
        return total;
      },
      clearCart: () => {
        console.log("Clearing cart");
        set({ items: [] });
        console.log("Cart cleared in store");
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);