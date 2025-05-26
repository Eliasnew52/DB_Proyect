import {create} from "zustand";
import {AuthState} from "./useAuthStore.types.ts";

export const useAuthStore = create<AuthState>(set => ({
    isAuthenticated: false,
    user: null,
    setIsAuthenticated: (isAuthenticated)=> set({ isAuthenticated }),
    setUser: user =>
        set({ isAuthenticated: true, user }),
    clearAuthStore: () =>
        set({ isAuthenticated: false, user: null }),
}))