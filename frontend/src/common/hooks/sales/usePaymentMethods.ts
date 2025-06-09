import {useQuery} from "@tanstack/react-query";
import {getPaymentMethods} from "../api/fetchers/sales/paymentMethodsFetchers.ts";
import {PAYMENT_METHODS_KEY} from "../api/fetchers/sales/queryKeys.ts";

export const usePaymentMethods = () => {
    return useQuery({ queryKey: PAYMENT_METHODS_KEY, queryFn: ({ signal }) => getPaymentMethods(signal) })
}