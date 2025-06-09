import { Product } from "../../../../common/domain/products/products.types.ts";

export type CartItem = Product & { quantity: number };

export interface CartState {
    items: CartItem[];
    addItem: (product: Product, quantity?: number) => void;
    removeItem: (productId: number) => void;
    updateQuantity: (productId: number, quantity: number) => void;
    clearCart: () => void;
    getSubtotal: () => number;
    getDiscount: (discountValue: number, discountType: 'PERCENT' | 'FIXED') => number;
    getTotal: (discountValue: number, discountType: 'PERCENT' | 'FIXED') => number;
}
