import {UserMini} from "../../../../../common/types/auth.types.ts";

export interface BrandResponse {
    id: number;
    name: string;
    description: string;
    image: string;
    creation_date: string;
    last_updated: string;
    active: boolean;
    created_by: UserMini | null;
}