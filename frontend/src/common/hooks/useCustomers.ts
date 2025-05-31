import {useQuery} from "@tanstack/react-query";
import {CUSTOMERS_KEY} from "../queryKeys.ts";
import {getCustomers} from "../../../common/api/fetchers/customersFetchers.ts";

export const useCustomers = () => {
    return useQuery({ queryKey: CUSTOMERS_KEY, queryFn: ({ signal }) => getCustomers(signal) })
}