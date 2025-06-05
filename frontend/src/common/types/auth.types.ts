export interface User {
    pk: number;
    username: string;
    first_name: string;
    last_name: string;
    email: string;
}

export interface UserMini {
    id: number;
    username: string;
}