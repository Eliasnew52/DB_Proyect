import {useQuery} from "@tanstack/react-query";
import {TRANSACTION_STATUSES_KEY} from "./sales/queryKeys.ts";
import {getTransactionStatuses} from "../api/fetchers/transactionStatusFetchers.ts";

export const useTransactionStatuses = () => {
    return useQuery({ queryKey: TRANSACTION_STATUSES_KEY, queryFn: ({ signal }) => getTransactionStatuses(signal) })
}