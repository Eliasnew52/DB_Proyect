export const PURCHASES_KEY = ['purchases'] as const;
export const PURCHASE_KEY = (id: number) => [...PURCHASES_KEY, id] as const;