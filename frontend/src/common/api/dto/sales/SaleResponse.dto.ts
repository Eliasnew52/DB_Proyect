import type {PaymentMethod} from "../../../domain/sales/paymentsMethods.types.ts";
import type {TransactionStatus} from "../../../types/transactionStatus.types.ts";
import type {Customer} from "../../../domain/sales/customer.types.ts";
import type {ProductMini} from "../../../domain/products/products.types.ts";
import type {UserMini} from "../../../domain/auth/user.types.ts";

export interface SaleResponseDTO {
    total: number;
    payment_method: PaymentMethod;
    status: TransactionStatus;
    customer: Customer;
    products: ProductMini[];
    created_by: UserMini;
    creation_date: string;
}