export interface ApiResponseTypes<T> {
    success: boolean;
    message: string;
    result: T;
}