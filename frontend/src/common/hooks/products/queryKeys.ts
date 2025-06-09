export const BRANDS_KEY = ['brands'] as const;
export const BRAND_KEY = (id: number) => [...BRANDS_KEY, id]

export const CATEGORIES_KEY = ['categories'] as const;
export const CATEGORY_KEY = (id: number) => [...CATEGORIES_KEY, id];

export const PRODUCTS_KEY = ['products'] as const;
export const PRODUCT_KEY = (id: number) => [...PRODUCTS_KEY, id];

export const SUPPLIERS_KEY = ['suppliers'] as const;
export const SUPPLIER_KEY = (id: number) => [...SUPPLIERS_KEY, id];

export const CUSTOMERS_KEY = ['customers'] as const;
export const CUSTOMER_KEY = (id: number) => [...CUSTOMERS_KEY, id]