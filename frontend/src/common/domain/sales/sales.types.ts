import type {PaymentMethod} from "./paymentsMethods.types.ts";
import type {TransactionStatus} from "../../types/transactionStatus.types.ts";
import type {Customer} from "./customer.types.ts";
import type {ProductMini} from "../products/products.types.ts";
import type {UserMini} from "../auth/user.types.ts";

export interface Sale {
    total: number;
    payment_method: PaymentMethod;
    status: TransactionStatus;
    customer: Customer;
    products: ProductMini[];
    created_by: UserMini;
    creation_date: string;
}