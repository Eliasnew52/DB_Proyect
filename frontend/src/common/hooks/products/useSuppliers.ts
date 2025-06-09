import {useQuery} from "@tanstack/react-query";
import {getSupplier} from "../../api/fetchers/suppliersFetchers.ts";
import {SUPPLIERS_KEY} from "./queryKeys.ts";

export const useSuppliers = (enabled = true) => {
    return useQuery({ enabled: enabled, queryKey: SUPPLIERS_KEY, queryFn: ({signal}) => getSupplier(signal) })
}