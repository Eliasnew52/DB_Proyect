export interface Brand {
    id: number;
    name: string;
    description: string;
    creation_date: string;
    image: string;
    last_updated: string;
    active: boolean;
    created_by: number | null;
}

export interface BrandMini {
    id: number;
    name: string;
    description: string;
    image: string;
}