export const CUSTOMERS_KEY = ['customers'] as const;
export const CUSTOMER_KEY = (id: number) => [...CUSTOMERS_KEY, id]