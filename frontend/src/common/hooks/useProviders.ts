import {useQuery} from "@tanstack/react-query";
import {getProviders} from "../../../common/api/fetchers/providersFetchers.ts";
import {PROVIDERS_KEY} from "../queryKeys.ts";

export const useProviders = () => {
    return useQuery({ queryKey: PROVIDERS_KEY, queryFn: ({signal}) => getProviders(signal) })
}