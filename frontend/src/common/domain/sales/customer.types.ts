import type {UserMini} from "../auth/user.types.ts";

export interface Customer {
    id: number
    name: string
    address: string
    email: string
    phone: string
    creation_date: string
    last_updated: string
    created_by: UserMini;
}
