import {useQuery} from "@tanstack/react-query";
import {getMe} from "../api/usersFetchers.ts";
import {USER_KEY} from "../queryKeys.ts";

export const useUsers = () => {
    return useQuery({ queryKey: USER_KEY, queryFn: ({ signal }) => getMe(signal) });
}