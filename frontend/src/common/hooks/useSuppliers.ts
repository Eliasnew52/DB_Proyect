import {useQuery} from "@tanstack/react-query";
import {getSupplier} from "../api/fetchers/products/suppliersFetchers.ts";
import {SUPPLIER_KEY} from "../api/fetchers/products/queryKeys.ts";

export const useSuppliers = (enabled = true) => {
    return useQuery({ enabled: enabled, queryKey: SUPPLIER_KEY, queryFn: ({signal}) => getSupplier(signal) })
}