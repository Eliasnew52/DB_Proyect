import type {UserMini} from "../auth/user.types.ts";

export interface PaymentMethod {
    name: string;
    code: string;
    description: string;
    active: boolean;
    created_by: UserMini | null;
    last_updated: string;
}