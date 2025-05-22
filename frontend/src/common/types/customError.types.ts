export interface CustomError {
    code: string;
    status: number | null;
    endpoint: string;
    message: string;
    messages?: string[];
    fieldErrors?: Record<string,string[]>;
    timestamp: string;
}