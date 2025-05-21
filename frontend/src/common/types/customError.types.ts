export interface CustomError {
    code: string;
    status: number | null;
    endpoint: string;
    message: string;
    timestamp: string;
}