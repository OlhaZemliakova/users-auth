import { create } from "zustand";
import { authService } from "../services/authService";

type AuthState = {
    token: string | null;
    user: { username: string } | null;
    setToken: (token: string) => void;
    setUser: (user: { username: string }) => void;
    fetchUser: () => Promise<void>;
    logout: () => void;
};

export const useAuthStore = create<AuthState>((set, get) => ({
    token: (typeof window !== "undefined") && localStorage.getItem("token") || null,
    user: null,

    setToken: (token) => {
        if (typeof window !== "undefined") {
            localStorage.setItem("token", token);
        }
        set({ token });
    },

    setUser: (user) => {
        set({ user });
    },

    fetchUser: async () => {
        const { token, logout, setUser } = get();
        
        if (!token) return;

        try {
            const user = await authService.getMe(token);
            setUser(user);
        } catch (error) {
            if (error instanceof Error && error.message.includes("Unauthorized")) {
                logout();
                if (typeof window !== "undefined") {
                    window.location.href = "/login";
                }
            }
        }
    },

    logout: () => {
        if (typeof window !== "undefined") {
            localStorage.removeItem("token");
        }
        set({ token: null, user: null });
        if (typeof window !== "undefined") {
            window.location.href = "/login";
        }
    },
}));