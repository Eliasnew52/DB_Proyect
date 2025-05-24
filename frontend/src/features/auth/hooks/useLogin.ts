import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login} from "../api/authFetchers.ts";

export const useLogin = () => {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: login,
    })
}