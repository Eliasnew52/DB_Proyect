import {useQuery} from "@tanstack/react-query";
import {getCustomers} from "../../api/fetchers/sales/customersFetchers.ts";
import {CUSTOMERS_KEY} from "../products/queryKeys.ts";

export const useCustomers = () => {
    return useQuery({ queryKey: CUSTOMERS_KEY, queryFn: ({ signal }) => getCustomers(signal) })
}