import {useQuery} from "@tanstack/react-query";
import {getMe} from "../api/usersFetchers.ts";
import {USER_KEY} from "../queryKeys.ts";

export const useUser = () => {
    const  { data: user, isLoading, isError, error } = useQuery({
        queryKey: USER_KEY,
        queryFn: ({signal}) => getMe(signal),
        staleTime: 5 * 60_000,
        retry: false,
    });

    const isAuthenticated = !!user;

    return {
        user,
        isLoading,
        isError,
        error,
        isAuthenticated,
    }
}