import {useQuery} from "@tanstack/react-query";
import {PROVIDERS_KEY} from "../queryKeys.ts";
import {getProviders} from "./providersFetchers.ts";

export const useProviders = () => {
    return useQuery({ queryKey: PROVIDERS_KEY, queryFn: ({signal}) => getProviders(signal) })
}