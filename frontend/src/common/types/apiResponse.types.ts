export interface ApiResponseTypes<T> {
    success: boolean;
    message: string;
    result: T;
}

export interface PaginatedResponse<T> {
    count: number;
    next: string | null;
    previous: string | null;
    results: T[];
}

export type PaginatedResponseWithField<
    T,
    K extends string,
    V
> = PaginatedResponse<T> & Record<K, V>;