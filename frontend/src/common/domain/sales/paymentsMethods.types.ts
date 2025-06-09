export interface PaymentMethod {
    name: string;
    code: string;
    description: string;
    active: boolean;
    created_by: number | null;
    last_updated: string;
}