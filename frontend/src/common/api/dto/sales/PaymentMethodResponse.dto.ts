import type {UserMini} from "../../../domain/auth/user.types.ts";

export interface PaymentMethodResponseDTO {
    name: string;
    code: string;
    description: string;
    active: boolean;
    created_by: UserMini;
    last_updated: string;
}