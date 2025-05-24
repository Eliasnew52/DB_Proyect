export interface AuthState {
    isAuthenticated: boolean;
    user: { id: number; username: string } | null;
    setUser: (user: AuthState['user']) => void;
    clearAuthStore: () => void;
}