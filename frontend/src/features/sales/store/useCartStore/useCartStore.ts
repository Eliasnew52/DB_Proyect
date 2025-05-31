import { create } from 'zustand';
import { CartState } from '../../store/useCartStore/useCartStore.types';

export const useCartStore = create<CartState>((set, get) => ({
    items: [],
    addItem: (product, quantity = 1) =>
        set((state) => {
            const existing = state.items.find(item => item.id === product.id);
            if (existing) {
                return {
                    items: state.items.map(item =>
                        item.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    ),
                };
            }
            return { items: [...state.items, { ...product, quantity }] };
        }),
    removeItem: (productId) =>
        set((state) => ({
            items: state.items.filter(item => item.id !== productId),
        })),
    updateQuantity: (productId, quantity) =>
        set((state) => ({
            items: state.items.map(item =>
                item.id === productId ? { ...item, quantity } : item
            ),
        })),
    clearCart: () => set({ items: [] }),

    getSubtotal: () => {
        const items = get().items;
        return items.reduce((acc, item) => acc + item.sale_price * item.quantity, 0);
    },
    getDiscount: (discountValue: number, discountType: 'PERCENT' | 'FIXED') => {
        const subtotal = get().getSubtotal();
        if (discountType === 'PERCENT') {
            return subtotal * (discountValue / 100);
        }
        return Math.min(discountValue, subtotal);
    },
    getTotal: (discountValue: number, discountType: 'PERCENT' | 'FIXED') => {
        const subtotal = get().getSubtotal();
        const discount = get().getDiscount(discountValue, discountType);
        return subtotal - discount;
    }
}));