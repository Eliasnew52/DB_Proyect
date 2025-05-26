import {useMutation, useQueryClient} from "@tanstack/react-query";
import {login} from "../api/authFetchers.ts";
import {useAuthStore} from "../store/useAuthStore.ts";
import {useShallow} from "zustand/react/shallow";

export const useLogin = () => {
    const qc = useQueryClient();
    const [ setIsAuthenticated ] = useAuthStore(useShallow(state => [
        state.setIsAuthenticated,
    ]))

    return useMutation({
        mutationFn: login,

        onSuccess: _data => {
            setIsAuthenticated(true);
        },


    })
}