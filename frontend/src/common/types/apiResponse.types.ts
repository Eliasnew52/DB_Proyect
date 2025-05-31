import {Product} from "./products.types.ts";

export interface ApiResponseTypes<T> {
    success: boolean;
    message: string;
    result: T;
}

export interface PaginatedResponse {
    count: number
    next: string | null
    previous: string | null
    results: Product[]
}