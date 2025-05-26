export interface AuthState {
    isAuthenticated: boolean;
    setIsAuthenticated: (isAuthenticated: boolean) => void;
    user: { id: number; username: string } | null;
    setUser: (user: AuthState['user']) => void;
    clearAuthStore: () => void;
}