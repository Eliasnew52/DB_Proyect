export const PAYMENT_METHODS_KEY = ['payment_methods'] as const;
export const PAYMENT_METHOD_KEY = (id: number) => [...PAYMENT_METHODS_KEY, id] as const;

export const TRANSACTION_STATUSES_KEY = ['transaction_statuses'] as const;
export const TRANSACTION_STATUS_KEY = (id: number) => [...PAYMENT_METHODS_KEY, id] as const;

export const DISCOUNT_TYPES_KEY = ['discount_types'] as const;
export const DISCOUNT_TYPE_KEY = (id: number) => [...DISCOUNT_TYPES_KEY, id] as const;

export const SALES_KEY = ['sales'] as const;
export const SALE_KEY = (id: number) => [...SALES_KEY, id] as const;