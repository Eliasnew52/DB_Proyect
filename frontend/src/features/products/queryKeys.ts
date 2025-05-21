export const BRANDS_KEY = ['brands'] as const;
export const BRAND_KEY = (id: number) => [...BRANDS_KEY, id] as const;