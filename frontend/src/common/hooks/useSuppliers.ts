import {useQuery} from "@tanstack/react-query";
import {getProviders} from "../api/fetchers/products/providersFetchers.ts";
import {PROVIDERS_KEY} from "../api/fetchers/products/queryKeys.ts";

export const useProviders = (enabled = true) => {
    return useQuery({ enabled: enabled, queryKey: PROVIDERS_KEY, queryFn: ({signal}) => getProviders(signal) })
}