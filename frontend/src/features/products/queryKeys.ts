export const BRANDS_KEY = ['brands'] as const;
export const BRAND_KEY = (id: number) => [...BRANDS_KEY, id] as const;

export const CATEGORIES_KEY = ['categories'] as const;
export const CATEGORY_KEY = (id: number) => [...CATEGORIES_KEY, id] as const;

export const PRODUCTS_KEY = ['products'] as const;
export const PRODUCT_KEY = (id: number) => [...PRODUCTS_KEY, id] as const;

export const PROVIDERS_KEY = ['providers'] as const;
export const PROVIDER_KEY = (id: number) => [...PROVIDERS_KEY, id] as const;